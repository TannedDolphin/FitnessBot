import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { useUser } from "../context/UserContext";
import { Plus, TrendingUp, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData, workoutPlan, nutritionPlan, progressHistory } = useUser();

  const hasPlan = Boolean(workoutPlan?.days.length && nutritionPlan?.meals.length);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Chào mừng trở lại, <span className="text-green-400">{userData?.name}</span>!
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Đây là kế hoạch thể dục cá nhân của bạn
          </p>
        </div>

        <Link to="/progress">
          <Button className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-md shadow-green-500/20 hover:shadow-green-500/30 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Ghi tiến độ
          </Button>
        </Link>
      </div>

      {!hasPlan ? (
        <Card className="bg-[#111827] border-yellow-500/20 shadow-xl shadow-black/20">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              Chưa có kế hoạch AI
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-slate-400 text-sm leading-relaxed">
              Hãy hoàn thành hồ sơ thể dục để AI tạo kế hoạch phù hợp với thông số của bạn.
            </p>

            <Button
              onClick={() => navigate("/fitness-profile")}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-medium shadow-md shadow-yellow-500/20"
            >
              Tạo hồ sơ và bắt đầu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#111827] border border-white/5 p-1 rounded-xl">
              <TabsTrigger
                value="workout"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-green-500/20 text-slate-400 transition-all"
              >
                Kế hoạch Tập luyện
              </TabsTrigger>

              <TabsTrigger
                value="nutrition"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-green-500/20 text-slate-400 transition-all"
              >
                Kế hoạch Dinh dưỡng
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workout" className="space-y-4 mt-4">
              <Card className="bg-[#111827] border-white/5 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-slate-100">
                    Kế hoạch tập luyện hàng tuần
                  </CardTitle>

                  <CardDescription className="text-slate-500">
                    Do AI tạo dựa trên hồ sơ thể dục của bạn
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {workoutPlan?.days.map((day) => (
                    <div
                      key={day.id}
                      className="border border-white/5 rounded-xl p-4 bg-[#0B1120]"
                    >
                      <h3 className="font-semibold text-base mb-3 text-slate-200">
                        {day.day}
                      </h3>

                      <div className="space-y-2">
                        {day.exercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className="flex items-center justify-between bg-[#1A2333] hover:bg-[#1E293B] p-3 rounded-lg transition-colors"
                          >
                            <span className="font-medium text-sm text-slate-200">
                              {exercise.name}
                            </span>

                            <div className="flex gap-3 text-xs text-slate-400">
                              <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-md">
                                {exercise.sets} hiệp
                              </span>

                              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md">
                                {exercise.reps} lần
                              </span>

                              <span className="bg-slate-700/50 text-slate-400 px-2 py-1 rounded-md">
                                Nghỉ {exercise.rest}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4 mt-4">
              <Card className="bg-[#111827] border-white/5 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-slate-100">
                    Mục tiêu dinh dưỡng hàng ngày
                  </CardTitle>

                  <CardDescription className="text-slate-500">
                    Phân bổ macro để đạt kết quả tối ưu
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Macro Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-[#0B1120] border border-red-500/15 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">
                        Calories
                      </p>

                      <p className="text-2xl font-bold text-red-400">
                        {nutritionPlan?.dailyCalories} cal
                      </p>
                    </div>

                    <div className="text-center p-4 bg-[#0B1120] border border-green-500/15 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">
                        Protein
                      </p>

                      <p className="text-2xl font-bold text-green-400">
                        {nutritionPlan?.macros.protein}g
                      </p>
                    </div>

                    <div className="text-center p-4 bg-[#0B1120] border border-emerald-500/15 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">
                        Carbs
                      </p>

                      <p className="text-2xl font-bold text-emerald-400">
                        {nutritionPlan?.macros.carbs}g
                      </p>
                    </div>

                    <div className="text-center p-4 bg-[#0B1120] border border-amber-500/15 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">
                        Chất béo
                      </p>

                      <p className="text-2xl font-bold text-amber-400">
                        {nutritionPlan?.macros.fats}g
                      </p>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-3 text-slate-200 text-sm">
                    Kế hoạch bữa ăn
                  </h3>

                  <div className="space-y-2">
                    {nutritionPlan?.meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between bg-[#1A2333] hover:bg-[#1E293B] p-3 rounded-lg transition-colors"
                      >
                        <div>
                          <p className="font-medium text-sm text-slate-200">
                            {meal.name}
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            {meal.time}h
                          </p>
                        </div>

                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/15">
                          {meal.calories} cal
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {progressHistory.length > 0 && (
            <Card className="bg-[#111827] border-white/5 shadow-xl shadow-black/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />

                  <CardTitle className="text-slate-100">
                    Tiến độ gần đây
                  </CardTitle>
                </div>

                <CardDescription className="text-slate-500">
                  Các cập nhật mới nhất của bạn
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {progressHistory
                    .slice(-5)
                    .reverse()
                    .map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm text-slate-200">
                            {entry.date}
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            {entry.notes || "Không có ghi chú"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-slate-200">
                            {entry.weight} kg
                          </p>

                          {entry.workoutCompleted && (
                            <div className="flex items-center gap-1 mt-1 justify-end">
                              <CheckCircle2 className="h-3 w-3 text-green-400" />

                              <span className="text-xs text-green-400">
                                Hoàn thành
                              </span>
                            </div>
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