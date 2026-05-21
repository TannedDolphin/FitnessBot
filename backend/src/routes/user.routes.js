import express from "express";
import { latestPlan, login, register, changePassword, forgotPassword } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);
router.get("/:userId/latest", latestPlan);

export default router;
