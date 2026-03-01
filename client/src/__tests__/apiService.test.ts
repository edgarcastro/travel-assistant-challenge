import { describe, it, expect, vi, beforeEach } from "vitest";
import { getItems, createItem, updateItem, deleteItem } from "../apiService";

vi.mock("aws-amplify/auth", () => ({
  fetchAuthSession: vi.fn().mockResolvedValue({
    tokens: { idToken: { toString: () => "mock-token" } },
  }),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const userId = "user@example.com";

const mockItem = {
  id: "CO#Bogota",
  userId,
  countryCode: "CO",
  city: "Bogota",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

describe("apiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getItems", () => {
    it("sends GET to /travels with Authorization header", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => [mockItem] });
      const result = await getItems(userId);
      expect(result).toEqual([mockItem]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/travels"),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: "Bearer mock-token" }),
        }),
      );
    });

    it("throws when response is not ok", async () => {
      mockFetch.mockResolvedValue({ ok: false, text: async () => "Unauthorized" });
      await expect(getItems(userId)).rejects.toThrow("Unauthorized");
    });
  });

  describe("createItem", () => {
    it("sends POST to /travels with body", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => mockItem });
      await createItem({ userId, countryCode: "CO", city: "Bogota" });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/travels"),
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("throws when response is not ok", async () => {
      mockFetch.mockResolvedValue({ ok: false, text: async () => "Bad Request" });
      await expect(createItem({ userId, countryCode: "CO", city: "Bogota" })).rejects.toThrow(
        "Bad Request",
      );
    });
  });

  describe("updateItem", () => {
    it("sends PUT to /travels/:id converting # to -", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => mockItem });
      await updateItem("CO#Bogota", userId, { priority: "high" });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/travels/CO-Bogota"),
        expect.objectContaining({ method: "PUT" }),
      );
    });

    it("throws when response is not ok", async () => {
      mockFetch.mockResolvedValue({ ok: false, text: async () => "Not Found" });
      await expect(updateItem("CO#Bogota", userId, { priority: "high" })).rejects.toThrow(
        "Not Found",
      );
    });
  });

  describe("deleteItem", () => {
    it("sends DELETE to /travels/:id converting # to -", async () => {
      mockFetch.mockResolvedValue({ ok: true });
      await deleteItem("CO#Bogota", userId);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/travels/CO-Bogota"),
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("throws when response is not ok", async () => {
      mockFetch.mockResolvedValue({ ok: false, text: async () => "Forbidden" });
      await expect(deleteItem("CO#Bogota", userId)).rejects.toThrow("Forbidden");
    });
  });
});
