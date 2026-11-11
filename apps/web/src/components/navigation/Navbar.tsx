'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Security', href: '/security' },
    { label: 'Resources', href: '/resources' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070711]/85 backdrop-blur-xl border-b border-[rgba(145,105,255,0.18)] py-3.5 shadow-[0_4px_30px_rgba(7,7,17,0.8)]'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#713BFF] via-[#963FFF] to-[#536CFF] text-white shadow-[0_0_24px_rgba(113,59,255,0.55)] border border-[rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-heading font-bold text-lg text-[#F7F5FF] tracking-tight leading-none">
              ResolveAI
              <span className="text-[10px] font-semibold bg-[rgba(113,59,255,0.25)] text-[#d4c3ff] px-1.5 py-0.5 rounded-md border border-[rgba(150,63,255,0.4)] font-mono">
                PayPal
              </span>
            </div>
            <span className="text-[10px] text-[#AAA6C5] font-mono tracking-wider">Dispute Intelligence</span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0F0E24]/85 border border-[rgba(164,125,255,0.25)] rounded-full px-4 py-1.5 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-[#713BFF]/45 to-[#963FFF]/35 shadow-[0_0_16px_rgba(113,59,255,0.4)] border border-[rgba(164,125,255,0.5)]'
                    : 'text-[#AAA6C5] hover:text-[#F7F5FF] hover:bg-[rgba(145,105,255,0.12)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="glow" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Console
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#AAA6C5] hover:text-white rounded-lg hover:bg-[#111126]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070711]/95 backdrop-blur-2xl border-b border-[rgba(145,105,255,0.2)] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#AAA6C5] hover:text-white hover:bg-[rgba(113,59,255,0.12)] rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-[rgba(145,105,255,0.15)] flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="md" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="glow" size="md" className="w-full">
                Open Merchant Console
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

