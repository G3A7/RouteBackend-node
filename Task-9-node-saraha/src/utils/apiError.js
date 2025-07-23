export class ApiError extends Error {
  constructor(message, statusCode = 500, status = "error") {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
