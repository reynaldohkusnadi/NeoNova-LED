import React from "react";
import { render, screen } from "@testing-library/react";
import NavbarMinimal from "./NavbarMinimal";
import { content } from "@/content/site";

describe("NavbarMinimal", () => {
  it("renders CTA labels from content", () => {
    const { container } = render(<NavbarMinimal />);
    expect(screen.getByText(content.form.ctaPrimary)).toBeInTheDocument();
    expect(screen.getByText(content.form.ctaSecondary)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});


