import { validationResult } from "express-validator";
import { ApiError, asyncHandler } from "../utils/index.js";
import { STATUS_CODES } from "../constants.js";
import jwt from "jsonwebtoken";
import { Captain } from "../models/captain.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "All fields are required", errors.array());
    }
    const token = req.cookies.token || req.headers.authorization?.split(" ")?.[1];
    if (!token) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED.code, "Token is required");
    }
    const { _id } = await jwt.verify(token, process.env.JWT_SECRET); //if token is expired then verify method will throw the error
    const captain = await Captain.findById(_id);
    req.captain = captain;
    next();
});
