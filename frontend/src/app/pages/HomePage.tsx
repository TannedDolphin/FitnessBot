import { Link } from "react-router";
import { motion } from "motion/react";
import { Zap, Brain, Trophy, TrendingUp } from "lucide-react";
import heroImage from "../../imports/hero-fitness.jpg";
import featureImage from "../../imports/feature-tracking.jpg";
import ctaImage from "../../imports/cta-fitness.jpg";
import WebsiteNav from "../components/WebsiteNav";

const features = [
  {
    icon: Brain,
    title: "Huấn luyện viên AI",
    description:
      "Nhận kế hoạch tập luyện và dinh dưỡng cá nhân hóa được hỗ trợ bởi AI tiên tiến",
  },
  {
    icon: Zap,
    title: "Theo dõi thời gian thực",
    description:
      "Giám sát tiến độ của bạn với số liệu trực tiếp và phân tích chi tiết",
  },
  {
    icon: Trophy,
    title: "Đạt mục tiêu",
    description:
      "Đặt mục tiêu tham vọng và chinh phục chúng với thông tin chi tiết dựa trên dữ liệu",
  },
  {
    icon: TrendingUp,
    title: "Phân tích tiến độ",
    description:
      "Trực quan hóa hành trình rèn luyện của bạn với biểu đồ và xu hướng đẹp mắt",
  },
];

export default function HomePage() {
  return (
    <div className="relative bg-[#050816] text-white">
      <WebsiteNav />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <motion.img
            src={heroImage}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6 }}
            className="w-full h-full object-cover"
            alt="Hero fitness"
          />
          <div className="absolute inset-0 bg-[#050816]/70" />
        </div>

        {/* Ambient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/12 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"
        />

        {/* Content */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                VƯỢT QUA
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                GIỚI HẠN
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Người đồng hành thể dục được hỗ trợ AI của bạn.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-200"
              >
                Dùng thử miễn phí
              </Link>

              <Link
                to="/about"
                className="px-8 py-4 bg-white/6 text-white rounded-xl backdrop-blur-sm hover:bg-white/12 border border-white/10 transition-all duration-200"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#050816] to-[#0B1120]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 tracking-tight">
            MỌI THỨ BẠN CẦN
          </h2>
          <p className="text-slate-500 text-center mb-14 text-lg">Được thiết kế cho hiệu suất đỉnh cao</p>

          {/* Banner Image */}
          <div className="relative mb-16 rounded-2xl overflow-hidden border border-white/6">
            <img
              src={featureImage}
              className="w-full h-64 md:h-80 object-cover"
              alt="Feature tracking"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/90 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <p className="text-white text-2xl font-semibold">
                Công nghệ AI cho thể dục
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group p-8 bg-[#111827] border border-white/5 rounded-2xl hover:border-green-500/20 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-slate-100">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-[#0B1120]">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/6">
            <img src={ctaImage} className="w-full h-[400px] object-cover" alt="CTA fitness" />
            <div className="absolute inset-0 bg-[#050816]/70" />

            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div>
                <h2 className="text-4xl md:text-6xl mb-6 font-bold tracking-tight">SẴN SÀNG BẮT ĐẦU?</h2>
                <p className="mb-8 text-slate-300 text-lg">
                  Tham gia cùng hàng nghìn người dùng ngay hôm nay
                </p>

                <Link
                  to="/register"
                  className="inline-block px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-200"
                >
                  Bắt đầu miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#050816] border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-slate-600 text-sm">
          <p>&copy; 2026 FitAI. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}