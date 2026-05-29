"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";
import { Sidebar } from "./sidebar";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  // Close sidebar on route change (navigation inside dashboard)
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  if (!checked) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop Sidebar (always visible ≥ lg) ──────────────── */}
      <div className="hidden w-64 shrink-0 lg:flex lg:flex-col border-r border-border/50">
        <Sidebar />
      </div>

      {/* ── Mobile Sidebar Overlay ──────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 sidebar-overlay lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Sidebar Drawer ───────────────────────────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border/50 shadow-2xl lg:hidden transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0 animate-slide-left" : "-translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation sidebar"
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="flex h-16 items-center border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 text-sm font-semibold">
            {process.env.NEXT_PUBLIC_APP_NAME || "Taskify"}
          </span>
        </div>

        <main className="flex-1 overflow-y-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
