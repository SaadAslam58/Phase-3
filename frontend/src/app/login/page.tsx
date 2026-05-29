"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { setToken, setUser, isAuthenticated } from "@/lib/auth";
import { CheckSquare, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) { setError("Email is required"); return; }
    if (!password) { setError("Password is required"); return; }

    setIsLoading(true);
    try {
      const response = await api.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex">
      {/* ── Left panel (decorative, desktop only) ────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-violet-600/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.60_0.22_265/0.25),transparent_70%)]" />
        {/* Grid lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.40 0.08 265 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.40 0.08 265 / 0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative flex flex-col justify-center p-12 z-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              {process.env.NEXT_PUBLIC_APP_NAME || "Taskify"}
            </span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Welcome back to<br />
            <span className="text-gradient">your workspace</span>
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Everything you need to stay organised and productive — all in one
            place.
          </p>

          {/* Feature bullets */}
          <ul className="mt-10 space-y-3">
            {[
              "Real-time task tracking",
              "AI-powered assistant",
              "Secure & private by design",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right panel (form) ─────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <CheckSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">
            {process.env.NEXT_PUBLIC_APP_NAME || "Taskify"}
          </span>
        </div>

        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up for free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 bg-input border-border/60 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 pr-10 bg-input border-border/60 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full glow-primary text-sm font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
