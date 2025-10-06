"use client";

import { useEffect, useState } from "react";
import { WidgetTemplate } from "@/lib/types";
import { useBuilderStore } from "@/state/useBuilderStore";
import { BuilderCanvas } from "./BuilderCanvas";
import { PreviewPane } from "./PreviewPane";
import { ThemeControls } from "./ThemeControls";
import { WidgetPalette } from "./WidgetPalette";

interface BuilderShellProps {
  templates: WidgetTemplate[];
  hub?: {
    slug: string;
    title: string;
    description?: string;
    theme: Record<string, string>;
    widgets: Array<{
      id: string;
      template_id: string;
      order_index: number;
      data: Record<string, string>;
    }>;
  } | null;
}

export function BuilderShell({ templates, hub }: BuilderShellProps) {
  const setTemplates = useBuilderStore((state) => state.setTemplates);
  const hydrate = useBuilderStore((state) => state.hydrate);
  const theme = useBuilderStore((state) => state.theme);
  const widgets = useBuilderStore((state) => state.widgets);
  const slug = useBuilderStore((state) => state.slug);
  const title = useBuilderStore((state) => state.title);
  const description = useBuilderStore((state) => state.description);
  const setMetadata = useBuilderStore((state) => state.setMetadata);
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<string | null>(null);

  useEffect(() => {
    setTemplates(templates);
  }, [templates, setTemplates]);

  useEffect(() => {
    if (hub) {
      hydrate({
        slug: hub.slug,
        title: hub.title,
        description: hub.description,
        theme: hub.theme,
        widgets: hub.widgets.sort((a, b) => a.order_index - b.order_index),
      });
    } else {
      hydrate({ slug: "", title: "Untitled hub", description: "", theme: undefined, widgets: [] });
    }
  }, [hydrate, hub]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveState(null);
    try {
      const safeSlug = slug || "draft";
      const response = await fetch(`/api/hubs/${safeSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: safeSlug,
          title,
          description,
          theme,
          widgets,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to save hub");
      }
      setSaveState("Saved");
    } catch (error: unknown) {
      setSaveState(error instanceof Error ? error.message : "Save failed");
    } finally {
      setIsSaving(false);
      window.setTimeout(() => setSaveState(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Hub title
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setMetadata({ title: event.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm focus:border-brand focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setMetadata({ description: event.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm focus:border-brand focus:outline-none"
              rows={3}
            />
          </label>
        </div>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Hub slug
            </span>
            <input
              type="text"
              value={slug}
              placeholder="e.g. team-home"
              onChange={(event) =>
                setMetadata({ slug: event.target.value.replace(/\s+/g, "-").toLowerCase() })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm focus:border-brand focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || widgets.length === 0}
            className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSaving ? "Saving..." : "Save hub"}
          </button>
          {saveState && (
            <p className="text-xs text-slate-500">{saveState}</p>
          )}
        </div>
      </section>

      <ThemeControls />

      <div className="grid gap-6 lg:grid-cols-[280px,1fr,320px]">
        <WidgetPalette />
        <BuilderCanvas />
        <PreviewPane />
      </div>
    </div>
  );
}
