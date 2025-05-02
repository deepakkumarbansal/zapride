export const STATUS_CODES = {
    SUCCESS: { code: 200, message: "Success" },
    RIDE_CREATED: { code: 201, message: "Ride created successfully" },
    RIDE_ACCEPTED: { code: 202, message: "Ride request accepted" },
    NO_CONTENT: { code: 204, message: "No content available" },

    BAD_REQUEST: { code: 400, message: "Bad request, All fields fields are required" },
    UNAUTHORIZED: { code: 401, message: "Unauthorized access" },
    FORBIDDEN: { code: 403, message: "Forbidden" },
    NOT_FOUND: { code: 404, message: "Resource not found" },
    REQUEST_TIMEOUT: { code: 408, message: "Request timeout" },
    CONFLICT: { code: 409, message: "Conflict occurred" },
    TOO_MANY_REQUESTS: { code: 429, message: "Too many requests" },

    INTERNAL_SERVER_ERROR: { code: 500, message: "Internal server error" },
    BAD_GATEWAY: { code: 502, message: "Bad gateway" },
    SERVICE_UNAVAILABLE: { code: 503, message: "Service unavailable" },
    GATEWAY_TIMEOUT: { code: 504, message: "Gateway timeout" },

    RIDE_SCHEDULED: { code: 600, message: "Ride scheduled" },
    DRIVER_ASSIGNED: { code: 601, message: "Driver assigned" },
    DRIVER_ARRIVING: { code: 602, message: "Driver arriving" },
    DRIVER_ARRIVED: { code: 603, message: "Driver arrived" },
    RIDE_STARTED: { code: 604, message: "Ride started" },
    RIDE_COMPLETED: { code: 605, message: "Ride completed" },
    RIDE_CANCELLED_BY_RIDER: { code: 606, message: "Ride cancelled by rider" },
    RIDE_CANCELLED_BY_DRIVER: { code: 607, message: "Ride cancelled by driver" },
    PAYMENT_PENDING: { code: 608, message: "Payment pending" },
    PAYMENT_COMPLETED: { code: 609, message: "Payment completed" },
    RIDE_RATED: { code: 610, message: "Ride rated successfully" },
};
export const DB_NAME = `captain-service`;
export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};
