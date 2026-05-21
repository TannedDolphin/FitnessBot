import { useState } from "react";
import { useNavigate, Link } from "react-router";
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
import { useUser } from "../context/UserContext";
import WebsiteNav from "../components/WebsiteNav";
import { postJson } from "../lib/api";

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function Register() {
  const navigate = useNavigate();
  const { setUserData } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await postJson<AuthResponse>("/api/users/register", {
        name,
        email,
        password,
      });

      setUserData(response.user);
      navigate("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Khong the tao tai khoan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <WebsiteNav />

      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
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

        <Card className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border-gray-800 relative z-10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-white">
              Tao tai khoan
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Bat dau hanh trinh the duc cua ban ngay hom nay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">
                  Ho va ten
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyen Van A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Mat khau
                </Label>
                <Input
                  id="password"
                  type="password"
                  minLength={6}
                  placeholder="Toi thieu 6 ky tu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              {error ? <p className="text-sm text-red-300">{error}</p> : null}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Dang tao..." : "Tao tai khoan"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Da co tai khoan?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                Dang nhap
              </Link>
            </div>
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
