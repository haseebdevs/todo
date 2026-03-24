"use client";

import { useState } from "react";
import { Trash2, Pencil, CheckCircle2, Circle } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  deleteField,
} from "firebase/firestore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

type Props = {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
};

export default function TodoItem({ todo, onEdit }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteDoc(doc(db, "todos", todo.id));
    } finally {
      setDeleting(false);
    }
  };

  const toggleCompleted = async () => {
    try {
      setToggling(true);
      const nowCompleted = !todo.completed;
      await updateDoc(doc(db, "todos", todo.id), {
        completed: nowCompleted,
        completedAt: nowCompleted ? serverTimestamp() : deleteField(),
      });
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="border-t border-border p-4 flex items-center justify-between hover:bg-muted">
      <div className="flex items-center gap-3">
        <button
          aria-label="toggle completed"
          onClick={toggleCompleted}
          disabled={toggling}
          className="text-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          {todo.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        <span className={`text-foreground ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
          {todo.title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit?.(todo)}
        >
          <Pencil className="w-4 h-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" disabled={deleting}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete todo?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your todo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
