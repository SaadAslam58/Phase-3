"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/lib/api";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

const statusConfig: Record<
  Task["status"],
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  todo: { label: "Todo", variant: "outline" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
};

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const config = statusConfig[task.status];
            return (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => onToggleComplete(task)}
                    aria-label={`Mark "${task.title}" as ${task.status === "completed" ? "incomplete" : "complete"}`}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <span
                      className={
                        task.status === "completed"
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                        {task.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(task)}
                      aria-label={`Edit "${task.title}"`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(task)}
                      aria-label={`Delete "${task.title}"`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
