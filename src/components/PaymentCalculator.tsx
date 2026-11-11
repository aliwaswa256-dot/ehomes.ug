import React, { useState, useEffect } from 'react';
import { Plot, PaymentPlanType } from '../types';
import { calculatePaymentPlan, formatUGX } from '../utils/formatters';
import {
  Calculator,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Percent,
  DollarSign,
  Info,
} from 'lucide-react';

interface PaymentCalculatorProps {
  plots: Plot[];
  initialSelectedPlot?: Plot | null;
  onProceedToPayment: (plot: Plot, planType: PaymentPlanType, depositAmount: number, tenure: string) => void;
}

export const PaymentCalculator: React.FC<PaymentCalculatorProps> = ({
  plots,
  initialSelectedPlot,
  onProceedToPayment,
}) => {
  // Available plots only for purchasing
  const availablePlots = plots.filter((p) => p.status === 'available');

  const [selectedPlotId, setSelectedPlotId] = useState<string>(
    initialSelectedPlot?.id || availablePlots[0]?.id || ''
  );

  const [planType, setPlanType] = useState<PaymentPlanType>('monthly');
  const [depositPercent, setDepositPercent] = useState<number>(30); // 30% default
  const [durationMonths, setDurationMonths] = useState<number>(12); // 12 months default
  const [durationYears, setDurationYears] = useState<number>(2); // 2 years default

  // Update selected plot if initialSelectedPlot changes
  useEffect(() => {
    if (initialSelectedPlot && initialSelectedPlot.id !== selectedPlotId) {
      setSelectedPlotId(initialSelectedPlot.id);
    }
  }, [initialSelectedPlot]);

  const currentPlot = plots.find((p) => p.id === selectedPlotId) || availablePlots[0] || plots[0];

  const calculation = calculatePaymentPlan(
    currentPlot ? currentPlot.priceUGX : 18000000,
    planType,
    depositPercent,
    durationMonths,
    durationYears
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Title & Description */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>Transparent Financial Planning</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Automatic Land Payment Calculator
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Select any available estate plot and customize your initial deposit and payment duration.
          Our automatic calculator displays exact instalments in UGX with zero hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Plot */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Choose Available Plot & Estate
            </label>
            <select
              value={selectedPlotId}
              onChange={(e) => setSelectedPlotId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 font-medium text-sm transition-all"
            >
              {plots.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  disabled={p.status !== 'available'}
                >
                  {p.estateName} — {p.plotNumber} ({p.dimensions}) - {formatUGX(p.priceUGX)}{' '}
                  {p.status !== 'available' ? `[${p.status.toUpperCase()}]` : ''}
                </option>
              ))}
            </select>
            {currentPlot && (
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <span>Estate: <strong>{currentPlot.estateName}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Size: <strong>{currentPlot.dimensions}</strong></span>
              </div>
            )}
          </div>

          {/* Step 2: Choose Payment Plan Option */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Select Flexible Payment Option
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option A: Monthly */}
              <button
                type="button"
                onClick={() => setPlanType('monthly')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  planType === 'monthly'
                    ? 'border-cyan-600 bg-cyan-50/50 ring-2 ring-cyan-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-900">
                    Option A
                  </span>
                  <Clock className={`w-4 h-4 ${planType === 'monthly' ? 'text-cyan-600' : 'text-slate-400'}`} />
                </div>
                <div className="font-extrabold text-slate-900 text-sm mt-1">
                  Monthly Plan
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Spread over 6 to 36 months
                </div>
              </button>

              {/* Option B: Annual */}
              <button
                type="button"
                onClick={() => setPlanType('annual')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  planType === 'annual'
                    ? 'border-cyan-600 bg-cyan-50/50 ring-2 ring-cyan-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-900">
                    Option B
                  </span>
                  <Calendar className={`w-4 h-4 ${planType === 'annual' ? 'text-cyan-600' : 'text-slate-400'}`} />
                </div>
                <div className="font-extrabold text-slate-900 text-sm mt-1">
                  Annual Plan
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Agreed 1 to 3 yearly instalments
                </div>
              </button>

              {/* Option C: Full Settlement */}
              <button
                type="button"
                onClick={() => setPlanType('full')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  planType === 'full'
                    ? 'border-cyan-600 bg-cyan-50/50 ring-2 ring-cyan-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-900">
                    Option C
                  </span>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-extrabold text-slate-900 text-sm mt-1">
                  Full Payment
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  5% Cash Discount
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Sliders for Monthly & Annual */}
          {planType !== 'full' && (
            <div className="space-y-5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              {/* Deposit Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    Initial Deposit ({depositPercent}%)
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {formatUGX(calculation.depositUGX)}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={depositPercent}
                  onChange={(e) => setDepositPercent(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>20% (Minimum)</span>
                  <span>30% (Standard)</span>
                  <span>40%</span>
                  <span>50%</span>
                  <span>60%</span>
                </div>
              </div>

              {/* Duration Slider: Monthly */}
              {planType === 'monthly' && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider">
                      Instalment Duration ({durationMonths} Months)
                    </span>
                    <span className="font-semibold text-cyan-700">
                      ~ {Math.round(durationMonths / 12 * 10) / 10} Years
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[6, 12, 18, 24, 36].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setDurationMonths(months)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          durationMonths === months
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {months}m
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration Slider: Annual */}
              {planType === 'annual' && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider">
                      Payment Period ({durationYears} Year{durationYears > 1 ? 's' : ''})
                    </span>
                    <span className="font-semibold text-cyan-700">
                      Annual Instalments
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((years) => (
                      <button
                        key={years}
                        type="button"
                        onClick={() => setDurationYears(years)}
                        className={`py-2.5 text-xs font-bold rounded-lg border transition-all ${
                          durationYears === years
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {years} Year{years > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {planType === 'full' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant 5% Cash Discount Applied</span>
              </div>
              <p className="text-emerald-700">
                You save <strong>{formatUGX(calculation.discountAppliedUGX)}</strong> on this purchase!
                Immediate signing of land sale agreements and title deed transfer initiated within 7 business days.
              </p>
            </div>
          )}
        </div>

        {/* Breakdown Summary Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Official Estimate
              </span>
              <h3 className="text-xl font-bold text-white">Payment Breakdown</h3>
            </div>
            <span className="text-xs font-mono px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
              UGX Currency
            </span>
          </div>

          {/* Primary Highlight Metric: Monthly / Annual Instalment */}
          {planType !== 'full' ? (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {planType === 'monthly' ? 'Estimated Monthly Instalment' : 'Agreed Annual Instalment'}
              </span>
              <div className="text-3xl font-black text-cyan-300 tracking-tight tabular-nums">
                {formatUGX(calculation.instalmentAmountUGX)}
              </div>
              <span className="text-[11px] text-slate-400 block pt-1">
                for {calculation.durationLabel} ({calculation.numberOfInstalments} payments total)
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 space-y-1">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                Discounted Full Price
              </span>
              <div className="text-3xl font-black text-emerald-300 tracking-tight tabular-nums">
                {formatUGX(calculation.totalPriceUGX)}
              </div>
              <span className="text-[11px] text-emerald-400 block pt-1">
                5% discount applied: Save {formatUGX(calculation.discountAppliedUGX)}
              </span>
            </div>
          )}

          {/* Detailed Itemization Table */}
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Total Land Purchase Price:</span>
              <span className="font-semibold text-white tabular-nums">
                {formatUGX(currentPlot ? currentPlot.priceUGX : 0)}
              </span>
            </div>

            {calculation.discountAppliedUGX > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-800 text-emerald-400">
                <span>Cash Payment Discount:</span>
                <span className="font-semibold tabular-nums">
                  - {formatUGX(calculation.discountAppliedUGX)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Initial Required Deposit:</span>
              <span className="font-semibold text-white tabular-nums">
                {formatUGX(calculation.depositUGX)} ({calculation.depositPercent}%)
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Remaining Balance:</span>
              <span className="font-semibold text-white tabular-nums">
                {formatUGX(calculation.balanceUGX)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Est. Completion Date:</span>
              <span className="font-semibold text-cyan-400">
                {calculation.completionDate}
              </span>
            </div>
          </div>

          {/* Proceed to reserve or pay CTA */}
          <div className="pt-2 space-y-3">
            {currentPlot?.status === 'available' ? (
              <button
                type="button"
                onClick={() =>
                  onProceedToPayment(
                    currentPlot,
                    planType,
                    calculation.depositUGX,
                    calculation.durationLabel
                  )
                }
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>PROCEED TO PURCHASE / PAY DEPOSIT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-center p-3 rounded-lg bg-slate-800 text-amber-400 text-xs">
                Selected plot is currently {currentPlot?.status}. Please select an available plot to proceed with payment.
              </div>
            )}

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Payments accepted via MTN MoMo, Airtel Money, or Bank Wire.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
