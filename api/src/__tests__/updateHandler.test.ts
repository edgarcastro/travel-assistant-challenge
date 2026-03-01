jest.mock("../data/updateData");
jest.mock("../utils/getUser");

import { handler } from "../handlers/updateHandler";
import { updateData } from "../data/updateData";
import { getUser } from "../utils/getUser";

const mockUpdateData = updateData as jest.Mock;
const mockGetUser = getUser as jest.Mock;

const mockUpdatedItem = {
  id: "CO#Bogota",
  userId: "user@example.com",
  countryCode: "CO",
  city: "Bogota",
  priority: "high",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-02",
};

describe("updateHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockReturnValue("user@example.com");
  });

  it("returns 200 with updated item", async () => {
    mockUpdateData.mockResolvedValue(mockUpdatedItem);
    const event = {
      pathParameters: { id: "CO-Bogota" },
      body: JSON.stringify({ priority: "high" }),
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({ priority: "high" });
  });

  it("converts URL id from - to # before calling updateData", async () => {
    mockUpdateData.mockResolvedValue(mockUpdatedItem);
    const event = {
      pathParameters: { id: "CO-Bogota" },
      body: JSON.stringify({ priority: "high" }),
      headers: {},
    };
    await handler(event);
    expect(mockUpdateData).toHaveBeenCalledWith(
      "user@example.com",
      "CO#Bogota",
      expect.any(Object),
    );
  });

  it("returns 400 when neither priority nor notes provided", async () => {
    const event = {
      pathParameters: { id: "CO-Bogota" },
      body: JSON.stringify({}),
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  it("returns 200 when only notes is provided", async () => {
    mockUpdateData.mockResolvedValue({ ...mockUpdatedItem, notes: "Updated" });
    const event = {
      pathParameters: { id: "CO-Bogota" },
      body: JSON.stringify({ notes: "Updated" }),
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
  });

  it("returns 500 when data layer throws", async () => {
    mockUpdateData.mockRejectedValue(new Error("DB error"));
    const event = {
      pathParameters: { id: "CO-Bogota" },
      body: JSON.stringify({ notes: "Updated" }),
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ message: "DB error" });
  });
});
