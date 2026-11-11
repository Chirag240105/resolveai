'use client';

import React from 'react';
import Link from 'next/link';
import { GridBackground } from '@/components/backgrounds/GridBackground';
import { AmbientGlow } from '@/components/backgrounds/AmbientGlow';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Code2,
  Terminal,
  ExternalLink,
  Layers,
  CheckCircle2,
  Github,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function ResourcesPage() {
  const apiEndpoints = [
    { method: 'POST', path: '/api/auth/login', desc: 'Authenticate merchant and retrieve JWT Bearer token' },
    { method: 'GET', path: '/api/merchants/dashboard', desc: 'Retrieve merchant active disputes, revenue, and KPIs' },
    { method: 'GET', path: '/api/disputes', desc: 'List disputes with pagination, reason, and status filtering' },
    { method: 'GET', path: '/api/disputes/:id', desc: 'Fetch full dispute dossier with matched order and evidence' },
    { method: 'POST', path: '/api/disputes/:id/analyze', desc: 'Run autonomous Gemini 2.5 Flash investigation pipeline' },
    { method: 'POST', path: '/api/disputes/:id/approve', desc: 'Record explicit merchant approval (human-in-the-loop gate)' },
    { method: 'POST', path: '/api/disputes/:id/submit', desc: 'Submit contestation package to PayPal Disputes REST API' },
    { method: 'POST', path: '/api/paypal/webhooks', desc: 'HMAC signature verified webhook listener for dispute events' },
    { method: 'GET', path: '/api/audit', desc: 'Retrieve paginated compliance ledger of all system actions' },
  ];

  return (
    <div className="relative overflow-hidden pt-32 pb-24">
      <GridBackground variant="marketing" />
      <AmbientGlow position="top" color="dual" intensity="medium" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="blue" glow>Documentation & Specs</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F7F5FF] tracking-tight">
            Developer & Architecture Resources
          </h1>
          <p className="text-base text-[#AAA6C5] leading-relaxed">
            Everything you need to evaluate, integrate, and deploy ResolveAI with PayPal Sandbox and PostgreSQL.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="p-6 space-y-3 bg-[#111126]/90 border-[rgba(145,105,255,0.25)]">
            <div className="p-3 w-fit rounded-xl bg-[rgba(113,59,255,0.15)] text-[#963FFF] border border-[rgba(150,63,255,0.3)]">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#F7F5FF]">REST API Specification</h3>
            <p className="text-xs text-[#AAA6C5] leading-relaxed">
              Explore the complete OpenAPI 3.0 contract powering our Next.js frontend and Express 5 backend.
            </p>
            <a href="#api-contract" className="text-xs text-[#536CFF] font-semibold hover:underline inline-flex items-center gap-1 pt-2">
              View Endpoints <ArrowRight className="w-3 h-3" />
            </a>
          </Card>

          <Card hover className="p-6 space-y-3 bg-[#111126]/90 border-[rgba(145,105,255,0.25)]">
            <div className="p-3 w-fit rounded-xl bg-[rgba(83,108,255,0.15)] text-[#536CFF] border border-[rgba(83,108,255,0.3)]">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#F7F5FF]">PayPal Sandbox Setup</h3>
            <p className="text-xs text-[#AAA6C5] leading-relaxed">
              Step-by-step instructions for webhook URL registration, sandbox OAuth credentials, and order captures.
            </p>
            <a href="#sandbox-guide" className="text-xs text-[#536CFF] font-semibold hover:underline inline-flex items-center gap-1 pt-2">
              Read Sandbox Guide <ArrowRight className="w-3 h-3" />
            </a>
          </Card>

          <Card hover className="p-6 space-y-3 bg-[#111126]/90 border-[rgba(145,105,255,0.25)]">
            <div className="p-3 w-fit rounded-xl bg-[rgba(53,211,154,0.15)] text-[#35D39A] border border-[rgba(53,211,154,0.3)]">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#F7F5FF]">Open Source Repository</h3>
            <p className="text-xs text-[#AAA6C5] leading-relaxed">
              Built under the permissive MIT License for the PayPal AI Hackathon 2026.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#35D39A] font-semibold hover:underline inline-flex items-center gap-1 pt-2"
            >
              Inspect Source on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </Card>
        </div>

        {/* API Contract Table */}
        <div id="api-contract" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#F7F5FF]">Backend REST API Contract</h2>
              <p className="text-xs text-[#AAA6C5] mt-1">Mounted on Express 5 at /api with Zod request validation.</p>
            </div>
            <Badge variant="purple">OpenAPI 3.0</Badge>
          </div>

          <div className="rounded-2xl border border-[rgba(145,105,255,0.2)] bg-[#0B0B18] overflow-hidden">
            <div className="divide-y divide-[rgba(145,105,255,0.12)]">
              {apiEndpoints.map((ep) => (
                <div key={ep.path} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 font-mono">
                    <span
                      className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${
                        ep.method === 'POST'
                          ? 'bg-[#713BFF]/20 text-[#d4c3ff] border border-[rgba(113,59,255,0.35)]'
                          : 'bg-[#536CFF]/20 text-[#b8c6ff] border border-[rgba(83,108,255,0.35)]'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-[#F7F5FF] font-semibold">{ep.path}</span>
                  </div>
                  <span className="text-[#AAA6C5]">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sandbox Guide */}
        <div id="sandbox-guide" className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F7F5FF]">PayPal Sandbox Configuration</h2>
          <Card className="p-6 space-y-4 bg-[#111126]/80 border-[rgba(145,105,255,0.25)] text-xs text-[#AAA6C5] leading-relaxed">
            <p>
              In your <a href="https://developer.paypal.com" target="_blank" rel="noreferrer" className="text-[#536CFF] hover:underline font-semibold">PayPal Developer Dashboard</a> under your Sandbox REST App:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2 text-[#e2dff8]">
              <li>Register your public webhook URL: <code className="bg-[#070711] px-2 py-0.5 rounded text-[#35D39A] font-mono">https://your-domain/api/paypal/webhooks</code></li>
              <li>Subscribe to: <code className="font-mono text-[#F7F5FF]">CUSTOMER.DISPUTE.CREATED</code>, <code className="font-mono text-[#F7F5FF]">CUSTOMER.DISPUTE.UPDATED</code>, and <code className="font-mono text-[#F7F5FF]">CUSTOMER.DISPUTE.RESOLVED</code></li>
              <li>Copy the generated <code className="font-mono text-[#F5B942]">PAYPAL_WEBHOOK_ID</code> into your <code className="font-mono text-[#F7F5FF]">.env</code> file</li>
              <li>Set <code className="font-mono text-[#F7F5FF]">DEMO_MODE=false</code> to execute real sandbox dispute submissions, or keep it true for verified offline rehearsals</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

