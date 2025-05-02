import { STATUS_CODES } from "../constants";
import { BlackListedToken } from "../models/blacklistedToken.model.js";
import { Captain } from "../models/captain.model.js";
import { ApiError } from "../utils/index.js";
import { uploadToCloudinary } from "./cloudinary.service.js";

export const createCaptain = async ({ fullName, email, phone, password, avatarUrl, vehicle }) => {
    if (
        !fullName ||
        !fullName.firstName ||
        !fullName.lastName ||
        (!email && !phone) ||
        !password ||
        !avatarUrl ||
        !vehicle
    ) {
        throw new ApiError(STATUS_CODES.BAD_GATEWAY.code, "All fields are required");
    }
    try {
        const captain = await Captain.create({ fullName, email, password, phone, avatar: avatarUrl, vehicle });
        return captain;
    } catch (error) {
        throw new ApiError(error.statusCode || error.code, error.message, error.errors || [], error.stack || undefined);
    }
};

export const loginCaptain = async ({ email, phone, password }) => {
    if (!password || (!phone && !email)) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "All fields are required");
    }
    const captain = await Captain.findOne({
        $or: [{ email }, { phone }],
    });
    if (!captain) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED.code, "Invalid email or phone");
    }
    const isMatched = await Captain.comparePassword(password);
    if (!isMatched) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED.code, "Invalid password");
    }
    return captain;
};

export const logoutCaptain = async ({ token, captainId }) => {
    if (!token) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "Token required");
    }
    await Captain.findByIdAndUpdate(captainId, { isActive: false });
    await BlackListedToken.create({ token });
};

export const getCaptainProfile = async ({ captainId }) => {
    if (!captainId) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "Captain id is required");
    }
    const captain = await Captain.findById(captainId);
    return captain;
};
