import { AdminTemplates } from "@/components/admin/AdminTemplates";
import { getServerSupabase } from "@/lib/supabase/server";

async function loadTemplates() {
  const supabase = getServerSupabase();
  const { data } = await supabase
    .from("widget_templates")
    .select("id,title,description,fields,accent")
    .order("title", { ascending: true });
  return (data ?? []).map((template: any) => ({
    id: template.id,
    title: template.title,
    description: template.description,
    accent: template.accent ?? undefined,
    fields: Array.isArray(template.fields) ? template.fields : [],
  }));
}

export default async function AdminPage() {
  const templates = await loadTemplates();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Widget templates</h1>
        <p className="text-sm text-slate-600">
          Manage the building blocks that teams can use in the hub builder.
        </p>
      </div>
      <AdminTemplates templates={templates} />
    </div>
  );
}
