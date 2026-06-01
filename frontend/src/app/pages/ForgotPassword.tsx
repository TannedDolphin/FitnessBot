import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import WebsiteNav from "../components/WebsiteNav";
import { postJson } from "../lib/api";
import { Mail, ShieldCheck, Lock, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";

type Step = "email" | "otp" | "new-password" | "done";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Bước 1: Gửi OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setInfo(""); setIsSendingOtp(true);
    try {
      await postJson("/api/users/send-otp", { email, purpose: "forgot-password" });
      setInfo("Mã OTP đã được gửi. Kiểm tra hộp thư (và thư mục spam).");
      setStep("otp");
      startResendCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi mã OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Bước 2: Xác minh OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsSubmitting(true);
    try {
      await postJson("/api/users/verify-otp", {
        email,
        code: otpCode,
        purpose: "forgot-password",
      });
      setStep("new-password");
      setInfo("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mã OTP không đúng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bước 3: Đặt mật khẩu mới
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setIsSubmitting(true);
    try {
      await postJson("/api/users/forgot-password", { email, newPassword });
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đặt lại mật khẩu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(""); setInfo(""); setIsSendingOtp(true);
    try {
      await postJson("/api/users/send-otp", { email, purpose: "forgot-password" });
      setInfo("Mã OTP mới đã được gửi!");
      setOtpCode("");
      startResendCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi lại mã.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const stepIndex = { email: 0, otp: 1, "new-password": 2, done: 2 };
  const steps = [
    { icon: Mail, label: "Email" },
    { icon: ShieldCheck, label: "Xác minh" },
    { icon: Lock, label: "Mật khẩu mới" },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <WebsiteNav />

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

          {/* Progress */}
          {step !== "done" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const active = i === stepIndex[step];
                const done = i < stepIndex[step];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${active ? "text-green-400" : done ? "text-green-600" : "text-slate-600"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${active ? "border-green-400 bg-green-400/10" : done ? "border-green-600 bg-green-600/20" : "border-white/10"}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`h-px w-6 transition-colors ${i < stepIndex[step] ? "bg-green-500" : "bg-white/10"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-[#0B1120]/80 backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-2xl shadow-black/60">
            <AnimatePresence mode="wait">

              {/* Step 1: Email */}
              {step === "email" && (
                <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">Quên mật khẩu</h1>
                    <p className="text-slate-500 text-sm leading-relaxed">Nhập email để nhận mã xác minh.</p>
                  </div>
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300 text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          id="email" type="email" placeholder="you@example.com"
                          value={email} onChange={(e) => setEmail(e.target.value)} required
                          className="pl-10 bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11"
                        />
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                    <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white h-11" size="lg" disabled={isSendingOtp}>
                      {isSendingOtp ? "Đang gửi..." : "Gửi mã OTP →"}
                    </Button>
                  </form>
                  <div className="mt-6 text-center text-sm text-slate-500">
                    Đã nhớ mật khẩu?{" "}
                    <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">Đăng nhập</Link>
                  </div>
                </motion.div>
              )}

              {/* Step 2: OTP */}
              {step === "otp" && (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                  <button onClick={() => { setStep("email"); setError(""); setOtpCode(""); }} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                  </button>
                  <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">Xác minh email</h1>
                    <p className="text-slate-500 text-sm">Nhập mã OTP đã gửi đến<br /><span className="text-green-400 font-medium">{email}</span></p>
                  </div>
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-slate-300 text-sm">Mã OTP (6 chữ số)</Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          id="otp" type="text" inputMode="numeric" maxLength={6} placeholder="123456"
                          value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} required
                          className="pl-10 bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11 text-center tracking-[0.35em] text-lg font-mono"
                          autoFocus
                        />
                      </div>
                    </div>
                    {info && <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/10"><p className="text-sm text-green-400">{info}</p></div>}
                    {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                    <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white h-11" size="lg" disabled={isSubmitting || otpCode.length !== 6}>
                      {isSubmitting ? "Đang xác minh..." : "Xác minh →"}
                    </Button>
                  </form>
                  <div className="mt-5 text-center">
                    <button onClick={handleResendOtp} disabled={resendCooldown > 0 || isSendingOtp} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? "animate-spin" : ""}`} />
                      {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : "Gửi lại mã"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: New Password */}
              {step === "new-password" && (
                <motion.div key="new-password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                  <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">Mật khẩu mới</h1>
                    <p className="text-slate-500 text-sm">Đặt mật khẩu mới cho tài khoản của bạn.</p>
                  </div>
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="new-pass" className="text-slate-300 text-sm">Mật khẩu mới</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          id="new-pass" type="password" minLength={6} placeholder="Tối thiểu 6 ký tự"
                          value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                          className="pl-10 bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-pass" className="text-slate-300 text-sm">Xác nhận mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          id="confirm-pass" type="password" minLength={6} placeholder="Nhập lại mật khẩu"
                          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                          className="pl-10 bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11"
                        />
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                    <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white h-11" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Done */}
              {step === "done" && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center py-4">
                  <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-100 mb-2">Đặt lại thành công!</h1>
                  <p className="text-slate-500 text-sm mb-8">Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ.</p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white h-11"
                    size="lg"
                  >
                    Đăng nhập
                  </Button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
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
