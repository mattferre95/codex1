"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetInstance, WidgetTemplate } from "@/lib/types";

interface Props {
  widget: WidgetInstance;
  template: WidgetTemplate;
  onRemove: () => void;
  onChange: (data: WidgetInstance["data"]) => void;
}

export function SortableWidget({ widget, template, onRemove, onChange }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as const;

  const [localData, setLocalData] = useState(widget.data);

  useEffect(() => {
    setLocalData(widget.data);
  }, [widget.data]);

  const handleFieldChange = (key: string, value: string) => {
    const newData = { ...localData, [key]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const inlineEditor = useMemo(
    () =>
      template.fields.map((field) => (
        <label key={field.key} className="block text-sm text-slate-700">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {field.label}
          </span>
          {field.type === "textarea" ? (
            <textarea
              value={localData[field.key] ?? ""}
              placeholder={field.placeholder}
              onChange={(event) => handleFieldChange(field.key, event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-sm focus:border-brand focus:outline-none"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={localData[field.key] ?? ""}
              placeholder={field.placeholder}
              onChange={(event) => handleFieldChange(field.key, event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-sm focus:border-brand focus:outline-none"
            />
          )}
        </label>
      )),
    [localData, template.fields],
  );

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <button
            type="button"
            className="cursor-grab rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs"
            {...listeners}
            {...attributes}
          >
            Drag
          </button>
          <span>{template.title}</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-medium text-rose-500 hover:text-rose-600"
        >
          Remove
        </button>
      </div>
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="space-y-3">{inlineEditor}</div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <WidgetRenderer widget={widget} template={template} />
        </div>
      </div>
    </div>
  );
}
