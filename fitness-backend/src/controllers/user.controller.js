import { z, ZodError } from "zod";
import {
  getLatestUserPlan,
  loginUser,
  registerUser,
} from "../services/user.service.js";

const authSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

const registerSchema = authSchema.extend({
  name: z.string().trim().min(1),
});

const handleAuthError = (error, res) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid user request",
      details: error.flatten(),
    });
  }

  if (
    error.message === "Email already exists" ||
    error.message === "Username already exists" ||
    error.message === "Invalid email or password"
  ) {
    return res.status(400).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: error.message });
};

export const register = async (req, res) => {
  try {
    const user = await registerUser(registerSchema.parse(req.body));
    res.status(201).json({ user });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const user = await loginUser(authSchema.parse(req.body));
    const latest = await getLatestUserPlan(user.id);
    res.json({ user, latest });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const latestPlan = async (req, res) => {
  try {
    const latest = await getLatestUserPlan(req.params.userId);
    res.json({ latest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
