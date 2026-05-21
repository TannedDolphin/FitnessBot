import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useUser } from "../context/UserContext";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
    if (timeStr.includes('SA') || timeStr.includes('CH')) {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);

      if (period === 'CH' && hour !== 12) {
        hour += 12;
      } else if (period === 'SA' && hour === 12) {
        hour = 0;
      }

      return `${hour.toString().padStart(2, '0')}:${minutes}`;
    }
    return timeStr;
  };

  const handleOpenMealDialog = (mealId?: string) => {
    if (mealId) {
      const meal = nutritionPlan?.meals.find(m => m.id === mealId);
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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kế hoạch Dinh dưỡng</h1>
          <p className="text-gray-600 mt-1">Chiến lược bữa ăn cá nhân hóa của bạn</p>
        </div>
        <Dialog open={mealDialogOpen} onOpenChange={setMealDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenMealDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm bữa ăn
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMealId ? "Chỉnh sửa bữa ăn" : "Thêm bữa ăn mới"}</DialogTitle>
              <DialogDescription>
                {editingMealId ? "Cập nhật thông tin bữa ăn" : "Tạo bữa ăn mới trong kế hoạch"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tên bữa ăn</Label>
                <Input
                  placeholder="Ví dụ: Bữa sáng - Yến mạch"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Calories</Label>
                  <Input
                    type="number"
                    placeholder="450"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thời gian</Label>
                  <Input
                    type="time"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    className="[&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMealDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleSaveMeal}>
                  {editingMealId ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Kế hoạch hàng ngày</TabsTrigger>
          <TabsTrigger value="tips">Mẹo dinh dưỡng</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Bữa ăn hôm nay</CardTitle>
              <CardDescription>Làm theo lịch trình này để đạt kết quả tốt nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nutritionPlan?.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{meal.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{meal.time}h</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-base">
                        {meal.calories} cal
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenMealDialog(meal.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMeal(meal.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!nutritionPlan?.meals || nutritionPlan.meals.length === 0) && (
                  <p className="text-center text-gray-500 py-8">
                    Chưa có bữa ăn nào. Nhấn "Thêm bữa ăn" để bắt đầu.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Uống đủ nước</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Nhắm mục tiêu ít nhất 2-3 lít nước mỗi ngày. Tăng lượng này vào ngày tập hoặc thời tiết nóng.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thời gian bữa ăn</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Cố gắng ăn trong vòng 2 giờ sau khi tập luyện để tối đa hóa phục hồi và tăng trưởng cơ bắp.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Phân bổ Protein</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Phân bổ lượng protein trong tất cả các bữa ăn để hấp thụ tốt hơn và tổng hợp cơ bắp hiệu quả.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Linh hoạt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Kế hoạch này là hướng dẫn. Bạn có thể thay đổi thực phẩm tương tự trong khi duy trì cùng macros.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
