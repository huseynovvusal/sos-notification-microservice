package handler

import (
	"sos-notification-microservice/api-gateway/internal/dto"
	"sos-notification-microservice/api-gateway/internal/interfaces"
	"sos-notification-microservice/api-gateway/internal/utils"

	"github.com/gin-gonic/gin"
)

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
	req := c.MustGet("validated_request").(dto.RegisterRequest)

	res, err := h.authService.Register(c.Request.Context(), &req)
	if err != nil {
		c.Error(err)
		return
	}

	h.logger.Infof("User registered successfully: %s", req.Email)
	c.JSON(200, res)
}
