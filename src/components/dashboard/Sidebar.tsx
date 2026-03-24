"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/contexts-index";
import { Button } from "@/components/ui/button";
import { logOut } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/todos", label: "Todos" },
  { href: "/dashboard/admin", label: "Admin" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").toLowerCase();
  const [dbRole, setDbRole] = useState<string | null>(null);
  const isSuperAdmin = (user?.email ?? "").toLowerCase() === ADMIN_EMAIL;
  const isAdmin = isSuperAdmin || dbRole === "admin";

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      setDbRole((snap.data()?.role as string) ?? null);
    });
    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    // Only upsert identity/timestamps; do not override role from DB.
    setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email ?? "",
        disabled: false,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true },
    ).catch(() => { });
  }, [user?.uid]);

  const handleLogout = async () => {
    await logOut();
    router.push("/login");
  };

  return (
    <aside className="h-full w-64 border-r border-border bg-card text-foreground p-4 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 grid place-items-center font-semibold">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">
            {user?.email ?? "User"}
          </div>
          <div className="text-xs text-gray-500">Signed in</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          if (item.href === "/dashboard/admin" && !isAdmin) return null;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Button className="w-full" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );
}
