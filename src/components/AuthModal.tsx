import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { ADMIN_CREDENTIALS, DEMO_CUSTOMER } from '../data/mockData';
import { StorageService } from '../services/storageService';
import { BrandLogo } from './BrandLogo';
import {
  X,
  User,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'client' | 'admin';
  onClientLoginSuccess: (user: Customer) => void;
  onAdminLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'client',
  onClientLoginSuccess,
  onAdminLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [activeRole, setActiveRole] = useState<'client' | 'admin'>(initialRole);
  const [clientMode, setClientMode] = useState<'signin' | 'signup'>('signin');

  // Client form fields
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNin, setClientNin] = useState('');

  // Admin form fields
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Status / Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setActiveRole(initialRole);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [initialRole, isOpen]);

  // Handle Client Sign In with Email
  const handleClientSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = StorageService.loginClientByEmail(clientEmail);
    if (!result.success || !result.customer) {
      setErrorMessage(result.error || 'Account not found. Please register below.');
      return;
    }

    setSuccessMessage(`Welcome back, ${result.customer.name}!`);
    setTimeout(() => {
      onClientLoginSuccess(result.customer!);
      onClose();
    }, 500);
  };

  // Handle Client Registration
  const handleClientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = StorageService.registerClient({
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      nin: clientNin,
    });

    if (!result.success || !result.customer) {
      setErrorMessage(result.error || 'Failed to register account.');
      return;
    }

    setSuccessMessage(`Welcome to E-HOMES, ${result.customer.name}! Account registered.`);
    setTimeout(() => {
      onClientLoginSuccess(result.customer!);
      onClose();
    }, 600);
  };

  // Quick fill known client
  const handleFillClient = (email: string, name?: string) => {
    setClientEmail(email);
    if (name) setClientName(name);
    setErrorMessage(null);
  };

  // Handle Single Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = StorageService.loginAdmin(adminEmail, adminPassword);
    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed.');
      return;
    }

    setSuccessMessage('Administrator authenticated. Loading E-HOMES Console...');
    setTimeout(() => {
      onAdminLoginSuccess();
      onClose();
    }, 600);
  };

  // Auto fill the one official admin credentials helper
  const handleFillAdminCredentials = () => {
    setAdminEmail(ADMIN_CREDENTIALS.email);
    setAdminPassword(ADMIN_CREDENTIALS.password);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header Lockup */}
        <div className="flex items-center justify-between">
          <BrandLogo size="md" />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Segmented Switcher (Client vs Admin) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveRole('client');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'client'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-cyan-600" />
            <span>Client Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('admin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Error / Success Feedback Banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 1: CLIENT LOGIN WITH EMAIL */}
        {/* ============================================================ */}
        {activeRole === 'client' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {clientMode === 'signin' ? 'Sign In with Email' : 'Create Client Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {clientMode === 'signin'
                  ? 'Access your reserved plots, payment receipts, and balance statement.'
                  : 'Register your email to secure plots and manage payment instalments.'}
              </p>
            </div>

            {/* Quick Email Selection Chips for testing */}
            {clientMode === 'signin' && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Select Sample Client Account:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFillClient(DEMO_CUSTOMER.email, DEMO_CUSTOMER.name)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition-colors"
                  >
                    david.mukasa@gmail.com (Plot 103 Owner)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillClient('sarah.namagembe@yahoo.com', 'Sarah Namagembe')}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    sarah.namagembe@yahoo.com
                  </button>
                </div>
              </div>
            )}

            {/* Sign In Form */}
            {clientMode === 'signin' ? (
              <form onSubmit={handleClientSignIn} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Client Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. david.mukasa@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Sign In with Email</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Registration Form */
              <form onSubmit={handleClientRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Grace Atuhaire"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. grace@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Uganda Telephone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. +256 787 004962"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    National ID (NIN) / Passport (Optional)
                  </label>
                  <input
                    type="text"
                    value={clientNin}
                    onChange={(e) => setClientNin(e.target.value)}
                    placeholder="e.g. CM840291089JKA"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Register & Open Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Mode Toggle */}
            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              {clientMode === 'signin' ? (
                <p>
                  New to E-HOMES?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setClientMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-cyan-700 font-bold hover:underline"
                  >
                    Create client account here
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setClientMode('signin');
                      setErrorMessage(null);
                    }}
                    className="text-cyan-700 font-bold hover:underline"
                  >
                    Sign in with email
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: SINGLE ADMIN LOGIN */}
        {/* ============================================================ */}
        {activeRole === 'admin' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>One Authorized Administrator</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Management Terminal Login
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Restricted to E-HOMES Operations & Finance Executive (Bahai Road Office).
              </p>
            </div>

            {/* One-click Admin Credentials Helper */}
            <div className="p-3 rounded-xl bg-slate-900 text-white text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Authorized Administrator</span>
                </span>
                <button
                  type="button"
                  onClick={handleFillAdminCredentials}
                  className="px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] transition-colors"
                >
                  Auto-Fill Admin
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-300 space-y-0.5">
                <p>Email: <strong className="text-white">{ADMIN_CREDENTIALS.email}</strong></p>
                <p>Password: <strong className="text-white">{ADMIN_CREDENTIALS.password}</strong></p>
              </div>
            </div>

            {/* Admin Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@ehomesuganda.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter administrator password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Verify & Enter Admin Console</span>
              </button>
            </form>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 text-center">
              Only one designated executive account holds authority to verify land payments, modify plot statuses, and register projects.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
