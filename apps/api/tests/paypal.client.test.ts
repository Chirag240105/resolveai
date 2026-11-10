import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("PayPal REST adapter", () => {
  beforeEach(() => {
    process.env.PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";
    process.env.PAYPAL_CLIENT_ID = "test-client-id";
    process.env.PAYPAL_CLIENT_SECRET = "test-client-secret";
    vi.resetModules();
  });

  afterEach(() => vi.unstubAllGlobals());

  it("caches OAuth and passes the request id for an idempotent order call", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "test-token", expires_in: 3600 }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ORDER123" }), { status: 201 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ORDER123", status: "CREATED" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { paypalRequest } = await import("../src/integrations/paypal/paypal.client.js");

    const result = await paypalRequest<{ id: string }>("/v2/checkout/orders", {
      method: "POST", body: { intent: "CAPTURE" }, requestId: "stable-request-id",
    });

    expect(result.id).toBe("ORDER123");
    await paypalRequest<{ id: string }>("/v2/checkout/orders/ORDER123", { method: "GET" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1]?.[1]?.headers).toMatchObject({
      Authorization: "Bearer test-token",
      "PayPal-Request-Id": "stable-request-id",
    });
  });
});
