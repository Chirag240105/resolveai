'use client';

import React from 'react';
import Link from 'next/link';
import { HeroScene } from '@/components/three/HeroScene';
import { GridBackground } from '@/components/backgrounds/GridBackground';
import { AmbientGlow } from '@/components/backgrounds/AmbientGlow';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Scale,
  FileCheck,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  Search,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const steps = [
    { num: '01', title: 'Webhook Ingestion', desc: 'Real-time PayPal dispute notification received with HMAC cryptographic signature validation & deduplication.' },
    { num: '02', title: 'Transaction Match', desc: 'Dispute is automatically linked with captured PayPal orders, shipping profiles, and line-item records.' },
    { num: '03', title: 'AI Investigation', desc: 'Gemini 2.5 Flash agent classifies dispute reason under PayPal Seller Protection and queries database tools.' },
    { num: '04', title: 'Evidence Completeness', desc: 'Objectively scores evidence (0–100) against carrier tracking, address match, and delivery scan criteria.' },
    { num: '05', title: 'Citation-Backed Draft', desc: 'Drafts a structured response where every single claim cites a verified transaction or tracking record.' },
    { num: '06', title: 'Human Merchant Review', desc: 'Hard Rule: Merchant inspects evidence, reviews the draft, and clicks explicit approval. AI cannot submit alone.' },
    { num: '07', title: 'PayPal Submission & Audit', desc: 'Backend submits evidence via PayPal Disputes API and records an immutable log in the audit ledger.' },
  ];

  const features = [
    { icon: Activity, title: 'Real-Time Webhook Ingestion', desc: 'HMAC signature verification and event-ID deduplication for 100% idempotent PayPal dispute ingestion.' },
    { icon: Sparkles, title: 'Autonomous AI Investigation', desc: 'Gemini-powered reasoning classifies disputes, extracts verified records, and assesses case risk in seconds.' },
    { icon: Scale, title: 'Evidence Completeness Scoring', desc: 'Transparent 0–100 readiness benchmark scoring delivery proof, address verification, and carrier stamps.' },
    { icon: FileCheck, title: 'Zero-Hallucination Citations', desc: 'Every drafted response claim links directly to a verifiable transaction ID, tracking number, or timestamp.' },
    { icon: AlertTriangle, title: 'Missing Evidence Flagging', desc: 'Identifies missing proof (e.g. unverified carrier scan, signature threshold) before submission.' },
    { icon: ShieldCheck, title: 'Human-in-the-Loop Governance', desc: 'AI NEVER submits autonomously. Submissions are strictly locked until human merchant signs off.' },
    { icon: Layers, title: 'Immutable Audit History', desc: 'Complete timeline recording incoming webhooks, AI analysis, merchant reviews, and PayPal API outcomes.' },
    { icon: Zap, title: 'Native PayPal API Integration', desc: 'Built directly on PayPal Disputes REST API, Orders V2, and OAuth 2.0 with sandbox test tools.' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 min-h-[92vh] flex items-center">
        <GridBackground variant="hero" showFloor />
        <AmbientGlow position="hero" color="dual" intensity="strong" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(113,59,255,0.15)] border border-[rgba(150,63,255,0.35)] shadow-[0_0_20px_rgba(113,59,255,0.25)] backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#963FFF]" />
                <span className="text-xs uppercase tracking-wider font-semibold text-[#d4c3ff]">
                  AI-Powered Dispute Intelligence
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#F7F5FF] tracking-tight leading-[1.12]">
                <span className="block">Resolve Disputes.</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9060FF] via-[#B282FF] to-[#38BDF8]">
                  With Intelligence.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#AAA6C5] max-w-xl leading-relaxed">
                Investigate PayPal disputes, uncover missing evidence, and prepare stronger responses with AI-powered evidence intelligence. Built for merchants with strict human approval control.
              </p>

              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link href="/dashboard">
                  <Button variant="glow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore ResolveAI Console
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="text-white hover:text-white">
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust Line */}
              <div className="pt-4 flex items-center gap-4 text-xs text-[#AAA6C5]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#35D39A]" />
                  <span>Human-Approved</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[rgba(145,105,255,0.4)]" />
                <div className="flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#536CFF]" />
                  <span>Evidence-Grounded</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[rgba(145,105,255,0.4)]" />
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#963FFF]" />
                  <span>PayPal Sandbox Verified</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Interactive 3D Hologram */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <HeroScene />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="relative py-8 bg-[#090914] border-y border-[rgba(145,105,255,0.18)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-[#111126]/40 border border-[rgba(145,105,255,0.12)]">
              <div className="text-xl font-bold text-[#F7F5FF] font-mono">0–100</div>
              <div className="text-xs text-[#AAA6C5] mt-1 font-medium">Evidence Completeness Scoring</div>
            </div>
            <div className="p-4 rounded-xl bg-[#111126]/40 border border-[rgba(145,105,255,0.12)]">
              <div className="text-xl font-bold text-[#35D39A] font-mono">100%</div>
              <div className="text-xs text-[#AAA6C5] mt-1 font-medium">Human Approval Required</div>
            </div>
            <div className="p-4 rounded-xl bg-[#111126]/40 border border-[rgba(145,105,255,0.12)]">
              <div className="text-xl font-bold text-[#963FFF] font-mono">&lt; 2 min</div>
              <div className="text-xs text-[#AAA6C5] mt-1 font-medium">Full AI Investigation Speed</div>
            </div>
            <div className="p-4 rounded-xl bg-[#111126]/40 border border-[rgba(145,105,255,0.12)]">
              <div className="text-xl font-bold text-[#536CFF] font-mono">Immutable</div>
              <div className="text-xs text-[#AAA6C5] mt-1 font-medium">Compliance Audit Ledger</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-28">
        <GridBackground variant="marketing" />
        <AmbientGlow position="center" color="violet" intensity="subtle" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="purple">The Merchant Dilemma</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F7F5FF] tracking-tight">
              Dispute Management Shouldn't Be a Manual Investigation
            </h2>
            <p className="text-sm sm:text-base text-[#AAA6C5] leading-relaxed">
              When a dispute arrives, merchants are caught in an urgent scramble across fragmented order records, carrier APIs, and strict PayPal Seller Protection guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover className="space-y-3">
              <div className="p-3 w-fit rounded-xl bg-[rgba(255,100,124,0.12)] text-[#FF647C] border border-[rgba(255,100,124,0.3)]">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F7F5FF]">Scattered Order Records</h3>
              <p className="text-xs text-[#AAA6C5] leading-relaxed">
                Transaction receipts, warehouse packing stamps, and FedEx/USPS tracking IDs reside in disconnected databases with no unified evidentiary view.
              </p>
            </Card>

            <Card hover className="space-y-3">
              <div className="p-3 w-fit rounded-xl bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.3)]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F7F5FF]">Unclear Evidence Strength</h3>
              <p className="text-xs text-[#AAA6C5] leading-relaxed">
                Merchants guess whether their package satisfies PayPal Seller Protection rules—risking forfeiture over a missing delivery scan or signature.
              </p>
            </Card>

            <Card hover className="space-y-3">
              <div className="p-3 w-fit rounded-xl bg-[rgba(113,59,255,0.15)] text-[#963FFF] border border-[rgba(150,63,255,0.35)]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F7F5FF]">Strict Deadlines</h3>
              <p className="text-xs text-[#AAA6C5] leading-relaxed">
                With dispute countdowns under 7–10 days, manual contestation writing causes late submissions and automatic financial penalties.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section: 7-Step Workflow */}
      <section className="relative py-28 bg-[#090916]">
        <GridBackground variant="marketing" />
        <AmbientGlow position="top" color="purple" intensity="medium" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="blue">Automated Intelligence Workflow</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F7F5FF] tracking-tight">
              From Dispute to Decision. In One Workflow.
            </h2>
            <p className="text-sm sm:text-base text-[#AAA6C5] leading-relaxed">
              ResolveAI orchestrates the entire dispute investigation lifecycle while keeping humans securely in command.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.slice(0, 4).map((step) => (
              <Card key={step.num} hover className="space-y-3 relative overflow-hidden group">
                <div className="text-3xl font-extrabold font-mono text-[rgba(150,63,255,0.35)] group-hover:text-[#963FFF] transition-colors">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-[#F7F5FF]">{step.title}</h3>
                <p className="text-xs text-[#AAA6C5] leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.slice(4).map((step) => (
              <Card key={step.num} hover className="space-y-3 relative overflow-hidden group">
                <div className="text-3xl font-extrabold font-mono text-[rgba(150,63,255,0.35)] group-hover:text-[#963FFF] transition-colors">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-[#F7F5FF]">{step.title}</h3>
                <p className="text-xs text-[#AAA6C5] leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real Product Preview Section */}
      <section className="relative py-28 overflow-hidden">
        <GridBackground variant="hero" />
        <AmbientGlow position="center" color="dual" intensity="strong" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12 text-center">
          <div className="space-y-4 max-w-2xl mx-auto">
            <Badge variant="violet">Enterprise Console Preview</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F7F5FF] tracking-tight">
              Designed for High-Volume Merchant Operations
            </h2>
            <p className="text-sm text-[#AAA6C5]">
              Real-time AG Grid disputes table, circular completeness meters, and citation-backed contestation editors.
            </p>
          </div>

          {/* Interactive Mockup Container */}
          <div className="rounded-2xl border border-[rgba(150,63,255,0.35)] bg-[#0B0B18]/90 p-4 md:p-6 shadow-[0_0_60px_rgba(113,59,255,0.25)] backdrop-blur-xl text-left max-w-5xl mx-auto">
            {/* Window Topbar */}
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(145,105,255,0.15)] mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF647C]" />
                <div className="w-3 h-3 rounded-full bg-[#F5B942]" />
                <div className="w-3 h-3 rounded-full bg-[#35D39A]" />
                <span className="ml-3 font-mono text-xs text-[#AAA6C5]">resolveai.merchant.dashboard / disputes / PP-D-10291-INR</span>
              </div>
              <Badge variant="success" size="sm">Connected: PayPal Sandbox</Badge>
            </div>

            {/* Simulated Case Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#111126] border border-[rgba(145,105,255,0.2)] mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#AAA6C5] block">Dispute Case ID</span>
                <span className="text-sm font-bold text-[#F7F5FF] font-mono">PP-D-10291-INR</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#AAA6C5] block">Disputed Revenue</span>
                <span className="text-sm font-bold text-[#F7F5FF] font-mono">$249.99 USD</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#AAA6C5] block">Reason Code</span>
                <span className="text-xs font-semibold text-[#F5B942]">Item Not Received</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#AAA6C5] block">Completeness Readiness</span>
                <span className="text-sm font-bold text-[#35D39A] font-mono">88% (Seller Protection)</span>
              </div>
            </div>

            {/* Split panels: AI findings on left, Draft on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-5 rounded-xl bg-[#111126]/80 border border-[rgba(145,105,255,0.18)]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-[#d4c3ff] font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#963FFF]" /> AI Evidence Extraction
                  </h4>
                  <Badge variant="blue" size="sm">3 Records Found</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#0B0B18] border border-[rgba(145,105,255,0.15)] flex justify-between">
                    <span className="text-[#AAA6C5]">Carrier Tracking:</span>
                    <span className="text-[#35D39A] font-mono font-semibold">USPS: 940011189956 (DELIVERED)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0B0B18] border border-[rgba(145,105,255,0.15)] flex justify-between">
                    <span className="text-[#AAA6C5]">Capture Settle:</span>
                    <span className="text-[#F7F5FF] font-mono">CAP-9901-INR ($249.99 USD)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0B0B18] border border-[rgba(145,105,255,0.15)] flex justify-between">
                    <span className="text-[#AAA6C5]">Recipient Address:</span>
                    <span className="text-[#F7F5FF]">Seattle, WA 98101 (Confirmed Match)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5 rounded-xl bg-[#111126]/80 border border-[rgba(145,105,255,0.18)]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-[#d4c3ff] font-semibold flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#536CFF]" /> Citation-Backed Response
                  </h4>
                  <Badge variant="purple" size="sm">Factual Assertive</Badge>
                </div>
                <div className="p-3 rounded-lg bg-[#0B0B18] border border-[rgba(145,105,255,0.15)] text-xs text-[#AAA6C5] font-mono leading-relaxed line-clamp-4">
                  "We formally contest this dispute. Order ORD-9901-INR was dispatched via USPS Priority Mail (tracking: 9400111899562537829102) and delivered to buyer's confirmed postal address on file prior to dispute filing."
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Link href="/dashboard/disputes/disp-mock-1">
                    <Button variant="glow" size="sm">
                      Inspect Full Dossier
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-28 bg-[#090914]">
        <GridBackground variant="marketing" />
        <AmbientGlow position="bottom" color="purple" intensity="medium" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="violet">Core Capabilities</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F7F5FF] tracking-tight">
              Engineered for Precision, Protection, and Speed
            </h2>
            <p className="text-sm sm:text-base text-[#AAA6C5]">
              Every tool and metric is backed by rigorous backend validation and PayPal Seller Protection standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <Card key={feat.title} hover className="space-y-3">
                  <div className="p-3 w-fit rounded-xl bg-[rgba(113,59,255,0.15)] text-[#963FFF] border border-[rgba(150,63,255,0.3)] shadow-[0_0_15px_rgba(113,59,255,0.25)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#F7F5FF]">{feat.title}</h3>
                  <p className="text-xs text-[#AAA6C5] leading-relaxed">{feat.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="relative py-28">
        <GridBackground variant="marketing" />
        <AmbientGlow position="center" color="violet" intensity="subtle" />

        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="rounded-3xl border border-[rgba(150,63,255,0.3)] bg-gradient-to-br from-[#111126] via-[#0B0B18] to-[#070711] p-8 md:p-14 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6 text-left">
                <Badge variant="success" glow>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#35D39A]" /> Security Architecture
                </Badge>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F7F5FF] tracking-tight">
                  AI Assistance. Human Authority.
                </h2>
                <p className="text-sm sm:text-base text-[#AAA6C5] leading-relaxed max-w-2xl">
                  We reject irresponsible autonomous bot submissions. In ResolveAI, financial actions can only be authorized by the backend after verified merchant sign-off.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#35D39A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#F7F5FF]">Backend-Enforced Approval Gate</h4>
                      <p className="text-[11px] text-[#AAA6C5] mt-0.5">HTTP 400 validation error thrown if submission attempted without approval.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#35D39A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#F7F5FF]">Zero Hallucination Grounding</h4>
                      <p className="text-[11px] text-[#AAA6C5] mt-0.5">Every AI draft section binds to verified transaction and tracking IDs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#35D39A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#35D39A]">HMAC Webhook Verification</h4>
                      <p className="text-[11px] text-[#AAA6C5] mt-0.5">Every event signature is cryptographically validated with PayPal servers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#35D39A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#F7F5FF]">Zod Schema Validation</h4>
                      <p className="text-[11px] text-[#AAA6C5] mt-0.5">Strict runtime schema validation on all incoming payloads and AI outputs.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="p-8 rounded-2xl bg-[#070711] border border-[rgba(150,63,255,0.3)] shadow-[0_0_40px_rgba(113,59,255,0.2)] text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#713BFF] to-[#963FFF] mx-auto flex items-center justify-center text-white shadow-[0_0_30px_rgba(113,59,255,0.6)]">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F7F5FF]">Hard Design Rule</h4>
                  <p className="text-xs text-[#AAA6C5] leading-relaxed">
                    AI NEVER submits evidence on its own. AI recommends, a human approves, and the backend executes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-28 text-center">
        <GridBackground variant="hero" showFloor />
        <AmbientGlow position="center" color="dual" intensity="strong" />

        <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-8 relative z-10">
          <Badge variant="purple" glow>Ready in Minutes</Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#F7F5FF] tracking-tight">
            Take Control of Every Dispute.
          </h2>
          <p className="text-base text-[#AAA6C5] max-w-xl mx-auto leading-relaxed">
            Bring investigation, evidence, and decision-making into one intelligent, transparent workflow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="glow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Merchant Console
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline" size="lg">
                View Documentation & Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

