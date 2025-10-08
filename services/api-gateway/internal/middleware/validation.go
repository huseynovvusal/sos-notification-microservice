package middleware

import (
	"sos-notification-microservice/api-gateway/internal/error/http_error"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func ValidateRequest[T any](ctx *gin.Context) error {
	var req T
	if err := ctx.ShouldBindJSON(&req); err != nil {
		return http_error.NewBadRequestError("Invalid request payload")
	}

	if err := validator.New().Struct(req); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		return http_error.NewValidationError("Validation failed: " + validationErrors.Error())
	}

	ctx.Set("validated_request", req)
	return nil
}

func ValidateEndpoint[T any]() gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := ValidateRequest[T](c); err != nil {
			c.Error(err)
			c.Abort()
			return
		}

		c.Next()
	}
}
