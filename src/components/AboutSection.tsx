import React from 'react';
import { COMPANY_DETAILS } from '../data/mockData';
import { ShieldCheck, Target, HeartHandshake, MapPin, Phone, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="space-y-12">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-6">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <span>About E-Homes Uganda</span>
            <span aria-hidden="true">·</span>
            <span>BUILDING VALUE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Your Land. Your Investment.{' '}
            <span className="text-cyan-400">Your Future.</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Headquartered on <strong>Bahai Road, Kampala, Uganda</strong>, E-HOMES was founded
            with a singular mission: to make authentic land ownership in Uganda transparent, secure,
            and financially accessible for every hardworking individual and diaspora family.
          </p>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Too many people have lost life savings to rogue middlemen and disputed plots.
            E-HOMES eliminates the uncertainty through legally verified Private Mailo and Freehold title deeds,
            cadastral survey beacons, and flexible payment plans that accommodate real-world income flows.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Our Mission</h3>
            <p className="text-xs text-slate-400">
              To democratize titled property ownership in Uganda through transparent surveying, digital plot selection, and ethical financing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Zero Fraud Commitment</h3>
            <p className="text-xs text-slate-400">
              All land undergoes comprehensive title search and community boundaries verification prior to estate demarcation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <HeartHandshake className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Client Partnership</h3>
            <p className="text-xs text-slate-400">
              From your initial plot selection to the final handover of your registered title deed, our legal officers walk with you every step.
            </p>
          </div>
        </div>
      </div>

      {/* Physical Office Highlight */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider block">
            Visit Us in Person
          </span>
          <h4 className="text-xl font-black text-slate-900">
            Bahai Road Corporate Office
          </h4>
          <p className="text-xs text-slate-600 max-w-xl">
            {COMPANY_DETAILS.location}. Open Monday to Saturday. Walk in for a coffee and inspect deed plans, or arrange free chauffeured site visits to our estates.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`tel:${COMPANY_DETAILS.phoneClean}`}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-cyan-400" />
            <span>Call {COMPANY_DETAILS.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
