import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

const useProfileMock = vi.fn();
vi.mock("../../../contexts/ProfileContext", () => ({
  useProfile: () => useProfileMock(),
}));
vi.mock("../../../contexts/NotificationContext", () => ({
  useNotifications: () => ({ unreadCount: 0 }),
}));

import NavigationBar from "../NavigationBar";

const renderNav = (route = "/") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <NavigationBar />
    </MemoryRouter>,
  );

describe("NavigationBar", () => {
  beforeEach(() => {
    useProfileMock.mockReturnValue({ profile: null });
  });

  it("renders the logo and primary nav links for anonymous visitors", () => {
    renderNav();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /jobs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  it("hides the about link for signed-in users", () => {
    useProfileMock.mockReturnValue({ profile: { role: "client" } });
    renderNav();
    expect(screen.queryByRole("link", { name: /^about$/i })).not.toBeInTheDocument();
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    renderNav();

    const toggle = screen.getByRole("button", { name: /open menu/i });
    await user.click(toggle);

    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /mobile navigation/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();
  });

  it("marks the active route", () => {
    renderNav("/services");
    const servicesLink = screen.getAllByRole("link", { name: /services/i })[0];
    expect(servicesLink).toHaveClass("bg-sky-100");
  });
});
