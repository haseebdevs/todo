"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/contexts-index";
import { useRouter } from "next/navigation";
import { TodoForm, TodoList } from "@/components/dashboard/dashboard-index";

export default function TodosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Todos</h2>
        <p className="text-muted-foreground">Create and manage your tasks</p>
      </div>
      <div className="bg-card rounded-xl shadow-sm border border-border p-4">
        <TodoForm userId={user.uid} />
      </div>
      <TodoList userId={user.uid} />
    </div>
  );
}
