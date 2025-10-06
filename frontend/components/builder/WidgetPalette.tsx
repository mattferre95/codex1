"use client";

import { WidgetTemplate } from "@/lib/types";
import { useBuilderStore } from "@/state/useBuilderStore";

export function WidgetPalette() {
  const templates = useBuilderStore((state) => state.templates);
  const addWidget = useBuilderStore((state) => state.addWidget);

  return (
    <aside className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Widget library
      </h2>
      <div className="grid gap-3">
        {templates.map((template: WidgetTemplate) => (
          <button
            key={template.id}
            type="button"
            onClick={() => addWidget(template)}
            className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-brand hover:shadow"
          >
            <h3 className="text-sm font-semibold text-slate-900">{template.title}</h3>
            <p className="mt-1 text-xs text-slate-600">{template.description}</p>
          </button>
        ))}
        {templates.length === 0 && (
          <p className="text-sm text-slate-500">
            No templates yet. Head to the admin area to add one.
          </p>
        )}
      </div>
    </aside>
  );
}
