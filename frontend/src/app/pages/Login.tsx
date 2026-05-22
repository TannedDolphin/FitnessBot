import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  useUser,
  type FitnessProfile,
  type NutritionPlan,
  type WorkoutPlan,
} from "../context/UserContext";
import WebsiteNav from "../components/WebsiteNav";
import { postJson } from "../lib/api";

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  latest?: {
    fitnessProfile?: FitnessProfile;
    workoutPlan?: WorkoutPlan;
    nutritionPlan?: NutritionPlan;
  } | null;
}

export default function Login() {
  const navigate = useNavigate();

  const {
    setUserData,
    setFitnessProfile,
    setWorkoutPlan,
    setNutritionPlan,
  } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await postJson<LoginResponse>("/api/users/login", {
        email,
        password,
      });

      setUserData(response.user);

      if (response.latest?.fitnessProfile) {
        setFitnessProfile(response.latest.fitnessProfile);
      }

      if (response.latest?.workoutPlan) {
        setWorkoutPlan(response.latest.workoutPlan);
      }

      if (response.latest?.nutritionPlan) {
        setNutritionPlan(response.latest.nutritionPlan);
      }

      navigate(response.latest?.workoutPlan ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đăng nhập.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center text-slate-100">
              Đăng nhập
            </CardTitle>

            <CardDescription className="text-center text-slate-500 text-sm">
              Chào mừng bạn trở lại với FitAI
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm">
                  Mật khẩu
                </Label>

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                />
              </div>

              <div className="flex items-center justify-end text-sm">
                <Link
                  to="/forgot-password"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {error ? (
                <p className="text-sm text-red-400">{error}</p>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all h-11"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-green-400 hover:text-green-300 font-semibold transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
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