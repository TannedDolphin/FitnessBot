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

const removeTrailingCommas = (text) =>
  text.replace(/,\s*([}\]])/g, "$1");

const quoteUnquotedKeys = (text) =>
  text.replace(
    /([\{\[,\s])([A-Za-z0-9_\- ]+)(\s*:\s*)/g,
    (match, prefix, key, suffix) => {
      if (/^".*"$/.test(key) || /^'.*'$/.test(key)) {
        return match;
      }

      return `${prefix}"${key.trim()}"${suffix}`;
    }
  );

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

  const hour = Math.min(Number(match[1]), 23)
    .toString()
    .padStart(2, "0");

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

  const wantsGain = normalizedGoals.some(
    (goal) =>
      goal.includes("tang co") ||
      goal.includes("tăng cơ") ||
      goal.includes("build muscle") ||
      goal.includes("gain muscle")
  );

  const wantsLose = normalizedGoals.some(
    (goal) =>
      goal.includes("giam can") ||
      goal.includes("giảm cân") ||
      goal.includes("lose weight") ||
      goal.includes("cut fat")
  );

  if (wantsGain && !wantsLose) return "gain";

  if (wantsLose && !wantsGain) return "lose";

  return "maintain";
};

const getActivityFactor = (trainingDaysPerWeek) => {
  if (trainingDaysPerWeek <= 2) return 1.2;

  if (trainingDaysPerWeek <= 4) return 1.375;

  if (trainingDaysPerWeek <= 6) return 1.55;

  return 1.725;
};

const calculateBMI = (weight, heightCm) => {
  const heightM = heightCm / 100;

  return Number((weight / (heightM * heightM)).toFixed(1));
};

const calculateWaterIntake = (weight) => {
  return Math.round(weight * 35);
};

const distributeMealCalories = (dailyCalories) => {
  return {
    breakfast: Math.round(dailyCalories * 0.25),
    lunch: Math.round(dailyCalories * 0.35),
    dinner: Math.round(dailyCalories * 0.3),
    snack: Math.round(dailyCalories * 0.1),
  };
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

  const activityFactor = getActivityFactor(
    Number(profile.trainingDaysPerWeek)
  );

  const goalType = getGoalType(profile.goals);

  const goalMultiplier =
    goalType === "gain"
      ? 1.1
      : goalType === "lose"
      ? 0.85
      : 1.0;

  const dailyCalories = clampNumber(
    bmr * activityFactor * goalMultiplier,
    1200,
    6000,
    2200
  );

  const proteinPerKg =
    goalType === "gain"
      ? 2.0
      : goalType === "lose"
      ? 1.8
      : 1.6;

  const protein = clampNumber(
    weight * proteinPerKg,
    50,
    400,
    150
  );

  const fats = clampNumber(
    Math.round((dailyCalories * 0.25) / 9),
    10,
    250,
    70
  );

  const carbs = clampNumber(
    Math.round(
      (dailyCalories - protein * 4 - fats * 9) / 4
    ),
    20,
    800,
    220
  );

  return {
    bmi: calculateBMI(weight, height),

    waterIntakeMl: calculateWaterIntake(weight),

    dailyCalories,

    mealCalories: distributeMealCalories(dailyCalories),

    macros: {
      protein,
      carbs,
      fats,
    },
  };
};

const fallbackExercises = [
  {
    name: "Squat",
    sets: 3,
    reps: "10-12",
    rest: "60s",
  },

  {
    name: "Push-up",
    sets: 3,
    reps: "8-12",
    rest: "60s",
  },

  {
    name: "Plank",
    sets: 3,
    reps: "30s",
    rest: "45s",
  },
];

const fallbackMeals = [
  {
    name: "Bua sang - Yen mach va trung",
    calories: 450,
    time: "07:00",
  },

  {
    name: "Bua trua - Com ga va rau",
    calories: 650,
    time: "12:30",
  },

  {
    name: "Bua toi - Ca va khoai lang",
    calories: 600,
    time: "18:30",
  },
];

const normalizeExercises = (exercises, dayIndex) => {
  const source =
    Array.isArray(exercises) && exercises.length > 0
      ? exercises
      : fallbackExercises;

  return source.slice(0, 8).map((rawExercise, exerciseIndex) => {
    const exercise = rawExercise || {};

    const fallback =
      fallbackExercises[
        exerciseIndex % fallbackExercises.length
      ];

    return {
      id:
        exercise.id ||
        `ex-${dayIndex + 1}-${exerciseIndex + 1}`,

      name: String(exercise.name || fallback.name),

      sets: clampNumber(
        exercise.sets,
        1,
        8,
        fallback.sets
      ),

      reps: String(exercise.reps || fallback.reps),

      rest: String(exercise.rest || fallback.rest),
    };
  });
};

const normalizeMeals = (meals) => {
  const source = Array.isArray(meals)
    ? meals.slice(0, 8)
    : [];

  const normalized = source.map((rawMeal, mealIndex) => {
    const meal = rawMeal || {};

    const fallback =
      fallbackMeals[mealIndex % fallbackMeals.length];

    return {
      id: meal.id || `meal-${mealIndex + 1}`,

      name: String(meal.name || fallback.name),

      calories: clampNumber(
        meal.calories,
        50,
        2500,
        fallback.calories
      ),

      time: toHHMM(meal.time, fallback.time),
    };
  });

  while (normalized.length < 3) {
    const fallback =
      fallbackMeals[
        normalized.length % fallbackMeals.length
      ];

    normalized.push({
      id: `meal-${normalized.length + 1}`,
      name: fallback.name,
      calories: fallback.calories,
      time: fallback.time,
    });
  }

  return normalized;
};

const normalizePlans = (
  plans,
  trainingDaysPerWeek = 4,
  nutritionTargets
) => {
  const desiredDays = Math.max(
    1,
    Math.min(Number(trainingDaysPerWeek) || 4, 7)
  );

  const sourceDays =
    Array.isArray(plans?.workoutPlan?.days) &&
    plans.workoutPlan.days.length > 0
      ? plans.workoutPlan.days
      : [
          {
            day: "Buoi 1",
            exercises: fallbackExercises,
          },
        ];

  const normalizedDays = sourceDays.slice(
    0,
    desiredDays
  );

  while (normalizedDays.length < desiredDays) {
    normalizedDays.push({
      day: `Buoi ${normalizedDays.length + 1}`,
      exercises: fallbackExercises,
    });
  }

  return {
    workoutPlan: {
      days: normalizedDays.map((rawDay, dayIndex) => {
        const day = rawDay || {};

        return {
          id: day.id || `day-${dayIndex + 1}`,

          day: `Buoi ${dayIndex + 1}`,

          exercises: normalizeExercises(
            day.exercises,
            dayIndex
          ),
        };
      }),
    },

    nutritionPlan: {
      bmi: nutritionTargets.bmi,

      waterIntakeMl:
        nutritionTargets.waterIntakeMl,

      dailyCalories:
        nutritionTargets.dailyCalories,

      macros: nutritionTargets.macros,

      meals: normalizeMeals(
        plans?.nutritionPlan?.meals
      ),
    },
  };
};

const buildPlanPrompt = (
  profile,
  nutritionTargets
) => `
Generate a JSON object for a Vietnamese AI fitness app.

The JSON must match this frontend shape exactly:

{
  "workoutPlan": {
    "days": [
      {
        "id": "day-1",
        "day": "Buoi 1",
        "exercises": [
          {
            "id": "ex-1-1",
            "name": "Squat",
            "sets": 3,
            "reps": "10-12",
            "rest": "60s"
          }
        ]
      }
    ]
  },

  "nutritionPlan": {
    "meals": [
      {
        "id": "meal-1",
        "name": "Bua sang - Yen mach va trung",
        "calories": 450,
        "time": "07:00"
      }
    ]
  }
}

IMPORTANT:
- Return ONLY valid JSON.
- No markdown.
- No explanations.
- Every property name MUST use double quotes.
- No trailing commas.
- Create exactly ${profile.trainingDaysPerWeek} workout sessions.
- Sessions must be named:
  "Buoi 1", "Buoi 2", etc.
- Never use weekdays.
- Use ids like:
  day-1
  ex-1-1
  meal-1
- Meal time must use HH:mm.
- Maximum 5 exercises per session.
- Maximum 4 meals.

User profile:
- age: ${profile.age}
- gender: ${profile.gender}
- height: ${profile.height}
- weight: ${profile.weight}
- fitnessLevel: ${profile.fitnessLevel}
- trainingDaysPerWeek:
  ${profile.trainingDaysPerWeek}
- goals:
  ${
    Array.isArray(profile.goals)
      ? profile.goals.join(", ")
      : profile.goals
  }
- restrictions:
  ${profile.restrictions || "Khong co"}

Nutrition targets:
- dailyCalories:
  ${nutritionTargets.dailyCalories}

- protein:
  ${nutritionTargets.macros.protein}

- carbs:
  ${nutritionTargets.macros.carbs}

- fats:
  ${nutritionTargets.macros.fats}

Meal calorie targets:
- breakfast:
  ${nutritionTargets.mealCalories.breakfast}

- lunch:
  ${nutritionTargets.mealCalories.lunch}

- dinner:
  ${nutritionTargets.mealCalories.dinner}

- snack:
  ${nutritionTargets.mealCalories.snack}
`;

export const generateFitnessPlans = async (
  rawProfile
) => {
  const profile =
    fitnessProfileSchema.parse(rawProfile);

  const nutritionTargets =
    calculateNutritionTargets(profile);

  const { text, model, finishReason, usage } =
    await chatWithCohere({
      messages: [
        {
          role: "system",

          content:
            "You are a careful fitness coach and nutrition planner. You generate strict JSON for a React frontend.",
        },

        {
          role: "user",

          content: buildPlanPrompt(
            profile,
            nutritionTargets
          ),
        },
      ],

      maxTokens: 3000,

      temperature: 0.2,
    });

  const rawResponse = stripJsonFence(text);

  console.log("RAW AI RESPONSE:");
  console.log(rawResponse);

  console.log({
    model,
    finishReason,
    usage,
  });

  let parsed;

  try {
    parsed = tryParseJson(rawResponse);
  } catch (error) {
    console.error(
      "Failed to parse AI JSON response:",
      rawResponse,
      error.message
    );

    const repairMessages = [
      {
        role: "system",

        content:
          "You are a JSON repair assistant. Return ONLY valid JSON.",
      },

      {
        role: "user",

        content: `
Fix this invalid JSON.

Return ONLY corrected JSON.

${rawResponse}
`,
      },
    ];

    const repairResult =
      await chatWithCohere({
        messages: repairMessages,

        maxTokens: 2000,

        temperature: 0,
      });

    try {
      parsed = tryParseJson(
        stripJsonFence(repairResult.text)
      );
    } catch (repairError) {
      console.error(
        "AI JSON repair failed:",
        repairResult.text,
        repairError.message
      );

      parsed = {
        workoutPlan: {
          days: [],
        },

        nutritionPlan: {
          meals: [],
        },
      };
    }
  }

  const normalizedPlans = normalizePlans(
    parsed,
    profile.trainingDaysPerWeek,
    nutritionTargets
  );

  const validationResult =
    generatedPlansSchema.safeParse(
      normalizedPlans
    );

  if (!validationResult.success) {
    console.error(
      "Schema validation failed:"
    );

    console.dir(
      validationResult.error.format(),
      { depth: null }
    );

    throw new Error(
      "Invalid AI response schema"
    );
  }

  return {
    ...validationResult.data,

    model,

    finishReason,

    usage,
  };
};