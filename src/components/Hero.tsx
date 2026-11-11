import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  MapPin,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/mockData';

interface HeroProps {
  onExploreLand: () => void;
  onSelectPlot: () => void;
  onContactUs: () => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreLand,
  onSelectPlot,
  onContactUs,
  onOpenCalculator,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Hero Image with measured dark gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_uganda_land_estate_1793824668136.jpg"
          alt="E-HOMES surveyed estate land development in Uganda"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.78] contrast-[1.05]"
        />
        {/* Measured Scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-6">
            {/* Unboxed editorial kicker */}
            <div className="flex items-center gap-2 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wider uppercase">
              <span>E-Homes Uganda</span>
              <span aria-hidden="true">·</span>
              <span>Bahai Road, Kampala</span>
              <span aria-hidden="true">·</span>
              <span>Licensed Real Estate</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white [text-wrap:balance]">
              OWN YOUR DREAM LAND WITH{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-200">
                E-HOMES.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Discover affordable land investment opportunities with flexible payment plans
              designed around you. From scenic lakeside plots in Entebbe to prime estates in
              Gayaza and Mukono — all with verifiable land titles.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onExploreLand}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>EXPLORE AVAILABLE LAND</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSelectPlot}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>INTERACTIVE MASTER PLAN</span>
              </button>

              <button
                onClick={onContactUs}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>CONTACT US</span>
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Ready Land Titles (Mailo/Freehold)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Monthly & Annual Instalments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Direct Site Inspection Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Bahai Road Head Office</span>
              </div>
            </div>
          </div>

          {/* Hero Quick Plan / Fast Plot Finder Card */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  BUILDING VALUE
                </span>
                <h3 className="text-lg font-bold text-white">Payment Options at a Glance</h3>
              </div>
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>Option A: Monthly Plan</span>
                  <span className="text-cyan-400">From 30% Deposit</span>
                </div>
                <p className="text-slate-400 mt-1">
                  Spread balance over 6, 12, 24, or 36 low monthly instalments.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>Option B: Annual Plan</span>
                  <span className="text-cyan-400">1 to 3 Years</span>
                </div>
                <p className="text-slate-400 mt-1">
                  Pay structured annual instalments matching harvest or seasonal cash flows.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>Option C: Full Payment</span>
                  <span className="text-emerald-400">5% Instant Discount</span>
                </div>
                <p className="text-slate-400 mt-1">
                  Immediate sale agreement and express title transfer initiation.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenCalculator}
              className="mt-5 w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-xl transition-all shadow-md shadow-cyan-600/20 text-center"
            >
              Open Payment Calculator
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
