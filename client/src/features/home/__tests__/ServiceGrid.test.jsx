import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import ServiceGrid from "../ServiceGrid";

describe("ServiceGrid", () => {
  it("renders the section heading and subtitle", () => {
    render(
      <MemoryRouter>
        <ServiceGrid />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /everything you need to land well/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/one platform for the entire move/i)).toBeInTheDocument();
  });

  it("renders all four service cards", () => {
    render(
      <MemoryRouter>
        <ServiceGrid />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /visa & blue card/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /executive job matching/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /housing search/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /language & integration/i }),
    ).toBeInTheDocument();
  });

  it("links every card to the services page", () => {
    render(
      <MemoryRouter>
        <ServiceGrid />
      </MemoryRouter>,
    );
    const links = screen.getAllByRole("link", { name: /learn more/i });
    expect(links).toHaveLength(4);
    links.forEach((link) => expect(link).toHaveAttribute("href", "/services"));
  });
});
