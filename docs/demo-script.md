# ResolveAI: 3-Minute Demo Video Script & Walkthrough

**Target Duration**: 2 minutes 45 seconds  
**Speaker Tone**: Crisp, pragmatic, senior fintech technical lead.

---

### [0:00 - 0:25] The Problem & Hook
- **Visual**: Screen captures PayPal resolution center showing a wall of red alerts: "Item Not Received - Action Required in 48 Hours".
- **Narration**:  
  *"Online merchants lose over 125 billion dollars every year to chargebacks and payment disputes. When a customer claims an item never arrived or was unauthorized, the clock starts ticking. Merchants must manually dig through warehouse logs, FedEx and USPS tracking records, match transaction IDs, and write a formal legal contestation. Missing the deadline means forfeiting the revenue immediately."*

---

### [0:25 - 0:55] Live Integration: Webhooks & AG Grid Console
- **Visual**: Split screen: PayPal webhook test event fires -> ResolveAI Dashboard updates live. Click into Disputes table showing AG Grid.
- **Narration**:  
  *"Meet ResolveAI. Connected directly to the merchant's PayPal sandbox account. When a dispute is lodged, our webhook engine cryptographically validates the PayPal HMAC signature, deduplicates the event, and matches it with the captured order in PostgreSQL. Here in our AG Grid console, merchants have enterprise-grade visibility: response countdowns, disputed amounts, and preliminary readiness."*

---

### [0:55 - 1:40] AI Evidence Investigation & Completeness Meter
- **Visual**: Click into Dispute `PP-D-10291-INR` ($249.99 Bose Headphones). Click "Run AI Investigation". Completeness meter animates to 88%.
- **Narration**:  
  *"Watch what happens when we investigate. Our Gemini 2.5 Flash agent classifies the dispute reason under PayPal Seller Protection rules. Using tool-calling, it queries transaction logs and carrier data. Notice the Evidence Completeness Score: 88 out of 100. It confirms USPS tracking delivered the item to the buyer's verified ZIP code before the dispute was filed, while flagging that signature confirmation was omitted—though not required under 750 dollars."*

---

### [1:40 - 2:15] Anti-Hallucination Citations & Hard Human-in-the-Loop Gate
- **Visual**: Zoom in on Response Editor. Highlight citations: clicking a citation badge highlights the verified transaction record. Show the "Submit to PayPal" button disabled until "Approve" is clicked.
- **Narration**:  
  *"Crucially: AI hallucination has no place in financial disputes. Every claim drafted by the AI cites a verified record—carrier tracking number, capture ID, and timestamp. Now for our hard architectural rule: AI NEVER submits evidence on its own. The merchant inspects the evidence, makes any final edits, and clicks 'Approve Response'. Only with explicit human authorization does the backend enable and execute the submission to PayPal's Disputes API."*

---

### [2:15 - 2:45] Audit Trail, Reliability & Conclusion
- **Visual**: Click into Audit Trail tab showing immutable ledger from webhook receipt to final PayPal submission. Cut to architectural diagram and GitHub repo.
- **Narration**:  
  *"Every interaction is captured in an immutable audit ledger for compliance. With Express 5, Prisma, Gemini, AG Grid, and PayPal REST APIs, ResolveAI gives merchants the evidence intelligence they need to protect valid revenue without losing sleep. ResolveAI: AI-investigated, human-approved, PayPal-powered. Thank you."*

