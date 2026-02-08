"use client";

import { DashboardLayout } from "@/components/dashboard/layout";
import { Navbar } from "@/components/dashboard/navbar";
import { ChatInterface } from "@/components/dashboard/chat-interface";

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="flex h-full flex-col">
        <Navbar title="AI Chat" />
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
}
