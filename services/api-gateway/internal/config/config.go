package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port string

	AuthServiceAddress string
}

func Load() (*Config, error) {
	// Load from .env
	_ = godotenv.Load()

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	authServiceAddress := os.Getenv("AUTH_SERVICE_ADDRESS")
	if authServiceAddress == "" {
		authServiceAddress = "localhost:50051"
	}

	return &Config{
		Port:               port,
		AuthServiceAddress: authServiceAddress,
	}, nil
}
