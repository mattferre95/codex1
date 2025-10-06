"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { WidgetTemplate } from "@/lib/types";

type TemplateFormValues = {
  title: string;
  description: string;
  accent?: string;
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "textarea" | "link" | "image";
    placeholder?: string;
  }>;
};

type Props = {
  templates: WidgetTemplate[];
};

export function AdminTemplates({ templates: initialTemplates }: Props) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<WidgetTemplate | null>(
    initialTemplates[0] ?? null,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { register, control, handleSubmit, reset } = useForm<TemplateFormValues>({
    defaultValues: {
      title: "",
      description: "",
      accent: "#6366f1",
      fields: [],
    },
  });

  useEffect(() => {
    if (selectedTemplate) {
      reset({
        title: selectedTemplate.title,
        description: selectedTemplate.description,
        accent: selectedTemplate.accent ?? "#6366f1",
        fields: selectedTemplate.fields,
      });
    } else {
      reset({
        title: "",
        description: "",
        accent: "#6366f1",
        fields: [],
      });
    }
  }, [reset, selectedTemplate]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const onSubmit = async (values: TemplateFormValues) => {
    const payload = {
      ...values,
      fields: values.fields.map((field) => ({
        key: field.key,
        label: field.label,
        type: field.type,
        placeholder: field.placeholder,
      })),
    };
    try {
      const response = await fetch(
        selectedTemplate ? `/api/templates/${selectedTemplate.id}` : "/api/templates",
        {
          method: selectedTemplate ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to save template");
      }
      const updatedTemplate = result.template as WidgetTemplate;
      setTemplates((prev) => {
        const without = prev.filter((template) => template.id !== updatedTemplate.id);
        return [...without, updatedTemplate];
      });
      setStatusMessage("Template saved");
      setSelectedTemplate(updatedTemplate);
    } catch (error: unknown) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to save");
    }
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    reset({
      title: "",
      description: "",
      accent: "#6366f1",
      fields: [],
    });
  };

  const handleSelectTemplate = (template: WidgetTemplate) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[220px,1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Templates</h2>
          <button
            type="button"
            onClick={handleCreateNew}
            className="text-xs font-medium text-brand"
          >
            New
          </button>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {templates.map((template) => (
            <li key={template.id}>
              <button
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className={`w-full rounded-lg px-3 py-2 text-left transition ${
                  selectedTemplate?.id === template.id
                    ? "bg-brand/10 text-brand"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {template.title}
              </button>
            </li>
          ))}
          {templates.length === 0 && (
            <li className="text-xs text-slate-500">No templates yet.</li>
          )}
        </ul>
      </aside>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title
              </span>
              <input
                {...register("title", { required: true })}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:border-brand focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Accent
              </span>
              <input
                type="color"
                {...register("accent")}
                className="mt-1 h-10 w-full cursor-pointer rounded border border-slate-200"
              />
            </label>
          </div>
          <label className="text-sm text-slate-600">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </span>
            <textarea
              {...register("description")}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:border-brand focus:outline-none"
              rows={3}
            />
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Fields</h3>
              <button
                type="button"
                onClick={() =>
                  append({ key: `field_${fields.length + 1}`, label: "New field", type: "text" })
                }
                className="text-xs font-medium text-brand"
              >
                Add field
              </button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-4">
                <input
                  {...register(`fields.${index}.key` as const)}
                  placeholder="Key"
                  className="rounded-lg border border-slate-200 p-2 text-sm"
                />
                <input
                  {...register(`fields.${index}.label` as const)}
                  placeholder="Label"
                  className="rounded-lg border border-slate-200 p-2 text-sm"
                />
                <select
                  {...register(`fields.${index}.type` as const)}
                  className="rounded-lg border border-slate-200 p-2 text-sm"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Paragraph</option>
                  <option value="link">Link</option>
                  <option value="image">Image</option>
                </select>
                <div className="flex items-center gap-2">
                  <input
                    {...register(`fields.${index}.placeholder` as const)}
                    placeholder="Placeholder"
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-rose-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-xs text-slate-500">No fields yet. Add at least one.</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow"
            >
              {selectedTemplate ? "Update template" : "Create template"}
            </button>
            {statusMessage && <span className="text-xs text-slate-500">{statusMessage}</span>}
          </div>
        </form>
      </section>
    </div>
  );
}
