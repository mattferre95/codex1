"use client";

import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { useBuilderStore } from "@/state/useBuilderStore";

export function PreviewPane() {
  const widgets = useBuilderStore((state) => state.widgets);
  const templates = useBuilderStore((state) => state.templates);
  const theme = useBuilderStore((state) => state.theme);
  const title = useBuilderStore((state) => state.title);
  const description = useBuilderStore((state) => state.description);

  return (
    <section
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      style={{ background: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold" style={{ color: theme.textColor }}>
          {title || "Untitled hub"}
        </h2>
        {description && (
          <p className="text-sm text-slate-600" style={{ color: theme.textColor }}>
            {description}
          </p>
        )}
      </div>
      <div className="mt-4 space-y-3">
        {widgets.map((widget) => {
          const template = templates.find((item) => item.id === widget.template_id);
          if (!template) return null;
          return (
            <WidgetRenderer
              key={widget.id}
              widget={widget}
              template={template}
              accentColor={theme.accentColor}
              textColor={theme.textColor}
            />
          );
        })}
      </div>
    </section>
  );
}
