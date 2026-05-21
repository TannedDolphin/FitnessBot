import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import FitnessProfile from "./pages/FitnessProfile";
import PlanGeneration from "./pages/PlanGeneration";
import Dashboard from "./pages/Dashboard";
import ProgressUpdate from "./pages/ProgressUpdate";
import WorkoutNew from "./pages/Workout";
import NutritionNew from "./pages/Nutrition";
import Profile from "./pages/Profile";
import AppLayout from "./components/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/fitness-profile",
    Component: FitnessProfile,
  },
  {
    path: "/plan-generation",
    Component: PlanGeneration,
  },
  {
    path: "/dashboard",
    element: (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    ),
  },
  {
    path: "/workout",
    element: (
      <AppLayout>
        <WorkoutNew />
      </AppLayout>
    ),
  },
  {
    path: "/nutrition",
    element: (
      <AppLayout>
        <NutritionNew />
      </AppLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <AppLayout>
        <Profile />
      </AppLayout>
    ),
  },
  {
    path: "/progress",
    element: (
      <AppLayout>
        <ProgressUpdate />
      </AppLayout>
    ),
  },
]);
