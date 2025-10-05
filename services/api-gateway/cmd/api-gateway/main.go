package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sos-notification-microservice/api-gateway/internal/config"
	"sos-notification-microservice/api-gateway/internal/handler"
	"sos-notification-microservice/api-gateway/internal/middleware"
	"sos-notification-microservice/api-gateway/internal/services"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	authService, err := services.NewAuthService(cfg.AuthServiceAddress)
	if err != nil {
		log.Fatalf("Failed to connect to AuthService: %v", err)
	}
	defer func() {
		if err := authService.Close(); err != nil {
			log.Printf("Failed to close AuthService connection: %v", err)
		}
	}()

	authHandler := handler.NewAuthHandler(authService)

	// Router setup with middleware
	router := gin.New()
	router.Use(middleware.Logging())

	// API versioning
	v1 := router.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
		}
	}

	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	go func() {
		log.Printf("Starting server on port %s", cfg.Port)

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)

	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server shut down gracefully")

}
