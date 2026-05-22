import { Link } from "react-router";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function WebsiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent tracking-tight"
          >
            FitAI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-slate-300 hover:text-white transition-all duration-300 text-sm"
            >
              Trang chủ
            </Link>

            <Link
              to="/about"
              className="text-slate-300 hover:text-white transition-all duration-300 text-sm"
            >
              Về chúng tôi
            </Link>

            <Link to="/login">
              <Button
                variant="ghost"
                className="text-slate-200 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 text-sm rounded-xl"
              >
                Đăng nhập
              </Button>
            </Link>

            <Link to="/register">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 rounded-xl px-6 text-sm">
                Bắt đầu ngay
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-200 hover:text-white transition-colors duration-300"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 pt-4 space-y-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
            
            <Link
              to="/"
              className="block text-slate-300 hover:text-white transition-all duration-300 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>

            <Link
              to="/about"
              className="block text-slate-300 hover:text-white transition-all duration-300 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Về chúng tôi
            </Link>

            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 rounded-xl text-sm"
              >
                Đăng nhập
              </Button>
            </Link>

            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-xl shadow-lg shadow-green-500/20 text-sm">
                Bắt đầu ngay
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}