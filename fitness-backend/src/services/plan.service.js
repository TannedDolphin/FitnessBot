import {
  fitnessProfileSchema,
  generatedPlansSchema,
} from "../schemas/fitness.schema.js";
import { chatWithCohere } from "./cohere.service.js";

const stripJsonFence = (text) =>
  text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

export const extractJsonObject = (text) => {
  const cleaned = stripJsonFence(String(text ?? ""));

  if (!cleaned) {
    throw new SyntaxError("Empty AI response");
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: extract first top-level JSON object from any extra text around it
    const start = cleaned.indexOf("{");
    if (start === -1) {
      throw new SyntaxError("No JSON object found in AI response");
    }

    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = start; i < cleaned.length; i += 1) {
      const char = cleaned[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (char === "\\") {
        escape = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (inString) {
        continue;
      }

      if (char === "{") {
        depth += 1;
      }

      if (char === "}") {
        depth -= 1;
        if (depth === 0) {
          const candidate = cleaned.slice(start, i + 1);
          try {
            return JSON.parse(candidate);
          } catch {
            break;
          }
        }
      }
    }

    throw new SyntaxError("Unable to parse JSON from AI response");
  }
};

const toHHMM = (value, fallback) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  const match = normalized.match(/^(\d{1,2}):([0-5]\d)$/);

  if (!match) {
    return fallback;
  }

  const hour = Math.min(Number(match[1]), 23).toString().padStart(2, "0");
  return `${hour}:${match[2]}`;
};

const clampNumber = (value, min, max, fallback) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.min(Math.max(Math.round(number), min), max);
};

const fallbackExercises = [
  { name: "Squat", sets: 3, reps: "10-12", rest: "60s" },
  { name: "Push-up", sets: 3, reps: "8-12", rest: "60s" },
  { name: "Plank", sets: 3, reps: "30s", rest: "45s" },
];

const fallbackMeals = [
  { name: "Bua sang - Yen mach va trung", calories: 450, time: "07:00" },
  { name: "Bua trua - Com ga va rau", calories: 650, time: "12:30" },
  { name: "Bua toi - Ca va khoai lang", calories: 600, time: "18:30" },
];

const normalizeExercises = (exercises, dayIndex) => {
  const source = Array.isArray(exercises) && exercises.length > 0
    ? exercises
    : fallbackExercises;

  return source.slice(0, 8).map((rawExercise, exerciseIndex) => {
    const exercise = rawExercise || {};
    const fallback = fallbackExercises[exerciseIndex % fallbackExercises.length];

    return {
      id: exercise.id || `ex-${dayIndex + 1}-${exerciseIndex + 1}`,
      name: String(exercise.name || fallback.name),
      sets: clampNumber(exercise.sets, 1, 8, fallback.sets),
      reps: String(exercise.reps || fallback.reps),
      rest: String(exercise.rest || fallback.rest),
    };
  });
};

const normalizeMeals = (meals) => {
  const source = Array.isArray(meals) ? meals.slice(0, 8) : [];

  while (source.length < 3) {
    source.push(fallbackMeals[source.length % fallbackMeals.length]);
  }

  return source.map((rawMeal, mealIndex) => {
    const meal = rawMeal || {};
    const fallback = fallbackMeals[mealIndex % fallbackMeals.length];

    return {
      id: meal.id || `meal-${mealIndex + 1}`,
      name: String(meal.name || fallback.name),
      calories: clampNumber(meal.calories, 50, 2500, fallback.calories),
      time: toHHMM(meal.time, fallback.time),
    };
  });
};

const normalizePlans = (plans, trainingDays) => {
  const sourceDays =
    Array.isArray(plans?.workoutPlan?.days) && plans.workoutPlan.days.length > 0
      ? plans.workoutPlan.days
      : [{ day: "Ngay 1", exercises: fallbackExercises }];

  return {
    workoutPlan: {
      days: sourceDays.slice(0, trainingDays || 7).map((rawDay, dayIndex) => {
        const day = rawDay || {};

        return {
          id: day.id || `day-${dayIndex + 1}`,
          day: String(day.day || `Ngay ${dayIndex + 1}`),
          exercises: normalizeExercises(day.exercises, dayIndex),
        };
      }),
    },
    nutritionPlan: {
      dailyCalories: clampNumber(plans?.nutritionPlan?.dailyCalories, 900, 6000, 2200),
      macros: {
        protein: clampNumber(plans?.nutritionPlan?.macros?.protein, 20, 400, 150),
        carbs: clampNumber(plans?.nutritionPlan?.macros?.carbs, 20, 800, 220),
        fats: clampNumber(plans?.nutritionPlan?.macros?.fats, 10, 250, 70),
      },
      meals: normalizeMeals(plans?.nutritionPlan?.meals),
    },
  };
};

const buildPlanPrompt = (profile) => `
Generate a JSON object for a Vietnamese AI fitness app.

The JSON must match this frontend shape exactly:
{
  "workoutPlan": {
    "days": [
      {
        "id": "day-1",
        "day": "Ngay 1",
        "exercises": [
          { "id": "ex-1-1", "name": "Squat", "sets": 3, "reps": "10-12", "rest": "60s" }
        ]
      }
    ]
  },
  "nutritionPlan": {
    "dailyCalories": 2200,
    "macros": { "protein": 150, "carbs": 220, "fats": 70 },
    "meals": [
      { "id": "meal-1", "name": "Bua sang - Yen mach va trung", "calories": 450, "time": "07:00" }
    ]
  }
}

Rules:
- Return only the raw JSON object exactly as shown. No markdown, no code fences, no explanations, no extra text.
- Do not include any text before or after the JSON object.
- Use Vietnamese names without accents if needed for compatibility.
- Use day names as "Ngay 1", "Ngay 2", etc., NOT weekday names.
- Create EXACTLY ${profile.trainingDaysPerWeek} workout days based on user's trainingDaysPerWeek.
- Each day should have 3 to 5 exercises matching the fitness level and goals.
- Use ids like day-1, ex-1-1, meal-1.
- Meal time must be 24-hour HH:mm.
- Respect injuries, dietary restrictions, and goals.
- Adjust training intensity based on fitnessLevel (${profile.fitnessLevel}) and activityLevel (${profile.activityLevel}).
- Adjust calories based on age, weight, height, gender, and activity level.
- Keep recommendations safe and realistic for the user's fitness level.
- Do not prescribe medical treatment.

User fitness profile:
${JSON.stringify(profile, null, 2)}
`;

export const generateFitnessPlans = async (rawProfile) => {
  const profile = fitnessProfileSchema.parse(rawProfile);

  const { text, model, finishReason, usage } = await chatWithCohere({
    messages: [
      {
        role: "system",
        content:
          "You are a careful fitness coach and nutrition planner. You generate strict JSON for a React frontend.",
      },
      { role: "user", content: buildPlanPrompt(profile) },
    ],
    responseFormat: {
      type: "json_object",
    },
    maxTokens: 3000,
    temperature: 0.0,
  });

  let parsed;

  try {
    parsed = extractJsonObject(text);
  } catch (error) {
    console.error("Invalid AI JSON response:", text);

    const repairMessages = [
      {
        role: "system",
        content:
          "You are a JSON repair assistant. Return only a valid JSON object with no markdown, no extra text, and no explanations.",
      },
      {
        role: "user",
        content: `The previous AI response was invalid JSON. Fix it and return only the corrected JSON object.\n\nInvalid response:\n${text}`,
      },
    ];

    const repairResult = await chatWithCohere({
      messages: repairMessages,
      responseFormat: {
        type: "json_object",
      },
      maxTokens: 1200,
      temperature: 0.0,
    });

    parsed = extractJsonObject(repairResult.text);
  }

  const plans = generatedPlansSchema.parse(normalizePlans(parsed, profile.trainingDaysPerWeek));

  return {
    ...plans,
    model,
    finishReason,
    usage,
  };
};
