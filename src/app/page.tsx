"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/contexts-index";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace("/dashboard");
    else router.replace("/login");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="size-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        Redirecting…
      </div>
    </div>
  );
}
