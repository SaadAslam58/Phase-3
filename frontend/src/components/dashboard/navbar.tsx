"use client";

interface NavbarProps {
  title: string;
  children?: React.ReactNode;
}

export function Navbar({ title, children }: NavbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 sm:px-6 sticky top-0 z-10">
      <h1 className="text-base font-semibold tracking-tight sm:text-lg">{title}</h1>
      {children && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </header>
  );
}
