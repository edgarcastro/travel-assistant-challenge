jest.mock("../data/readData");
jest.mock("../utils/getUser");

import { handler } from "../handlers/readHandler";
import { readData } from "../data/readData";
import { getUser } from "../utils/getUser";

const mockReadData = readData as jest.Mock;
const mockGetUser = getUser as jest.Mock;

describe("readHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockReturnValue("user@example.com");
  });

  it("returns 200 with items array", async () => {
    const items = [
      {
        id: "CO#Bogota",
        userId: "user@example.com",
        countryCode: "CO",
        city: "Bogota",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];
    mockReadData.mockResolvedValue(items);
    const res = await handler({ headers: {} });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual(items);
  });

  it("returns 200 with empty array when no items", async () => {
    mockReadData.mockResolvedValue([]);
    const res = await handler({ headers: {} });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([]);
  });

  it("calls readData with the userId from getUser", async () => {
    mockReadData.mockResolvedValue([]);
    await handler({ headers: {} });
    expect(mockReadData).toHaveBeenCalledWith("user@example.com");
  });

  it("returns 500 when data layer throws", async () => {
    mockReadData.mockRejectedValue(new Error("DB error"));
    const res = await handler({ headers: {} });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ message: "DB error" });
  });
});
