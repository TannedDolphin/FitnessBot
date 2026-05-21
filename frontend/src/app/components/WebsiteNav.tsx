import { Link } from "react-router";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function WebsiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">
            FitAI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white/80 hover:text-white transition">
              Trang chủ
            </Link>
            <Link to="/about" className="text-white/80 hover:text-white transition">
              Về chúng tôi
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500">
                Bắt đầu ngay
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              to="/"
              className="block text-white/80 hover:text-white transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              className="block text-white/80 hover:text-white transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Về chúng tôi
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500">
                Bắt đầu ngay
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
