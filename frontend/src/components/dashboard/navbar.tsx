"use client";

interface NavbarProps {
  title: string;
  children?: React.ReactNode;
}

export function Navbar({ title, children }: NavbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
}
