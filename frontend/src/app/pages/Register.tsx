import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
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
import { useUser } from "../context/UserContext";
import WebsiteNav from "../components/WebsiteNav";
import { postJson } from "../lib/api";
import { Mail, Lock, User, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

type Step = "form" | "otp";

export default function Register() {
  const navigate = useNavigate();
  const { setUserData } = useUser();

  // Step
  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // UI state
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // ─── Bước 1: Gửi OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsSendingOtp(true);

    try {
      await postJson("/api/users/send-otp", { email, purpose: "register" });
      setInfo("Mã OTP đã được gửi đến email của bạn. Kiểm tra hộp thư (và thư mục spam).");
      setStep("otp");
      startResendCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi mã OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ─── Bước 2: Xác minh OTP ─────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await postJson("/api/users/verify-otp", {
        email,
        code: otpCode,
        purpose: "register",
      });
      setOtpVerified(true);
      setInfo("Email đã xác minh! Đang tạo tài khoản...");

      // Ngay sau khi verify thành công, tạo tài khoản
      const response = await postJson<AuthResponse>("/api/users/register", {
        name,
        email,
        password,
      });

      setUserData(response.user);
      navigate("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xác minh OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setInfo("");
    setIsSendingOtp(true);
    try {
      await postJson("/api/users/send-otp", { email, purpose: "register" });
      setInfo("Mã OTP mới đã được gửi!");
      setOtpCode("");
      startResendCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi lại mã.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const ambientOrbs = (
    <>
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
    </>
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <WebsiteNav />
      {ambientOrbs}

      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md relative z-10">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${step === "form" ? "text-green-400" : "text-green-600"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${step === "form" ? "border-green-400 bg-green-400/10" : "border-green-600 bg-green-600/20"}`}>
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline">Thông tin</span>
            </div>
            <div className={`h-px w-8 transition-colors ${step === "otp" ? "bg-green-500" : "bg-white/10"}`} />
            <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${step === "otp" ? "text-green-400" : "text-slate-600"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${step === "otp" ? "border-green-400 bg-green-400/10" : "border-white/10"}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline">Xác minh</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="bg-[#0B1120]/80 backdrop-blur-xl border border-white/8 rounded-2xl shadow-2xl shadow-black/60">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl font-bold text-center text-slate-100">
                      Tạo tài khoản
                    </CardTitle>
                    <CardDescription className="text-center text-slate-500 text-sm">
                      Bắt đầu hành trình thể dục của bạn ngay hôm nay
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleSendOtp} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300 text-sm">Họ và tên</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="pl-10 bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300 text-sm">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300 text-sm">Mật khẩu</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            id="password"
                            type="password"
                            minLength={6}
                            placeholder="Tối thiểu 6 ký tự"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                          />
                        </div>
                      </div>

                      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all h-11 mt-2"
                        size="lg"
                        disabled={isSendingOtp}
                      >
                        {isSendingOtp ? "Đang gửi mã..." : "Tiếp tục →"}
                      </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                      Đã có tài khoản?{" "}
                      <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                        Đăng nhập
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="bg-[#0B1120]/80 backdrop-blur-xl border border-white/8 rounded-2xl shadow-2xl shadow-black/60">
                  <CardHeader className="space-y-2">
                    <button
                      onClick={() => { setStep("form"); setError(""); setInfo(""); setOtpCode(""); }}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors mb-1"
                    >
                      <ArrowLeft className="w-4 h-4" /> Quay lại
                    </button>
                    <CardTitle className="text-3xl font-bold text-center text-slate-100">
                      Xác minh email
                    </CardTitle>
                    <CardDescription className="text-center text-slate-500 text-sm">
                      Chúng tôi đã gửi mã OTP 6 chữ số đến
                      <br />
                      <span className="text-green-400 font-medium">{email}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-slate-300 text-sm">Mã OTP</Label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="123456"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                            required
                            className="pl-10 bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11 text-center tracking-[0.35em] text-lg font-mono"
                            autoFocus
                          />
                        </div>
                      </div>

                      {info && (
                        <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/10">
                          <p className="text-sm text-green-400">{info}</p>
                        </div>
                      )}
                      {error && (
                        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 transition-all h-11"
                        size="lg"
                        disabled={isSubmitting || otpCode.length !== 6 || otpVerified}
                      >
                        {isSubmitting ? "Đang xác minh..." : "Xác minh & Tạo tài khoản"}
                      </Button>
                    </form>

                    <div className="mt-5 text-center">
                      <button
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0 || isSendingOtp}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? "animate-spin" : ""}`} />
                        {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : "Gửi lại mã"}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-slate-600 text-sm">
          <p>&copy; 2026 FitAI. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
