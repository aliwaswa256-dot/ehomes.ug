import React, { useState } from 'react';
import { Customer, PaymentMethod, PaymentPlanType, PaymentTransaction, Plot } from '../types';
import { formatUGX, generateReference } from '../utils/formatters';
import { COMPANY_DETAILS } from '../data/mockData';
import {
  X,
  Smartphone,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plot: Plot;
  planType: PaymentPlanType;
  depositAmountUGX: number;
  tenurePeriod: string;
  currentUser: Customer | null;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plot,
  planType,
  depositAmountUGX,
  tenurePeriod,
  currentUser,
  onPaymentSuccess,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '0787004962');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerNIN, setCustomerNIN] = useState(currentUser?.nin || '');
  const [bankRefCode, setBankRefCode] = useState('');
  const [selectedBank, setSelectedBank] = useState(COMPANY_DETAILS.bankAccounts[0].bank);

  // Flow states: 'form' | 'processing' | 'success'
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'completed'>('form');
  const [copiedBank, setCopiedBank] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const handleCopyAccount = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');

    const txRef = generateReference('EH-UGX');

    // Simulate network communication with telecom API (MTN / Airtel) or Bank Gateway
    if (paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money') {
      let secondsLeft = 4;
      const interval = setInterval(() => {
        secondsLeft -= 1;
        setCountdown(secondsLeft);
        if (secondsLeft <= 0) {
          clearInterval(interval);

          const transaction: PaymentTransaction = {
            id: `tx-${Date.now()}`,
            reference: txRef,
            purchaseId: `purch-${Date.now()}`,
            plotNumber: plot.plotNumber,
            estateName: plot.estateName,
            customerId: currentUser?.id || `cust-${Date.now()}`,
            customerName: customerName || 'Valued Customer',
            customerEmail: customerEmail || currentUser?.email,
            amountUGX: depositAmountUGX,
            method: paymentMethod,
            providerRef: `${paymentMethod.toUpperCase()}-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
            phoneNumber: phoneNumber,
            status: 'verified', // Mobile money completes automatically after PIN
            date: new Date().toISOString(),
            notes: `Initial down payment for ${plot.plotNumber} (${planType.toUpperCase()} Plan)`,
          };

          setCompletedTx(transaction);
          setPaymentStep('completed');
          onPaymentSuccess(transaction);
        }
      }, 1000);
    } else {
      // Bank Transfer: sets to 'pending' as required ("Never mark an unverified bank payment as successful without verification")
      setTimeout(() => {
        const transaction: PaymentTransaction = {
          id: `tx-${Date.now()}`,
          reference: txRef,
          purchaseId: `purch-${Date.now()}`,
          plotNumber: plot.plotNumber,
          estateName: plot.estateName,
          customerId: currentUser?.id || `cust-${Date.now()}`,
          customerName: customerName || 'Valued Customer',
          customerEmail: customerEmail || currentUser?.email,
          amountUGX: depositAmountUGX,
          method: 'bank_transfer',
          providerRef: bankRefCode || `STANBIC-FT-${Math.floor(100000 + Math.random() * 900000)}`,
          bankName: selectedBank,
          status: 'pending', // Pending admin reconciliation
          date: new Date().toISOString(),
          notes: `Bank Transfer deposit for ${plot.plotNumber}. Awaiting accountant verification.`,
        };

        setCompletedTx(transaction);
        setPaymentStep('completed');
        onPaymentSuccess(transaction);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure E-Homes Payment Gateway</span>
            </div>
            <h3 className="text-xl font-black mt-1">
              Purchase {plot.plotNumber} — {plot.estateName}
            </h3>
            <p className="text-xs text-slate-400">
              {planType === 'full' ? 'Full Settlement' : `${tenurePeriod} ${planType} plan`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-cyan-50 border-b border-cyan-100 p-4 px-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block">
              Payment Due Now (Deposit / Cash Price)
            </span>
            <div className="text-2xl font-black text-cyan-900 tracking-tight">
              {formatUGX(depositAmountUGX)}
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-white text-cyan-800 border border-cyan-200 font-semibold">
            Plot Price: {formatUGX(plot.priceUGX)}
          </span>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {paymentStep === 'form' && (
            <form onSubmit={handleInitiatePayment} className="space-y-5">
              {/* Customer Info Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. David Mukasa"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Uganda Telephone / MoMo Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0787004962"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. david.mukasa@example.com"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    National ID (NIN) / Passport (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerNIN}
                    onChange={(e) => setCustomerNIN(e.target.value)}
                    placeholder="e.g. CM840291089JKA"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Uganda Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {/* MTN Mobile Money */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'mtn_momo'
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/20 text-slate-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                    <span>MTN MoMo</span>
                  </button>

                  {/* Airtel Money */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtel_money')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'airtel_money'
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/20 text-slate-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-rose-500" />
                    <span>Airtel Money</span>
                  </button>

                  {/* Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-slate-100 border-slate-800 ring-2 ring-slate-800/20 text-slate-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-slate-800" />
                    <span>Bank Wire / EFT</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Method Guidance */}
              {paymentMethod === 'mtn_momo' && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5 text-amber-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>MTN Mobile Money Instant Push</span>
                  </div>
                  <p>
                    A prompt will be sent immediately to <strong>{phoneNumber || 'your registered number'}</strong>.
                    Enter your 5-digit MTN MoMo PIN on your handset to approve <strong>{formatUGX(depositAmountUGX)}</strong>.
                  </p>
                  <p className="text-[11px] text-amber-700">
                    Merchant Code: {COMPANY_DETAILS.mobileMoneyDetails.mtnMerchantCode} ({COMPANY_DETAILS.mobileMoneyDetails.mtnMerchantName})
                  </p>
                </div>
              )}

              {paymentMethod === 'airtel_money' && (
                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1.5 text-rose-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>Airtel Money Instant Push</span>
                  </div>
                  <p>
                    A secure authorization prompt will appear on phone <strong>{phoneNumber || 'your registered number'}</strong>.
                    Input your Airtel Money PIN to confirm payment.
                  </p>
                  <p className="text-[11px] text-rose-700">
                    Merchant Code: {COMPANY_DETAILS.mobileMoneyDetails.airtelMerchantCode} ({COMPANY_DETAILS.mobileMoneyDetails.airtelMerchantName})
                  </p>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800">E-HOMES Official Bank Accounts (Uganda):</span>
                    {COMPANY_DETAILS.bankAccounts.map((acc, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <strong className="block text-slate-900">{acc.bank}</strong>
                          <span className="text-[11px] text-slate-500 font-mono">A/C: {acc.accountNumber} ({acc.accountName})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount(acc.accountNumber)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 rounded"
                          title="Copy account number"
                        >
                          {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Bank Deposit Slip / Reference Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={bankRefCode}
                      onChange={(e) => setBankRefCode(e.target.value)}
                      placeholder="e.g. STANBIC-FT-849201 or teller slip ID"
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Bank transfers are recorded as pending until verified by E-HOMES finance officers.
                    </span>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Authorize & Pay {formatUGX(depositAmountUGX)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {paymentStep === 'processing' && (
            <div className="py-12 px-4 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto" />
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {paymentMethod === 'bank_transfer'
                    ? 'Submitting Bank Transfer Records...'
                    : `Sending USSD Push to ${phoneNumber}...`}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {paymentMethod === 'bank_transfer'
                    ? 'Please do not close this window.'
                    : `Please check your phone and enter your Mobile Money PIN (${countdown}s remaining)`}
                </p>
              </div>
            </div>
          )}

          {paymentStep === 'completed' && completedTx && (
            <div className="py-6 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  {completedTx.status === 'verified' ? 'Payment Verified & Approved' : 'Payment Submitted for Verification'}
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-1">
                  Plot Reservation Confirmed!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Transaction Reference: <strong className="font-mono text-slate-900">{completedTx.reference}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reserved Plot:</span>
                  <strong className="text-slate-900">{completedTx.plotNumber} ({completedTx.estateName})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <strong className="text-slate-900 tabular-nums">{formatUGX(completedTx.amountUGX)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className={`font-bold ${completedTx.status === 'verified' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {completedTx.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 rounded-xl"
                >
                  View in My Customer Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
