export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            res.status(error.statusCode || 500).json({
                message: error.message,
                statusCode: error.statusCode,
                errors: error.errors,
                stack: process.env.NODE_ENV == "development" ? error.stack : undefined,
            });
        }
    };
};
