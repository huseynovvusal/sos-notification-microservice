package middleware

import (
	"sos-notification-microservice/api-gateway/internal/error/http_error"
	"sos-notification-microservice/api-gateway/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func ErrorHandler(logger *utils.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			var httpErr *http_error.HTTPError

			if e, ok := err.(*http_error.HTTPError); ok {
				httpErr = e
			} else {
				httpErr = http_error.NewInternalError("An unexpected error occurred")

				logger.WithFields(logrus.Fields{
					"path":   c.Request.URL.Path,
					"method": c.Request.Method,
					"error":  err.Error(),
				}).Error("Unexpected error")
			}

			c.JSON(httpErr.Status, httpErr)
			return
		}
	}
}
