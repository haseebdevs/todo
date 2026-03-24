"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/contexts-index";
import { useRouter } from "next/navigation";
import { Analytics } from "@/components/dashboard/dashboard-index";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="text-gray-500">Your todo analytics</p>
      </div>
      <Analytics userId={user.uid} />
    </div>
  );
}
