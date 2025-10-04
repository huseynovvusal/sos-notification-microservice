APP_NAME=api-gateway
CMD_DIR=./cmd/api-gateway

PROTOC = protoc
PROTO_DIR = ../shared/proto
GO_PROTO_OUT = ./internal/proto

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
proto:
	$(PROTOC) \
  --go_out=$(GO_PROTO_OUT) --go-grpc_out=$(GO_PROTO_OUT) \
  -I $(PROTO_DIR) \
  $(PROTO_DIR)/auth/*.proto \
  $(PROTO_DIR)/user/*.proto \
  $(PROTO_DIR)/notification/*.proto \
  $(PROTO_DIR)/sos/*.proto