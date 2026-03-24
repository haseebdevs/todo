"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/contexts-index";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";

type UserRow = { id: string; email: string; role?: string; disabled?: boolean };
type TodoRow = { id: string; title: string; completed: boolean; userId: string };

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [todos, setTodos] = useState<TodoRow[]>([]);
  const ADMIN_EMAIL =
    (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").toLowerCase();
  const allowed = (user?.email ?? "").toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (!allowed) router.push("/dashboard");
    }
  }, [user, loading, allowed, router]);

  useEffect(() => {
    const unsubUsers = onSnapshot(query(collection(db, "users")), (snap) => {
      setUsers(
        snap.docs.map((d) => ({
          id: d.id,
          email: String(d.data().email ?? ""),
          role: d.data().role,
          disabled: Boolean(d.data().disabled),
        })),
      );
    });
    const unsubTodos = onSnapshot(query(collection(db, "todos")), (snap) => {
      setTodos(
        snap.docs.map((d) => ({
          id: d.id,
          title: String(d.data().title ?? ""),
          completed: Boolean(d.data().completed),
          userId: String(d.data().userId ?? ""),
        })),
      );
    });
    return () => {
      unsubUsers();
      unsubTodos();
    };
  }, []);

  useEffect(() => {
    // no-op: allowed handled above
  }, [allowed]);

  const usersById = useMemo(() => {
    const m = new Map<string, UserRow>();
    for (const u of users) m.set(u.id, u);
    return m;
  }, [users]);

  const toggleDisable = async (u: UserRow) => {
    await updateDoc(doc(db, "users", u.id), { disabled: !u.disabled });
  };

  if (loading || !user || !allowed) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Admin</h2>
        <p className="text-muted-foreground">Manage users and view all todos</p>
      </div>

      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold mb-3 text-foreground">All Todos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-2 text-muted-foreground">Title</th>
                <th className="p-2 text-muted-foreground">Completed</th>
                <th className="p-2 text-muted-foreground">User</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((t) => {
                const u = usersById.get(t.userId);
                return (
                  <tr key={t.id} className="border-b border-border hover:bg-muted">
                    <td className="p-2 text-foreground">{t.title}</td>
                    <td className="p-2 text-foreground">{t.completed ? "Yes" : "No"}</td>
                    <td className="p-2 text-foreground">{u?.email ?? t.userId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold mb-3 text-foreground">Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-2 text-muted-foreground">Email</th>
                <th className="p-2 text-muted-foreground">Role</th>
                <th className="p-2 text-muted-foreground">Status</th>
                <th className="p-2 text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-muted">
                  <td className="p-2 text-foreground">{u.email}</td>
                  <td className="p-2 text-foreground">{u.role ?? "user"}</td>
                  <td className="p-2 text-foreground">
                    {u.disabled ? "Disabled" : "Active"}
                  </td>
                  <td className="p-2">
                    {u.role !== "admin" ? (
                      <Button size="sm" onClick={() => toggleDisable(u)}>
                        {u.disabled ? "Enable" : "Disable"}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
