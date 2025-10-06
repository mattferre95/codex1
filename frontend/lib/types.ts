export type WidgetFieldType = "text" | "textarea" | "link" | "image";

export interface WidgetTemplateField {
  key: string;
  label: string;
  type: WidgetFieldType;
  placeholder?: string;
}

export interface WidgetTemplate {
  id: string;
  title: string;
  description: string;
  fields: WidgetTemplateField[];
  accent?: string;
}

export interface WidgetInstance {
  id: string;
  template_id: string;
  order_index: number;
  data: Record<string, string>;
}

export interface HubTheme {
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface Hub {
  id: string;
  slug: string;
  title: string;
  description?: string;
  theme: HubTheme;
  widgets: WidgetInstance[];
}
