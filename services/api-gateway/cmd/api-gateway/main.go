package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"sos-notification-microservice/api-gateway/internal/config"
	"sos-notification-microservice/api-gateway/internal/dto"
	"sos-notification-microservice/api-gateway/internal/handler"
	"sos-notification-microservice/api-gateway/internal/middleware"
	"sos-notification-microservice/api-gateway/internal/services"
	"sos-notification-microservice/api-gateway/internal/utils"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {

	logger := utils.NewLogger("info")

	cfg, err := config.Load()
	if err != nil {
		logger.Fatalf("Failed to load config: %v", err)
	}

	authService, err := services.NewAuthService(cfg.AuthServiceAddress)
	if err != nil {
		logger.Fatalf("Failed to connect to AuthService: %v", err)
	}
	defer func() {
		if err := authService.Close(); err != nil {
			logger.Errorf("Failed to close AuthService connection: %v", err)
		}
	}()

	authHandler := handler.NewAuthHandler(authService, logger)

	// Router setup with middleware
	router := gin.New()
	router.Use(middleware.Logging())
	router.Use(middleware.ErrorHandler(logger))

	// API versioning
	v1 := router.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register",
				middleware.ValidateEndpoint[dto.RegisterRequest](),
				authHandler.Register)
		}
	}

	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	// Start server in a separate
	go func() {
		logger.Infof("Starting server on port %s", cfg.Port)

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatalf("Could not listen on port %s: %v", cfg.Port, err)
		}
	}()

	quit := make(chan os.Signal, 1)

	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		logger.Fatalf("Server forced to shutdown: %v", err)
	}

	logger.Info("Server exiting")

}
