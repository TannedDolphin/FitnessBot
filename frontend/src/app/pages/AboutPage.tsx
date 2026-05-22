import { motion } from "motion/react";
import { Target, Users, Lightbulb, Heart } from "lucide-react";
import WebsiteNav from "../components/WebsiteNav";

const values = [
  {
    icon: Target,
    title: "Định hướng sứ mệnh",
    description: "Chúng tôi có sứ mệnh làm cho thể dục trở nên dễ tiếp cận và khả thi cho tất cả mọi người, mọi nơi.",
  },
  {
    icon: Users,
    title: "Cộng đồng là trên hết",
    description: "Xây dựng một cộng đồng hỗ trợ nơi mọi người có thể phát triển và đạt được tiềm năng của họ.",
  },
  {
    icon: Lightbulb,
    title: "Đổi mới",
    description: "Tận dụng công nghệ AI tiên tiến để cung cấp trải nghiệm thể dục được cá nhân hóa.",
  },
  {
    icon: Heart,
    title: "Sức khỏe toàn diện",
    description: "Cách tiếp cận toàn diện đối với thể dục bao gồm cơ thể, tâm trí và lối sống.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#050816] text-white min-h-screen">
      <WebsiteNav />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                CÂU CHUYỆN CỦA CHÚNG TÔI
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              FitAI ra đời từ một niềm tin đơn giản: thể dục nên mang tính cá nhân, thông minh
              và trao quyền. Chúng tôi kết hợp công nghệ AI mới nhất với khoa học thể dục đã được chứng minh
              để giúp bạn đạt được kết quả mà bạn chưa bao giờ nghĩ là có thể.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-32"
          >
            <div className="relative p-12 bg-green-500/5 backdrop-blur-sm border border-green-500/15 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5" />
              <div className="relative z-10 text-center">
                <h2 className="text-5xl font-bold mb-6 tracking-tight">SỨ MỆNH CỦA CHÚNG TÔI</h2>
                <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                  Trao quyền cho các cá nhân trên toàn thế giới kiểm soát hành trình thể dục của họ
                  thông qua công nghệ thông minh, huấn luyện cá nhân hóa và một cộng đồng hỗ trợ.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-32"
          >
            <h2 className="text-6xl font-bold text-center mb-16 tracking-tight">GIÁ TRỊ CỦA CHÚNG TÔI</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="relative p-8 bg-[#111827] border border-white/5 rounded-2xl hover:border-green-500/20 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-slate-100">{value.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-6xl font-bold mb-6 tracking-tight">XÂY DỰNG BỞI VẬN ĐỘNG VIÊN</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
              Đội ngũ của chúng tôi kết hợp các vận động viên đẳng cấp thế giới, huấn luyện viên được chứng nhận, chuyên gia dinh dưỡng,
              và kỹ sư AI đam mê giúp bạn thành công. Chúng tôi không chỉ
              xây dựng ứng dụng thể dục—chúng tôi sống và thở lối sống này mỗi ngày.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
              {[
                { value: "15+", label: "Thành viên đội ngũ" },
                { value: "50+", label: "Năm kinh nghiệm kết hợp" },
                { value: "20+", label: "Quốc gia" },
                { value: "100%", label: "Cam kết" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-[#111827] border border-white/5 rounded-xl hover:border-green-500/20 transition-colors"
                >
                  <div className="text-4xl font-bold text-green-400 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#050816] border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-slate-600 text-sm">
          <p>&copy; 2026 FitAI. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
