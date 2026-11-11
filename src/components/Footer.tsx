import React from 'react';
import { BrandLogo } from './BrandLogo';
import { COMPANY_DETAILS } from '../data/mockData';
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenInquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenInquiry }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo variant="dark" size="lg" />
            <p className="text-slate-300 font-semibold text-sm">
              "{COMPANY_DETAILS.slogan}"
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              E-HOMES is Uganda's premier land and property development enterprise.
              We specialize in surveyed residential land acquisitions, title verification,
              and flexible monthly or annual payment plans designed to build generational value.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={COMPANY_DETAILS.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: +256 787 004962</span>
              </a>
              <a
                href={`tel:${COMPANY_DETAILS.phoneClean}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>{COMPANY_DETAILS.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Available Land
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plot-map')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Interactive Master Plan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('payment-plans')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Payment Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Instalment Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Estates Covered (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Uganda Estates
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-300 font-medium block">Gayaza Royale</span>
                <span className="text-[11px] text-slate-500">Wakiso District</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium block">Victoria Heights</span>
                <span className="text-[11px] text-slate-500">Entebbe Corridor</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium block">Mukono Greenfield</span>
                <span className="text-[11px] text-slate-500">Mukono District</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium block">Bahai Enclave</span>
                <span className="text-[11px] text-slate-500">Kampala City</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Head Office
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{COMPANY_DETAILS.location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${COMPANY_DETAILS.phoneClean}`} className="hover:text-white">
                  {COMPANY_DETAILS.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{COMPANY_DETAILS.email}</span>
              </p>
              <p className="flex items-start gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{COMPANY_DETAILS.workingHours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} E-HOMES (Uganda) Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Registered Land Company · Uganda</span>
            </span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-600 hover:text-slate-400 transition-colors"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
