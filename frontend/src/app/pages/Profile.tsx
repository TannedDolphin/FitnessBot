import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
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
      toast.error(err instanceof Error ? err.message : "Đổi mật khẩu thất bại.");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information</p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Chi tiết tài khoản của bạn</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Tên</span>
              <span className="font-medium">{userData?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{userData?.email}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Tuổi</span>
              <span className="font-medium">{fitnessProfile?.age} tuổi</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Chiều cao</span>
              <span className="font-medium">{fitnessProfile?.height} cm</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Cân nặng</span>
              <span className="font-medium">{fitnessProfile?.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mức độ thể dục</span>
              <Badge variant="secondary" className="capitalize">
                {fitnessProfile?.fitnessLevel === "beginner" ? "Mới bắt đầu" :
                 fitnessProfile?.fitnessLevel === "intermediate" ? "Trung cấp" : "Nâng cao"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Lock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>Cập nhật mật khẩu của bạn</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isChangingPassword}>
                {isChangingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
