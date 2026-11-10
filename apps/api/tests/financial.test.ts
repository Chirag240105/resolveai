import { describe, expect, it } from "vitest";
import { calculateInvoice, findPotentialDuplicates } from "../src/shared/financial.js";
import { detectDocumentAmountAnomalies } from "../src/modules/anomaly-detection/anomaly.service.js";

describe("financial calculations", () => {
  it("calculates line tax and invoice totals with integer minor units", () => {
    const result = calculateInvoice({
      items: [
        { description: "Consulting", quantity: "1.5", unitPrice: "100.00", taxRate: "10" },
        { description: "Travel", quantity: "2", unitPrice: "12.50", taxRate: "0" },
      ],
      discountAmount: "5.00",
    });
    expect(result.subtotal).toBe("175.00");
    expect(result.taxAmount).toBe("15.00");
    expect(result.discountAmount).toBe("5.00");
    expect(result.totalAmount).toBe("185.00");
    expect(result.items.map((item) => item.lineTotal)).toEqual(["165.00", "25.00"]);
  });

  it("rejects a discount larger than the invoice value", () => {
    expect(() => calculateInvoice({
      items: [{ description: "Work", quantity: "1", unitPrice: "10", taxRate: "0" }],
      discountAmount: "10.01",
    })).toThrow("Discount cannot exceed invoice subtotal plus tax");
  });

  it("rejects totals beyond the persisted DECIMAL(12,2) precision", () => {
    expect(() => calculateInvoice({
      items: [{ description: "Large", quantity: "9999999", unitPrice: "9999999999.99", taxRate: "0" }],
      discountAmount: "0",
    })).toThrow("Invoice amount exceeds the supported maximum");
  });
});

describe("document anomaly checks", () => {
  it("flags extracted totals that disagree with deterministic backend totals", () => {
    expect(detectDocumentAmountAnomalies(
      { statedSubtotal: "100.00", statedTaxAmount: "5.00", statedTotal: "105.00" },
      { subtotal: "100.00", taxAmount: "5.00", totalAmount: "110.00" },
    ).map((flag) => flag.code)).toEqual(["STATED_TOTAL_MISMATCH"]);
  });
});

describe("duplicate detection", () => {
  const candidates = [
    { id: "1", invoiceNumber: "INV-1", customerName: "Example Co", totalAmount: "100.00" },
    { id: "2", invoiceNumber: "INV-2", customerName: "Other Co", totalAmount: "100.00" },
  ];

  it("flags exact invoice number and matching customer/amount candidates", () => {
    expect(findPotentialDuplicates({ invoiceNumber: "inv-1", customerName: "New Name", totalAmount: "4.00" }, candidates).map((c) => c.id)).toEqual(["1"]);
    expect(findPotentialDuplicates({ invoiceNumber: "INV-3", customerName: " example co ", totalAmount: "100.00" }, candidates).map((c) => c.id)).toEqual(["1"]);
  });

  it("does not flag unrelated records", () => {
    expect(findPotentialDuplicates({ invoiceNumber: "INV-3", customerName: "New Co", totalAmount: "100.00" }, candidates)).toEqual([]);
  });
});
