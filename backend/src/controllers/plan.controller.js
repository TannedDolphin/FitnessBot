import { ZodError } from "zod";
import { fitnessProfileSchema } from "../schemas/fitness.schema.js";
import { generateFitnessPlans } from "../services/plan.service.js";
import { saveGeneratedPlan } from "../services/persistence.service.js";

export const generatePlans = async (req, res) => {
  try {
    const profile = req.body?.fitnessProfile ?? req.body;
    const parsedProfile = fitnessProfileSchema.parse(profile);
    const plans = await generateFitnessPlans(parsedProfile, req.body?.userData);
    const saved = await saveGeneratedPlan({
      userId: req.body?.userId,
      userData: req.body?.userData,
      fitnessProfile: parsedProfile,
      workoutPlan: plans.workoutPlan,
      nutritionPlan: plans.nutritionPlan,
      model: plans.model,
      finishReason: plans.finishReason,
    });

    res.json({ ...plans, saved });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Invalid fitness profile",
        details: error.flatten(),
      });
    }

    if (error instanceof SyntaxError) {
      return res.status(502).json({
        error: "AI returned invalid JSON",
      });
    }

    console.error(error);

    res.status(502).json({
      error: "AI service error",
      message: error.message,
    });
  }
};
