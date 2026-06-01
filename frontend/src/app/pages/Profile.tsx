import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useUser } from "../context/UserContext";
import { User, LogOut, Lock, ShieldCheck, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { postJson } from "../lib/api";
import { AnimatePresence, motion } from "motion/react";

type PasswordStep = "form" | "otp";

export default function Profile() {
  const { userData, fitnessProfile } = useUser();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // OTP state
  const [passwordStep, setPasswordStep] = useState<PasswordStep>("form");
  const [otpCode, setOtpCode] = useState("");
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

  // Bước 1: Validate form và gửi OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?.email) {
      toast.error("Vui lòng đăng nhập trước khi đổi mật khẩu.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      return;
    }

    setIsSendingOtp(true);
    try {
      await postJson("/api/users/send-otp", {
        email: userData.email,
        purpose: "change-password",
      });
      toast.success("Mã OTP đã được gửi đến email của bạn.");
      setPasswordStep("otp");
      startResendCooldown();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể gửi mã OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Bước 2: Xác minh OTP rồi đổi mật khẩu
  const handleVerifyAndChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?.email) return;
    setIsChangingPassword(true);

    try {
      // Verify OTP trước
      await postJson("/api/users/verify-otp", {
        email: userData.email,
        code: otpCode,
        purpose: "change-password",
      });

      // Đổi mật khẩu
      await postJson("/api/users/change-password", {
        email: userData.email,
        currentPassword,
        newPassword,
      });

      toast.success("Mật khẩu đã được thay đổi thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtpCode("");
      setPasswordStep("form");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đổi mật khẩu thất bại.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !userData?.email) return;
    setIsSendingOtp(true);
    try {
      await postJson("/api/users/send-otp", {
        email: userData.email,
        purpose: "change-password",
      });
      toast.success("Mã OTP mới đã được gửi!");
      setOtpCode("");
      startResendCooldown();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể gửi lại mã.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleLogout = () => {
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-slate-500 mt-1 text-sm">Quản lý thông tin tài khoản của bạn</p>
        </div>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="bg-red-500/90 hover:bg-red-500 text-white border-0 shadow-lg shadow-red-500/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="bg-[#111827] border-white/5 shadow-xl shadow-black/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/10">
                <User className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-slate-100">Thông tin cá nhân</CardTitle>
                <CardDescription className="text-slate-500">Chi tiết tài khoản của bạn</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Tên", value: userData?.name },
              { label: "Giới tính", value: fitnessProfile?.gender === "male" ? "Nam" : "Nữ" },
              { label: "Email", value: userData?.email },
              { label: "Tuổi", value: fitnessProfile?.age ? `${fitnessProfile.age} tuổi` : undefined },
              { label: "Chiều cao", value: fitnessProfile?.height ? `${fitnessProfile.height} cm` : undefined },
              { label: "Cân nặng", value: fitnessProfile?.weight ? `${fitnessProfile.weight} kg` : undefined },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <span className="text-slate-500 text-sm">{label}</span>
                <span className="font-medium text-slate-100 text-sm">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Mức độ thể dục</span>
              <Badge className="capitalize bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/15">
                {fitnessProfile?.fitnessLevel === "beginner" ? "Mới bắt đầu"
                  : fitnessProfile?.fitnessLevel === "intermediate" ? "Trung cấp"
                  : "Nâng cao"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="bg-[#111827] border-white/5 shadow-xl shadow-black/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/10">
                <Lock className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-slate-100">Đổi mật khẩu</CardTitle>
                <CardDescription className="text-slate-500">Cập nhật mật khẩu của bạn</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">

              {/* Step 1: Password Form */}
              {passwordStep === "form" && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleRequestOtp}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-slate-300 text-sm">Mật khẩu hiện tại</Label>
                    <Input
                      id="current-password" type="password"
                      value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="bg-[#0B1120] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-slate-300 text-sm">Mật khẩu mới</Label>
                    <Input
                      id="new-password" type="password"
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="bg-[#0B1120] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-slate-300 text-sm">Xác nhận mật khẩu mới</Label>
                    <Input
                      id="confirm-password" type="password"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-[#0B1120] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 transition-all h-11"
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? "Đang gửi mã..." : "Tiếp tục →"}
                  </Button>
                </motion.form>
              )}

              {/* Step 2: OTP Verification */}
              {passwordStep === "otp" && (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleVerifyAndChange}
                  className="space-y-5"
                >
                  <button
                    type="button"
                    onClick={() => { setPasswordStep("form"); setOtpCode(""); }}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                  </button>

                  <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/5 text-center">
                    <ShieldCheck className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-sm text-slate-400">
                      Mã OTP đã gửi đến <span className="text-green-400 font-medium">{userData?.email}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp-code" className="text-slate-300 text-sm">Mã OTP (6 chữ số)</Label>
                    <Input
                      id="otp-code" type="text" inputMode="numeric" maxLength={6}
                      placeholder="123456"
                      value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      required
                      className="bg-[#0B1120] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11 text-center tracking-[0.35em] text-lg font-mono"
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 transition-all h-11"
                    disabled={isChangingPassword || otpCode.length !== 6}
                  >
                    {isChangingPassword ? "Đang cập nhật..." : "Xác minh & Đổi mật khẩu"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isSendingOtp}
                      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? "animate-spin" : ""}`} />
                      {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : "Gửi lại mã"}
                    </button>
                  </div>
                </motion.form>
              )}

            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
