import { useState } from "react";
import { Link } from "react-router";
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
      const response = await postJson<{ message: string }>("/api/users/forgot-password", {
        email,
      });

      setMessage(response.message || "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi yêu cầu quên mật khẩu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <WebsiteNav />

      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-white">Quên mật khẩu</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Nhập email để nhận hướng dẫn đặt lại mật khẩu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>

              {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
              {error ? <p className="text-sm text-red-300">{error}</p> : null}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Đã nhớ mật khẩu? {" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                Quay lại đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>&copy; 2026 FitAI. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
