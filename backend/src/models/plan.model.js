import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    sets: Number,
    reps: String,
    rest: String,
  },
  { _id: false },
);

const workoutDaySchema = new mongoose.Schema(
  {
    id: String,
    day: String,
    exercises: [exerciseSchema],
  },
  { _id: false },
);

const mealSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    calories: Number,
    time: String,
  },
  { _id: false },
);

const planSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fitnessProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FitnessProfile",
      required: true,
    },
    workoutPlan: {
      days: [workoutDaySchema],
    },
    nutritionPlan: {
      dailyCalories: Number,
      macros: {
        protein: Number,
        carbs: Number,
        fats: Number,
      },
      meals: [mealSchema],
    },
    model: String,
    finishReason: String,
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const Plan = mongoose.model("Plan", planSchema);
