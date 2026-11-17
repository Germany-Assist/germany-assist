import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import FooterSection from "../FooterSection";

describe("FooterSection", () => {
  it("renders the link columns with real routes", () => {
    render(
      <MemoryRouter>
        <FooterSection />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /about us/i })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /^services$/i })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: /jobs/i })).toHaveAttribute("href", "/jobs");
  });

  it("renders social links with accessible names", () => {
    render(
      <MemoryRouter>
        <FooterSection />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /instagram/i })).toBeInTheDocument();
  });

  it("renders the copyright line", () => {
    render(
      <MemoryRouter>
        <FooterSection />
      </MemoryRouter>,
    );
    expect(screen.getByText(/© \d{4} Germany Assist/)).toBeInTheDocument();
  });
});
