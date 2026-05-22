import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { useUser } from "../context/UserContext";
import WebsiteNav from "../components/WebsiteNav";

const goalOptions = [
  "Giảm cân",
  "Tăng cơ",
  "Cải thiện sức bền",
  "Tăng tính linh hoạt",
  "Thể dục tổng quát",
];

const isPositiveNumber = (value: string) => Number(value) > 0;

export default function FitnessProfile() {
  const navigate = useNavigate();
  const { setFitnessProfile } = useUser();

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState("");
  const [error, setError] = useState("");

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((item) => item !== goal)
        : [...prev, goal],
    );
  };

  const handleNumberChange =
    (setter: (value: string) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;

      if (nextValue === "" || Number(nextValue) >= 0) {
        setter(nextValue);
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !isPositiveNumber(age) ||
      !isPositiveNumber(weight) ||
      !isPositiveNumber(height)
    ) {
      setError("Tuổi, cân nặng và chiều cao phải lớn hơn 0.");
      return;
    }

    if (!gender) {
      setError("Vui lòng chọn giới tính.");
      return;
    }

    if (!fitnessLevel) {
      setError("Vui lòng chọn mức độ thể dục.");
      return;
    }

    if (
      !isPositiveNumber(trainingDaysPerWeek) ||
      parseInt(trainingDaysPerWeek) > 7
    ) {
      setError("Số ngày tập trong tuần phải từ 1 đến 7.");
      return;
    }

    if (goals.length === 0) {
      setError("Vui lòng chọn ít nhất một mục tiêu.");
      return;
    }

    setFitnessProfile({
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      gender,
      fitnessLevel,
      trainingDaysPerWeek: parseInt(trainingDaysPerWeek),
      goals,
      restrictions,
    });

    navigate("/plan-generation");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <WebsiteNav />

      {/* Ambient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/8 rounded-full blur-3xl pointer-events-none"
      />

      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl relative z-10">
          <div className="bg-[#0B1120]/80 backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-2xl shadow-black/60">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Hồ sơ Thể dục của bạn
              </h1>

              <p className="text-slate-500 text-sm">
                Giúp AI hiểu thể trạng hiện tại và mục tiêu của bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tuổi + Giới tính */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-slate-300 text-sm">
                    Tuổi
                  </Label>

                  <Input
                    id="age"
                    type="number"
                    min={13}
                    max={100}
                    inputMode="numeric"
                    placeholder="25"
                    value={age}
                    onChange={handleNumberChange(setAge)}
                    required
                    className="bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-slate-300 text-sm">
                    Giới tính
                  </Label>

                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger
                      id="gender"
                      className="bg-[#111827] border-white/8 text-slate-100 h-11 focus:border-green-500/50"
                    >
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>

                    <SelectContent className="bg-[#111827] border-white/10">
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cân nặng + Chiều cao */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-slate-300 text-sm">
                    Cân nặng (kg)
                  </Label>

                  <Input
                    id="weight"
                    type="number"
                    min={25}
                    max={300}
                    step="0.1"
                    inputMode="decimal"
                    placeholder="70"
                    value={weight}
                    onChange={handleNumberChange(setWeight)}
                    required
                    className="bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-slate-300 text-sm">
                    Chiều cao (cm)
                  </Label>

                  <Input
                    id="height"
                    type="number"
                    min={100}
                    max={250}
                    inputMode="numeric"
                    placeholder="175"
                    value={height}
                    onChange={handleNumberChange(setHeight)}
                    required
                    className="bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11"
                  />
                </div>
              </div>

              {/* Số ngày tập / tuần */}
              <div className="space-y-2">
                <Label
                  htmlFor="training-days"
                  className="text-slate-300 text-sm"
                >
                  Số ngày tập / tuần
                </Label>

                <Input
                  id="training-days"
                  type="number"
                  min={1}
                  max={7}
                  inputMode="numeric"
                  placeholder="5"
                  value={trainingDaysPerWeek}
                  onChange={handleNumberChange(setTrainingDaysPerWeek)}
                  required
                  className="bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 h-11"
                />
              </div>

              {/* Fitness Level */}
              <div className="space-y-2">
                <Label
                  htmlFor="fitness-level"
                  className="text-slate-300 text-sm"
                >
                  Mức độ thể dục hiện tại
                </Label>

                <Select
                  value={fitnessLevel}
                  onValueChange={setFitnessLevel}
                >
                  <SelectTrigger
                    id="fitness-level"
                    className="bg-[#111827] border-white/8 text-slate-100 h-11 focus:border-green-500/50"
                  >
                    <SelectValue placeholder="Chọn mức độ thể dục" />
                  </SelectTrigger>

                  <SelectContent className="bg-[#111827] border-white/10">
                    <SelectItem value="beginner">
                      Mới bắt đầu
                    </SelectItem>

                    <SelectItem value="intermediate">
                      Trung cấp - Tập luyện thường xuyên
                    </SelectItem>

                    <SelectItem value="advanced">
                      Nâng cao - Có kinh nghiệm tập luyện
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Goals */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-sm">
                  Mục tiêu thể dục (chọn tất cả mục phù hợp)
                </Label>

                <div className="grid grid-cols-1 gap-3">
                  {goalOptions.map((goal) => (
                    <label
                      key={goal}
                      htmlFor={goal}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        goals.includes(goal)
                          ? "border-green-500/40 bg-green-500/10"
                          : "border-white/6 bg-[#111827] hover:border-white/12"
                      }`}
                    >
                      <Checkbox
                        id={goal}
                        checked={goals.includes(goal)}
                        onCheckedChange={() => toggleGoal(goal)}
                        className="border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />

                      <span className="font-normal text-slate-300 text-sm">
                        {goal}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Restrictions */}
              <div className="space-y-2">
                <Label
                  htmlFor="restrictions"
                  className="text-slate-300 text-sm"
                >
                  Hạn chế ăn uống hoặc chấn thương (tùy chọn)
                </Label>

                <Textarea
                  id="restrictions"
                  placeholder="Ví dụ: ăn chay, chấn thương đầu gối, dị ứng đậu..."
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  className="bg-[#111827] border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-green-500/50 resize-none"
                  rows={3}
                />
              </div>

              {error ? (
                <p className="text-sm text-red-400">{error}</p>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all h-11"
                size="lg"
                disabled={goals.length === 0}
              >
                Tạo kế hoạch AI của tôi
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-slate-600 text-sm">
          <p>&copy; 2026 FitAI. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}