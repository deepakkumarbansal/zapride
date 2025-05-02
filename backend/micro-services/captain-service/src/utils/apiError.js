export class ApiError extends Error {
    constructor(statusCode = 500, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.message = message;
        this.success = false;
        this.statusCode = statusCode;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
