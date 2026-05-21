import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useUser } from "../context/UserContext";
import { Target, Calendar, Zap } from "lucide-react";
import WebsiteNav from "../components/WebsiteNav";
import { motion } from "motion/react";

export default function Onboarding() {
  const navigate = useNavigate();
  const { userData } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <WebsiteNav />

      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background Effects */}
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

        <Card className="w-full max-w-2xl bg-gray-900/50 backdrop-blur-xl border-gray-800 relative z-10">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Chào mừng, {userData?.name}!</CardTitle>
            <CardDescription className="text-gray-400">Hãy thiết lập trải nghiệm thể dục cá nhân của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 border border-gray-800 rounded-lg bg-gray-800/30">
                <Target className="h-8 w-8 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">Đặt mục tiêu của bạn</h3>
                  <p className="text-sm text-gray-400">
                    Cho chúng tôi biết bạn muốn đạt được điều gì - giảm cân, tăng cơ, hay cải thiện sức bền
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-gray-800 rounded-lg bg-gray-800/30">
                <Calendar className="h-8 w-8 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">AI tạo kế hoạch của bạn</h3>
                  <p className="text-sm text-gray-400">
                    AI phân tích hồ sơ của bạn và tạo kế hoạch tập luyện và dinh dưỡng tùy chỉnh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-gray-800 rounded-lg bg-gray-800/30">
                <Zap className="h-8 w-8 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">Theo dõi & Điều chỉnh</h3>
                  <p className="text-sm text-gray-400">
                    Ghi lại tiến độ và xem AI điều chỉnh kế hoạch của bạn để đạt kết quả tối ưu
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={() => navigate("/fitness-profile")} className="w-full bg-gradient-to-r from-blue-600 to-blue-500" size="lg">
              Tiếp tục đến Hồ sơ Thể dục
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>&copy; 2026 FitAI. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
