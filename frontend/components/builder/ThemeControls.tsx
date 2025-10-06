"use client";

import { useBuilderStore } from "@/state/useBuilderStore";

export function ThemeControls() {
  const theme = useBuilderStore((state) => state.theme);
  const setTheme = useBuilderStore((state) => state.setTheme);

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Theme
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Accent
          <input
            type="color"
            value={theme.accentColor ?? "#6366f1"}
            onChange={(event) => setTheme({ accentColor: event.target.value })}
            className="mt-1 h-10 w-full cursor-pointer rounded border border-slate-200"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Background
          <input
            type="color"
            value={theme.backgroundColor ?? "#ffffff"}
            onChange={(event) => setTheme({ backgroundColor: event.target.value })}
            className="mt-1 h-10 w-full cursor-pointer rounded border border-slate-200"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Text
          <input
            type="color"
            value={theme.textColor ?? "#0f172a"}
            onChange={(event) => setTheme({ textColor: event.target.value })}
            className="mt-1 h-10 w-full cursor-pointer rounded border border-slate-200"
          />
        </label>
      </div>
    </section>
  );
}
