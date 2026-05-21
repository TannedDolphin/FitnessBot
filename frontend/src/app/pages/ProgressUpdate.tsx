import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { useUser } from "../context/UserContext";
import { ArrowLeft } from "lucide-react";

export default function ProgressUpdate() {
  const navigate = useNavigate();
  const { addProgress, fitnessProfile } = useUser();
  const [weight, setWeight] = useState(fitnessProfile?.weight.toString() || "");
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Log Your Progress</CardTitle>
            <CardDescription>
              Update your metrics and the AI will adjust your plan accordingly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="workout-completed">Completed Today's Workout</Label>
                  <p className="text-sm text-gray-500">Mark if you finished your scheduled exercises</p>
                </div>
                <Switch
                  id="workout-completed"
                  checked={workoutCompleted}
                  onCheckedChange={setWorkoutCompleted}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How are you feeling? Any challenges or victories today?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>AI Adjustment:</strong> Based on your progress, the AI will analyze your data and
                  automatically adjust your workout intensity and nutrition targets for optimal results.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Save Progress
              </Button>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
