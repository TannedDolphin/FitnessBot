import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import WebsiteNav from "../components/WebsiteNav";
import { postJson } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await postJson<{ message: string }>(
        "/api/users/forgot-password",
        {
          email,
        },
      );

      setMessage(
        response.message ||
          "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể gửi yêu cầu quên mật khẩu.",
      );
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

      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#0B1120]/80 backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-2xl shadow-black/60">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Quên mật khẩu
              </h1>

              <p className="text-slate-500 text-sm leading-relaxed">
                Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-300 text-sm"
                >
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11"
                />
              </div>

              {message ? (
                <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/10">
                  <p className="text-sm text-green-400">{message}</p>
                </div>
              ) : null}

              {error ? (
                <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all h-11"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Đã nhớ mật khẩu?{" "}
              <Link
                to="/login"
                className="text-green-400 hover:text-green-300 font-semibold transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </div>
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