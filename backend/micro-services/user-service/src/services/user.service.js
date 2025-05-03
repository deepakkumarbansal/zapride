import { STATUS_CODES } from "../constants.js";
import { BlackListedToken } from "../models/blackListedToken.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const register = async ({ fullName: { firstName, lastName } = {}, email="", password, phone = "" }) => {
    try {
        if (!firstName || !lastName || (!email && !phone) || !password) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "All fields are required");
        }
        const user = await User.create({ fullName: { firstName, lastName }, email: (email ? email : undefined), password, phone : (phone ? phone : undefined) });
        user.password = undefined;
        return user;
    } catch (error) {
        throw new ApiError(
            error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR.code,
            error.message || STATUS_CODES.INTERNAL_SERVER_ERROR.message
        );
    }
};

export const login = async ({ email = "", phone = "", password }) => {
    if ((!email && !phone) || !password) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "All fields are required");
    }
    try {
        const user = await User.findOne({
            $or: [{ email }, { phone }],
        })
            .populate("travelHistory")
            .select("+password");
        if (!user) {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED.code, "No user exist with given email or phone");
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED.code, "Invalid password");
        }
        user.password = undefined;
        return user;
    } catch (error) {
        throw new ApiError(
            error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR.code,
            error.message || STATUS_CODES.INTERNAL_SERVER_ERROR.message
        );
    }
};

export const getProfile = async (userId) => {
    if (!userId) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, STATUS_CODES.BAD_REQUEST.message);
    }
    try {
        const user = await User.findById(userId); //cant use .populate("travelHistory") as ride is diff service;
        if (!user) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "No user found");
        }
        return user;
    } catch (error) {
        throw new ApiError(
            error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR.code,
            error.message || STATUS_CODES.INTERNAL_SERVER_ERROR.message
        );
    }
};

export const logout = async (token) => {
    if (!token) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, STATUS_CODES.BAD_REQUEST.message);
    }
    try {
        await BlackListedToken.create({ token });
    } catch (error) {
        throw new ApiError(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
    }
};
