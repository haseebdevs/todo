"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import type { Todo } from "./TodoItem";

type Props = {
  userId: string;
  initialTodo?: Todo | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function TodoForm({
  userId,
  initialTodo,
  onSuccess,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTodo?.title ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [disabledUser, setDisabledUser] = useState(false);

  useEffect(() => {
    setTitle(initialTodo?.title ?? "");
  }, [initialTodo?.id]);

  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(doc(db, "users", userId), (snap) => {
      setDisabledUser(Boolean(snap.data()?.disabled));
    });
    return () => unsub();
  }, [userId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (disabledUser) {
      setError("Your account is disabled by admin. You cannot add todos.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (initialTodo?.id) {
        await updateDoc(doc(db, "todos", initialTodo.id), {
          title: title.trim(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "todos"), {
          title: title.trim(),
          completed: false,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setTitle("");
      onSuccess?.();
      inputRef.current?.focus();
    } catch (err: unknown) {
      let msg = "Failed to save. Please try again.";
      if (err && typeof err === "object" && "message" in err) {
        msg = String((err as { message?: unknown }).message ?? msg);
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      <form onSubmit={submit} className="flex w-full items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          disabled={saving || disabledUser}
        />
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={saving || disabledUser}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={saving || !title.trim() || disabledUser}>
          {initialTodo?.id ? "Update" : "Add"}
        </Button>
      </form>
    </div>
  );
}
