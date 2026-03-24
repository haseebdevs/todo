"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/contexts-index";
import { useRouter } from "next/navigation";
import { logOut } from "@/lib/auth";
import { LogOut, ChevronDown } from "lucide-react";
import { TodoForm, TodoList } from "@/components/dashboard/dashboard-index";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // State for Dropdown & Loading
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🔒 Protect Route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        {/* Logo / Title */}
        <h1 className="text-xl font-bold text-blue-600">My Todos</h1>

        {/* Right Side: Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium">
              {user.email}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Invisible backdrop to close when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-500">Manage your tasks efficiently.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <TodoForm userId={user.uid} />
        </div>
        <TodoList userId={user.uid} />
      </main>
    </div>
  );
}
