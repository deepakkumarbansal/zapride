import { cookieOptions, STATUS_CODES } from "../constants";
import { Captain } from "../models/captain.model";
import { createCaptain, getCaptainProfile, loginCaptain, logoutCaptain } from "../services/captain.service";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { validationResult } from "express-validator";

export const register = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "All fields are required", errors.array());
    }
    const { fullName, email, phone, password, vehicle } = req.body;
    const avatarLocalFilePath = req.file?.path;
    const oldCaptain = await Captain.findOne({
        $or: [{ email }, { phone }],
    });
    if (oldCaptain) {
        throw new ApiError(STATUS_CODES.CONFLICT, "Captain already exist with same email or phone");
    }
    const avatarUrl = await uploadToCloudinary(avatarLocalFilePath);
    const captain = await createCaptain({ fullName, email, phone, password, avatarUrl, vehicle });
    const token = await captain.generateAuthToken();
    res.cookie("token", token, cookieOptions)
        .status(STATUS_CODES.SUCCESS.code)
        .json(new ApiResponse(STATUS_CODES.SUCCESS.code, "Captain created successfully", { captain, token }));
});

export const login = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "All fields are required", errors.array());
    }
    const { email, phone, password } = req.body;
    const captain = await loginCaptain({ email, phone, password });
    const token = await captain.generateAuthToken();
    res.cookie("token", token, cookieOptions)
        .status(STATUS_CODES.SUCCESS.code)
        .json(new ApiResponse(STATUS_CODES.SUCCESS.code, "Captain login successfully", { captain, token }));
});

export const logout = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")?.[1];
    const { _id: captainId } = req.captain;
    await logoutCaptain({ token, captainId });
    res.clearCookie("token", cookieOptions)
        .status(STATUS_CODES.SUCCESS.code)
        .json(new ApiResponse(STATUS_CODES.SUCCESS.code, "Logout captain Successfully"));
});

export const getProfile = asyncHandler(async (req, res, next) => {
    const { _id: captainId } = req.captain;
    const captain = await getCaptainProfile({ captainId });
    res.status(STATUS_CODES.SUCCESS.code).json(
        new ApiResponse(STATUS_CODES.SUCCESS.code, "Captain profile fetched successfully", { captain })
    );
});
