import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainSchema = new Schema(
    {
        email: {
            type: String,
            lowercase: true,
            // required: true,
            trim: true,
            unique: true,
            validate: {
                validator: function (value) {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    return (value && emailRegex.test(value)) || !!this.phone;
                },
                message: "Either valid email or phone is required",
            },
        },
        fullName: {
            firstName: {
                type: String,
                required: true,
                minLength: 3,
            },
            lastName: {
                type: String,
                required: true,
                minLength: 3,
            },
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        phone: {
            type: String,
            unique: true,
            trim: true,
            validate: {
                validator: function (value) {
                    const phoneRegex = /^\+(\d{1,4})[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,4}$/;
                    return (!!value && phoneRegex.test(value)) || this.email;
                },
                message: "Email or phone is required",
            },
        },
        vehicle: {
            color: {
                type: String,
                required: true,
            },
            type: {
                String,
                required: true,
                enum: ["car", "auto", "bike"],
            },
            numberPlate: {
                type: String,
                required: true,
            },
            capacity: {
                type: String,
                required: true,
            },
        },
        isAvailable: {
            type: Boolean,
            default: false,
        },
        location: {
            lat: Number,
            lng: Number,
        },
        socketId: String,
        ridesHistory: [{ type: String }],
        avatar: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

captainSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.methods.generateAuthToken = async function () {
    const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    return token;
};

export const Captain = model("Captain", captainSchema);
