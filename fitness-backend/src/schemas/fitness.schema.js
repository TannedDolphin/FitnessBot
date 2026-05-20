import { z } from "zod";

const idSchema = z.string().trim().min(1);

export const fitnessProfileSchema = z.object({
  age: z.coerce.number().int().min(13).max(100),
  weight: z.coerce.number().positive().min(25).max(300),
  height: z.coerce.number().positive().min(100).max(250),
  gender: z.enum(["male", "female", "other"]),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  trainingDaysPerWeek: z.coerce.number().int().min(1).max(7),
  goals: z.array(z.string().trim().min(1)).min(1),
  restrictions: z.string().trim().optional().default(""),
});

export const exerciseSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1),
  sets: z.coerce.number().int().min(1).max(8),
  reps: z.string().trim().min(1),
  rest: z.string().trim().min(1),
});

export const workoutDaySchema = z.object({
  id: idSchema,
  day: z.string().trim().min(1),
  exercises: z.array(exerciseSchema).min(1).max(8),
});

export const workoutPlanSchema = z.object({
  days: z.array(workoutDaySchema).min(1).max(7),
});

export const mealSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1),
  calories: z.coerce.number().int().min(50).max(2500),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
});

export const nutritionPlanSchema = z.object({
  dailyCalories: z.coerce.number().int().min(900).max(6000),
  macros: z.object({
    protein: z.coerce.number().int().min(20).max(400),
    carbs: z.coerce.number().int().min(20).max(800),
    fats: z.coerce.number().int().min(10).max(250),
  }),
  meals: z.array(mealSchema).min(3).max(8),
});

export const generatedPlansSchema = z.object({
  workoutPlan: workoutPlanSchema,
  nutritionPlan: nutritionPlanSchema,
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "ai", "assistant"]),
        content: z.string().trim().min(1),
      }),
    )
    .optional()
    .default([]),
  fitnessProfile: fitnessProfileSchema.nullish(),
  workoutPlan: workoutPlanSchema.nullish(),
  nutritionPlan: nutritionPlanSchema.nullish(),
});

export const generatedPlansJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["workoutPlan", "nutritionPlan"],
  properties: {
    workoutPlan: {
      type: "object",
      additionalProperties: false,
      required: ["days"],
      properties: {
        days: {
          type: "array",
          minItems: 3,
          maxItems: 5,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "day", "exercises"],
            properties: {
              id: { type: "string" },
              day: { type: "string" },
              exercises: {
                type: "array",
                minItems: 3,
                maxItems: 5,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["id", "name", "sets", "reps", "rest"],
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    sets: { type: "integer", minimum: 1, maximum: 8 },
                    reps: { type: "string" },
                    rest: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    nutritionPlan: {
      type: "object",
      additionalProperties: false,
      required: ["dailyCalories", "macros", "meals"],
      properties: {
        dailyCalories: { type: "integer", minimum: 900, maximum: 6000 },
        macros: {
          type: "object",
          additionalProperties: false,
          required: ["protein", "carbs", "fats"],
          properties: {
            protein: { type: "integer", minimum: 20, maximum: 400 },
            carbs: { type: "integer", minimum: 20, maximum: 800 },
            fats: { type: "integer", minimum: 10, maximum: 250 },
          },
        },
        meals: {
          type: "array",
          minItems: 3,
          maxItems: 8,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "name", "calories", "time"],
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              calories: { type: "integer", minimum: 50, maximum: 2500 },
              time: { type: "string" },
            },
          },
        },
      },
    },
  },
};
