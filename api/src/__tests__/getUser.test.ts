import { getUser } from "../utils/getUser";

describe("getUser", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("offline mode (IS_OFFLINE=true)", () => {
    beforeEach(() => {
      process.env.IS_OFFLINE = "true";
    });

    it("returns userId from x-user-id header", () => {
      const event = { headers: { "x-user-id": "user@example.com" } };
      expect(getUser(event)).toBe("user@example.com");
    });

    it("returns userId from X-User-Id header (capitalized)", () => {
      const event = { headers: { "X-User-Id": "user@example.com" } };
      expect(getUser(event)).toBe("user@example.com");
    });

    it("throws when x-user-id header is missing", () => {
      expect(() => getUser({ headers: {} })).toThrow("Missing x-user-id header");
    });

    it("throws when headers is undefined", () => {
      expect(() => getUser({})).toThrow("Missing x-user-id header");
    });
  });

  describe("production mode", () => {
    it("returns email from JWT claims", () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { email: "user@example.com" } } },
        },
      };
      expect(getUser(event)).toBe("user@example.com");
    });

    it("throws when JWT claims are missing", () => {
      expect(() => getUser({ requestContext: {} })).toThrow("Unauthorized");
    });

    it("throws when requestContext is missing", () => {
      expect(() => getUser({})).toThrow("Unauthorized");
    });
  });
});
