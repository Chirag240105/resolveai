'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  PackageCheck,
  Check,
  Database,
  Key,
} from 'lucide-react';

export default function HomePage() {
  const fourSteps = [
    {
      step: '01',
      title: 'Dispute Received',
      tag: 'Real-Time Webhook',
      desc: 'Dispute ingested instantly from PayPal with HMAC-SHA256 signature verification, deduplication, and immediate order binding.',
      icon: Activity,
    },
    {
      step: '02',
      title: 'Evidence Collected',
      tag: 'Automated Extraction',
      desc: 'System aggregates carrier delivery scans, shipping address records, payment capture IDs, and customer communication into a unified file.',
      icon: PackageCheck,
    },
    {
      step: '03',
      title: 'AI Investigation',
      tag: 'Gemini 2.5 Flash',
      desc: 'Evaluates Seller Protection eligibility, calculates 0–100 completeness score, identifies vulnerabilities, and drafts cited responses.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'Merchant Approval',
      tag: 'Human Governance Gate',
      desc: 'Hard Rule: Merchant reviews evidence strength, edits contestation text, and grants explicit cryptographic sign-off before dispatch.',
      icon: ShieldCheck,
    },
  ];

  const coreCapabilities = [
    {
      icon: Scale,
      title: 'Evidence Intelligence',
      desc: 'Algorithmic 0–100 completeness benchmark assessing carrier scans, recipient address matching, and signature thresholds.',
      badge: 'Deterministic',
    },
    {
      icon: Sparkles,
      title: 'AI Investigation',
      desc: 'Gemini-powered reasoning classifies reason codes, surfaces case vulnerabilities, and pinpoints exactly what proof is missing.',
      badge: 'Gemini 2.5 Flash',
    },
    {
      icon: FileCheck,
      title: 'Citation-Backed Responses',
      desc: 'Zero-hallucination contestation letters where every factual claim links strictly to an order reference, tracking scan, or timestamp.',
      badge: 'Zero Hallucination',
    },
    {
      icon: ShieldCheck,
      title: 'Merchant Approval Gate',
      desc: 'Absolute human-in-the-loop control. The backend strictly forbids autonomous submission without explicit merchant authorization.',
      badge: 'Non-Autonomous',
    },
    {
      icon: Layers,
      title: 'Immutable Audit Trail',
      desc: 'Append-only ledger recording webhook receipt, AI model inferences, merchant edits, approvals, and PayPal API responses.',
      badge: 'Cryptographic',
    },
    {
      icon: Zap,
      title: 'PayPal API Integration',
      desc: 'Built directly on PayPal Disputes REST API v1, Orders V2, and OAuth 2.0 with sandbox testing tools and automated mock generators.',
      badge: 'Native REST',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#070711] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 min-h-[92vh] flex items-center">
        <GridBackground variant="hero" showFloor />
        <AmbientGlow position="hero" color="dual" intensity="strong" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7047EB]/15 border border-[#7047EB]/35 shadow-[0_0_20px_rgba(112,71,235,0.25)] backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="text-xs uppercase tracking-wider font-semibold text-[#F3EFFF]">
                  AI-Powered PayPal Dispute Intelligence
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                <span>Resolve disputes.</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#38BDF8]">
                  Recover confidence.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#EAE5F5] max-w-xl leading-relaxed font-normal">
                AI-powered dispute intelligence to investigate, analyze, and prepare stronger responses — with your approval.
              </p>

              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link href="/dashboard">
                  <Button variant="glow" size="lg" className="shadow-[0_0_35px_rgba(112,71,235,0.5)]" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore Dashboard
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="border-[#EAE5F5]/30 text-white hover:text-white hover:bg-white/10">
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust Line */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-[#EAE5F5] font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Human-Approved Only</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[#8B5CF6]/40" />
                <div className="flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Evidence-Grounded Citations</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[#8B5CF6]/40" />
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#7047EB]" />
                  <span>PayPal Sandbox Verified</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Column: Interactive 3D Hologram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              <HeroScene />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="relative py-8 bg-[#0B0918] border-y border-[#7047EB]/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-[#171329]/80 border border-[#7047EB]/20">
              <div className="text-2xl font-bold text-white font-mono">0–100</div>
              <div className="text-xs text-[#EAE5F5] mt-1 font-semibold">Evidence Completeness Scoring</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#171329]/80 border border-[#7047EB]/20">
              <div className="text-2xl font-bold text-[#10B981] font-mono">100%</div>
              <div className="text-xs text-[#EAE5F5] mt-1 font-semibold">Human Approval Gate</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#171329]/80 border border-[#7047EB]/20">
              <div className="text-2xl font-bold text-[#8B5CF6] font-mono">&lt; 2 min</div>
              <div className="text-xs text-[#EAE5F5] mt-1 font-semibold">Investigation Speed</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#171329]/80 border border-[#7047EB]/20">
              <div className="text-2xl font-bold text-[#38BDF8] font-mono">Immutable</div>
              <div className="text-xs text-[#EAE5F5] mt-1 font-semibold">Compliance Audit Ledger</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE PROBLEM (Visual Comparison) */}
      <section className="relative py-28 bg-[#070711]">
        <GridBackground variant="marketing" />
        <AmbientGlow position="center" color="violet" intensity="subtle" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <Badge variant="purple">The Merchant Dilemma</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Fragmented Evidence vs. Unified Intelligence
            </h2>
            <p className="text-sm sm:text-base text-[#EAE5F5] leading-relaxed max-w-2xl mx-auto">
              When a dispute arrives, merchants face an urgent 10-day deadline while tracking receipts, carrier scans, and PayPal criteria are scattered across disconnected systems.
            </p>
          </motion.div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Old Way: Fragmented */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl bg-[#130E20] border border-[#EF4444]/25 space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono font-bold text-[#EF4444] tracking-wider">
                  Without ResolveAI (The Struggle)
                </span>
                <span className="text-xs font-mono text-[#EF4444] bg-[#EF4444]/10 px-2.5 py-1 rounded-md border border-[#EF4444]/20">
                  High Risk of Forfeiture
                </span>
              </div>
              <ul className="space-y-4 text-xs text-[#EAE5F5]">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</div>
                  <span><strong>Scattered proof:</strong> Tracking numbers, order slips, and receipts trapped in separate tools.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</div>
                  <span><strong>Blind contestations:</strong> Submitting generic responses without knowing if Seller Protection rules are met.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</div>
                  <span><strong>Countdown pressure:</strong> 7–10 day deadlines run out while manually assembling evidence packets.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</div>
                  <span><strong>No audit trail:</strong> Zero historical record of past approvals, claims, or PayPal dispute outcomes.</span>
                </li>
              </ul>
            </motion.div>

            {/* The ResolveAI Way: Unified Intelligence */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl bg-[#171329] border border-[#7047EB]/40 shadow-[0_0_40px_rgba(112,71,235,0.15)] space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono font-bold text-[#8B5CF6] tracking-wider">
                  With ResolveAI (Unified Intelligence)
                </span>
                <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-md border border-[#10B981]/30">
                  Defensible Win Rate
                </span>
              </div>
              <ul className="space-y-4 text-xs text-[#EAE5F5]">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                  <span><strong>Instant binding:</strong> Ingested PayPal disputes auto-link with captured Orders V2 and carrier scans.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                  <span><strong>Objective scoring:</strong> Deterministic 0–100 completeness score reveals exact gaps before submission.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                  <span><strong>Zero-hallucination drafts:</strong> AI synthesizes contestation letters citing verified IDs and timestamps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                  <span><strong>Human approval gate:</strong> The merchant stays in full control; backend enforces cryptographic sign-off.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW RESOLVEAI WORKS (4-Step Workflow) */}
      <section className="relative py-28 bg-[#090815] border-y border-[#7047EB]/20">
        <GridBackground variant="marketing" />
        <AmbientGlow position="top" color="purple" intensity="medium" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <Badge variant="blue">Sequential Pipeline</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How ResolveAI Works
            </h2>
            <p className="text-sm sm:text-base text-[#EAE5F5] leading-relaxed max-w-2xl mx-auto">
              From incoming dispute notification to authenticated PayPal dispatch, in four transparent steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {fourSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.12 }}
                  className="p-6 rounded-2xl bg-[#171329] border border-[#7047EB]/30 shadow-xs relative overflow-hidden group hover:border-[#8B5CF6] transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-extrabold font-mono text-[#8B5CF6]/40 group-hover:text-[#8B5CF6] transition-colors">
                      {s.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#7047EB]/15 border border-[#7047EB]/30 text-[#8B5CF6]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B5CF6] font-bold block mb-1">
                    {s.tag}
                  </span>
                  <h3 className="text-base font-bold text-white font-heading mb-2">{s.title}</h3>
                  <p className="text-xs text-[#EAE5F5] leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT EXPERIENCE (Dashboard & AI Investigation Preview) */}
      <section className="relative py-28 bg-[#070711]">
        <GridBackground variant="hero" />
        <AmbientGlow position="center" color="dual" intensity="strong" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4 max-w-2xl mx-auto"
          >
            <Badge variant="violet">Product Experience</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for High-Volume Operations
            </h2>
            <p className="text-sm text-[#EAE5F5]">
              Real-time AG Grid disputes terminal, deterministic completeness meters, and citation-backed contestation editors.
            </p>
          </motion.div>

          {/* Interactive Mockup Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-[#7047EB]/35 bg-[#171329]/95 p-5 md:p-8 shadow-[0_20px_70px_rgba(112,71,235,0.2)] text-left max-w-5xl mx-auto"
          >
            {/* Window Topbar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE5F5]/10 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="ml-3 font-mono text-xs text-[#EAE5F5]">resolveai.merchant.dashboard / disputes / PP-D-10291-INR</span>
              </div>
              <Badge variant="success" size="sm">Connected: PayPal Sandbox</Badge>
            </div>

            {/* Simulated Case Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#141024] border border-[#7047EB]/20 mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#EAE5F5] block font-bold">Dispute Case ID</span>
                <span className="text-sm font-bold text-white font-mono">PP-D-10291-INR</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#EAE5F5] block font-bold">Disputed Revenue</span>
                <span className="text-sm font-bold text-white font-mono">$249.99 USD</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#EAE5F5] block font-bold">Reason Code</span>
                <span className="text-xs font-semibold text-[#F59E0B]">Item Not Received</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#EAE5F5] block font-bold">Completeness Score</span>
                <span className="text-sm font-bold text-[#10B981] font-mono">88% (Seller Protection)</span>
              </div>
            </div>

            {/* Split Panels: AI Evidence & Cited Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-5 rounded-xl bg-[#141024] border border-[#7047EB]/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-[#F3EFFF] font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8B5CF6]" /> AI Evidence Extraction
                  </h4>
                  <Badge variant="blue" size="sm">3 Verified Records</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#171329] border border-[#7047EB]/20 flex justify-between">
                    <span className="text-[#EAE5F5]">Carrier Tracking:</span>
                    <span className="text-[#10B981] font-mono font-semibold">USPS: 940011189956 (DELIVERED)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#171329] border border-[#7047EB]/20 flex justify-between">
                    <span className="text-[#EAE5F5]">Payment Capture:</span>
                    <span className="text-white font-mono">CAP-9901-INR ($249.99 USD)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#171329] border border-[#7047EB]/20 flex justify-between">
                    <span className="text-[#EAE5F5]">Recipient Address:</span>
                    <span className="text-white">Seattle, WA 98101 (Confirmed Match)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5 rounded-xl bg-[#141024] border border-[#7047EB]/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-[#F3EFFF] font-semibold flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#8B5CF6]" /> Citation-Backed Response
                  </h4>
                  <Badge variant="purple" size="sm">Factual Assertive</Badge>
                </div>
                <div className="p-3 rounded-lg bg-[#171329] border border-[#7047EB]/20 text-xs text-[#EAE5F5] font-mono leading-relaxed line-clamp-4">
                  "We formally contest this dispute. Order ORD-9901-INR was dispatched via USPS Priority Mail (tracking: 9400111899562537829102) and delivered to buyer's confirmed postal address on file prior to dispute filing."
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Link href="/dashboard/disputes">
                    <Button variant="primary" size="sm">
                      Inspect Console Dossier
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: CORE CAPABILITIES (6 Features) */}
      <section className="relative py-28 bg-[#090815] border-y border-[#7047EB]/20">
        <GridBackground variant="marketing" />
        <AmbientGlow position="bottom" color="purple" intensity="medium" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <Badge variant="violet">Core Capabilities</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Precision, Protection, and Speed
            </h2>
            <p className="text-sm sm:text-base text-[#EAE5F5]">
              Every tool and metric is backed by rigorous backend validation and PayPal Seller Protection standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCapabilities.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 rounded-2xl bg-[#171329] border border-[#7047EB]/25 shadow-xs space-y-3 hover:border-[#8B5CF6] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 w-fit rounded-xl bg-[#7047EB]/15 text-[#8B5CF6] border border-[#7047EB]/30">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#8B5CF6] bg-[#7047EB]/15 px-2.5 py-0.5 rounded-full border border-[#7047EB]/30">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">{feat.title}</h3>
                  <p className="text-xs text-[#EAE5F5] leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: SECURITY AND TRUST */}
      <section className="relative py-28 bg-[#070711]">
        <GridBackground variant="marketing" />
        <AmbientGlow position="center" color="violet" intensity="subtle" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-[#7047EB]/40 bg-gradient-to-br from-[#171329] via-[#141024] to-[#070711] p-8 md:p-14 shadow-[0_20px_60px_rgba(112,71,235,0.15)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6 text-left">
                <Badge variant="success">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Security Architecture
                </Badge>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  AI Assistance. Human Authority.
                </h2>
                <p className="text-sm sm:text-base text-[#EAE5F5] leading-relaxed max-w-2xl">
                  We reject irresponsible autonomous bot submissions. In ResolveAI, financial actions can only be authorized by the backend after verified merchant sign-off.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">Backend-Enforced Approval Gate</h4>
                      <p className="text-[11px] text-[#EAE5F5] mt-0.5">HTTP 400 validation error thrown if submission attempted without approval.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">Zero Hallucination Grounding</h4>
                      <p className="text-[11px] text-[#EAE5F5] mt-0.5">Every AI draft section binds to verified transaction and tracking IDs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#10B981]">HMAC Webhook Verification</h4>
                      <p className="text-[11px] text-[#EAE5F5] mt-0.5">Every event signature is cryptographically validated with PayPal servers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">Zod Schema Validation</h4>
                      <p className="text-[11px] text-[#EAE5F5] mt-0.5">Strict runtime schema validation on all incoming payloads and AI outputs.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="p-8 rounded-2xl bg-[#0B0918] border border-[#7047EB]/30 shadow-xs text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7047EB] to-[#5128C7] mx-auto flex items-center justify-center text-white shadow-[0_10px_25px_rgba(112,71,235,0.4)]">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-heading">Hard Design Rule</h4>
                  <p className="text-xs text-[#EAE5F5] leading-relaxed">
                    AI NEVER submits evidence on its own. AI recommends, a human approves, and the backend executes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA (Deep Purple Gradient) */}
      <section className="relative py-28 text-center bg-gradient-to-br from-[#171329] via-[#241B4A] to-[#5128C7]">
        <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-8 relative z-10">
          <Badge variant="purple">Ready in Minutes</Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            Take Control of Every Dispute.
          </h2>
          <p className="text-base text-[#F3EFFF] max-w-xl mx-auto leading-relaxed">
            Bring investigation, evidence, and decision-making into one intelligent, transparent workflow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="glow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Merchant Console
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:text-white hover:bg-white/10">
                View Documentation & Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
