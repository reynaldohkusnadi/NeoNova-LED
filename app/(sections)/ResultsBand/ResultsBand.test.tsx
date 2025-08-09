import React from "react";
import { render, screen } from "@testing-library/react";
import ResultsBand from "./ResultsBand";
import { content } from "@/content/site";

describe("ResultsBand", () => {
  it("renders exactly 2 stats with values and labels", () => {
    render(<ResultsBand stats={content.stats} />);
    const region = screen.getByRole("region", { name: /key results/i });
    expect(region).toBeInTheDocument();
    expect(screen.getByText(content.stats[0].value)).toBeInTheDocument();
    expect(screen.getByText(content.stats[0].label)).toBeInTheDocument();
    expect(screen.getByText(content.stats[1].value)).toBeInTheDocument();
    expect(screen.getByText(content.stats[1].label)).toBeInTheDocument();
  });
});
