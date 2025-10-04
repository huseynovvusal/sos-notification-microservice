package services

import (
	pb "sos-notification-microservice/api-gateway/internal/proto/auth"

	"google.golang.org/grpc"
)

type AuthService struct {
	client pb.AuthServiceClient
	conn   *grpc.ClientConn
}
