"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Navbar } from "@/components/dashboard/navbar";
import { TaskFilters } from "@/components/dashboard/task-filters";
import { TaskList } from "@/components/dashboard/task-list";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { EditTaskDialog } from "@/components/dashboard/edit-task-dialog";
import { DeleteTaskDialog } from "@/components/dashboard/delete-task-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ListTodo } from "lucide-react";
import { api, type Task } from "@/lib/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await api.getTasks();
      setTasks(data.tasks);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        search === "" ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const handleCreate = async (data: { title: string; description: string }) => {
    const result = await api.createTask(data);
    setTasks((prev) => [result.task, ...prev]);
  };

  const handleEdit = async (data: {
    title: string;
    description: string;
    status: Task["status"];
  }) => {
    if (!selectedTask) return;
    const result = await api.updateTask(selectedTask.id, data);
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTask.id ? result.task : t))
    );
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    await api.deleteTask(selectedTask.id);
    setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
  };

  const handleToggleComplete = async (task: Task) => {
    const result = await api.toggleTask(task.id);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? result.task : t)));
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const openDelete = (task: Task) => {
    setSelectedTask(task);
    setDeleteOpen(true);
  };

  // Task counts
  const counts = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    return { total, done, inProgress };
  }, [tasks]);

  return (
    <DashboardLayout>
      <Navbar title="Tasks">
        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          id="create-task-btn"
          className="glow-primary"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </Navbar>

      <div className="p-4 sm:p-6 space-y-5">
        {/* ── Status summary chips ────────────────────────────── */}
        {!loading && tasks.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-muted-foreground">
              {counts.total} total
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400">
              {counts.done} completed
            </span>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-400">
              {counts.inProgress} in progress
            </span>
          </div>
        )}

        {/* ── Filters ────────────────────────────────────────── */}
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* ── Error ──────────────────────────────────────────── */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* ── Content ────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
              <ListTodo className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold">
              {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              {tasks.length === 0
                ? "Create your first task to get started."
                : "Try adjusting your search or filter."}
            </p>
            {tasks.length === 0 && (
              <Button
                onClick={() => setCreateOpen(true)}
                size="sm"
                className="mt-6"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={openEdit}
            onDelete={openDelete}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>

      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
      />
      <EditTaskDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        task={selectedTask}
        onSubmit={handleEdit}
      />
      <DeleteTaskDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        task={selectedTask}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
