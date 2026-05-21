import mongoose from "mongoose";

const fitnessProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
      min: 13,
      max: 100,
    },
    weight: {
      type: Number,
      required: true,
      min: 25,
      max: 300,
    },
    height: {
      type: Number,
      required: true,
      min: 100,
      max: 250,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    trainingDaysPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    goals: {
      type: [String],
      required: true,
      validate: (value) => value.length > 0,
    },
    restrictions: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

export const FitnessProfile = mongoose.model(
  "FitnessProfile",
  fitnessProfileSchema,
);
