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
import { User, LogOut, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { postJson } from "../lib/api";

export default function Profile() {
  const { userData, fitnessProfile } = useUser();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
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

    setIsChangingPassword(true);

    try {
      await postJson("/api/users/change-password", {
        email: userData.email,
        currentPassword,
        newPassword,
      });

      toast.success("Mật khẩu đã được thay đổi thành công!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Đổi mật khẩu thất bại."
      );
    } finally {
      setIsChangingPassword(false);
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
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Hồ sơ cá nhân
          </h1>

          <p className="text-slate-500 mt-1 text-sm">
            Quản lý thông tin tài khoản của bạn
          </p>
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
                <CardTitle className="text-slate-100">
                  Thông tin cá nhân
                </CardTitle>

                <CardDescription className="text-slate-500">
                  Chi tiết tài khoản của bạn
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-slate-500 text-sm">Tên</span>

              <span className="font-medium text-slate-100 text-sm">
                {userData?.name}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-slate-500 text-sm">Email</span>

              <span className="font-medium text-slate-100 text-sm">
                {userData?.email}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-slate-500 text-sm">Tuổi</span>

              <span className="font-medium text-slate-100 text-sm">
                {fitnessProfile?.age} tuổi
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-slate-500 text-sm">Chiều cao</span>

              <span className="font-medium text-slate-100 text-sm">
                {fitnessProfile?.height} cm
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-slate-500 text-sm">Cân nặng</span>

              <span className="font-medium text-slate-100 text-sm">
                {fitnessProfile?.weight} kg
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">
                Mức độ thể dục
              </span>

              <Badge className="capitalize bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/15">
                {fitnessProfile?.fitnessLevel === "beginner"
                  ? "Mới bắt đầu"
                  : fitnessProfile?.fitnessLevel === "intermediate"
                  ? "Trung cấp"
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
                <CardTitle className="text-slate-100">
                  Đổi mật khẩu
                </CardTitle>

                <CardDescription className="text-slate-500">
                  Cập nhật mật khẩu của bạn
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleChangePassword}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="current-password"
                  className="text-slate-300 text-sm"
                >
                  Mật khẩu hiện tại
                </Label>

                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  required
                  className="bg-[#0B1120] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="new-password"
                  className="text-slate-300 text-sm"
                >
                  Mật khẩu mới
                </Label>

                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  required
                  className="bg-[#0B1120] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-slate-300 text-sm"
                >
                  Xác nhận mật khẩu mới
                </Label>

                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  className="bg-[#0B1120] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all h-11"
                disabled={isChangingPassword}
              >
                {isChangingPassword
                  ? "Đang cập nhật..."
                  : "Cập nhật mật khẩu"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}