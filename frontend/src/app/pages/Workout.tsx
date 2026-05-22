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
import { Checkbox } from "../components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useUser } from "../context/UserContext";
import { Flame, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function WorkoutNew() {
  const {
    workoutPlan,
    addExercise,
    updateExercise,
    deleteExercise,
    addWorkoutDay,
    deleteWorkoutDay,
  } = useUser();
  const [completedExercises, setCompletedExercises] = useState<
    Set<string>
  >(new Set());

  // Exercise dialog state
  const [exerciseDialogOpen, setExerciseDialogOpen] =
    useState(false);
  const [selectedDayId, setSelectedDayId] =
    useState<string>("");
  const [editingExercise, setEditingExercise] = useState<{
    dayId: string;
    exerciseId: string;
  } | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseSets, setExerciseSets] = useState("3");
  const [exerciseReps, setExerciseReps] = useState("12");
  const [exerciseRest, setExerciseRest] = useState("60s");

  // Workout day dialog state
  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  const [newDayName, setNewDayName] = useState("");

  const toggleExercise = (
    dayIndex: number,
    exerciseIndex: number,
  ) => {
    const key = `${dayIndex}-${exerciseIndex}`;
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const isExerciseCompleted = (
    dayIndex: number,
    exerciseIndex: number,
  ) => {
    return completedExercises.has(
      `${dayIndex}-${exerciseIndex}`,
    );
  };

  const handleOpenExerciseDialog = (
    dayId: string,
    exerciseId?: string,
  ) => {
    setSelectedDayId(dayId);

    if (exerciseId) {
      const day = workoutPlan?.days.find((d) => d.id === dayId);
      const exercise = day?.exercises.find(
        (e) => e.id === exerciseId,
      );
      if (exercise) {
        setEditingExercise({ dayId, exerciseId });
        setExerciseName(exercise.name);
        setExerciseSets(exercise.sets.toString());
        setExerciseReps(exercise.reps);
        setExerciseRest(exercise.rest);
      }
    } else {
      setEditingExercise(null);
      setExerciseName("");
      setExerciseSets("3");
      setExerciseReps("12");
      setExerciseRest("60s");
    }

    setExerciseDialogOpen(true);
  };

  const handleSaveExercise = () => {
    if (!exerciseName.trim()) {
      toast.error("Vui lòng nhập tên bài tập");
      return;
    }

    const exercise = {
      name: exerciseName,
      sets: parseInt(exerciseSets),
      reps: exerciseReps,
      rest: exerciseRest,
    };

    if (editingExercise) {
      updateExercise(
        editingExercise.dayId,
        editingExercise.exerciseId,
        exercise,
      );
      toast.success("Đã cập nhật bài tập");
    } else {
      addExercise(selectedDayId, exercise);
      toast.success("Đã thêm bài tập mới");
    }

    setExerciseDialogOpen(false);
  };

  const handleDeleteExercise = (
    dayId: string,
    exerciseId: string,
  ) => {
    if (confirm("Bạn có chắc muốn xóa bài tập này?")) {
      deleteExercise(dayId, exerciseId);
      toast.success("Đã xóa bài tập");
    }
  };

  const handleAddWorkoutDay = () => {
    if (!newDayName.trim()) {
      toast.error("Vui lòng nhập tên ngày tập");
      return;
    }

    addWorkoutDay({
      day: newDayName,
      exercises: [],
    });

    setNewDayName("");
    setDayDialogOpen(false);
    toast.success("Đã thêm ngày tập mới");
  };

  const handleDeleteWorkoutDay = (dayId: string) => {
    if (confirm("Bạn có chắc muốn xóa ngày tập này?")) {
      deleteWorkoutDay(dayId);
      toast.success("Đã xóa ngày tập");
    }
  };

  return (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
          Kế hoạch Tập luyện
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Lịch tập do AI tạo của bạn
        </p>
      </div>

      <Dialog
        open={dayDialogOpen}
        onOpenChange={setDayDialogOpen}
      >
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-md shadow-green-500/20 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Thêm ngày tập
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-[#0B1120] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              Thêm ngày tập mới
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Tạo một ngày tập luyện mới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">
                Tên ngày
              </Label>

              <Input
                placeholder="Ví dụ: Thứ Hai"
                value={newDayName}
                onChange={(e) =>
                  setNewDayName(e.target.value)
                }
                className="bg-[#111827] border-white/8 text-slate-100 focus:border-green-500/50"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDayDialogOpen(false)}
                className="border-white/10 text-slate-300"
              >
                Hủy
              </Button>

              <Button
                onClick={handleAddWorkoutDay}
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white"
              >
                Thêm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <Tabs defaultValue="schedule" className="w-full">
      <TabsList className="bg-[#111827] border border-white/5 p-1 rounded-xl">
        <TabsTrigger
          value="schedule"
          className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-green-500/20 text-slate-400 transition-all"
        >
          Lịch hàng tuần
        </TabsTrigger>

        <TabsTrigger
          value="exercises"
          className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-green-500/20 text-slate-400 transition-all"
        >
          Tất cả bài tập
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="schedule"
        className="space-y-4 mt-4"
      >
        {workoutPlan?.days.map((day, dayIndex) => (
          <Card
            key={day.id}
            className="bg-[#111827] border-white/5 shadow-xl shadow-black/20"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">
                    {day.day}
                  </CardTitle>

                  <CardDescription className="text-slate-500">
                    {day.exercises.length} bài tập
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                    {
                      day.exercises.filter((_, idx) =>
                        isExerciseCompleted(dayIndex, idx),
                      ).length
                    }
                    /{day.exercises.length} hoàn thành
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleOpenExerciseDialog(day.id)
                    }
                    className="border-white/10 text-slate-400 hover:text-slate-100 hover:bg-white/5 h-8"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDeleteWorkoutDay(day.id)
                    }
                    className="h-8 w-8 p-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {day.exercises.map(
                  (exercise, exerciseIndex) => (
                    <div
                      key={exercise.id}
                      className={`flex items-start gap-4 p-4 border rounded-xl transition-all duration-200 ${
                        isExerciseCompleted(
                          dayIndex,
                          exerciseIndex,
                        )
                          ? "bg-green-500/5 border-green-500/20 opacity-70"
                          : "bg-[#0B1120] border-white/5 hover:border-white/10"
                      }`}
                    >
                      <Checkbox
                        checked={isExerciseCompleted(
                          dayIndex,
                          exerciseIndex,
                        )}
                        onCheckedChange={() =>
                          toggleExercise(
                            dayIndex,
                            exerciseIndex,
                          )
                        }
                        className="mt-1 border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />

                      <div className="flex-1">
                        <h4
                          className={`font-semibold text-sm ${
                            isExerciseCompleted(
                              dayIndex,
                              exerciseIndex,
                            )
                              ? "line-through text-slate-500"
                              : "text-slate-200"
                          }`}
                        >
                          {exercise.name}
                        </h4>

                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-md">
                            {exercise.sets} hiệp
                          </span>

                          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md">
                            {exercise.reps} lần
                          </span>

                          <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded-md">
                            Nghỉ {exercise.rest}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleOpenExerciseDialog(
                              day.id,
                              exercise.id,
                            )
                          }
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-200 hover:bg-white/5"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteExercise(
                              day.id,
                              exercise.id,
                            )
                          }
                          className="h-8 w-8 p-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ),
                )}

                {day.exercises.length === 0 && (
                  <p className="text-center text-slate-600 py-6 text-sm">
                    Chưa có bài tập nào. Nhấn + để thêm bài
                    tập.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent
        value="exercises"
        className="mt-4"
      >
        <Card className="bg-[#111827] border-white/5 shadow-xl shadow-black/20">
          <CardHeader>
            <CardTitle className="text-slate-100">
              Thư viện bài tập
            </CardTitle>

            <CardDescription className="text-slate-500">
              Tất cả bài tập trong kế hoạch hiện tại
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {workoutPlan?.days
                .flatMap((day) => day.exercises)
                .map((exercise, idx) => (
                  <div
                    key={idx}
                    className="border border-white/5 rounded-xl p-4 bg-[#0B1120] hover:border-green-500/15 transition-colors"
                  >
                    <h4 className="font-semibold mb-2 text-slate-200 text-sm">
                      {exercise.name}
                    </h4>

                    <div className="flex gap-2 text-xs">
                      <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-md">
                        Hiệp: {exercise.sets}
                      </span>

                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md">
                        Lần: {exercise.reps}
                      </span>

                      <span className="bg-slate-700/50 text-slate-400 px-2 py-1 rounded-md">
                        Nghỉ: {exercise.rest}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {/* AI Tip Card */}
    <div className="flex items-start gap-4 p-5 bg-[#111827] border border-green-500/15 rounded-xl shadow-lg shadow-green-500/5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-green-500/20">
        <Flame className="h-5 w-5 text-white" />
      </div>

      <div>
        <h3 className="font-semibold text-green-400 text-sm mb-1">
          Mẹo từ AI
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed">
          Dựa trên tiến độ của bạn, hãy cân nhắc tăng
          trọng lượng 5% trong buổi tập tiếp theo. Kỹ
          thuật của bạn rất tốt!
        </p>
      </div>
    </div>

    {/* Exercise Dialog */}
    <Dialog
      open={exerciseDialogOpen}
      onOpenChange={setExerciseDialogOpen}
    >
      <DialogContent className="bg-[#0B1120] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-slate-100">
            {editingExercise
              ? "Chỉnh sửa bài tập"
              : "Thêm bài tập mới"}
          </DialogTitle>

          <DialogDescription className="text-slate-500">
            {editingExercise
              ? "Cập nhật thông tin bài tập"
              : "Tạo bài tập mới cho ngày tập"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">
              Tên bài tập
            </Label>

            <Input
              placeholder="Ví dụ: Squats"
              value={exerciseName}
              onChange={(e) =>
                setExerciseName(e.target.value)
              }
              className="bg-[#111827] border-white/8 text-slate-100 focus:border-green-500/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">
                Số hiệp
              </Label>

              <Input
                type="number"
                value={exerciseSets}
                onChange={(e) =>
                  setExerciseSets(e.target.value)
                }
                className="bg-[#111827] border-white/8 text-slate-100 focus:border-green-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">
                Số lần
              </Label>

              <Input
                placeholder="12-15"
                value={exerciseReps}
                onChange={(e) =>
                  setExerciseReps(e.target.value)
                }
                className="bg-[#111827] border-white/8 text-slate-100 focus:border-green-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">
                Nghỉ
              </Label>

              <Input
                placeholder="60s"
                value={exerciseRest}
                onChange={(e) =>
                  setExerciseRest(e.target.value)
                }
                className="bg-[#111827] border-white/8 text-slate-100 focus:border-green-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setExerciseDialogOpen(false)}
              className="border-white/10 text-slate-300"
            >
              Hủy
            </Button>

            <Button
              onClick={handleSaveExercise}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white"
            >
              {editingExercise ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
);
}