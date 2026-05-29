"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

const statusConfig: Record<
  Task["status"],
  { label: string; className: string }
> = {
  todo: {
    label: "Todo",
    className: "border-border/60 text-muted-foreground bg-muted/40",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
  completed: {
    label: "Completed",
    className: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
};

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const config = statusConfig[task.status];
        const isDone = task.status === "completed";

        return (
          <div
            key={task.id}
            className={cn(
              "group flex items-start gap-3 rounded-xl border border-border/50 bg-card px-4 py-3.5 transition-all duration-200",
              "hover:border-border hover:shadow-[0_2px_16px_oklch(0_0_0/0.15)]",
              isDone && "opacity-60"
            )}
          >
            {/* Checkbox */}
            <Checkbox
              checked={isDone}
              onCheckedChange={() => onToggleComplete(task)}
              aria-label={`Mark "${task.title}" as ${isDone ? "incomplete" : "complete"}`}
              className="mt-0.5 shrink-0 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2">
                <span
                  className={cn(
                    "text-sm font-medium leading-snug break-words",
                    isDone && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </span>
                {/* Status badge — always visible on mobile */}
                <Badge
                  variant="outline"
                  className={cn("text-[10px] px-2 py-0.5 rounded-full shrink-0", config.className)}
                >
                  {config.label}
                </Badge>
              </div>
              {task.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                aria-label={`Edit "${task.title}"`}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task)}
                aria-label={`Delete "${task.title}"`}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
