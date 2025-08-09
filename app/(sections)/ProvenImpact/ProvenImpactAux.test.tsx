import React from "react";
import { render, screen } from "@testing-library/react";
import ProvenImpactAux from "./ProvenImpactAux";

const auxCard = {
  id: "impact",
  headline: "Proven impact",
  blurbShort: "Demonstrated results across clients.",
  ctaLabel: "Learn more",
};

describe("ProvenImpactAux", () => {
  it("renders nothing when card is absent", () => {
    const { container } = render(<ProvenImpactAux />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders intro mode when card is present", () => {
    render(<ProvenImpactAux card={auxCard} mode="intro" />);
    expect(screen.getByText(auxCard.headline)).toBeInTheDocument();
    expect(screen.getByText(auxCard.blurbShort)).toBeInTheDocument();
  });

  it("renders carousel-card article when chosen", () => {
    render(<ProvenImpactAux card={auxCard} mode="carousel-card" />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});
