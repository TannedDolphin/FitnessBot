import express from "express";
import {
  latestPlan,
  loginStep1,
  loginStep2,
  register,
  changePassword,
  forgotPassword,
  sendOtp,
  verifyOtpController,
} from "../controllers/user.controller.js";

const router = express.Router();

// OTP
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpController);

// Auth
router.post("/register", register);
router.post("/login", loginStep1);          // Bước 1: xác thực credentials → gửi OTP
router.post("/login/verify", loginStep2);   // Bước 2: xác minh OTP → trả user+plan
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);
router.get("/:userId/latest", latestPlan);

export default router;
