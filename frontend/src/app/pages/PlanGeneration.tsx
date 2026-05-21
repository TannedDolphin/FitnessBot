import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import WebsiteNav from "../components/WebsiteNav";
import { useUser, type NutritionPlan, type WorkoutPlan } from "../context/UserContext";
import { postJson } from "../lib/api";

interface GeneratePlansResponse {
  workoutPlan: WorkoutPlan;
  nutritionPlan: NutritionPlan;
  model?: string;
}

const steps = [
  { progress: 20, status: "Dang phan tich ho so the duc cua ban..." },
  { progress: 45, status: "Dang tinh cuong do tap luyen phu hop..." },
  { progress: 65, status: "Dang thiet ke lich tap ca nhan hoa..." },
  { progress: 82, status: "Dang tao ke hoach dinh duong..." },
];

export default function PlanGeneration() {
  const navigate = useNavigate();
  const { fitnessProfile, setWorkoutPlan, setNutritionPlan, userData } = useUser();
  const [progress, setProgress] = useState(5);
  const [status, setStatus] = useState("Dang ket noi AI coach...");
  const [error, setError] = useState("");

  const generatePlans = async () => {
    if (!fitnessProfile) {
      navigate("/fitness-profile");
      return;
    }

    setError("");
    setProgress(10);
    setStatus("Dang gui ho so den AI coach...");

    let stepIndex = 0;
    const progressTimer = window.setInterval(() => {
      const step = steps[stepIndex];
      if (!step) return;

      setProgress(step.progress);
      setStatus(step.status);
      stepIndex += 1;
    }, 900);

    try {
      const plans = await postJson<GeneratePlansResponse>("/api/plans/generate", {
        fitnessProfile,
        userId: userData?.id,
        userData,
      });

      window.clearInterval(progressTimer);
      setProgress(100);
      setStatus(
        plans.model
          ? `Da tao ke hoach bang ${plans.model}. Dang chuyen den dashboard...`
          : "Da tao ke hoach. Dang chuyen den dashboard...",
      );
      setWorkoutPlan(plans.workoutPlan);
      setNutritionPlan(plans.nutritionPlan);

      window.setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (err) {
      window.clearInterval(progressTimer);
      setProgress(100);
      setStatus("Chua tao duoc ke hoach.");
      setError(err instanceof Error ? err.message : "Khong the ket noi backend.");
    }
  };

  useEffect(() => {
    void generatePlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <WebsiteNav />

      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />

        <Card className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border-gray-800 relative z-10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
              <CardTitle className="text-white">Dang tao ke hoach AI cua ban</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-400 text-center">{status}</p>
            </div>

            {error ? (
              <div className="space-y-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                <p>{error}</p>
                <Button className="w-full" onClick={() => void generatePlans()}>
                  Thu lai
                </Button>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500">
                <p>Qua trinh nay co the mat vai giay...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>&copy; 2026 FitAI. Tat ca quyen duoc bao luu.</p>
        </div>
      </footer>
    </div>
  );
}
