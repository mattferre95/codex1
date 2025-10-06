import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">
          Build collaborative hubs in minutes.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          HubForge lets your team assemble shareable hub pages using a
          real-time drag-and-drop editor backed by Supabase.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/builder"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow"
          >
            Open Builder
          </Link>
          <Link
            href="/u/demo"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            View Demo Hub
          </Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Drag & drop",
            description:
              "Assemble widgets in a simple vertical stack with a live preview.",
          },
          {
            title: "Real-time",
            description:
              "State updates instantly across the canvas and preview panes.",
          },
          {
            title: "Supabase powered",
            description:
              "Persist hubs, widgets, and templates using Supabase tables.",
          },
        ].map((feature) => (
          <div key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
