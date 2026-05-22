import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import WebsiteNav from "../components/WebsiteNav";
import {
  useUser,
  type NutritionPlan,
  type WorkoutPlan,
} from "../context/UserContext";
import { postJson } from "../lib/api";

interface GeneratePlansResponse {
  workoutPlan: WorkoutPlan;
  nutritionPlan: NutritionPlan;
  model?: string;
}

const steps = [
  {
    progress: 20,
    status: "Đang phân tích hồ sơ thể dục của bạn...",
  },
  {
    progress: 45,
    status: "Đang tính cường độ tập luyện phù hợp...",
  },
  {
    progress: 65,
    status: "Đang thiết kế lịch tập cá nhân hóa...",
  },
  {
    progress: 82,
    status: "Đang tạo kế hoạch dinh dưỡng...",
  },
];

export default function PlanGeneration() {
  const navigate = useNavigate();

  const {
    fitnessProfile,
    setWorkoutPlan,
    setNutritionPlan,
    userData,
  } = useUser();

  const [progress, setProgress] = useState(5);
  const [status, setStatus] = useState(
    "Đang kết nối AI coach..."
  );
  const [error, setError] = useState("");

  const generatePlans = async () => {
    if (!fitnessProfile) {
      navigate("/fitness-profile");
      return;
    }

    setError("");
    setProgress(10);
    setStatus("Đang gửi hồ sơ đến AI coach...");

    let stepIndex = 0;

    const progressTimer = window.setInterval(() => {
      const step = steps[stepIndex];

      if (!step) return;

      setProgress(step.progress);
      setStatus(step.status);

      stepIndex += 1;
    }, 900);

    try {
      const plans = await postJson<GeneratePlansResponse>(
        "/api/plans/generate",
        {
          fitnessProfile,
          userId: userData?.id,
          userData,
        }
      );

      window.clearInterval(progressTimer);

      setProgress(100);

      setStatus(
        plans.model
          ? `Đã tạo kế hoạch bằng ${plans.model}. Đang chuyển đến dashboard...`
          : "Đã tạo kế hoạch. Đang chuyển đến dashboard..."
      );

      setWorkoutPlan(plans.workoutPlan);
      setNutritionPlan(plans.nutritionPlan);

      window.setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (err) {
      window.clearInterval(progressTimer);

      setProgress(100);
      setStatus("Chưa tạo được kế hoạch.");

      setError(
        err instanceof Error
          ? err.message
          : "Không thể kết nối backend."
      );
    }
  };

  useEffect(() => {
    void generatePlans();
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <WebsiteNav />

      {/* Ambient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/8 rounded-full blur-3xl pointer-events-none"
      />

      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <Card className="w-full max-w-md bg-[#0B1120]/80 backdrop-blur-xl border border-white/8 rounded-2xl shadow-2xl shadow-black/60 relative z-10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-green-400 animate-pulse" />
              </div>

              <CardTitle className="text-slate-100 text-xl">
                Đang tạo kế hoạch AI của bạn
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Progress
                value={progress}
                className="h-2 bg-[#111827]"
              />

              <p className="text-sm text-slate-400 text-center">
                {status}
              </p>
            </div>

            {error ? (
              <div className="space-y-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                <p>{error}</p>

                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white"
                  onClick={() => void generatePlans()}
                >
                  Thử lại
                </Button>
              </div>
            ) : (
              <div className="text-center text-sm text-slate-500">
                <p>Quá trình này có thể mất vài giây...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-slate-600 text-sm">
          <p>&copy; 2026 FitAI. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}