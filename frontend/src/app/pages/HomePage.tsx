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
    <div className="relative bg-black text-white">
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
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />

        {/* Content */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              VƯỢT QUA
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GIỚI HẠN
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Người đồng hành thể dục được hỗ trợ AI của bạn.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/30 transition"
            >
              Dùng thử miễn phí
            </Link>

            <Link
              to="/about"
              className="px-8 py-4 bg-white/10 text-white rounded-xl backdrop-blur-sm hover:bg-white/20 transition"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-32 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12">
            MỌI THỨ BẠN CẦN
          </h2>

          {/* Banner Image */}
          <div className="relative mb-16 rounded-3xl overflow-hidden">
            <img
              src={featureImage}
              className="w-full h-64 md:h-80 object-cover"
              alt="Feature tracking"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <p className="text-white text-2xl font-semibold">
                Công nghệ AI cho thể dục
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-white" />
                  </div>

                  <h3 className="text-2xl mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <img src={ctaImage} className="w-full h-[400px] object-cover" alt="CTA fitness" />

            <div className="absolute inset-0 bg-black/60" />

            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div>
                <h2 className="text-4xl md:text-6xl mb-6 font-bold">SẴN SÀNG BẮT ĐẦU?</h2>

                <p className="mb-8 text-gray-300 text-lg">
                  Tham gia cùng hàng nghìn người dùng ngay hôm nay
                </p>

                <Link
                  to="/register"
                  className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/30 transition"
                >
                  Bắt đầu miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 FitAI. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
