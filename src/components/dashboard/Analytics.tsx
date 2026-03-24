"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { BarChart } from "@/components/ui/charts";

type Props = {
  userId: string;
};

export default function Analytics({ userId }: Props) {
  const [items, setItems] = useState<
    Array<{ completed: boolean; createdAt: Date | null; completedAt: Date | null }>
  >([]);

  useEffect(() => {
    const q = query(collection(db, "todos"), where("userId", "==", userId));
    const unsub = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => {
          const data = d.data();
          const tsCreated = data.createdAt;
          const tsCompleted = data.completedAt;
          const createdAt =
            tsCreated && typeof tsCreated.toDate === "function"
              ? tsCreated.toDate()
              : null;
          const completedAt =
            tsCompleted && typeof tsCompleted.toDate === "function"
              ? tsCompleted.toDate()
              : null;
          return {
            completed: Boolean(data.completed),
            createdAt,
            completedAt,
          };
        }),
      );
    });
    return () => unsub();
  }, [userId]);

  const { total, completed, pending, completionRate } = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, completionRate };
  }, [items]);

  const last7Data = useMemo(() => {
    const now = new Date();
    const days: { label: string; key: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { day: "2-digit" });
      days.push({ label, key, value: 0 });
    }
    const byKey = new Map(days.map((d) => [d.key, d]));
    for (const item of items) {
      if (!item.createdAt) continue;
      const key = item.createdAt.toISOString().slice(0, 10);
      const entry = byKey.get(key);
      if (entry) entry.value += 1;
    }
    return days;
  }, [items]);

  const last7Completed = useMemo(() => {
    const now = new Date();
    const days: { label: string; key: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { day: "2-digit" });
      days.push({ label, key, value: 0 });
    }
    const byKey = new Map(days.map((d) => [d.key, d]));
    for (const item of items) {
      if (!item.completedAt) continue;
      const key = item.completedAt.toISOString().slice(0, 10);
      const entry = byKey.get(key);
      if (entry) entry.value += 1;
    }
    return days;
  }, [items]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total" value={total} />
        <Card label="Completed" value={completed} />
        <Card label="Pending" value={pending} />
        <Card label="Completion" value={`${completionRate}%`} />
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm text-muted-foreground">Completion Breakdown</div>
        <BarChart
          data={[
            { label: "Completed", value: completed, color: "#22c55e" },
            { label: "Pending", value: pending, color: "#eab308" },
          ]}
        />
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm text-muted-foreground">Todos Created (Last 7 Days)</div>
        <BarChart
          data={last7Data.map((d) => ({
            label: d.label,
            value: d.value,
            color: "#3b82f6",
          }))}
        />
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm text-muted-foreground">Todos Completed (Last 7 Days)</div>
        <BarChart
          data={last7Completed.map((d) => ({
            label: d.label,
            value: d.value,
            color: "#10b981",
          }))}
        />
      </div>
    </>
  );
}

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}
