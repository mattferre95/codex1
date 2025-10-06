import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BuilderShell } from "@/components/builder/BuilderShell";
import { WidgetTemplate } from "@/lib/types";
import { useBuilderStore } from "@/state/useBuilderStore";

describe("BuilderShell integration", () => {
  const templates: WidgetTemplate[] = [
    {
      id: "text",
      title: "Text",
      description: "Simple text block",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "body", label: "Body", type: "textarea" },
      ],
    },
  ];

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    useBuilderStore.setState({
      slug: "",
      title: "Untitled hub",
      description: "",
      theme: {
        accentColor: "#6366f1",
        backgroundColor: "#ffffff",
        textColor: "#0f172a",
      },
      widgets: [],
      templates: [],
    });
  });

  it("allows adding widgets, editing values, and saving", async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<BuilderShell templates={templates} hub={null} />);
    });

    const addButton = await screen.findByRole("button", { name: /text/i });
    await user.click(addButton);

    const titleInput = screen.getByLabelText(/hub title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Team Central");

    const slugInput = screen.getByLabelText(/hub slug/i);
    await user.type(slugInput, "team-central");

    const headingInput = await screen.findByLabelText(/heading/i);
    await user.type(headingInput, "Announcements");

    await waitFor(() => {
      expect(screen.getAllByText("Announcements").length).toBeGreaterThan(0);
    });

    const saveButton = screen.getByRole("button", { name: /save hub/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/hubs/team-central",
        expect.objectContaining({
          method: "PUT",
        }),
      );
    });
  });
});
