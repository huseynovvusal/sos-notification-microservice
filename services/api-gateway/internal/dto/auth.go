package dto

type RegisterRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Email    string `json:"email" validate:"required,email"`
	Phone    string `json:"phone" validate:"required,e164"` // E.164 phone format
	Password string `json:"password" validate:"required,min=8,containsany=!@#$%^&*"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type AuthResponse struct {
	AccessToken string `json:"accessToken"`
}
