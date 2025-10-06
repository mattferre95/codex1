import { notFound } from "next/navigation";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { getServerSupabase } from "@/lib/supabase/server";

async function loadHub(slug: string) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("hubs")
    .select(
      "id,slug,title,description,theme,widgets:widgets(id,template_id,order_index,data)"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error(error.message);
    return null;
  }
  if (!data) return null;
  const templatesResponse = await supabase
    .from("widget_templates")
    .select("id,title,description,fields,accent");
  const templates = (templatesResponse.data ?? []).map((template: any) => ({
    id: template.id,
    title: template.title,
    description: template.description,
    fields: Array.isArray(template.fields) ? template.fields : [],
    accent: template.accent ?? undefined,
  }));

  return {
    hub: {
      slug: data.slug,
      title: data.title,
      description: data.description ?? "",
      theme: data.theme ?? {},
      widgets: (data.widgets ?? []).sort((a: any, b: any) =>
        (a.order_index ?? 0) - (b.order_index ?? 0),
      ),
    },
    templates,
  };
}

export default async function HubViewerPage({ params }: { params: { hubSlug: string } }) {
  const payload = await loadHub(params.hubSlug);
  if (!payload) {
    notFound();
  }

  const { hub, templates } = payload;

  return (
    <div
      className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      style={{ background: hub.theme?.backgroundColor }}
    >
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold" style={{ color: hub.theme?.textColor }}>
          {hub.title}
        </h1>
        {hub.description && (
          <p className="text-sm" style={{ color: hub.theme?.textColor }}>
            {hub.description}
          </p>
        )}
      </header>
      <div className="space-y-4">
        {hub.widgets.map((widget: any) => {
          const template = templates.find((item) => item.id === widget.template_id);
          if (!template) return null;
          return (
            <WidgetRenderer
              key={widget.id}
              widget={widget}
              template={template}
              accentColor={hub.theme?.accentColor}
              textColor={hub.theme?.textColor}
            />
          );
        })}
        {hub.widgets.length === 0 && (
          <p className="text-sm text-slate-500">This hub is empty.</p>
        )}
      </div>
    </div>
  );
}
