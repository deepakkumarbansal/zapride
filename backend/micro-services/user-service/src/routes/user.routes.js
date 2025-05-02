import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { body } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/register",
    [
        body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid email"),
        body("phone").optional({ checkFalsy: true }).isMobilePhone().withMessage("Invalid phone number"),
        body().custom((value) => {
            if (!value.email && !value.phone) {
                throw new Error("Email or phone is required");
            } else {
                return true;
            }
        }),
        body("fullName.firstName").trim().isLength({ min: 3 }).withMessage("First name must have atleast 3 characters"),
        body("fullName.lastName").trim().isLength({ min: 3 }).withMessage("Last name must have atleast 3 characters"),
        body("password").trim().isLength({ min: 6 }).withMessage("Password length must have atleast 6 characters"),
    ],
    registerUser
);
router.post(
    "/login",
    [
        body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid Email"),
        body("phone").optional({ checkFalsy: true }).isMobilePhone().withMessage("Invalid phone"),
        body().custom((value) => {
            if (!value.email && !value.phone) {
                throw new Error("Email or phone is required");
            } else {
                return true;
            }
        }),
        body("password").trim().isLength({ min: 6 }).withMessage("Password must have atleast 6 characters"),
    ],
    loginUser
);
router.get("/get-profile", verifyJWT, getUserProfile);
router.post("/logout", verifyJWT, logoutUser);

export default router;
