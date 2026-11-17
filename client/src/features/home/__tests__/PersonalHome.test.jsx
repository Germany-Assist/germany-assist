import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

const profileState = { profile: null };
vi.mock("../../../contexts/ProfileContext", () => ({
  useProfile: () => profileState,
}));

vi.mock("../../../api/clientUserApis", () => ({
  fetchClientOrders: vi.fn().mockResolvedValue({ data: [] }),
  fetchUserChats: vi.fn().mockResolvedValue({ chats: [] }),
}));
vi.mock("../../../api/notificationaApi", () => ({
  getNotifications: vi.fn().mockResolvedValue({ notifications: [] }),
}));
vi.mock("../../../api/serviceProviderApis", () => ({
  getAllServices: vi.fn().mockResolvedValue({ data: [] }),
  serviceProviderGetAllOrders: vi.fn().mockResolvedValue({ data: [], meta: { total: 0 } }),
  serviceProviderFinanceInit: vi.fn().mockResolvedValue({ data: null }),
}));
vi.mock("../../../api/adminApis", () => ({
  getAllUsers: vi.fn().mockResolvedValue([]),
  getAllRequests: vi.fn().mockResolvedValue({ data: [] }),
  getAllServicesStatistical: vi.fn().mockResolvedValue({ data: {} }),
  getAllFinanceStatistical: vi.fn().mockResolvedValue({ data: {} }),
}));

import PersonalHome from "../PersonalHome";

const renderHome = () =>
  render(
    <MemoryRouter>
      <PersonalHome />
    </MemoryRouter>,
  );

describe("PersonalHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("greets a client by first name and shows client panels", async () => {
    profileState.profile = {
      role: "client",
      firstName: "Jane",
      lastName: "Doe",
      favorites: [],
      unReadNotifications: 0,
    };
    renderHome();

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /, Jane/i })).toBeInTheDocument(),
    );
    expect(screen.getByText(/Client$/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^orders$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /coming events/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^notifications$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^favorites$/i })).toBeInTheDocument();
  });

  it("shows provider panels for a service provider", async () => {
    profileState.profile = {
      role: "service_provider_root",
      firstName: "Max",
      lastName: "Muster",
      unReadNotifications: 0,
    };
    renderHome();

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /, Max/i })).toBeInTheDocument(),
    );
    expect(screen.getByRole("heading", { name: /my services/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /incoming orders/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^finance$/i })).toBeInTheDocument();
  });

  it("shows admin platform panels for an admin", async () => {
    profileState.profile = {
      role: "admin",
      firstName: "Ada",
      lastName: "Admin",
      unReadNotifications: 0,
    };
    renderHome();

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /, Ada/i })).toBeInTheDocument(),
    );
    expect(screen.getByRole("heading", { name: /^platform$/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /^orders$/i })).not.toBeInTheDocument();
  });

  it("renders empty states instead of crashing when there is no data", async () => {
    profileState.profile = {
      role: "client",
      firstName: "Nina",
      lastName: "N",
      favorites: [],
      unReadNotifications: 0,
    };
    renderHome();

    await waitFor(() =>
      expect(screen.getByText(/no orders yet/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/no upcoming events/i)).toBeInTheDocument();
    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
  });
});
