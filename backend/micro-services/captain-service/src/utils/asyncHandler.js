export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                message: error.message,
                succees: false,
                statusCode: error.statusCode || 500,
                errors: error.errors || [],
                stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
            });
        }
    };
};
