import React from 'react';
import { ShieldCheck, Calendar, Compass, Building, CheckCircle2 } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      title: 'Verifiable Land Titles',
      desc: 'Every estate holds authentic Private Mailo or Freehold title deeds. We encourage independent search and verification at the relevant Ministry of Lands Zonal Offices before any payment.',
      icon: ShieldCheck,
      stat: '100% Clean Deeds',
    },
    {
      title: 'Flexible Payment Plans',
      desc: 'Purchase land without depleting your capital. Pay an initial deposit of 20-30% and clear the balance in easy monthly instalments or annual harvest payments over up to 36 months.',
      icon: Calendar,
      stat: 'Up to 36 Months',
    },
    {
      title: 'Surveyed Boundary Beacons',
      desc: 'All plots are demarcated with physical concrete boundary beacons by registered surveyors. You can view individual plot dimensions on our interactive master plans.',
      icon: Compass,
      stat: 'Exact GPS Points',
    },
    {
      title: 'Permanent Bahai Road Presence',
      desc: 'We are not freelance street brokers. Visit our registered headquarters on Bahai Road, Kampala to meet our in-house legal team, inspect title files, and schedule site inspections.',
      icon: Building,
      stat: 'Licensed Corporate Entity',
    },
  ];

  return (
    <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-10">
      <div className="max-w-2xl space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <span>The E-Homes Guarantee</span>
          <span aria-hidden="true">·</span>
          <span>Building Value</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Why Discerning Ugandans Invest with E-HOMES
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Land fraud in Uganda is a major risk when dealing with informal brokers.
          E-HOMES operates with complete institutional transparency, legal diligence, and customer-first flexibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((r, idx) => {
          const Icon = r.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-cyan-500/50 transition-colors space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold text-cyan-300 font-mono">
                  {r.stat}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{r.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
