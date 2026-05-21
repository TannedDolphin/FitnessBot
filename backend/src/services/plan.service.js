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

const removeTrailingCommas = (text) => text.replace(/,\s*([}\]])/g, "$1");

const quoteUnquotedKeys = (text) =>
  text.replace(/([\{\[,\s])([A-Za-z0-9_\- ]+)(\s*:\s*)/g, (match, prefix, key, suffix) => {
    if (/^".*"$/.test(key) || /^'.*'$/.test(key)) {
      return match;
    }
    return `${prefix}"${key.trim()}"${suffix}`;
  });

const sanitizeJsonText = (text) => {
  let cleaned = text.trim();
  cleaned = removeTrailingCommas(cleaned);
  cleaned = quoteUnquotedKeys(cleaned);
  return cleaned;
};

const tryParseJson = (input) => {
  if (typeof input !== "string") {
    return input;
  }

  const trimmed = input.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const cleaned = sanitizeJsonText(trimmed);
    return JSON.parse(cleaned);
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

const getGoalType = (goals) => {
  const normalizedGoals = Array.isArray(goals)
    ? goals.map((goal) => String(goal).toLowerCase())
    : [];

  const wantsGain = normalizedGoals.some((goal) =>
    goal.includes("tang co") || goal.includes("tăng cơ") || goal.includes("build muscle") || goal.includes("gain muscle"),
  );
  const wantsLose = normalizedGoals.some((goal) =>
    goal.includes("giam can") || goal.includes("giảm cân") || goal.includes("lose weight") || goal.includes("cut fat"),
  );

  if (wantsGain && !wantsLose) return "gain";
  if (wantsLose && !wantsGain) return "lose";
  return "maintain";
};

const getActivityFactor = (fitnessLevel, trainingDaysPerWeek) => {
  if (trainingDaysPerWeek >= 5 || fitnessLevel === "advanced") {
    return 1.55;
  }

  if (trainingDaysPerWeek >= 3 || fitnessLevel === "intermediate") {
    return 1.375;
  }

  return 1.2;
};

const calculateNutritionTargets = (profile) => {
  const age = Number(profile.age);
  const weight = Number(profile.weight);
  const height = Number(profile.height);

  let bmr;
  if (profile.gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (profile.gender === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 78;
  }

  const activityFactor = getActivityFactor(profile.fitnessLevel, Number(profile.trainingDaysPerWeek));
  const goalType = getGoalType(profile.goals);
  const goalMultiplier = goalType === "gain" ? 1.1 : goalType === "lose" ? 0.85 : 1.0;

  const dailyCalories = clampNumber(bmr * activityFactor * goalMultiplier, 1200, 6000, 2200);
  const proteinPerKg = goalType === "gain" ? 2.0 : goalType === "lose" ? 1.8 : 1.6;
  const protein = clampNumber(weight * proteinPerKg, 50, 400, 150);
  const fats = clampNumber(Math.round((dailyCalories * 0.25) / 9), 10, 250, 70);
  const carbs = clampNumber(
    Math.round((dailyCalories - protein * 4 - fats * 9) / 4),
    20,
    800,
    220,
  );

  return {
    dailyCalories,
    macros: {
      protein,
      carbs,
      fats,
    },
  };
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

const normalizePlans = (plans, trainingDaysPerWeek = 4) => {
  const desiredDays = Math.max(1, Math.min(Number(trainingDaysPerWeek) || 4, 7));
  const sourceDays =
    Array.isArray(plans?.workoutPlan?.days) && plans.workoutPlan.days.length > 0
      ? plans.workoutPlan.days
      : [{ day: "Thu Hai", exercises: fallbackExercises }];

  const normalizedDays = sourceDays.slice(0, desiredDays);
  while (normalizedDays.length < desiredDays) {
    normalizedDays.push({ day: `Ngay ${normalizedDays.length + 1}`, exercises: fallbackExercises });
  }

  return {
    workoutPlan: {
      days: sourceDays.slice(0, 7).map((rawDay, dayIndex) => {
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

const buildPlanPrompt = (profile, nutritionTargets) => `
Generate a JSON object for a Vietnamese AI fitness app.

The JSON must match this frontend shape exactly:
{
  "workoutPlan": {
    "days": [
      {
        "id": "day-1",
        "day": "Thu Hai",
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
- Return JSON only. No markdown. No explanations.
- Use Vietnamese names without accents if needed for compatibility.
- Create exactly ${profile.trainingDaysPerWeek} workout days.
- Use ids like day-1, ex-1-1, meal-1.
- Meal time must be 24-hour HH:mm.
- Respect dietary restrictions, goals, and fitness level.
- Keep recommendations safe and realistic for the user's fitness level.
- Do not prescribe medical treatment.

User fitness profile:
- age: ${profile.age}
- gender: ${profile.gender}
- height: ${profile.height}
- weight: ${profile.weight}
- fitnessLevel: ${profile.fitnessLevel}
- trainingDaysPerWeek: ${profile.trainingDaysPerWeek}
- goals: ${Array.isArray(profile.goals) ? profile.goals.join(", ") : profile.goals}
- restrictions: ${profile.restrictions || "Không có"}

Nutrition targets:
- dailyCalories: ${nutritionTargets.dailyCalories}
- protein: ${nutritionTargets.macros.protein}
- carbs: ${nutritionTargets.macros.carbs}
- fats: ${nutritionTargets.macros.fats}
`;

export const generateFitnessPlans = async (rawProfile) => {
  const profile = fitnessProfileSchema.parse(rawProfile);
  const nutritionTargets = calculateNutritionTargets(profile);

  const { text, model, finishReason, usage } = await chatWithCohere({
    messages: [
      {
        role: "system",
        content:
          "You are a careful fitness coach and nutrition planner. You generate strict JSON for a React frontend.",
      },
      { role: "user", content: buildPlanPrompt(profile, nutritionTargets) },
    ],
    maxTokens: 3000,
    temperature: 0.25,
  });

  const rawResponse = stripJsonFence(text);
  let parsed;

  try {
    parsed = tryParseJson(rawResponse);
  } catch (error) {
    console.error("Failed to parse AI JSON response:", rawResponse, error.message);

    const repairMessages = [
      {
        role: "system",
        content:
          "You are a JSON repair assistant. Return only a valid JSON object with no markdown, no extra text, and no explanations.",
      },
      {
        role: "user",
        content: `The previous AI response was invalid JSON. Fix it and return only the corrected JSON object.\n\nInvalid response:\n${rawResponse}`,
      },
    ];

    const repairResult = await chatWithCohere({
      messages: repairMessages,
      maxTokens: 1200,
      temperature: 0.0,
    });

    try {
      parsed = tryParseJson(stripJsonFence(repairResult.text));
    } catch (repairError) {
      console.error("AI JSON repair failed:", repairResult.text, repairError.message);
      parsed = {
        workoutPlan: { days: [] },
        nutritionPlan: {
          dailyCalories: nutritionTargets.dailyCalories,
          macros: nutritionTargets.macros,
          meals: [],
        },
      };
    }
  }

  const plans = generatedPlansSchema.parse(normalizePlans(parsed, profile.trainingDaysPerWeek));

  return {
    ...plans,
    model,
    finishReason,
    usage,
  };
};