import { z, ZodError } from "zod";
import {
  getLatestUserPlan,
  loginUser,
  registerUser,
  changeUserPassword,
  resetPassword,
} from "../services/user.service.js";
import { createAndSendOtp, verifyOtp, consumeVerifiedOtp } from "../services/otp.service.js";
import { User } from "../models/user.model.js";

const authSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

const registerSchema = authSchema.extend({
  name: z.string().trim().min(1),
});

const handleAuthError = (error, res) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: "Invalid user request", details: error.flatten() });
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

// ─── OTP: Gửi mã ─────────────────────────────────────────────────────────────

export const sendOtp = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().trim().email(),
      purpose: z.enum(["register", "change-password", "forgot-password", "login"]),
    });

    const { email, purpose } = schema.parse(req.body);

    if (purpose === "register") {
      const exists = await User.findOne({ email: email.trim().toLowerCase() });
      if (exists) return res.status(400).json({ error: "Email already exists" });
    }

    // Với login: xác thực email tồn tại nhưng không để lộ
    await createAndSendOtp(email, purpose);
    res.json({ message: "Mã OTP đã được gửi đến email của bạn." });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Invalid request", details: error.flatten() });
    }
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ─── OTP: Xác minh mã ────────────────────────────────────────────────────────

export const verifyOtpController = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().trim().email(),
      code: z.string().length(6),
      purpose: z.enum(["register", "change-password", "forgot-password", "login"]),
    });

    const { email, code, purpose } = schema.parse(req.body);
    await verifyOtp(email, code, purpose);
    res.json({ message: "Xác minh thành công." });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Invalid request", details: error.flatten() });
    }
    res.status(400).json({ error: error.message });
  }
};

// ─── Auth: Bước 1 đăng nhập (xác thực email/password, gửi OTP) ───────────────

export const loginStep1 = async (req, res) => {
  try {
    const { email, password } = authSchema.parse(req.body);

    // Xác thực credentials trước (ném lỗi nếu sai)
    await loginUser({ email, password });

    // Credentials đúng → gửi OTP
    await createAndSendOtp(email, "login");

    res.json({ message: "Mã OTP đã được gửi đến email của bạn." });
  } catch (error) {
    handleAuthError(error, res);
  }
};

// ─── Auth: Bước 2 đăng nhập (xác minh OTP, trả về user + plan) ───────────────

export const loginStep2 = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().trim().email(),
      code: z.string().length(6),
    });

    const { email, code } = schema.parse(req.body);

    // Xác minh OTP login
    await verifyOtp(email, code, "login");
    // Consume ngay để tránh reuse
    await consumeVerifiedOtp(email, "login");

    // Lấy thông tin user và kế hoạch
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ error: "Tài khoản không tồn tại." });

    const latest = await getLatestUserPlan(user._id.toString());

    res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
      latest,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Invalid request", details: error.flatten() });
    }
    res.status(400).json({ error: error.message });
  }
};

// ─── Auth: Đăng ký ────────────────────────────────────────────────────────────

export const register = async (req, res) => {
  try {
    const user = await registerUser(registerSchema.parse(req.body));
    res.status(201).json({ user });
  } catch (error) {
    handleAuthError(error, res);
  }
};

// ─── Auth: Đổi mật khẩu ──────────────────────────────────────────────────────

export const changePassword = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().trim().email(),
      currentPassword: z.string().min(6),
      newPassword: z.string().min(6),
    });

    const payload = schema.parse(req.body);
    await changeUserPassword(payload);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Invalid request", details: error.flatten() });
    }
    if (error.message === "Invalid email or password") {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ─── Auth: Quên mật khẩu (đặt lại sau verify OTP) ───────────────────────────

export const forgotPassword = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().trim().email(),
      newPassword: z.string().min(6),
    });

    const { email, newPassword } = schema.parse(req.body);
    await resetPassword({ email, newPassword });

    res.json({ message: "Mật khẩu đã được đặt lại thành công." });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Invalid request", details: error.flatten() });
    }
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ─── Plan ─────────────────────────────────────────────────────────────────────

export const latestPlan = async (req, res) => {
  try {
    const latest = await getLatestUserPlan(req.params.userId);
    res.json({ latest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
