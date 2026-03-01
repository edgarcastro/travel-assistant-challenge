import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TravelList from "../components/TravelList";
import type { TravelEntry } from "../apiService";

vi.mock("../fixtures/destinations.json", () => ({
  default: [{ code: "BOG", name: "Bogotá", weatherCode: 0, description: "Capital of Colombia" }],
}));

vi.mock("../components/WeatherBadge", () => ({
  default: () => <span>WeatherBadge</span>,
}));

vi.mock("../components/TravelItemSkeleton", () => ({
  default: () => <div data-testid="skeleton" />,
}));

const mockItem: TravelEntry = {
  id: "CO#BOG",
  userId: "user@example.com",
  countryCode: "CO",
  city: "BOG",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

describe("TravelList", () => {
  it("renders 3 skeletons when loading is true", () => {
    render(<TravelList items={[]} onEdit={vi.fn()} onDelete={vi.fn()} loading />);
    expect(screen.getAllByTestId("skeleton")).toHaveLength(3);
  });

  it("does not render items while loading", () => {
    render(<TravelList items={[mockItem]} onEdit={vi.fn()} onDelete={vi.fn()} loading />);
    expect(screen.queryByText("Bogotá")).toBeNull();
  });

  it("renders empty message when items array is empty", () => {
    render(<TravelList items={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/Aún no hay destinos/)).toBeTruthy();
  });

  it("renders the destination name from fixtures", () => {
    render(<TravelList items={[mockItem]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Bogotá")).toBeTruthy();
  });

  it("renders priority chip when item has priority", () => {
    const item = { ...mockItem, priority: "high" as const };
    render(<TravelList items={[item]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Alta")).toBeTruthy();
  });

  it("renders notes when item has notes", () => {
    const item = { ...mockItem, notes: "Must visit in December" };
    render(<TravelList items={[item]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Must visit in December")).toBeTruthy();
  });

  it("calls onEdit with the item when edit button is clicked", async () => {
    const onEdit = vi.fn();
    render(<TravelList items={[mockItem]} onEdit={onEdit} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByLabelText("Editar"));
    expect(onEdit).toHaveBeenCalledWith(mockItem);
  });

  it("calls onDelete with the item when delete button is clicked", async () => {
    const onDelete = vi.fn();
    render(<TravelList items={[mockItem]} onEdit={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByLabelText("Eliminar"));
    expect(onDelete).toHaveBeenCalledWith(mockItem);
  });
});
