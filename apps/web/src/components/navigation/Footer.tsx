import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0918] border-t border-[#7047EB]/20 pt-16 pb-12 relative overflow-hidden text-[#A09BB8]">
      {/* Background Soft Purple Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-t from-[#7047EB]/15 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#7047EB]/15">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#7047EB] to-[#5128C7] text-white shadow-[0_4px_16px_rgba(112,71,235,0.4)]">
                <ShieldCheck className="w-5 h-5 fill-current" />
              </div>
              <span className="font-heading font-bold text-lg text-white tracking-tight">ResolveAI</span>
            </Link>
            <p className="text-xs text-[#A09BB8] max-w-sm leading-relaxed">
              AI-powered dispute investigation & evidence intelligence platform for PayPal merchants. 
              Built with rigorous human-in-the-loop governance: AI investigates, humans decide.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#A09BB8]">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#171329] border border-[#7047EB]/30 text-[#EAE5F5]">
                PayPal Disputes API
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#171329] border border-[#7047EB]/30 text-[#EAE5F5]">
                Gemini 2.5 Flash
              </span>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2 text-xs text-[#A09BB8]">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/solutions" className="hover:text-white transition-colors">Solutions</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Merchant Dashboard</Link></li>
              <li><Link href="/dashboard/disputes" className="hover:text-white transition-colors">Disputes Console</Link></li>
            </ul>
          </div>

          {/* Security & Tech Col */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-white">Security & Governance</h4>
            <ul className="space-y-2 text-xs text-[#A09BB8]">
              <li><Link href="/security" className="hover:text-white transition-colors">Security Architecture</Link></li>
              <li><Link href="/security#human-gate" className="hover:text-white transition-colors">Human Approval Gate</Link></li>
              <li><Link href="/security#webhooks" className="hover:text-white transition-colors">HMAC Webhook Ingestion</Link></li>
              <li><Link href="/security#citations" className="hover:text-white transition-colors">Zero-Hallucination Citations</Link></li>
              <li><Link href="/resources#audit" className="hover:text-white transition-colors">Immutable Audit Ledger</Link></li>
            </ul>
          </div>

          {/* Resources & Open Source Col */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-white">Resources</h4>
            <ul className="space-y-2 text-xs text-[#A09BB8]">
              <li><Link href="/resources" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/resources#api-contract" className="hover:text-white transition-colors">REST API Contract</Link></li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://developer.paypal.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  PayPal Sandbox Docs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77718C]">
          <p>© 2026 ResolveAI. Open source under the MIT License.</p>
          <div className="flex items-center gap-6">
            <span>Built for PayPal AI Hackathon 2026</span>
            <span>MIT License</span>
            <Link href="/login" className="hover:text-white transition-colors">Demo Merchant Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
