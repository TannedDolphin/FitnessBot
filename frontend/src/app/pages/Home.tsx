import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dumbbell, Apple, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">FitAI</h1>
          <p className="text-xl text-gray-600">Your AI-Powered Fitness Journey</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Dumbbell className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Smart Workouts</CardTitle>
              <CardDescription>
                AI-generated workout plans tailored to your fitness level and goals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Apple className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Nutrition Plans</CardTitle>
              <CardDescription>
                Personalized meal plans designed to fuel your progress
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Watch your AI adjust plans based on your real-time progress
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Ready to Transform Your Fitness?</CardTitle>
            <CardDescription>
              Join thousands who have achieved their goals with AI-powered coaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/register">
              <Button size="lg" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
