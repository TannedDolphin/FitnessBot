import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useUser } from "../context/UserContext";
import { Plus, Pencil, Trash2, Droplets, Clock3, Dumbbell, Shuffle } from "lucide-react";
import { toast } from "sonner";

export default function NutritionNew() {
  const { nutritionPlan, addMeal, updateMeal, deleteMeal } = useUser();

  // Meal dialog state
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealTime, setMealTime] = useState("");

  const formatTimeToHHMM = (timeStr: string): string => {
    // Convert from display format (e.g., "7:00 SA", "14:30") to HH:mm
    if (timeStr.includes("SA") || timeStr.includes("CH")) {
      const [time, period] = timeStr.split(" ");
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours);

      if (period === "CH" && hour !== 12) {
        hour += 12;
      } else if (period === "SA" && hour === 12) {
        hour = 0;
      }

      return `${hour.toString().padStart(2, "0")}:${minutes}`;
    }
    return timeStr;
  };

  const handleOpenMealDialog = (mealId?: string) => {
    if (mealId) {
      const meal = nutritionPlan?.meals.find((m) => m.id === mealId);
      if (meal) {
        setEditingMealId(mealId);
        setMealName(meal.name);
        setMealCalories(meal.calories.toString());
        setMealTime(formatTimeToHHMM(meal.time));
      }
    } else {
      setEditingMealId(null);
      setMealName("");
      setMealCalories("");
      setMealTime("");
    }
    setMealDialogOpen(true);
  };

  const handleSaveMeal = () => {
    if (!mealName.trim() || !mealCalories || !mealTime.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const meal = {
      name: mealName,
      calories: parseInt(mealCalories),
      time: mealTime,
    };

    if (editingMealId) {
      updateMeal(editingMealId, meal);
      toast.success("Đã cập nhật bữa ăn");
    } else {
      addMeal(meal);
      toast.success("Đã thêm bữa ăn mới");
    }

    setMealDialogOpen(false);
  };

  const handleDeleteMeal = (mealId: string) => {
    if (confirm("Bạn có chắc muốn xóa bữa ăn này?")) {
      deleteMeal(mealId);
      toast.success("Đã xóa bữa ăn");
    }
  };

  const tips = [
    {
      icon: Droplets,
      title: "Uống đủ nước",
      description:
        "Nhắm mục tiêu ít nhất 2-3 lít nước mỗi ngày. Tăng lượng này vào ngày tập hoặc thời tiết nóng.",
    },
    {
      icon: Clock3,
      title: "Thời gian bữa ăn",
      description:
        "Cố gắng ăn trong vòng 2 giờ sau khi tập luyện để tối đa hóa phục hồi và tăng trưởng cơ bắp.",
    },
    {
      icon: Dumbbell,
      title: "Phân bổ Protein",
      description:
        "Phân bổ lượng protein trong tất cả các bữa ăn để hấp thụ tốt hơn và tổng hợp cơ bắp hiệu quả.",
    },
    {
      icon: Shuffle,
      title: "Linh hoạt",
      description:
        "Kế hoạch này là hướng dẫn. Bạn có thể thay đổi thực phẩm tương tự trong khi duy trì cùng macros.",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Kế hoạch Dinh dưỡng
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Chiến lược bữa ăn cá nhân hóa của bạn
          </p>
        </div>

        <Dialog open={mealDialogOpen} onOpenChange={setMealDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenMealDialog()}
              className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-md shadow-green-500/20 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm bữa ăn
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[#0B1120] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-slate-100">
                {editingMealId
                  ? "Chỉnh sửa bữa ăn"
                  : "Thêm bữa ăn mới"}
              </DialogTitle>

              <DialogDescription className="text-slate-500">
                {editingMealId
                  ? "Cập nhật thông tin bữa ăn"
                  : "Tạo bữa ăn mới trong kế hoạch"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">
                  Tên bữa ăn
                </Label>

                <Input
                  placeholder="Ví dụ: Bữa sáng - Yến mạch"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="bg-[#111827] border-white/8 text-slate-100 focus:border-green-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">
                    Calories
                  </Label>

                  <Input
                    type="number"
                    placeholder="450"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value)}
                    className="bg-[#111827] border-white/8 text-slate-100 focus:border-green-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">
                    Thời gian
                  </Label>

                  <Input
                    type="time"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    className="bg-[#111827] border-white/8 text-slate-100 focus:border-green-500/50 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setMealDialogOpen(false)}
                  className="border-white/10 text-slate-300"
                >
                  Hủy
                </Button>

                <Button
                  onClick={handleSaveMeal}
                  className="bg-gradient-to-r from-green-600 to-emerald-500 text-white"
                >
                  {editingMealId ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="bg-[#111827] border border-white/5 p-1 rounded-xl">
          <TabsTrigger
            value="daily"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-green-500/20 text-slate-400 transition-all"
          >
            Kế hoạch hàng ngày
          </TabsTrigger>

          <TabsTrigger
            value="tips"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-green-500/20 text-slate-400 transition-all"
          >
            Mẹo dinh dưỡng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <Card className="bg-[#111827] border-white/5 shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle className="text-slate-100">
                Bữa ăn hôm nay
              </CardTitle>

              <CardDescription className="text-slate-500">
                Làm theo lịch trình này để đạt kết quả tốt nhất
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {nutritionPlan?.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-[#0B1120] hover:border-green-500/15 hover:bg-[#0D1A24] transition-all duration-200"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-200">
                        {meal.name}
                      </h4>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {meal.time}h
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-sm font-medium">
                        {meal.calories} cal
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenMealDialog(meal.id)}
                        className="h-8 w-8 p-0 text-slate-500 hover:text-slate-200 hover:bg-white/5"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="h-8 w-8 p-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}

                {(!nutritionPlan?.meals ||
                  nutritionPlan.meals.length === 0) && (
                  <p className="text-center text-slate-600 py-10 text-sm">
                    Chưa có bữa ăn nào. Nhấn "Thêm bữa ăn" để bắt đầu.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {tips.map((tip, index) => {
              const Icon = tip.icon;

              return (
                <Card
                  key={index}
                  className="bg-[#111827] border-white/5 shadow-xl shadow-black/20 hover:border-green-500/15 transition-colors"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/12 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-green-400" />
                      </div>

                      <CardTitle className="text-sm text-slate-100">
                        {tip.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}