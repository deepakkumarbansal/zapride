import { Router } from "express";
import { body } from "express-validator";
import { getProfile, login, logout, register } from "../controllers/captain.controller.js";
import { verifyJWT, uploadToServer } from "../middlewares/index.js";

const router = Router();

router.post(
    "/register",
    uploadToServer.single("avatar"),
    [
        body("email").optional({ checkFalsy: true }).isEmail().withMessage("Email is required"),
        body("phone").optional({ checkFalsy: true }).isMobilePhone().withMessage("Phone is required"),
        body().custom((value) => {
            if (!value.email && !value.phone) {
                throw new Error("Email or phone is required");
            }
            return true;
        }),
        body("fullName.firstName").trim().isLength({ min: 3 }).withMessage("First name is required"),
        body("fullName.lastName").trim().isLength({ min: 3 }).withMessage("Last name is required"),
        body("password").isLength({ min: 3 }).withMessage("Please select the strong password"),
        body("vehicle.type").isIn(["car", "bike", "auto"]).withMessage("Select the valid vehicle type"),
        body("vehicle.capacity").isInt({ min: 1 }).withMessage("Please enter valid vehicle capacity"),
        body("vehicle.color").isLength({ min: 3 }).withMessage("Please Enter a valid color"),
        body("vehicle.numberPlate").isAlphanumeric().withMessage("Please enter a valid number plate"),
    ],
    register
);

router.post(
    "/login",
    [
        body("email").optional({ checkFalsy: true }).isEmail().withMessage("Email is required"),
        body("phone").optional({ checkFalsy: true }).isMobilePhone().withMessage("Phone is required"),
        body().custom((value) => {
            if (!value.email && !value.phone) {
                throw new Error("Email or phone is required");
            }
        }),
        body("password").isLength({ min: 3 }).withMessage("Please select the strong password"),
    ],
    login
);

router.post("/logout", verifyJWT, logout);
router.get("/profile", verifyJWT, getProfile);

export default router;
