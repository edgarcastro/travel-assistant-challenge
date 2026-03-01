jest.mock("../data/createData");
jest.mock("../utils/getUser");

import { handler } from "../handlers/createHandler";
import { createData } from "../data/createData";
import { getUser } from "../utils/getUser";

const mockCreateData = createData as jest.Mock;
const mockGetUser = getUser as jest.Mock;

const mockItem = {
  id: "CO#Bogota",
  userId: "user@example.com",
  countryCode: "CO",
  city: "Bogota",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("createHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockReturnValue("user@example.com");
  });

  it("returns 201 with created item for valid payload", async () => {
    mockCreateData.mockResolvedValue(mockItem);
    const event = {
      body: JSON.stringify({ countryCode: "CO", city: "Bogota" }),
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body)).toMatchObject({ city: "Bogota", countryCode: "CO" });
  });

  it("returns 201 with optional priority and notes", async () => {
    mockCreateData.mockResolvedValue({ ...mockItem, priority: "high", notes: "Must visit" });
    const event = {
      body: JSON.stringify({
        countryCode: "CO",
        city: "Bogota",
        priority: "high",
        notes: "Must visit",
      }),
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(201);
  });

  it("returns 400 when countryCode is missing", async () => {
    const event = { body: JSON.stringify({ city: "Bogota" }), headers: {} };
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when city is missing", async () => {
    const event = { body: JSON.stringify({ countryCode: "CO" }), headers: {} };
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 for invalid priority value", async () => {
    const event = {
      body: JSON.stringify({ countryCode: "CO", city: "Bogota", priority: "critical" }),
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  it("returns 500 when data layer throws", async () => {
    mockCreateData.mockRejectedValue(new Error("DB error"));
    const event = {
      body: JSON.stringify({ countryCode: "CO", city: "Bogota" }),
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ message: "DB error" });
  });
});
