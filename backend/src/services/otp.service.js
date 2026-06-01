import crypto from "crypto";
import { Otp } from "../models/otp.model.js";
import { sendOtpEmail } from "./email.service.js";

const OTP_EXPIRES_MINUTES = 10;
const OTP_RATE_LIMIT_SECONDS = 60; // Tối thiểu 60s giữa 2 lần gửi

/**
 * Tạo và gửi OTP mới cho email + purpose.
 * Giới hạn: không gửi quá 1 lần/phút.
 */
export async function createAndSendOtp(email, purpose) {
  const normalizedEmail = email.trim().toLowerCase();

  // Rate limit: kiểm tra OTP gần nhất
  const recent = await Otp.findOne({
    email: normalizedEmail,
    purpose,
    createdAt: { $gte: new Date(Date.now() - OTP_RATE_LIMIT_SECONDS * 1000) },
  }).sort({ createdAt: -1 });

  if (recent) {
    const secondsAgo = Math.floor((Date.now() - recent.createdAt.getTime()) / 1000);
    const waitSeconds = OTP_RATE_LIMIT_SECONDS - secondsAgo;
    throw new Error(`Vui lòng đợi ${waitSeconds} giây trước khi gửi lại mã.`);
  }

  // Xóa OTP cũ cùng purpose
  await Otp.deleteMany({ email: normalizedEmail, purpose });

  // Tạo mã OTP 6 chữ số
  const code = String(crypto.randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);

  await Otp.create({ email: normalizedEmail, code, purpose, expiresAt });
  await sendOtpEmail(normalizedEmail, code, purpose);
}

/**
 * Xác minh OTP. Trả về true nếu hợp lệ, ném lỗi nếu không.
 * Sau khi verify thành công, đánh dấu verified=true (dùng 1 lần).
 */
export async function verifyOtp(email, code, purpose) {
  const normalizedEmail = email.trim().toLowerCase();

  const otp = await Otp.findOne({
    email: normalizedEmail,
    purpose,
    verified: false,
  }).sort({ createdAt: -1 });

  if (!otp) {
    throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn.");
  }

  if (otp.expiresAt < new Date()) {
    await otp.deleteOne();
    throw new Error("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
  }

  if (otp.code !== code.trim()) {
    throw new Error("Mã OTP không đúng.");
  }

  // Đánh dấu đã dùng
  otp.verified = true;
  await otp.save();

  return true;
}

/**
 * Kiểm tra xem OTP có đã được verified chưa (dùng cho các action sau verify).
 * Xóa OTP sau khi xác nhận để tránh reuse.
 */
export async function consumeVerifiedOtp(email, purpose) {
  const normalizedEmail = email.trim().toLowerCase();

  const otp = await Otp.findOne({
    email: normalizedEmail,
    purpose,
    verified: true,
  }).sort({ createdAt: -1 });

  if (!otp || otp.expiresAt < new Date()) {
    throw new Error("Phiên xác thực đã hết hạn. Vui lòng xác minh lại.");
  }

  await otp.deleteOne();
  return true;
}
