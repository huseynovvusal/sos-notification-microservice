package handler

import (
	"sos-notification-microservice/api-gateway/internal/dto"
	"sos-notification-microservice/api-gateway/internal/interfaces"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// TODO: Inject logger and use it for logging
type AuthHandler struct {
	authService interfaces.AuthService
	validator   *validator.Validate
}

func NewAuthHandler(authService interfaces.AuthService, validator *validator.Validate) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		validator:   validator,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		// h.logger.Errorf("Failed to bind JSON: %v", err)
		c.JSON(400, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := h.validator.Struct(&req); err != nil {
		// h.logger.Errorf("Validation error: %v", err)
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	res, err := h.authService.Register(c.Request.Context(), &req)
	if err != nil {
		// h.logger.Errorf("Registration failed: %v", err)
		c.JSON(500, gin.H{"error": "Registration failed"})
		return
	}

	// h.logger.Infof("User registered successfully: %s", req.Email)
	c.JSON(200, res)
}
