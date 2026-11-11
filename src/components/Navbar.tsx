import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Customer } from '../types';
import {
  Menu,
  X,
  Phone,
  User,
  Shield,
  Layers,
  Calculator,
  Compass,
  FileText,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/mockData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: Customer | null;
  isAdmin: boolean;
  onOpenAuth: (role?: 'client' | 'admin') => void;
  onLogoutAdmin: () => void;
  onLogoutClient: () => void;
  onOpenInquiry: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  isAdmin,
  onOpenAuth,
  onLogoutAdmin,
  onLogoutClient,
  onOpenInquiry,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'properties', label: 'Available Land', icon: Layers },
    { id: 'plot-map', label: 'Plot Selection', icon: Compass },
    { id: 'payment-plans', label: 'Payment Plans', icon: FileText },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'about', label: 'About Us', icon: null },
    { id: 'contact', label: 'Contact', icon: null },
  ];

  const handleNavClick = (tabId: string) => {
    if (tabId === 'admin' && !isAdmin) {
      onOpenAuth('admin');
      return;
    }
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      {/* Utility sub-strip: Telephone, Bahai Road, Client Email Login, and Admin Gateway */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 truncate">
            <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Bahai Road, Kampala, Uganda
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a
              href={`tel:${COMPANY_DETAILS.phoneClean}`}
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>{COMPANY_DETAILS.phoneDisplay}</span>
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Client Authentication status */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('customer-portal')}
                  className="flex items-center gap-1.5 hover:text-cyan-300 font-medium transition-colors"
                  title={`Logged in as ${currentUser.email}`}
                >
                  <User className="w-3 h-3 text-cyan-400" />
                  <span className="max-w-[140px] truncate">{currentUser.name}</span>
                  <span className="hidden md:inline text-[10px] text-slate-400 font-mono">
                    ({currentUser.email})
                  </span>
                </button>
                <button
                  onClick={onLogoutClient}
                  className="text-[10px] text-slate-400 hover:text-rose-300 transition-colors"
                  title="Sign out of client portal"
                >
                  (Sign Out)
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('client')}
                className="flex items-center gap-1 text-cyan-300 hover:text-white font-medium transition-colors"
              >
                <User className="w-3 h-3" />
                <span>Client Sign In (Email)</span>
              </button>
            )}

            <span className="text-slate-600">|</span>

            {/* Single Admin Portal Access */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center gap-1 text-amber-400 font-bold hover:text-amber-300 transition-colors bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Console</span>
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Log out of Administrator terminal"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('admin')}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:border-amber-500/40 transition-colors"
                title="Restricted Administrator Login"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Bar (Strict 3-zone contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-0.5"
        >
          <BrandLogo size="md" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'text-cyan-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('plot-map')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm hover:shadow transition-all duration-150 whitespace-nowrap"
          >
            Select a Plot
          </button>
          <button
            onClick={onOpenInquiry}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/80 rounded-lg transition-colors whitespace-nowrap"
          >
            Inquire
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 shadow-xl space-y-3">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'home' ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'text-slate-700'
              }`}
            >
              Home
            </button>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === link.id
                    ? 'bg-cyan-50 text-cyan-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick(currentUser ? 'customer-portal' : 'home')}
              className="text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50"
            >
              {currentUser ? `My Account (${currentUser.email})` : 'Client Portal'}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {isAdmin ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 rounded-lg shadow-sm"
              >
                Open Admin Console
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('admin');
                }}
                className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Login</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('plot-map')}
              className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 rounded-lg shadow-sm"
            >
              Explore Master Plan
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200 rounded-lg"
            >
              Contact Agent (+256 787 004962)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
