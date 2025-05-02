import { cookieOptions, STATUS_CODES } from "../constants.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { getProfile, login, logout, register } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, STATUS_CODES.BAD_REQUEST.message, errors.array());
    }
    const { email, password, phone, fullName } = req.body;
    const oldUser = await User.findOne({
        $or: [{ email }, { phone }],
    });
    if (oldUser) {
        throw new ApiError(STATUS_CODES.CONFLICT.code, "User already exist");
    }
    const user = await register({ fullName, email, password, phone });
    const token = await user.generateAccessToken();
    res.cookie("token", token, cookieOptions);
    res.status(STATUS_CODES.SUCCESS.code).json(
        new ApiResponse(STATUS_CODES.SUCCESS.code, "Account created successfully", { user, token })
    );
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, STATUS_CODES.BAD_REQUEST.message, errors.array());
    }
    const { email, password, phone } = req.body;
    const user = await login({ email, phone, password });
    const token = await user.generateAccessToken();
    res.cookie("token", token, cookieOptions);
    res.status(STATUS_CODES.SUCCESS.code).json(
        new ApiResponse(STATUS_CODES.SUCCESS.code, "Login successfully", { user, token })
    );
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await getProfile(_id);
    return res
        .status(STATUS_CODES.SUCCESS.code)
        .json(new ApiResponse(STATUS_CODES.SUCCESS.code, STATUS_CODES.SUCCESS.message, { user }));
});

export const logoutUser = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")?.[1];
    await logout(token);
    res.clearCookie("token", cookieOptions);
    res.status(STATUS_CODES.SUCCESS.code).json(
        new ApiResponse(STATUS_CODES.SUCCESS.code, STATUS_CODES.SUCCESS.message)
    );
});
