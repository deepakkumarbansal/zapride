import { STATUS_CODES } from "../constants";
import { ApiError } from "../utils";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST.code, "Local file path required");
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "zapride-captains-avatar",
        });
        return response.url;
    } catch (error) {
        throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR.code, error.message);
    } finally {
        fs.unlinkSync(localFilePath);
    }
};
