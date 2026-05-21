import mongoose from "mongoose";
import { FitnessProfile } from "../models/fitnessProfile.model.js";
import { Plan } from "../models/plan.model.js";
import { User } from "../models/user.model.js";

const isMongoReady = () => mongoose.connection.readyState === 1;

const resolveUserId = async ({ userId, userData }) => {
  if (userId) {
    return userId;
  }

  if (!userData?.email) {
    return null;
  }

  const user = await User.findOne({ email: userData.email.trim().toLowerCase() });
  return user?._id ?? null;
};

export const saveGeneratedPlan = async ({
  userId,
  userData,
  fitnessProfile,
  workoutPlan,
  nutritionPlan,
  model,
  finishReason,
}) => {
  if (!isMongoReady()) {
    return null;
  }

  const resolvedUserId = await resolveUserId({ userId, userData });

  if (!resolvedUserId) {
    return null;
  }

  const profileDocument = await FitnessProfile.create({
    user: resolvedUserId,
    ...fitnessProfile,
  });

  await Plan.updateMany(
    { user: resolvedUserId, active: true },
    { $set: { active: false } },
  );

  const planDocument = await Plan.create({
    user: resolvedUserId,
    fitnessProfile: profileDocument._id,
    workoutPlan,
    nutritionPlan,
    model,
    finishReason,
    active: true,
  });

  return {
    userId: resolvedUserId.toString(),
    fitnessProfileId: profileDocument._id.toString(),
    planId: planDocument._id.toString(),
  };
};
