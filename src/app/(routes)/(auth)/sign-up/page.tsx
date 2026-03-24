"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth"; // ✅ Make sure you export 'signUp' from auth.ts
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Call signUp instead of signIn
      await signUp(email, password);

      // Optional: You might want to verify email first, but for now we redirect
      router.push("/dashboard");
    } catch (err: any) {
      // Handle specific Firebase errors nicely
      let message = "Failed to sign up";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else {
        message = err.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md p-6 bg-card rounded-lg shadow-md border"
      >
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-100 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
