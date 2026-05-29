"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function TaskFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          id="task-search"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-9 bg-input border-border/60 focus:border-primary transition-colors rounded-xl"
          aria-label="Search tasks"
        />
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger
            id="task-status-filter"
            className="h-10 w-full sm:w-44 bg-input border-border/60 rounded-xl"
            aria-label="Filter by status"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
