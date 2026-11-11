import React from 'react';
import { Compass, Calculator, CreditCard, Award, ArrowRight } from 'lucide-react';

interface HowToBuyProps {
  onSelectPlot: () => void;
  onOpenCalculator: () => void;
}

export const HowToBuy: React.FC<HowToBuyProps> = ({ onSelectPlot, onOpenCalculator }) => {
  const steps = [
    {
      num: '01',
      title: 'Explore & Choose Your Plot',
      desc: 'Browse available land projects or view our interactive SVG master plans. Click on your preferred plot to check exact dimensions, road access, and beacons.',
      icon: Compass,
      action: 'Open Master Plan',
      onClick: onSelectPlot,
    },
    {
      num: '02',
      title: 'Calculate Your Payment Plan',
      desc: 'Decide how you want to pay: spread balance over monthly instalments (6-36 months), annual lump sums, or enjoy a 5% discount on full cash payment.',
      icon: Calculator,
      action: 'Calculate Plan',
      onClick: onOpenCalculator,
    },
    {
      num: '03',
      title: 'Secure with Initial Deposit',
      desc: 'Pay your initial commitment (from 20-30%) securely via MTN Mobile Money, Airtel Money, or direct bank transfer to lock in the plot and prevent double booking.',
      icon: CreditCard,
      action: 'View Payment Gateways',
      onClick: onOpenCalculator,
    },
    {
      num: '04',
      title: 'Sign Agreement & Transfer Title',
      desc: 'Our legal advocates draft your registered land sale agreement. Clear your instalments, receive your official handover certificate, and complete your title deed transfer.',
      icon: Award,
      action: 'Legal Guarantee',
      onClick: onSelectPlot,
    },
  ];

  return (
    <section className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
          <span>Straightforward Acquisition</span>
          <span aria-hidden="true">·</span>
          <span>4-Step Process</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          How to Purchase Land with E-HOMES
        </h2>
        <p className="text-slate-600 text-sm">
          A transparent, guided digital and in-person process designed for peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-cyan-700">
                    {step.num}
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700">
                    <Icon className="w-5 h-5" />
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={step.onClick}
                  className="w-full py-2 text-xs font-bold text-cyan-800 hover:text-cyan-900 flex items-center justify-between group"
                >
                  <span>{step.action}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
