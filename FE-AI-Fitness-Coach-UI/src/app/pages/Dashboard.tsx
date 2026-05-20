import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { useUser } from "../context/UserContext";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData, workoutPlan, nutritionPlan, progressHistory } = useUser();

  const hasPlan = Boolean(workoutPlan?.days.length && nutritionPlan?.meals.length);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Chào mừng trở lại, {userData?.name}!</h1>
            <p className="text-gray-600 mt-1">Đây là kế hoạch thể dục cá nhân của bạn</p>
          </div>
          <Link to="/progress">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ghi tiến độ
            </Button>
          </Link>
        </div>

        {!hasPlan ? (
          <Card className="bg-yellow-50 border-yellow-300 text-yellow-900">
            <CardHeader>
              <CardTitle>Chưa có kế hoạch AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Hãy hoàn thành hồ sơ thể dục để AI tạo kế hoạch phù hợp với thông số của bạn.
              </p>
              <Button onClick={() => navigate('/fitness-profile')} className="bg-yellow-500 text-white">
                Tạo hồ sơ và bắt đầu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="workout" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="workout">Kế hoạch Tập luyện</TabsTrigger>
                <TabsTrigger value="nutrition">Kế hoạch Dinh dưỡng</TabsTrigger>
              </TabsList>

              <TabsContent value="workout" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Kế hoạch tập luyện hàng tuần</CardTitle>
                    <CardDescription>Do AI tạo dựa trên hồ sơ thể dục của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {workoutPlan?.days.map((day) => (
                      <div key={day.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">{day.day}</h3>
                        <div className="space-y-2">
                          {day.exercises.map((exercise) => (
                            <div key={exercise.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                              <span className="font-medium">{exercise.name}</span>
                              <div className="flex gap-4 text-sm text-gray-600">
                                <span>{exercise.sets} hiệp</span>
                                <span>{exercise.reps} lần</span>
                                <span>Nghỉ {exercise.rest}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mục tiêu dinh dưỡng hàng ngày</CardTitle>
                    <CardDescription>Phân bổ macro để đạt kết quả tối ưu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Protein</p>
                        <p className="text-2xl font-bold text-blue-600">{nutritionPlan?.macros.protein}g</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Carbs</p>
                        <p className="text-2xl font-bold text-green-600">{nutritionPlan?.macros.carbs}g</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-600">Chất béo</p>
                        <p className="text-2xl font-bold text-orange-600">{nutritionPlan?.macros.fats}g</p>
                      </div>
                    </div>

                    <h3 className="font-semibold mb-3">Kế hoạch bữa ăn</h3>
                    <div className="space-y-2">
                      {nutritionPlan?.meals.map((meal) => (
                        <div key={meal.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div>
                            <p className="font-medium">{meal.name}</p>
                            <p className="text-sm text-gray-600">{meal.time}h</p>
                          </div>
                          <Badge variant="secondary">{meal.calories} cal</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {progressHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ gần đây</CardTitle>
                  <CardDescription>Các cập nhật mới nhất của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {progressHistory.slice(-5).reverse().map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">{entry.date}</p>
                          <p className="text-sm text-gray-600">{entry.notes || "Không có ghi chú"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{entry.weight} kg</p>
                          {entry.workoutCompleted && (
                            <Badge variant="default" className="mt-1">Hoàn thành</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
  );
}
