"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import TodoItem, { Todo } from "./TodoItem";
import TodoForm from "./TodoForm";

type Props = {
  userId: string;
};

export default function TodoList({ userId }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editing, setEditing] = useState<Todo | null>(null);

  useEffect(() => {
    const q = query(collection(db, "todos"), where("userId", "==", userId));
    const unsub = onSnapshot(q, (snap) => {
      const next: Todo[] = snap.docs.map(mapDocToTodo);
      setTodos(next);
    });
    return () => unsub();
  }, [userId]);

  const hasTodos = todos.length > 0;

  const header = useMemo(
    () => (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Todos</h3>
      </div>
    ),
    [],
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">{header}</div>

      {!hasTodos ? (
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg font-medium">No tasks yet</p>
          <p className="text-sm">Use the form above to add your first task.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {todos.map((t) =>
            editing?.id === t.id ? (
              <div key={t.id} className="p-4">
                <TodoForm
                  userId={userId}
                  initialTodo={t}
                  onSuccess={() => setEditing(null)}
                  onCancel={() => setEditing(null)}
                />
              </div>
            ) : (
              <TodoItem key={t.id} todo={t} onEdit={setEditing} />
            ),
          )}
        </div>
      )}
    </div>
  );
}

function mapDocToTodo(
  d: QueryDocumentSnapshot<DocumentData, DocumentData>,
): Todo {
  const data = d.data();
  return {
    id: d.id,
    title: data.title ?? "",
    completed: Boolean(data.completed),
    userId: data.userId ?? "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : data.createdAt ?? null,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : data.updatedAt ?? null,
  };
}
