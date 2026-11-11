import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { Quote, Star, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
          <span>Client Satisfaction</span>
          <span aria-hidden="true">·</span>
          <span>Verified Landowners</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Trusted by Homebuilders & Diaspora Investors
        </h2>
        <p className="text-slate-600 text-sm">
          Hear from real landowners who secured their plots and title deeds with E-HOMES.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Quote className="w-8 h-8 text-cyan-500/30" />
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1">
              <h4 className="text-sm font-black text-slate-900">{t.name}</h4>
              <p className="text-xs text-slate-500">{t.role} · {t.location}</p>
              <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.purchase}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
