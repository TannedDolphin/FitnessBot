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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Kế hoạch Tập luyện
          </h1>
          <p className="text-gray-600 mt-1">
            Lịch tập do AI tạo của bạn
          </p>
        </div>
        <Dialog
          open={dayDialogOpen}
          onOpenChange={setDayDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm ngày tập
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm ngày tập mới</DialogTitle>
              <DialogDescription>
                Tạo một ngày tập luyện mới
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tên ngày</Label>
                <Input
                  placeholder="Ví dụ: Thứ Hai"
                  value={newDayName}
                  onChange={(e) =>
                    setNewDayName(e.target.value)
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDayDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button onClick={handleAddWorkoutDay}>
                  Thêm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">
            Lịch hàng tuần
          </TabsTrigger>
          <TabsTrigger value="exercises">
            Tất cả bài tập
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {workoutPlan?.days.map((day, dayIndex) => (
            <Card key={day.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{day.day}</CardTitle>
                    <CardDescription>
                      {day.exercises.length} bài tập
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
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
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteWorkoutDay(day.id)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {day.exercises.map(
                    (exercise, exerciseIndex) => (
                      <div
                        key={exercise.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
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
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {exercise.name}
                          </h4>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <span className="bg-blue-50 px-2 py-1 rounded">
                              {exercise.sets} hiệp
                            </span>
                            <span className="bg-green-50 px-2 py-1 rounded">
                              {exercise.reps} lần
                            </span>
                            <span className="bg-orange-50 px-2 py-1 rounded">
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
                          >
                            <Pencil className="h-4 w-4" />
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
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ),
                  )}
                  {day.exercises.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Chưa có bài tập nào. Nhấn + để thêm bài
                      tập.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="exercises">
          <Card>
            <CardHeader>
              <CardTitle>Thư viện bài tập</CardTitle>
              <CardDescription>
                Tất cả bài tập trong kế hoạch hiện tại
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {workoutPlan?.days
                  .flatMap((day) => day.exercises)
                  .map((exercise, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-4"
                    >
                      <h4 className="font-semibold mb-2">
                        {exercise.name}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Hiệp: {exercise.sets}</p>
                        <p>Lần: {exercise.reps}</p>
                        <p>Nghỉ: {exercise.rest}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white rounded-full p-2">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                Mẹo từ AI
              </h3>
              <p className="text-sm text-blue-800 mt-1">
                Dựa trên tiến độ của bạn, hãy cân nhắc tăng
                trọng lượng 5% trong buổi tập tiếp theo. Kỹ
                thuật của bạn rất tốt!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Dialog */}
      <Dialog
        open={exerciseDialogOpen}
        onOpenChange={setExerciseDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExercise
                ? "Chỉnh sửa bài tập"
                : "Thêm bài tập mới"}
            </DialogTitle>
            <DialogDescription>
              {editingExercise
                ? "Cập nhật thông tin bài tập"
                : "Tạo bài tập mới cho ngày tập"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tên bài tập</Label>
              <Input
                placeholder="Ví dụ: Squats"
                value={exerciseName}
                onChange={(e) =>
                  setExerciseName(e.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Số hiệp</Label>
                <Input
                  type="number"
                  value={exerciseSets}
                  onChange={(e) =>
                    setExerciseSets(e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Số lần</Label>
                <Input
                  placeholder="12-15"
                  value={exerciseReps}
                  onChange={(e) =>
                    setExerciseReps(e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Nghỉ</Label>
                <Input
                  placeholder="60s"
                  value={exerciseRest}
                  onChange={(e) =>
                    setExerciseRest(e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setExerciseDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleSaveExercise}>
                {editingExercise ? "Cập nhật" : "Thêm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}