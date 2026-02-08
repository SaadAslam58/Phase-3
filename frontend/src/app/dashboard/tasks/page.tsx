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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ListTodo } from "lucide-react";
import { api, type Task } from "@/lib/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog state
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

  const handleCreate = async (data: {
    title: string;
    description: string;
  }) => {
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
      prev.map((t) => (t.id === selectedTask.id ? result.task : t)),
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

  return (
    <DashboardLayout>
      <Navbar title="Tasks">
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </Navbar>

      <div className="p-6 space-y-6">
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ListTodo className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {tasks.length === 0
                  ? "Create your first task to get started."
                  : "Try adjusting your search or filter."}
              </p>
              {tasks.length === 0 && (
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              )}
            </CardContent>
          </Card>
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
