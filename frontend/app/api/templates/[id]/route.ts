import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  const supabase = getServerSupabase();
  const { error, data } = await supabase
    .from("widget_templates")
    .update({
      title: payload.title,
      description: payload.description,
      fields: payload.fields,
      accent: payload.accent,
    })
    .eq("id", params.id)
    .select("id,title,description,fields,accent")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ template: data });
}
