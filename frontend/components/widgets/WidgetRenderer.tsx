"use client";

import { WidgetInstance, WidgetTemplate } from "@/lib/types";

type Props = {
  widget: WidgetInstance;
  template: WidgetTemplate;
  accentColor?: string;
  textColor?: string;
};

const fieldClass = "mt-1 text-sm leading-relaxed";

export function WidgetRenderer({ widget, template, accentColor, textColor }: Props) {
  const styles = {
    color: textColor,
  } as const;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" style={styles}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900" style={{ color: textColor }}>
          {template.title}
        </h3>
        {template.accent && (
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor ?? template.accent }} />
        )}
      </div>
      <div className="mt-2 space-y-2 text-slate-600" style={styles}>
        {template.fields.map((field) => {
          const value = widget.data[field.key];
          if (!value) return null;

          if (field.type === "link") {
            return (
              <p key={field.key} className={fieldClass}>
                <a
                  href={value}
                  className="font-medium text-brand underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {value}
                </a>
              </p>
            );
          }

          if (field.type === "image") {
            return (
              <div key={field.key} className="mt-4 overflow-hidden rounded-xl border border-slate-100">
                <img src={value} alt={template.title} className="h-40 w-full object-cover" />
              </div>
            );
          }

          const Element = field.type === "textarea" ? "p" : "p";

          return (
            <Element key={field.key} className={fieldClass}>
              {value}
            </Element>
          );
        })}
      </div>
    </div>
  );
}
