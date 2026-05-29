"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ListTodo, LogOut, MessageSquare, CheckSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
  { label: "Chat", href: "/dashboard/chat", icon: MessageSquare },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* ── Logo / Header ─────────────────────────────────── */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <CheckSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight">
            {process.env.NEXT_PUBLIC_APP_NAME || "Taskify"}
          </span>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_oklch(0.60_0.22_265/0.3)]"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-sidebar-foreground/50"
                )}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom / Logout ───────────────────────────────── */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-destructive rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
