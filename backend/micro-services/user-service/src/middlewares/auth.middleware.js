import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BlackListedToken } from "../models/blackListedToken.model.js";
import { ApiError } from "../utils/ApiError.js";
import { STATUS_CODES } from "../constants.js";
import { User } from "../models/user.model.js";
import { validationResult } from "express-validator";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.length) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, STATUS_CODES.BAD_REQUEST.message, errors.array());
    }
    const token = req.cookies.token || req.headers.authorization?.split(" ")?.[1];
    const blackListedToken = await BlackListedToken.findOne({ token });
    if (blackListedToken) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED.code, STATUS_CODES.UNAUTHORIZED.message);
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode._id);
    req.user = user;
    next();
});
