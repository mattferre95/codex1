import { BuilderShell } from "@/components/builder/BuilderShell";
import { getServerSupabase } from "@/lib/supabase/server";
import { WidgetTemplate } from "@/lib/types";

type BuilderPageProps = {
  searchParams?: Record<string, string | string[]>;
};

async function loadTemplates(): Promise<WidgetTemplate[]> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("widget_templates")
    .select("id,title,description,fields,accent")
    .order("title", { ascending: true });
  if (error) {
    console.error("Failed to fetch templates", error.message);
    return [];
  }
  return (data ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    fields: Array.isArray(item.fields) ? item.fields : [],
    accent: item.accent ?? undefined,
  }));
}

async function loadHub(slug?: string) {
  if (!slug) return null;
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("hubs")
    .select(
      "id,slug,title,description,theme,widgets:widgets(id,template_id,order_index,data)"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch hub", error.message);
    return null;
  }
  if (!data) return null;
  return {
    slug: data.slug,
    title: data.title,
    description: data.description ?? "",
    theme: data.theme ?? {},
    widgets: (data.widgets ?? []).map((widget: any) => ({
      id: widget.id,
      template_id: widget.template_id,
      order_index: widget.order_index ?? 0,
      data: widget.data ?? {},
    })),
  };
}

export default async function BuilderPage({ searchParams }: BuilderPageProps) {
  const slugParam = typeof searchParams?.hub === "string" ? searchParams.hub : undefined;
  const [templates, hub] = await Promise.all([loadTemplates(), loadHub(slugParam)]);

  return <BuilderShell templates={templates} hub={hub} />;
}
