import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SlideOverForm from "./SlideOverForm";

describe("SlideOverForm", () => {
  it("opens via custom event and submits successfully", async () => {
    render(<SlideOverForm />);
    // dispatch open event
    window.dispatchEvent(new CustomEvent("nn:openSlideOver"));
    // focus should move to first field
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveFocus();
    });

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText("Work Email"), {
      target: { value: "jane@company.com" },
    });
    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "ACME" } });

    fireEvent.click(screen.getByRole("button", { name: /request demo/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });
});


