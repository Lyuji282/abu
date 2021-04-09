import parser from "@kdcio/api-gw-req";
import response from "@kdcio/api-gw-resp";
import { makeFakeEvent } from "helper";
import makePatch from "../../../src/controller/patch";

let patch = null;
describe("Admin Patch Content", () => {
  beforeAll(() => {
    patch = makePatch({ patch: () => {}, parser, response });
  });

  it("should throw unauthrozied", async () => {
    expect.assertions(1);
    try {
      await patch({
        event: {
          requestContext: {},
        },
      });
    } catch (error) {
      expect(error.message).toBe("Unauthorized");
    }
  });

  it("should throw forbidden for invalid group", async () => {
    expect.assertions(1);
    try {
      const event = makeFakeEvent({
        path: "/",
        pathParameters: { modelId: "blog" },
        headers: { "Content-Type": "application/json" },
        httpMethod: "PATCH",
        requestContext: {
          authorizer: {
            claims: {
              sub: "user",
              "cognito:groups": ["client"],
            },
          },
        },
      });
      await patch({ event });
    } catch (error) {
      expect(error.message).toMatch(/forbidden/i);
    }
  });

  it("should throw forbidden for no group", async () => {
    expect.assertions(1);
    try {
      const event = makeFakeEvent({
        path: "/",
        pathParameters: { modelId: "blog" },
        headers: { "Content-Type": "application/json" },
        httpMethod: "PATCH",
        requestContext: {
          authorizer: {
            claims: {
              sub: "user",
            },
          },
        },
      });
      await patch({ event });
    } catch (error) {
      expect(error.message).toMatch(/forbidden/i);
    }
  });

  it("should throw Missing id", async () => {
    expect.assertions(1);
    try {
      await patch({
        event: {
          requestContext: {
            identity: {},
            authorizer: {
              claims: { sub: "tester", "cognito:groups": ["admin"] },
            },
          },
          path: "/",
        },
      });
    } catch (error) {
      expect(error.message).toBe("Missing model id");
    }
  });

  it("should throw missing model id", async () => {
    expect.assertions(1);
    try {
      const event = makeFakeEvent({
        path: "/",
        headers: { "Content-Type": "application/json" },
        httpMethod: "PATCH",
        requestContext: {
          authorizer: {
            claims: {
              sub: "user",
              "cognito:groups": ["editor"],
            },
          },
        },
      });
      await patch({ event });
    } catch (error) {
      expect(error.message).toBe("Missing model id");
    }
  });

  it("should throw missing id", async () => {
    expect.assertions(1);
    try {
      const event = makeFakeEvent({
        path: "/",
        headers: { "Content-Type": "application/json" },
        httpMethod: "PATCH",
        pathParameters: { modelId: "blog" },
        requestContext: {
          authorizer: {
            claims: {
              sub: "user",
              "cognito:groups": ["editor"],
            },
          },
        },
      });
      await patch({ event });
    } catch (error) {
      expect(error.message).toBe("Missing id");
    }
  });
});
