package interfaces

import (
	"context"
	"sos-notification-microservice/api-gateway/internal/dto"
)

type AuthService interface {
	Register(ctx context.Context, req *dto.RegisterRequest) (*dto.AuthResponse, error)
}
