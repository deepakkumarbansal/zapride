export class ApiResponse {
    constructor(statusCode = 200, message = "Success", data = {}) {
        this.message = message;
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        Object.assign(this, data);
    }
}
