import React from "react";
import { render, screen, within } from "@testing-library/react";
import CardCarousel from "./CardCarousel";
import { content } from "@/content/site";

describe("CardCarousel", () => {
  it("renders exactly 3 cards in order from content", () => {
    render(<CardCarousel cards={content.cardsCore} />);
    const grid = screen.getByRole("region", { name: /highlights/i });
    const articles = within(grid).getAllByRole("article");
    expect(articles).toHaveLength(3);
    expect(articles[0]).toHaveTextContent(content.cardsCore[0].headline);
    expect(articles[1]).toHaveTextContent(content.cardsCore[1].headline);
    expect(articles[2]).toHaveTextContent(content.cardsCore[2].headline);
  });
});


