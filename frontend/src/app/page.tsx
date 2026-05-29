import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Smart Task Management",
    description:
      "Create, organise, and prioritise your tasks effortlessly. Drag, sort, and filter with a single tap.",
    gradient: "from-indigo-500/20 to-violet-500/20",
    iconColor: "text-indigo-400",
  },
  {
    icon: BarChart3,
    title: "Real-time Dashboard",
    description:
      "Live stats and insights keep you informed on your progress without ever leaving the page.",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and private. Industry-grade JWT auth ensures only you have access.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Chat",
    description:
      "Talk to your task list. Ask our AI to create, update, or summarise tasks in plain English.",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimistic UI updates mean your actions reflect instantly — no waiting, no lag.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Sparkles,
    title: "Beautiful by Default",
    description:
      "A carefully crafted dark interface that works on every device, from phone to widescreen monitor.",
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-400",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      {/* ── Navigation ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-primary">
              <CheckSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              {process.env.NEXT_PUBLIC_APP_NAME || "Taskify"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="glow-primary hidden sm:flex" asChild>
              <Link href="/signup">
                Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <main className="flex-1">
        <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6">
          {/* Decorative orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500/8 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-purple-500/8 blur-3xl" />
          </div>

          {/* Badge */}
          <div className="animate-fade-up mb-6 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-powered task management</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up animate-delay-100 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your tasks,{" "}
            <span className="text-gradient">beautifully</span>
            <br className="hidden sm:block" />
            {" "}organised
          </h1>

          {/* Sub-headline */}
          <p className="animate-fade-up animate-delay-200 mx-auto mt-6 max-w-xl text-center text-base text-muted-foreground sm:text-lg md:text-xl">
            Taskify gives you a smart, real-time dashboard to manage everything
            from daily to-dos to complex projects — with an AI assistant built
            right in.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up animate-delay-300 mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button size="lg" className="glow-primary px-8" asChild>
              <Link href="/signup">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border/60 px-8" asChild>
              <Link href="/login">Sign in to dashboard</Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up animate-delay-400 mt-16 grid grid-cols-3 gap-6 text-center sm:gap-12">
            {[
              { value: "10k+", label: "Tasks managed" },
              { value: "99%", label: "Uptime SLA" },
              { value: "< 1s", label: "Response time" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-gradient sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────────── */}
        <section className="px-4 py-24 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            {/* Section header */}
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Everything you need
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for how you actually work
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                From quick captures to complex project flows, Taskify adapts to
                your workflow — not the other way around.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`animate-fade-up animate-delay-${(i % 5) * 100} group relative rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_oklch(0.60_0.22_265/0.1)]`}
                >
                  {/* Icon */}
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ─────────────────────────────────────────── */}
        <section className="px-4 pb-24 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent p-8 text-center sm:p-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
              >
                <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
              </div>
              <h2 className="text-2xl font-bold sm:text-4xl">
                Ready to take control?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground sm:text-lg">
                Join thousands of professionals who trust Taskify to keep their
                day on track.
              </p>
              <Button size="lg" className="glow-primary mt-8 px-10" asChild>
                <Link href="/signup">
                  Create your free account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-8 px-4 sm:px-6">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/80">
              <CheckSquare className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Taskify</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Taskify. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
