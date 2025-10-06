import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("hubs")
    .select(
      "id,slug,title,description,theme,widgets:widgets(id,template_id,order_index,data)"
    )
    .eq("slug", params.slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Hub not found" }, { status: 404 });
  }

  return NextResponse.json({ hub: data });
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const payload = await request.json();
  const supabase = getServerSupabase();

  if (!payload.slug || !payload.title) {
    return NextResponse.json({ error: "Missing slug or title" }, { status: 400 });
  }

  const { data: hubData, error: hubError } = await supabase
    .from("hubs")
    .upsert({
      slug: payload.slug,
      title: payload.title,
      description: payload.description,
      theme: payload.theme,
    })
    .select("id")
    .single();

  if (hubError || !hubData) {
    return NextResponse.json({ error: hubError?.message ?? "Failed to save hub" }, { status: 500 });
  }

  const widgets = Array.isArray(payload.widgets) ? payload.widgets : [];

  await supabase.from("widgets").delete().eq("hub_id", hubData.id);

  if (widgets.length > 0) {
    const formatted = widgets.map((widget: any, index: number) => ({
      hub_id: hubData.id,
      template_id: widget.template_id,
      order_index: index,
      data: widget.data,
    }));
    const { error: widgetError } = await supabase.from("widgets").insert(formatted);
    if (widgetError) {
      return NextResponse.json({ error: widgetError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
