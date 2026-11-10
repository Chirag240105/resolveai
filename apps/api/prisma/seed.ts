import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://resolveai:password@localhost:5432/resolveai?schema=public';

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting ResolveAI database seed...');

  const passwordHash = await bcrypt.hash('DemoPassword123!', 10);
  const adminHash = await bcrypt.hash('AdminPassword123!', 10);

  // 1. Seed Merchant User
  const merchantUser = await prisma.user.upsert({
    where: { email: 'merchant@resolveai.test' },
    update: {},
    create: {
      email: 'merchant@resolveai.test',
      passwordHash,
      name: 'Elena Rostova',
      role: 'MERCHANT',
    },
  });

  // 2. Seed Admin User
  await prisma.user.upsert({
    where: { email: 'admin@resolveai.test' },
    update: {},
    create: {
      email: 'admin@resolveai.test',
      passwordHash: adminHash,
      name: 'Devpost Judge / Compliance Admin',
      role: 'ADMIN',
    },
  });

  // 3. Seed Merchant Profile
  const merchant = await prisma.merchant.upsert({
    where: { userId: merchantUser.id },
    update: {},
    create: {
      userId: merchantUser.id,
      businessName: 'Apex Electronics & Audio Lab',
      businessEmail: 'support@apexelectronics.test',
    },
  });

  // 4. Seed PayPal Connection
  await prisma.paypalConnection.upsert({
    where: { merchantId: merchant.id },
    update: {},
    create: {
      merchantId: merchant.id,
      paypalMerchantId: 'SANDBOX-MERCHANT-89201',
      accessToken: 'encrypted_sandbox_token_ref',
      isActive: true,
    },
  });

  // 5. Seed Transactions
  const tx1 = await prisma.transaction.upsert({
    where: { paypalOrderId: 'ORD-9901-INR' },
    update: {},
    create: {
      merchantId: merchant.id,
      paypalOrderId: 'ORD-9901-INR',
      paypalCaptureId: 'CAP-9901-INR',
      amount: 249.99,
      currency: 'USD',
      status: 'COMPLETED',
      payerEmail: 'sarah.buyer@example.com',
      payerName: 'Sarah Buyer',
      description: 'Bose QuietComfort 45 Bluetooth Wireless Headphones',
      itemDetails: [
        { name: 'Bose QuietComfort 45', quantity: 1, unitAmount: 249.99 },
      ],
      shippingAddress: {
        recipientName: 'Sarah Buyer',
        line1: '452 Fremont Avenue',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'US',
      },
      trackingInfo: {
        carrier: 'USPS',
        trackingNumber: '9400111899562537829102',
        status: 'DELIVERED',
        dispatchedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        deliveredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        signatureRequired: false,
      },
    },
  });

  const tx2 = await prisma.transaction.upsert({
    where: { paypalOrderId: 'ORD-9902-UNAUTH' },
    update: {},
    create: {
      merchantId: merchant.id,
      paypalOrderId: 'ORD-9902-UNAUTH',
      paypalCaptureId: 'CAP-9902-UNAUTH',
      amount: 780.0,
      currency: 'USD',
      status: 'COMPLETED',
      payerEmail: 'alex.investor@example.com',
      payerName: 'Alex Investor',
      description: 'Dell UltraSharp 32-inch 4K Curved USB-C Hub Monitor',
      itemDetails: [
        { name: 'Dell UltraSharp 32" 4K Monitor', quantity: 1, unitAmount: 780.0 },
      ],
      shippingAddress: {
        recipientName: 'Alex Investor',
        line1: '100 Montgomery St, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94104',
        country: 'US',
      },
      trackingInfo: {
        carrier: 'FedEx Express',
        trackingNumber: '782910384719',
        status: 'DELIVERED',
        dispatchedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        deliveredAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        signedBy: 'A. INVESTOR',
      },
    },
  });

  // 6. Seed Disputes
  const dispute1 = await prisma.dispute.upsert({
    where: { paypalDisputeId: 'PP-D-10291-INR' },
    update: {},
    create: {
      merchantId: merchant.id,
      transactionId: tx1.id,
      paypalDisputeId: 'PP-D-10291-INR',
      reason: 'ITEM_NOT_RECEIVED',
      status: 'WAITING_FOR_SELLER_RESPONSE',
      disputeAmount: 249.99,
      disputeCurrency: 'USD',
      sellerResponseDueDate: new Date(Date.now() + 86400000 * 2), // Due in 48 hours
      approvalStatus: 'PENDING_REVIEW',
      messages: [
        {
          posted_by: 'BUYER',
          time_posted: new Date(Date.now() - 86400000).toISOString(),
          content: 'I ordered the Bose headphones 10 days ago and have not received them. Package is missing.',
        },
      ],
    },
  });

  const dispute2 = await prisma.dispute.upsert({
    where: { paypalDisputeId: 'PP-D-10292-UNAUTH' },
    update: {},
    create: {
      merchantId: merchant.id,
      transactionId: tx2.id,
      paypalDisputeId: 'PP-D-10292-UNAUTH',
      reason: 'UNAUTHORIZED_TRANSACTION',
      status: 'UNDER_REVIEW',
      disputeAmount: 780.0,
      disputeCurrency: 'USD',
      sellerResponseDueDate: new Date(Date.now() + 86400000 * 5),
      approvalStatus: 'APPROVED',
      approvedBy: merchantUser.id,
      approvedAt: new Date(),
    },
  });

  // 7. Seed Pre-computed AI Analysis for Dispute 1
  await prisma.aiAnalysis.create({
    data: {
      disputeId: dispute1.id,
      status: 'COMPLETED',
      completenessScore: 88,
      modelUsed: 'gemini-2.5-flash',
      processingTimeMs: 1420,
      classification: {
        reason: 'ITEM_NOT_RECEIVED',
        severity: 3,
        urgency: 'HIGH',
        confidence: 0.98,
        summary: 'Buyer claims headphones were never received, but USPS tracking confirms successful delivery to the confirmed Seattle address 2 days ago.',
        keyIssue: 'Delivery confirmed to recipient postal code prior to dispute initiation.',
      },
      evidenceExtraction: {
        items: [
          {
            type: 'TRACKING_INFO',
            title: 'USPS Priority Mail Tracking Confirmation',
            description: 'Tracking number 9400111899562537829102 shows delivered to front porch in Seattle, WA 98101.',
            sourceReference: '9400111899562537829102',
            confidence: 0.99,
          },
          {
            type: 'INVOICE',
            title: 'Order Capture Record #ORD-9901-INR',
            description: 'Proof of authorized charge matching confirmed shipping address on buyer profile.',
            sourceReference: 'ORD-9901-INR',
            confidence: 1.0,
          },
        ],
      },
      riskAssessment: {
        winProbability: 0.91,
        riskLevel: 'LOW',
        factors: [
          { factor: 'Delivered Status on Tracking', impact: 'HIGH_POSITIVE', description: 'Item marked delivered before dispute filed.' },
          { factor: 'Address Verification', impact: 'POSITIVE', description: 'Address matches verified PayPal shipping profile.' },
        ],
        strategicRecommendation: 'Contest dispute immediately with verified tracking and invoice.',
      },
      weaknesses: {
        weaknesses: [
          { area: 'Signature', severity: 'LOW', description: 'No physical signature on delivery.', recommendation: 'Optional for orders under $750.' },
        ],
      },
      responseDraft: {
        subject: 'Dispute Response: Case PP-D-10291-INR (Order ORD-9901-INR)',
        body: 'We are formally contesting this dispute. The order was dispatched via USPS Priority Mail (tracking: 9400111899562537829102) and delivered to the buyer confirmed address in Seattle, WA 98101 on record. Under PayPal Seller Protection, merchant has fulfilled all delivery obligations.',
        sections: [
          {
            heading: 'Fulfillment & Carrier Delivery Proof',
            content: 'Order ORD-9901-INR was dispatched on schedule and verified as delivered by the United States Postal Service to the buyer registered postal address.',
            citations: [{ source: 'ShippingLabel', reference: '9400111899562537829102', detail: 'USPS Delivery Scan at front porch' }],
          },
          {
            heading: 'PayPal Seller Protection Compliance',
            content: 'The tracking number provided confirms online delivery to the recipient address provided at checkout, fully satisfying Seller Protection guidelines.',
            citations: [{ source: 'TransactionRecord', reference: 'CAP-9901-INR', detail: 'Authorized capture' }],
          },
        ],
        tone: 'FACTUAL_ASSERTIVE',
        keyArguments: [
          'Carrier tracking confirms delivery before dispute was initiated',
          'Delivery address exactly matches PayPal confirmed address',
        ],
        suggestedAction: 'CONTEST_WITH_EVIDENCE',
      },
    },
  });

  // 8. Seed Evidence Record
  await prisma.disputeEvidence.create({
    data: {
      disputeId: dispute1.id,
      evidenceType: 'TRACKING_INFO',
      title: 'USPS Priority Mail Delivery Scan',
      description: 'Official tracking history showing delivery confirmation to Seattle, WA 98101',
      sourceReference: '9400111899562537829102',
      isAiGenerated: true,
      isVerified: true,
    },
  });

  // 9. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'WEBHOOK_RECEIVED',
        details: { event: 'CUSTOMER.DISPUTE.CREATED', disputeId: 'PP-D-10291-INR' },
        disputeId: dispute1.id,
      },
      {
        action: 'DISPUTE_SYNCED',
        userId: merchantUser.id,
        disputeId: dispute1.id,
        details: { status: 'WAITING_FOR_SELLER_RESPONSE' },
      },
      {
        action: 'ANALYSIS_COMPLETED',
        userId: merchantUser.id,
        disputeId: dispute1.id,
        details: { completenessScore: 88, winProbability: 0.91 },
      },
    ],
  });

  console.log('✅ ResolveAI database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
