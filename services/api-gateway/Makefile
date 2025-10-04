APP_NAME=api-gateway
CMD_DIR=./cmd/api-gateway

.PHONY: run build clean test fmt lint

run:
	cd $(CMD_DIR) && go run main.go
build:
	cd $(CMD_DIR) && go build -o ../../bin/$(APP_NAME) main.go
clean:
	rm -f ./bin/$(APP_NAME)
test:
	go test ./...
fmt:
	go fmt ./...
lint:
	golangci-lint run
deps:
	go mod tidy