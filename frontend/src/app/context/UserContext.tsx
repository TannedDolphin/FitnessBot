import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserData {
  id?: string;
  email: string;
  name: string;
}

export interface FitnessProfile {
  age: number;
  weight: number;
  height: number;
  gender: string;
  trainingDaysPerWeek: number;
  fitnessLevel: string;
  goals: string[];
  restrictions: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface WorkoutDay {
  id: string;
  day: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  days: WorkoutDay[];
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
}

export interface NutritionPlan {
  dailyCalories: number;
  macros: { protein: number; carbs: number; fats: number };
  meals: Meal[];
}

export interface ProgressData {
  date: string;
  weight: number;
  workoutCompleted: boolean;
  notes: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  fitnessProfile: FitnessProfile | null;
  setFitnessProfile: (profile: FitnessProfile) => void;
  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan) => void;
  nutritionPlan: NutritionPlan | null;
  setNutritionPlan: (plan: NutritionPlan) => void;
  progressHistory: ProgressData[];
  addProgress: (progress: ProgressData) => void;
  addExercise: (dayId: string, exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (dayId: string, exerciseId: string, exercise: Omit<Exercise, 'id'>) => void;
  deleteExercise: (dayId: string, exerciseId: string) => void;
  addWorkoutDay: (day: Omit<WorkoutDay, 'id'>) => void;
  updateWorkoutDay: (dayId: string, day: Omit<WorkoutDay, 'id' | 'exercises'>) => void;
  deleteWorkoutDay: (dayId: string) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (mealId: string, meal: Omit<Meal, 'id'>) => void;
  deleteMeal: (mealId: string) => void;
  updateWeight: (newWeight: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const storedUserData = () => {
  try {
    const value = window.localStorage.getItem("fitai_user");
    return value ? (JSON.parse(value) as UserData) : null;
  } catch {
    return null;
  }
};

const storedFitnessProfile = () => {
  try {
    const value = window.localStorage.getItem("fitai_fitness_profile");
    return value ? (JSON.parse(value) as FitnessProfile) : null;
  } catch {
    return null;
  }
};

const storedWorkoutPlan = () => {
  try {
    const value = window.localStorage.getItem("fitai_workout_plan");
    return value ? (JSON.parse(value) as WorkoutPlan) : null;
  } catch {
    return null;
  }
};

const storedNutritionPlan = () => {
  try {
    const value = window.localStorage.getItem("fitai_nutrition_plan");
    return value ? (JSON.parse(value) as NutritionPlan) : null;
  } catch {
    return null;
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(storedUserData);
  const [fitnessProfile, setFitnessProfileState] = useState<FitnessProfile | null>(storedFitnessProfile);
  const [workoutPlan, setWorkoutPlanState] = useState<WorkoutPlan | null>(storedWorkoutPlan);
  const [nutritionPlan, setNutritionPlanState] = useState<NutritionPlan | null>(storedNutritionPlan);
  const [progressHistory, setProgressHistory] = useState<ProgressData[]>([]);

  const setUserData = (data: UserData) => {
    setUserDataState(data);
    window.localStorage.setItem("fitai_user", JSON.stringify(data));
  };

  const setFitnessProfileData = (profile: FitnessProfile | null) => {
    setFitnessProfileState(profile);
    if (profile) {
      window.localStorage.setItem("fitai_fitness_profile", JSON.stringify(profile));
    } else {
      window.localStorage.removeItem("fitai_fitness_profile");
    }
  };

  const setWorkoutPlanData = (plan: WorkoutPlan | null) => {
    setWorkoutPlanState(plan);
    if (plan) {
      window.localStorage.setItem("fitai_workout_plan", JSON.stringify(plan));
    } else {
      window.localStorage.removeItem("fitai_workout_plan");
    }
  };

  const setNutritionPlanData = (plan: NutritionPlan | null) => {
    setNutritionPlanState(plan);
    if (plan) {
      window.localStorage.setItem("fitai_nutrition_plan", JSON.stringify(plan));
    } else {
      window.localStorage.removeItem("fitai_nutrition_plan");
    }
  };

  const addProgress = (progress: ProgressData) => {
    setProgressHistory(prev => [...prev, progress]);
  };

  // Workout CRUD operations
  const addExercise = (dayId: string, exercise: Omit<Exercise, 'id'>) => {
    setWorkoutPlanState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map(day =>
          day.id === dayId
            ? { ...day, exercises: [...day.exercises, { ...exercise, id: Date.now().toString() }] }
            : day
        )
      };
    });
  };

  const updateExercise = (dayId: string, exerciseId: string, exercise: Omit<Exercise, 'id'>) => {
    setWorkoutPlanState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map(day =>
          day.id === dayId
            ? {
                ...day,
                exercises: day.exercises.map(ex =>
                  ex.id === exerciseId ? { ...exercise, id: exerciseId } : ex
                )
              }
            : day
        )
      };
    });
  };

  const deleteExercise = (dayId: string, exerciseId: string) => {
    setWorkoutPlanState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map(day =>
          day.id === dayId
            ? { ...day, exercises: day.exercises.filter(ex => ex.id !== exerciseId) }
            : day
        )
      };
    });
  };

  const addWorkoutDay = (day: Omit<WorkoutDay, 'id'>) => {
    setWorkoutPlanState(prev => {
      if (!prev) return { days: [{ ...day, id: Date.now().toString() }] };
      return {
        ...prev,
        days: [...prev.days, { ...day, id: Date.now().toString() }]
      };
    });
  };

  const updateWorkoutDay = (dayId: string, day: Omit<WorkoutDay, 'id' | 'exercises'>) => {
    setWorkoutPlanState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map(d =>
          d.id === dayId ? { ...d, ...day } : d
        )
      };
    });
  };

  const deleteWorkoutDay = (dayId: string) => {
    setWorkoutPlanState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.filter(d => d.id !== dayId)
      };
    });
  };

  // Nutrition CRUD operations
  const addMeal = (meal: Omit<Meal, 'id'>) => {
    setNutritionPlanState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        meals: [...prev.meals, { ...meal, id: Date.now().toString() }]
      };
    });
  };

  const updateMeal = (mealId: string, meal: Omit<Meal, 'id'>) => {
    setNutritionPlanState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        meals: prev.meals.map(m =>
          m.id === mealId ? { ...meal, id: mealId } : m
        )
      };
    });
  };

  const deleteMeal = (mealId: string) => {
    setNutritionPlanState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        meals: prev.meals.filter(m => m.id !== mealId)
      };
    });
  };

  const updateWeight = (newWeight: number) => {
    setFitnessProfileState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, weight: newWeight };
      window.localStorage.setItem("fitai_fitness_profile", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        fitnessProfile,
        setFitnessProfile: setFitnessProfileData,
        workoutPlan,
        setWorkoutPlan: setWorkoutPlanData,
        nutritionPlan,
        setNutritionPlan: setNutritionPlanData,
        progressHistory,
        addProgress,
        addExercise,
        updateExercise,
        deleteExercise,
        addWorkoutDay,
        updateWorkoutDay,
        deleteWorkoutDay,
        addMeal,
        updateMeal,
        deleteMeal,
        updateWeight,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
