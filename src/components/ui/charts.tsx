"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BarDatum = {
  label: string;
  value: number;
  color?: string;
};

export function BarChart({
  data,
  className,
}: {
  data: BarDatum[];
  className?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={cn("space-y-3", className)}>
      {data.map((d) => {
        const pct = Math.round((d.value / max) * 100);
        return (
          <div key={d.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{d.label}</span>
              <span>{d.value}</span>
            </div>
            <div className="h-2 w-full rounded bg-muted">
              <div
                className="h-2 rounded"
                style={{
                  width: `${pct}%`,
                  backgroundColor: d.color ?? "#2563eb",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
