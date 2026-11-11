import React from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileCheck,
} from 'lucide-react';

interface PaymentPlansSectionProps {
  onOpenCalculator: () => void;
  onExplorePlots: () => void;
}

export const PaymentPlansSection: React.FC<PaymentPlansSectionProps> = ({
  onOpenCalculator,
  onExplorePlots,
}) => {
  return (
    <section className="space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-cyan-600 text-xs font-bold uppercase tracking-wider">
          <span>E-Homes Flexibility</span>
          <span aria-hidden="true">·</span>
          <span>Zero Compounding Interest</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Flexible Payment Plans Built Around You
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          At E-HOMES, we believe every Ugandan deserves the pride of owning titled land.
          Choose between monthly instalments, annual harvest-aligned payments, or full cash settlement.
        </p>
      </div>

      {/* 3 Main Payment Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* OPTION A: MONTHLY PAYMENT */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-wider uppercase text-cyan-700 bg-cyan-50 px-3 py-1 rounded-md border border-cyan-100">
                OPTION A
              </span>
              <span className="p-2 rounded-xl bg-slate-50 text-slate-700 group-hover:text-cyan-600 transition-colors">
                <Clock className="w-5 h-5" />
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Monthly Payment
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ideal for salaried professionals, business managers, and steady monthly earners.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Flexible Initial Deposit:</strong> Start with as low as 20% to 30% upfront.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Monthly Instalments:</strong> Spread remaining balance across 6, 12, 24, or 36 months.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Convenient Mobile Money:</strong> Pay directly via MTN MoMo or Airtel Money with instant digital receipts.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Immediate Site Utilization:</strong> Begin boundary fencing upon reaching 50% threshold.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
            <button
              onClick={onOpenCalculator}
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Calculate Monthly Dues</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* OPTION B: ANNUAL PAYMENT */}
        <div className="rounded-3xl border-2 border-cyan-500 bg-white p-7 shadow-lg shadow-cyan-500/10 flex flex-col justify-between relative group">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-sm">
            Popular for Diaspora & Agriculture
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-wider uppercase text-cyan-800 bg-cyan-100 px-3 py-1 rounded-md">
                OPTION B
              </span>
              <span className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
                <Calendar className="w-5 h-5" />
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Annual Payment
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Perfect for agricultural business owners, diaspora bonuses, and contract lump sums.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Initial Deposit:</strong> Secure your plot beacon with 30% initial commitment.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Annual Instalments:</strong> Balance is split into agreed yearly payments over 1, 2, or 3 years.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Bank Transfer Verification:</strong> Verified electronic transfers with bank reconciliation.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Legal Sale Agreement:</strong> Formally executed agreement registered by company advocates.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
            <button
              onClick={onOpenCalculator}
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <span>Calculate Annual Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* OPTION C: FULL PAYMENT */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">
                OPTION C
              </span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Sparkles className="w-5 h-5" />
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Full Outright Payment
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                For ready buyers looking for maximum discount and fastest deed transfer.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>5% Instant Cash Discount:</strong> Save up to UGX 2,500,000 on executive plots.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Fast-Track Title Deed:</strong> Ownership transfer initiated at Ministry Zonal Office within 7 days.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Immediate Construction:</strong> Start building your dream residential home right away.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Full Documentation:</strong> Signed transfer forms, deed prints, and handover certificate.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
            <button
              onClick={onExplorePlots}
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Discounted Plots</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Land Title Security</span>
          </div>
          <h4 className="text-xl font-bold text-white">
            Need a custom corporate or cooperative payment structure?
          </h4>
          <p className="text-xs text-slate-400">
            Our legal and financial advisors at Bahai Road can tailor payment timelines for SACCOs, family syndicates, and diaspora groups.
          </p>
        </div>

        <button
          onClick={onOpenCalculator}
          className="shrink-0 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          Open Custom Calculator
        </button>
      </div>
    </section>
  );
};
