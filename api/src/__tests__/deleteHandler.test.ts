jest.mock("../data/deleteData");
jest.mock("../utils/getUser");

import { handler } from "../handlers/deleteHandler";
import { deleteData } from "../data/deleteData";
import { getUser } from "../utils/getUser";

const mockDeleteData = deleteData as jest.Mock;
const mockGetUser = getUser as jest.Mock;

describe("deleteHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockReturnValue("user@example.com");
  });

  it("returns 204 on successful deletion", async () => {
    mockDeleteData.mockResolvedValue(undefined);
    const event = {
      pathParameters: { id: "CO-Bogota" },
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(204);
    expect(res.body).toBe("");
  });

  it("converts URL id from - to # before calling deleteData", async () => {
    mockDeleteData.mockResolvedValue(undefined);
    const event = {
      pathParameters: { id: "CO-Bogota" },
      headers: {},
    };
    await handler(event);
    expect(mockDeleteData).toHaveBeenCalledWith("user@example.com", "CO#Bogota");
  });

  it("returns 500 when data layer throws", async () => {
    mockDeleteData.mockRejectedValue(new Error("DB error"));
    const event = {
      pathParameters: { id: "CO-Bogota" },
      headers: {},
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ message: "DB error" });
  });
});
