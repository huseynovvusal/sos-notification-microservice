package handler

import (
	"sos-notification-microservice/api-gateway/internal/dto"
	"sos-notification-microservice/api-gateway/internal/interfaces"
	"sos-notification-microservice/api-gateway/internal/utils"

	"github.com/gin-gonic/gin"
)

// TODO: Add validation for request payloads
type AuthHandler struct {
	authService interfaces.AuthService
	logger      *utils.Logger
}

func NewAuthHandler(authService interfaces.AuthService, logger *utils.Logger) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		logger:      logger,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Errorf("Failed to bind JSON: %v", err)
		c.JSON(400, gin.H{"error": "Invalid request payload"})
		return
	}

	// if err := h.validator.Struct(&req); err != nil {
	// 	// h.logger.Errorf("Validation error: %v", err)
	// 	c.JSON(400, gin.H{"error": err.Error()})
	// 	return
	// }

	res, err := h.authService.Register(c.Request.Context(), &req)
	if err != nil {
		c.Error(err)
		return
	}

	h.logger.Infof("User registered successfully: %s", req.Email)
	c.JSON(200, res)
}
