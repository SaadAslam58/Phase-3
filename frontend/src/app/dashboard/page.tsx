"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Navbar } from "@/components/dashboard/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ListTodo, CheckCircle2, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { api, type TaskStats } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.getTaskStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const completionRate =
    stats && stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  const statCards = [
    {
      title: "Total Tasks",
      value: stats?.total ?? 0,
      icon: ListTodo,
      description: "All tasks in your list",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      ring: "ring-indigo-500/20",
    },
    {
      title: "Completed",
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      description: "Tasks you've finished",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    {
      title: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      description: "Tasks still to do",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
    },
  ];

  return (
    <DashboardLayout>
      <Navbar title="Dashboard" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* ── Welcome header ─────────────────────────────────── */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Welcome back 👋
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Here&apos;s a summary of your tasks.
            </p>
          </div>
          <Button size="sm" asChild className="self-start sm:self-auto">
            <Link href="/dashboard/tasks">
              View all tasks <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* ── Error ──────────────────────────────────────────── */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* ── Stat cards ─────────────────────────────────────── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-card border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-1.5" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((card, i) => (
                <Card
                  key={card.title}
                  className={`bg-card border-border/50 hover:border-border transition-colors animate-fade-up animate-delay-${i * 100}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg} ring-1 ${card.ring}`}>
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{card.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* ── Completion rate ────────────────────────────────── */}
        {!loading && stats && (
          <Card className="bg-card border-border/50 animate-fade-up animate-delay-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Completion Rate
                </CardTitle>
                <span className="text-2xl font-bold text-gradient">
                  {completionRate}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Quick action card ──────────────────────────────── */}
        {!loading && stats && stats.total === 0 && (
          <Card className="border-dashed border-border/50 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <ListTodo className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-base font-semibold">No tasks yet</h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Get started by creating your first task or asking the AI assistant.
              </p>
              <div className="mt-6 flex gap-3">
                <Button size="sm" asChild>
                  <Link href="/dashboard/tasks">Create a task</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/chat">Ask AI</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
