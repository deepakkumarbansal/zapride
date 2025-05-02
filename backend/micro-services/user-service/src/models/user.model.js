import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { STATUS_CODES } from "../constants.js";

const userSchema = new Schema(
    {
        fullName: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        email: {
            type: String,
            lowercase: true,
            // required:true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        phone: {
            type: String,
            unique: true,
        },
        socketId: {
            type: String,
        },
        favouritePlaces: [
            {
                tag: String,
                address: String,
            },
        ],
        travelHistory: {
            type: [String],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    return token;
};

userSchema.methods.comparePassword = async function (password) {
    if (!password) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST.code, STATUS_CODES.BAD_REQUEST.message);
    }
    const isMatched = await bcrypt.compare(password, this.password);
    return isMatched;
};

export const User = model("User", userSchema);
