import { describe, expect, it } from "vitest";
import { parseInvoiceExtraction } from "../src/integrations/gemini/invoice-extraction.js";

describe("Gemini invoice output boundary", () => {
  it("parses a structured candidate without calculating or trusting totals", () => {
    const candidate = parseInvoiceExtraction(JSON.stringify({
      invoiceNumber: "INV-5", customerName: "Example", customerEmail: null, customerAddress: null,
      issueDate: "2026-11-09", dueDate: null, currency: "USD",
      items: [{ description: "Service", quantity: "2", unitPrice: "50.00", taxRate: "0" }],
      statedSubtotal: "100.00", statedTaxAmount: "0.00", statedTotal: "100.00", notes: null,
    }));
    expect(candidate.statedTotal).toBe("100.00");
    expect(candidate.items[0]?.unitPrice).toBe("50.00");
  });

  it("rejects malformed model output", () => {
    expect(() => parseInvoiceExtraction("not json")).toThrow("AI returned invalid structured data");
    expect(() => parseInvoiceExtraction(JSON.stringify({ invoiceNumber: "only a partial response" }))).toThrow();
  });
});
