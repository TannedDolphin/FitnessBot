import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Dumbbell, Apple, User, LayoutDashboard, Menu, X, Zap } from "lucide-react";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { path: "/workout", label: "Tập luyện", icon: Dumbbell },
    { path: "/nutrition", label: "Dinh dưỡng", icon: Apple },
    { path: "/profile", label: "Hồ sơ", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#0F172A] border-r border-white/5 flex-col shadow-xl shadow-black/40">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent tracking-tight">
                FitAI
              </h1>
              <p className="text-xs text-slate-500">AI Fitness Coach</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="p-4 rounded-xl bg-green-500/8 border border-green-500/15 backdrop-blur-sm">
            <p className="text-xs font-semibold text-green-400 mb-1.5">💡 AI Tip</p>
            <p className="text-xs text-slate-400 leading-relaxed">Hãy nhất quán với lịch tập!</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-[#0B1120]/95 backdrop-blur-lg border-b border-white/5 p-4 z-40 shadow-lg shadow-black/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-md shadow-green-500/20">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              FitAI
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-400 hover:text-slate-100 hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0B1120] z-30 pt-16">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/20"
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>

    </div>
  );
}
