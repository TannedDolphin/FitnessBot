import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import AIChatWidget from "./AIChatWidget";
import { Dumbbell, Apple, User, LayoutDashboard, Menu, X } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">FitAI</h1>
          <p className="text-sm text-gray-500">Your AI Coach</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b p-4 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">FitAI</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-30 pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0">
        {children}
      </main>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}
