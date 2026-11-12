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
          ? 'bg-[#070711]/90 backdrop-blur-xl border-b border-[#7047EB]/20 py-3.5 shadow-[0_4px_30px_rgba(7,7,17,0.8)]'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#7047EB] to-[#5128C7] text-white shadow-[0_4px_16px_rgba(112,71,235,0.4)] border border-white/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-heading font-bold text-lg text-white tracking-tight leading-none">
              ResolveAI
              <span className="text-[10px] font-semibold bg-[#7047EB]/25 text-[#F3EFFF] px-1.5 py-0.5 rounded-md border border-[#7047EB]/40 font-mono">
                PayPal
              </span>
            </div>
            <span className="text-[10px] text-[#A09BB8] font-mono tracking-wider font-semibold">Dispute Intelligence</span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#171329]/90 border border-[#7047EB]/25 rounded-full px-4 py-1.5 backdrop-blur-xl shadow-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-[#7047EB] shadow-xs'
                    : 'text-[#EAE5F5] hover:text-white hover:bg-white/10'
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
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10 font-medium">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="glow" size="sm" className="shadow-[0_0_20px_rgba(112,71,235,0.4)]" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Console
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-white rounded-lg hover:bg-white/10"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070711]/98 backdrop-blur-2xl border-b border-[#7047EB]/20 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-[#EAE5F5] hover:text-white hover:bg-[#7047EB]/20 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-[#7047EB]/20 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="md" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Open Merchant Console
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
