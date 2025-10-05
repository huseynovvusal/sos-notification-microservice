package services

import (
	"context"
	pb "sos-notification-microservice/api-gateway/internal/proto/auth"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	dto "sos-notification-microservice/api-gateway/internal/dto"
)

type authClient struct {
	client pb.AuthServiceClient
	conn   *grpc.ClientConn
}

func NewAuthService(authServiceAddr string) (*authClient, error) {
	conn, err := grpc.NewClient(authServiceAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}

	client := pb.NewAuthServiceClient(conn)

	return &authClient{
		client: client,
		conn:   conn,
	}, nil

}

func (c *authClient) Register(ctx context.Context, req *dto.RegisterRequest) (*dto.AuthResponse, error) {
	pbReq := &pb.RegisterRequest{
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Password: req.Password,
	}

	ctx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	res, err := c.client.Register(ctx, pbReq)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		AccessToken: res.AccessToken,
	}, nil
}
