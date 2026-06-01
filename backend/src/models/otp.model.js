import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ["register", "change-password", "forgot-password", "login"],
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index: MongoDB tự động xóa document sau khi hết hạn
      index: { expires: 0 },
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Otp = mongoose.model("Otp", otpSchema);
