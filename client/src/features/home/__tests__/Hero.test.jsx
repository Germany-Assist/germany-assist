import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Hero from "../Hero";

const renderHero = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>,
  );

describe("Hero", () => {
  it("renders the main headline and subcopy", () => {
    renderHero();
    expect(
      screen.getByRole("heading", { level: 1, name: /relocate to germany/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/verified specialists handle every step/i)).toBeInTheDocument();
  });

  it("renders both calls to action with correct destinations", () => {
    renderHero();
    expect(screen.getByRole("link", { name: /explore services/i })).toHaveAttribute(
      "href",
      "/services",
    );
    expect(screen.getByRole("link", { name: /get started free/i })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("renders the trust stats", () => {
    renderHero();
    expect(screen.getByText("2,400+")).toBeInTheDocument();
    expect(screen.getByText("98%")).toBeInTheDocument();
    expect(screen.getByText("120+")).toBeInTheDocument();
  });
});
