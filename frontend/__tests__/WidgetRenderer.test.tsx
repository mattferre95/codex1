import { render, screen } from "@testing-library/react";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetInstance, WidgetTemplate } from "@/lib/types";

describe("WidgetRenderer", () => {
  const template: WidgetTemplate = {
    id: "text-block",
    title: "Text block",
    description: "Simple text",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "link", label: "Link", type: "link" },
    ],
  };

  const widget: WidgetInstance = {
    id: "widget-1",
    template_id: "text-block",
    order_index: 0,
    data: {
      heading: "Hello",
      body: "Welcome to the hub",
      link: "https://example.com",
    },
  };

  it("renders text and links according to the template", () => {
    render(
      <WidgetRenderer
        widget={widget}
        template={template}
        accentColor="#000"
        textColor="#111"
      />,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Welcome to the hub")).toBeInTheDocument();
    const anchor = screen.getByRole("link", { name: "https://example.com" });
    expect(anchor).toHaveAttribute("href", "https://example.com");
  });

  it("omits empty fields", () => {
    const emptyWidget = { ...widget, data: { heading: "", body: "", link: "" } };
    render(<WidgetRenderer widget={emptyWidget} template={template} />);
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  });
});
