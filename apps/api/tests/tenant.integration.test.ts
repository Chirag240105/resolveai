import { Prisma } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../lib/db.js";
import { invoiceRepository } from "../src/modules/invoices/invoice.repository.js";
import { persistVerifiedPayPalEvent } from "../src/modules/payments/payment.service.js";
import { approveInvoice } from "../src/modules/invoices/invoice.service.js";

const enabled = process.env.RUN_DB_INTEGRATION === "true";
let businessIds: string[] = [];
const eventIds: string[] = [];
let userIds: string[] = [];

describe.skipIf(!enabled)("PostgreSQL tenant isolation", () => {
  afterAll(async () => {
    if (businessIds.length) {
      await prisma.webhookEvent.deleteMany({ where: { providerEventId: { in: eventIds } } });
      await prisma.auditLog.deleteMany({ where: { businessId: { in: businessIds } } });
      await prisma.payment.deleteMany({ where: { invoice: { businessId: { in: businessIds } } } });
      await prisma.invoiceDocument.deleteMany({ where: { businessId: { in: businessIds } } });
      await prisma.invoice.deleteMany({ where: { businessId: { in: businessIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      await prisma.business.deleteMany({ where: { id: { in: businessIds } } });
    }
    await prisma.$disconnect();
  });

  it("does not return another business's invoice by ID", async () => {
    const first = await prisma.business.create({ data: { name: `tenant-a-${Date.now()}` } });
    const second = await prisma.business.create({ data: { name: `tenant-b-${Date.now()}` } });
    businessIds = [first.id, second.id];
    const invoice = await prisma.invoice.create({
      data: {
        businessId: first.id, invoiceNumber: `T-${Date.now()}`, customerName: "Tenant A", currency: "USD",
        subtotal: new Prisma.Decimal("25.00"), taxAmount: new Prisma.Decimal("0.00"),
        discountAmount: new Prisma.Decimal("0.00"), totalAmount: new Prisma.Decimal("25.00"),
      },
    });
    expect(await invoiceRepository.findById(second.id, invoice.id)).toBeNull();
    expect(await invoiceRepository.findById(first.id, invoice.id)).not.toBeNull();
  });

  it("deduplicates verified payment events and changes invoice state once", async () => {
    const business = await prisma.business.create({ data: { name: `payment-tenant-${Date.now()}` } });
    businessIds = [...businessIds, business.id];
    const suffix = Date.now().toString();
    const invoice = await prisma.invoice.create({
      data: {
        businessId: business.id, invoiceNumber: `PAY-${suffix}`, customerName: "Payment Customer", currency: "USD",
        status: "APPROVED", paymentStatus: "PENDING", subtotal: new Prisma.Decimal("25.00"),
        taxAmount: new Prisma.Decimal("0.00"), discountAmount: new Prisma.Decimal("0.00"), totalAmount: new Prisma.Decimal("25.00"),
      },
    });
    const payment = await prisma.payment.create({ data: {
      invoiceId: invoice.id, paypalOrderId: `ORDER-${suffix}`, amount: new Prisma.Decimal("25.00"), currency: "USD",
    } });
    const eventId = `EVENT-${suffix}`;
    eventIds.push(eventId);
    const event = {
      id: eventId,
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      resource: {
        id: `CAPTURE-${suffix}`,
        status: "COMPLETED",
        amount: { value: "25.00", currency_code: "USD" },
        supplementary_data: { related_ids: { order_id: payment.paypalOrderId } },
      },
    };

    expect(await persistVerifiedPayPalEvent(event)).toBe("processed");
    expect(await persistVerifiedPayPalEvent(event)).toBe("duplicate");
    expect((await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } })).status).toBe("CAPTURED");
    expect((await prisma.invoice.findUniqueOrThrow({ where: { id: invoice.id } })).paymentStatus).toBe("PAID");
    expect(await prisma.auditLog.count({ where: { invoiceId: invoice.id, action: "PAYMENT_CONFIRMED_BY_WEBHOOK" } })).toBe(1);
  });

  it("does not mark an invoice paid when the event amount does not reconcile", async () => {
    const business = await prisma.business.create({ data: { name: `mismatch-tenant-${Date.now()}` } });
    businessIds = [...businessIds, business.id];
    const suffix = Date.now().toString();
    const invoice = await prisma.invoice.create({
      data: {
        businessId: business.id, invoiceNumber: `MISMATCH-${suffix}`, customerName: "Reconciliation Customer", currency: "USD",
        status: "APPROVED", paymentStatus: "PENDING", subtotal: new Prisma.Decimal("25.00"),
        taxAmount: new Prisma.Decimal("0.00"), discountAmount: new Prisma.Decimal("0.00"), totalAmount: new Prisma.Decimal("25.00"),
      },
    });
    const payment = await prisma.payment.create({ data: {
      invoiceId: invoice.id, paypalOrderId: `ORDER-MISMATCH-${suffix}`, amount: new Prisma.Decimal("25.00"), currency: "USD",
    } });
    const eventId = `EVENT-MISMATCH-${suffix}`;
    eventIds.push(eventId);
    const result = await persistVerifiedPayPalEvent({
      id: eventId,
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      resource: {
        id: `CAPTURE-MISMATCH-${suffix}`,
        amount: { value: "250.00", currency_code: "USD" },
        supplementary_data: { related_ids: { order_id: payment.paypalOrderId } },
      },
    });

    expect(result).toBe("reconciliation_required");
    expect((await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } })).status).toBe("CREATED");
    expect((await prisma.invoice.findUniqueOrThrow({ where: { id: invoice.id } })).paymentStatus).toBe("PENDING");
    expect((await prisma.webhookEvent.findUniqueOrThrow({ where: { providerEventId: eventId } })).processingError).toBe("PAYMENT_RECONCILIATION_MISMATCH");
  });

  it("requires an owner to acknowledge review flags before invoice approval", async () => {
    const business = await prisma.business.create({ data: { name: `review-tenant-${Date.now()}` } });
    businessIds = [...businessIds, business.id];
    const user = await prisma.user.create({
      data: { businessId: business.id, name: "Test Owner", email: `owner-${Date.now()}@example.test`, passwordHash: "not-used", role: "OWNER" },
    });
    userIds.push(user.id);
    const invoice = await prisma.invoice.create({
      data: {
        businessId: business.id, invoiceNumber: `REVIEW-${Date.now()}`, customerName: "Review Customer", currency: "USD",
        subtotal: new Prisma.Decimal("20.00"), taxAmount: new Prisma.Decimal("0.00"),
        discountAmount: new Prisma.Decimal("0.00"), totalAmount: new Prisma.Decimal("20.00"),
        reviewFlags: [{ code: "POTENTIAL_DUPLICATE", message: "Review before approval", source: "duplicate" }],
        items: { create: { description: "Test work", quantity: new Prisma.Decimal("1"), unitPrice: new Prisma.Decimal("20"), taxRate: new Prisma.Decimal("0"), lineTotal: new Prisma.Decimal("20") } },
      },
    });
    await expect(approveInvoice(business.id, user.id, invoice.id, false)).rejects.toMatchObject({ code: "INVOICE_REVIEW_REQUIRED" });
    expect((await approveInvoice(business.id, user.id, invoice.id, true)).status).toBe("APPROVED");
  });
});
