import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Plan } from "../models/plan.model.js";

const isMongoReady = () => mongoose.connection.readyState === 1;

export const toPublicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
});

export const registerUser = async ({ name, email, password }) => {
  if (!isMongoReady()) {
    throw new Error("MongoDB is not connected");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const username = normalizedEmail;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      username,
      passwordHash,
    });

    return toPublicUser(user);
  } catch (error) {
    if (error?.code === 11000) {
      if (error.message?.includes("email_1") || error.message?.includes("email")) {
        throw new Error("Email already exists");
      }
      if (error.message?.includes("username_1") || error.message?.includes("username")) {
        throw new Error("Username already exists");
      }
      throw new Error("Duplicate user record");
    }
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  if (!isMongoReady()) {
    throw new Error("MongoDB is not connected");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  return toPublicUser(user);
};

export const requestPasswordReset = async ({ email }) => {
  if (!isMongoReady()) {
    throw new Error("MongoDB is not connected");
  }

  const normalizedEmail = email.trim().toLowerCase();
  await User.findOne({ email: normalizedEmail });

  // In a full implementation, send an email with a reset link or token here.
  return;
};

export const changeUserPassword = async ({ email, currentPassword, newPassword }) => {
  if (!isMongoReady()) {
    throw new Error("MongoDB is not connected");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  return toPublicUser(user);
};

export const getLatestUserPlan = async (userId) => {
  if (!isMongoReady() || !userId) {
    return null;
  }

  const plan = await Plan.findOne({ user: userId, active: true })
    .sort({ createdAt: -1 })
    .populate("fitnessProfile")
    .lean();

  if (!plan) {
    return null;
  }

  return {
    fitnessProfile: plan.fitnessProfile,
    workoutPlan: plan.workoutPlan,
    nutritionPlan: plan.nutritionPlan,
  };
};
