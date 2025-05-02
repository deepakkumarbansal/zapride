export class ApiResponse {
    constructor(statusCode, message = "Success", data = {}) {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        Object.assign(this, data); // assigning the data object properties to current class object
    }
}
