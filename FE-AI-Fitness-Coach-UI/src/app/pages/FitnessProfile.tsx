import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
  "Giam can",
  "Tang co",
  "Cai thien suc ben",
  "Tang tinh linh hoat",
  "The duc tong quat",
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
  const [activityLevel, setActivityLevel] = useState("");
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
      setError("Tuoi, can nang va chieu cao phai lon hon 0.");
      return;
    }

    if (!gender) {
      setError("Vui long chon gioi tinh.");
      return;
    }

    if (!fitnessLevel) {
      setError("Vui long chon muc do the duc.");
      return;
    }

    if (!activityLevel) {
      setError("Vui long chon muc do van dong.");
      return;
    }

    if (
      !isPositiveNumber(trainingDaysPerWeek) ||
      parseInt(trainingDaysPerWeek) > 7
    ) {
      setError("So ngay tap trong tuan phai tu 1 den 7.");
      return;
    }

    if (goals.length === 0) {
      setError("Vui long chon it nhat mot muc tieu.");
      return;
    }

    setFitnessProfile({
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      gender,
      fitnessLevel,
      activityLevel,
      trainingDaysPerWeek: parseInt(trainingDaysPerWeek),
      goals,
      restrictions,
    });

    navigate("/plan-generation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <WebsiteNav />

      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />

        <Card className="w-full max-w-2xl bg-gray-900/50 backdrop-blur-xl border-gray-800 relative z-10">
          <CardHeader>
            <CardTitle className="text-3xl text-white">
              Ho so the duc cua ban
            </CardTitle>

            <CardDescription className="text-gray-400">
              Giup AI hieu the trang hien tai va muc tieu cua ban.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Tuoi + Gioi tinh */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-200">
                    Tuoi
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
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-200">
                    Gioi tinh
                  </Label>

                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger
                      id="gender"
                      className="bg-gray-800/50 border-gray-700 text-white"
                    >
                      <SelectValue placeholder="Chon gioi tinh" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Can nang + Chieu cao */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-gray-200">
                    Can nang (kg)
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
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-gray-200">
                    Chieu cao (cm)
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
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* So ngay tap / tuan */}
              <div className="space-y-2">
                <Label htmlFor="training-days" className="text-gray-200">
                  So ngay tap / tuan
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
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Fitness Level */}
              <div className="space-y-2">
                <Label htmlFor="fitness-level" className="text-gray-200">
                  Muc do the duc hien tai
                </Label>

                <Select
                  value={fitnessLevel}
                  onValueChange={setFitnessLevel}
                >
                  <SelectTrigger
                    id="fitness-level"
                    className="bg-gray-800/50 border-gray-700 text-white"
                  >
                    <SelectValue placeholder="Chon muc do the duc" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="beginner">
                      Moi bat dau
                    </SelectItem>

                    <SelectItem value="intermediate">
                      Trung cap - Tap luyen thuong xuyen
                    </SelectItem>

                    <SelectItem value="advanced">
                      Nang cao - Co kinh nghiem tap luyen
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <Label htmlFor="activity-level" className="text-gray-200">
                  Muc do van dong hang ngay
                </Label>

                <Select
                  value={activityLevel}
                  onValueChange={setActivityLevel}
                >
                  <SelectTrigger
                    id="activity-level"
                    className="bg-gray-800/50 border-gray-700 text-white"
                  >
                    <SelectValue placeholder="Chon muc do van dong" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="sedentary">
                      Ap luc thap - Lam viec van phong, it van dong
                    </SelectItem>

                    <SelectItem value="lightly_active">
                      Ap luc trung binh - Van dong nhe, tap 1-3 lan/tuan
                    </SelectItem>

                    <SelectItem value="moderately_active">
                      Ap luc trung - Van dong vua phai, tap 3-5 lan/tuan
                    </SelectItem>

                    <SelectItem value="very_active">
                      Ap luc cao - Van dong manh, tap 6-7 lan/tuan
                    </SelectItem>

                    <SelectItem value="extremely_active">
                      Ap luc rat cao - Cong viec giang day, tap the duc hoac
                      the thao
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Goals */}
              <div className="space-y-3">
                <Label className="text-gray-200">
                  Muc tieu the duc (chon tat ca muc phu hop)
                </Label>

                {goalOptions.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={goals.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                      className="border-gray-600"
                    />

                    <Label
                      htmlFor={goal}
                      className="font-normal cursor-pointer text-gray-300"
                    >
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Restrictions */}
              <div className="space-y-2">
                <Label htmlFor="restrictions" className="text-gray-200">
                  Han che an uong hoac chan thuong (tuy chon)
                </Label>

                <Textarea
                  id="restrictions"
                  placeholder="Vi du: an chay, chan thuong dau goi, di ung dau..."
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {error ? (
                <p className="text-sm text-red-300">{error}</p>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                size="lg"
                disabled={goals.length === 0}
              >
                Tao ke hoach AI cua toi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>&copy; 2026 FitAI. Tat ca quyen duoc bao luu.</p>
        </div>
      </footer>
    </div>
  );
}