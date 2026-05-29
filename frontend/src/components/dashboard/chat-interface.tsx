"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, AlertCircle, Sparkles } from "lucide-react";
import { api, type ChatMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  id: number | string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.sendMessage(text, conversationId);
      setConversationId(response.conversation_id);

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.response.content,
        isError: response.status === "error",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "Show me my tasks",
    "Add a task to buy groceries",
    "What's pending today?",
    "Mark my top task as done",
  ];

  return (
    <div className="flex h-full flex-col">
      {/* ── Messages area ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 animate-pulse-glow items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">AI Task Assistant</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Ask me to manage your tasks in plain English. I can create, update,
              list, and complete tasks for you.
            </p>

            {/* Suggestion chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    inputRef.current?.focus();
                  }}
                  className="rounded-full border border-border/60 bg-muted/40 px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {/* Assistant avatar */}
                {msg.role === "assistant" && (
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                      msg.isError
                        ? "bg-destructive/15"
                        : "bg-primary/10 ring-1 ring-primary/20"
                    )}
                  >
                    {msg.isError ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : msg.isError
                      ? "rounded-tl-sm border border-destructive/30 bg-destructive/10 text-destructive"
                      : "rounded-tl-sm border border-border/40 bg-card text-card-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* User avatar */}
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-border/40 bg-card px-4 py-3">
                  <div className="flex gap-1 items-center">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input area ────────────────────────────────────────── */}
      <div className="border-t border-border/50 bg-background/60 backdrop-blur-sm p-3 sm:p-4">
        <div className="flex gap-2 items-center">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to manage your tasks…"
            disabled={loading}
            autoFocus
            className="h-11 flex-1 bg-input border-border/60 focus:border-primary transition-colors rounded-xl"
            id="chat-input"
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl glow-primary"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
