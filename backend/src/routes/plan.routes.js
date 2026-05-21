import express from "express";
import { generatePlans } from "../controllers/plan.controller.js";

const router = express.Router();

router.post("/generate", generatePlans);

export default router;
