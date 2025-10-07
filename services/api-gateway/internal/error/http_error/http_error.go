package http_error

import "fmt"

type ErrorType string

const (
	ErrorTypeValidation    ErrorType = "VALIDATION_ERROR"
	ErrorTypeAuthorization ErrorType = "AUTHORIZATION_ERROR"
	ErrorTypeInternal      ErrorType = "INTERNAL_ERROR"
	ErrorTypeNotFound      ErrorType = "NOT_FOUND"
	ErrorTypeBadRequest    ErrorType = "BAD_REQUEST"
)

type HTTPError struct {
	Type    ErrorType `json:"type"`
	Message string    `json:"message"`
	Status  int       `json:"status"`
}

func (e *HTTPError) Error() string {
	return fmt.Sprintf("%s: %s", e.Type, e.Message)
}

func NewHTTPError(errType ErrorType, message string, status int) *HTTPError {
	return &HTTPError{
		Type:    errType,
		Message: message,
		Status:  status,
	}
}

func NewValidationError(message string) *HTTPError {
	return NewHTTPError(ErrorTypeValidation, message, 400)
}

func NewAuthorizationError(message string) *HTTPError {
	return NewHTTPError(ErrorTypeAuthorization, message, 401)
}

func NewInternalError(message string) *HTTPError {
	return NewHTTPError(ErrorTypeInternal, message, 500)
}

func NewNotFoundError(message string) *HTTPError {
	return NewHTTPError(ErrorTypeNotFound, message, 404)
}

func NewBadRequestError(message string) *HTTPError {
	return NewHTTPError(ErrorTypeBadRequest, message, 400)
}
