"use client";

import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { HubTheme, WidgetInstance, WidgetTemplate } from "@/lib/types";

type BuilderState = {
  slug: string;
  title: string;
  description: string;
  theme: HubTheme;
  widgets: WidgetInstance[];
  templates: WidgetTemplate[];
  setTemplates: (templates: WidgetTemplate[]) => void;
  setMetadata: (data: Partial<Pick<BuilderState, "slug" | "title" | "description">>) => void;
  setTheme: (theme: Partial<HubTheme>) => void;
  addWidget: (template: WidgetTemplate) => void;
  updateWidget: (id: string, data: WidgetInstance["data"]) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  hydrate: (payload: {
    slug: string;
    title: string;
    description?: string;
    theme?: HubTheme;
    widgets: WidgetInstance[];
  }) => void;
};

const defaultTheme: HubTheme = {
  accentColor: "#6366f1",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
};

function createWidget(template: WidgetTemplate, order: number): WidgetInstance {
  const data: Record<string, string> = {};
  template.fields.forEach((field) => {
    data[field.key] = "";
  });
  return {
    id: uuid(),
    template_id: template.id,
    order_index: order,
    data,
  };
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  slug: "",
  title: "Untitled hub",
  description: "",
  theme: defaultTheme,
  widgets: [],
  templates: [],
  setTemplates: (templates) => set({ templates }),
  setMetadata: (data) => set(data),
  setTheme: (theme) => set({ theme: { ...get().theme, ...theme } }),
  addWidget: (template) =>
    set((state) => ({
      widgets: [
        ...state.widgets,
        createWidget(template, state.widgets.length),
      ],
    })),
  updateWidget: (id, data) =>
    set((state) => ({
      widgets: state.widgets.map((widget) =>
        widget.id === id ? { ...widget, data: { ...widget.data, ...data } } : widget,
      ),
    })),
  removeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets
        .filter((widget) => widget.id !== id)
        .map((widget, index) => ({ ...widget, order_index: index })),
    })),
  reorderWidgets: (startIndex, endIndex) => {
    const reordered = [...get().widgets];
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    set({
      widgets: reordered.map((widget, index) => ({
        ...widget,
        order_index: index,
      })),
    });
  },
  hydrate: ({ slug, title, description = "", theme, widgets }) =>
    set({
      slug,
      title,
      description,
      theme: theme ?? defaultTheme,
      widgets,
    }),
}));
