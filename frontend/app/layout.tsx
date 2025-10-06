import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Social Hub Builder",
  description: "Create and share collaborative hubs in real time.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-slate-50">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <a href="/" className="text-xl font-semibold text-slate-900">
                HubForge
              </a>
              <nav className="flex items-center gap-4 text-sm text-slate-600">
                <a href="/builder">Builder</a>
                <a href="/admin">Admin</a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
