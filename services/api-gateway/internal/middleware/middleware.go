package middleware

import (
	"sos-notification-microservice/api-gateway/internal/utils"

	"github.com/gin-gonic/gin"
)

func Logging() gin.HandlerFunc {
	logger := utils.NewLogger("info")

	return func(c *gin.Context) {
		logger.Infof("Request: %s %s", c.Request.Method, c.Request.URL.Path)
		c.Next()
		logger.Infof("Response: %d", c.Writer.Status())
	}
}
