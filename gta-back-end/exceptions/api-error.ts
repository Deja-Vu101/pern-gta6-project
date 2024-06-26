export class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static Unauthorized(message = "User is not authorized") {
    return new ApiError(401, message);
  }
  static BadRequest(message: string, errors: any[] = []): ApiError {
    return new ApiError(400, message, errors);
  }
  static NotModified(message: string, errors: any[] = []): ApiError {
    return new ApiError(403, message, errors);
  }
}
