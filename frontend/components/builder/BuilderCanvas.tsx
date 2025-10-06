"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetInstance } from "@/lib/types";
import { useBuilderStore } from "@/state/useBuilderStore";
import { SortableWidget } from "./SortableWidget";

export function BuilderCanvas() {
  const widgets = useBuilderStore((state) => state.widgets);
  const templates = useBuilderStore((state) => state.templates);
  const reorderWidgets = useBuilderStore((state) => state.reorderWidgets);
  const removeWidget = useBuilderStore((state) => state.removeWidget);
  const updateWidget = useBuilderStore((state) => state.updateWidget);
  const theme = useBuilderStore((state) => state.theme);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((item) => item.id === active.id);
    const newIndex = widgets.findIndex((item) => item.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderWidgets(oldIndex, newIndex);
    }
  };

  const activeWidget = widgets.find((widget) => widget.id === activeId) ?? null;
  const activeTemplate = templates.find(
    (template) => template.id === activeWidget?.template_id,
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={widgets.map((widget) => widget.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {widgets.map((widget: WidgetInstance) => {
            const template = templates.find((item) => item.id === widget.template_id);
            if (!template) return null;
            return (
              <SortableWidget
                key={widget.id}
                widget={widget}
                template={template}
                onRemove={() => removeWidget(widget.id)}
                onChange={(data) => updateWidget(widget.id, data)}
              />
            );
          })}
          {widgets.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Add widgets from the library to get started.
            </div>
          )}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeWidget && activeTemplate && (
          <WidgetRenderer
            widget={activeWidget}
            template={activeTemplate}
            accentColor={theme.accentColor}
            textColor={theme.textColor}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
