import * as grpc from "@grpc/grpc-js"

class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: grpc.status = grpc.status.INTERNAL
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, grpc.status.NOT_FOUND)
  }
}

export { AppError, NotFoundError }
