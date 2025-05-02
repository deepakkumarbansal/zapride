import { Schema, model } from "mongoose";

const blackListedTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400,
    },
});

export const BlackListedToken = model("BlackListedToken", blackListedTokenSchema);
