import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { WidgetTemplate } from "@/lib/types";

export async function GET() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("widget_templates")
    .select("id,title,description,fields,accent")
    .order("title", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const templates = (data ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    fields: Array.isArray(item.fields) ? item.fields : [],
    accent: item.accent ?? undefined,
  })) as WidgetTemplate[];

  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const supabase = getServerSupabase();
  const template: Partial<WidgetTemplate> = {
    title: payload.title,
    description: payload.description,
    fields: payload.fields,
    accent: payload.accent,
  };

  if (!template.title || !Array.isArray(template.fields)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("widget_templates")
    .insert([{ ...template }])
    .select("id,title,description,fields,accent")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ template: data });
}
