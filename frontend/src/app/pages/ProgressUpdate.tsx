import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { useUser } from "../context/UserContext";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function ProgressUpdate() {
  const navigate = useNavigate();
  const { addProgress, fitnessProfile } = useUser();
  const [weight, setWeight] = useState(fitnessProfile?.weight.toString() || "");
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    addProgress({
      date: today,
      weight: parseFloat(weight),
      workoutCompleted,
      notes,
    });

    navigate("/dashboard");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6 text-slate-400 hover:text-slate-100 hover:bg-white/5"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Về Dashboard
      </Button>

      <Card className="bg-[#111827] border-white/5 shadow-xl shadow-black/20">
        <CardHeader>
          <CardTitle className="text-slate-100">Ghi tiến độ</CardTitle>
          <CardDescription className="text-slate-500">
            Cập nhật số liệu và AI sẽ điều chỉnh kế hoạch của bạn
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-slate-300 text-sm">
                Cân nặng hiện tại (kg)
              </Label>

              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="bg-[#0B1120] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-[#0B1120]">
              <div className="space-y-0.5">
                <Label
                  htmlFor="workout-completed"
                  className="text-slate-200 text-sm"
                >
                  Hoàn thành buổi tập hôm nay
                </Label>

                <p className="text-sm text-slate-500">
                  Đánh dấu nếu bạn đã hoàn thành bài tập theo lịch
                </p>
              </div>

              <Switch
                id="workout-completed"
                checked={workoutCompleted}
                onCheckedChange={setWorkoutCompleted}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-300 text-sm">
                Ghi chú (tùy chọn)
              </Label>

              <Textarea
                id="notes"
                placeholder="Bạn cảm thấy thế nào? Có thử thách hoặc thành tích nào hôm nay không?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="bg-[#0B1120] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 resize-none"
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-500/5 border border-green-500/15 rounded-xl">
              <Sparkles className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />

              <p className="text-sm text-slate-400 leading-relaxed">
                <span className="text-green-400 font-medium">
                  Điều chỉnh AI:
                </span>{" "}
                Dựa trên tiến độ của bạn, AI sẽ phân tích dữ liệu và tự động
                điều chỉnh cường độ tập luyện cũng như mục tiêu dinh dưỡng để
                đạt kết quả tối ưu.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all h-11"
              size="lg"
            >
              Lưu tiến độ
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}