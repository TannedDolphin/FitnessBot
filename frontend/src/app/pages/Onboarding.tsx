import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { useUser } from "../context/UserContext";
import { Target, Calendar, Zap } from "lucide-react";
import WebsiteNav from "../components/WebsiteNav";
import { motion } from "motion/react";

export default function Onboarding() {
  const navigate = useNavigate();
  const { userData } = useUser();

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
        <div className="w-full max-w-2xl relative z-10">
          <div className="bg-[#0B1120]/80 backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-2xl shadow-black/60">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">Chào mừng, {userData?.name}!</h1>
              <p className="text-slate-500 text-sm">Hãy thiết lập trải nghiệm thể dục cá nhân của bạn</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-5 border border-white/6 rounded-xl bg-[#111827] hover:border-green-500/20 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-slate-100">Đặt mục tiêu của bạn</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Cho chúng tôi biết bạn muốn đạt được điều gì - giảm cân, tăng cơ, hay cải thiện sức bền
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 border border-white/6 rounded-xl bg-[#111827] hover:border-green-500/20 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-slate-100">AI tạo kế hoạch của bạn</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    AI phân tích hồ sơ của bạn và tạo kế hoạch tập luyện và dinh dưỡng tùy chỉnh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 border border-white/6 rounded-xl bg-[#111827] hover:border-green-500/20 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-green-600/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-slate-100">Theo dõi & Điều chỉnh</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Ghi lại tiến độ và xem AI điều chỉnh kế hoạch của bạn để đạt kết quả tối ưu
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate("/fitness-profile")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all h-11"
              size="lg"
            >
              Tiếp tục đến Hồ sơ Thể dục
            </Button>
          </div>
        </div>
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