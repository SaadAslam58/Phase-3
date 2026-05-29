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

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setIsLoading(true);
    try {
      const response = await api.signup({ name, email, password });
      setToken(response.token);
      setUser(response.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex">
      {/* ── Left decorative panel (desktop) ────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-primary/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.65_0.25_300/0.25),transparent_70%)]" />
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
            Start organising<br />
            <span className="text-gradient">smarter today</span>
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Your account is free forever. No credit card required.
          </p>

          <ul className="mt-10 space-y-3">
            {[
              "Unlimited tasks & projects",
              "AI assistant included",
              "Syncs across all devices",
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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="signup-name" className="text-sm font-medium">
                Full name <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-input border-border/60 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="signup-email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="signup-email"
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
              <Label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
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
              {password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= level * 3
                          ? level <= 1
                            ? "bg-destructive"
                            : level <= 2
                            ? "bg-amber-500"
                            : level <= 3
                            ? "bg-yellow-400"
                            : "bg-emerald-500"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              )}
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
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create account <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By creating an account you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
