import React from 'react';
import { Estate, Plot } from '../types';
import { formatUGX } from '../utils/formatters';
import {
  X,
  MapPin,
  CheckCircle,
  Clock,
  Ban,
  ShieldCheck,
  Calendar,
  ExternalLink,
  PhoneCall,
  ArrowRight,
  Maximize2,
  Check,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/mockData';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plot: Plot | null;
  estate: Estate | null;
  onBuyPlot: (plot: Plot) => void;
  onCalculatePlot: (plot: Plot) => void;
  onInquirePlot: (plot: Plot) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  isOpen,
  onClose,
  plot,
  estate,
  onBuyPlot,
  onCalculatePlot,
  onInquirePlot,
}) => {
  if (!isOpen || !plot || !estate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        {/* Cover Image & Close Button */}
        <div className="relative aspect-[16/8] sm:aspect-[16/7] bg-slate-900 overflow-hidden">
          <img
            src={estate.coverImage}
            alt={estate.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay titles */}
          <div className="absolute bottom-4 left-6 right-6 text-white flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                {estate.district} · {estate.location}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">{plot.plotNumber}</h2>
              <span className="text-xs text-slate-300 font-mono">{estate.name}</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-300 uppercase block">Total Price</span>
              <span className="text-2xl font-black text-white tabular-nums">
                {formatUGX(plot.priceUGX)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Dimensions</span>
              <strong className="text-slate-900 font-bold text-sm block mt-0.5">{plot.dimensions}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Land Title</span>
              <strong className="text-slate-900 font-bold text-sm block mt-0.5">{estate.titleType}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Distance</span>
              <strong className="text-slate-900 font-bold text-sm block mt-0.5">{estate.distanceFromKampala}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Availability</span>
              <div className="mt-1">
                {plot.status === 'available' && (
                  <span className="font-bold text-emerald-700">Available ✓</span>
                )}
                {plot.status === 'reserved' && (
                  <span className="font-bold text-amber-700">Reserved (Under Plan)</span>
                )}
                {plot.status === 'sold' && (
                  <span className="font-bold text-slate-600">Sold Out</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Estate & Plot Overview
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {estate.description}
            </p>
            <p className="text-xs text-slate-600">
              {plot.description}
            </p>
          </div>

          {/* Amenities & Survey Assurance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Estate Infrastructure & Legal Assurance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {estate.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Survey status: {estate.surveyStatus}</span>
              </div>
            </div>
          </div>

          {/* Flexible Payment Plans Preview for this Plot */}
          <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-100 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-900 uppercase tracking-wider">
                Payment Plans for this Plot
              </span>
              <span className="text-cyan-800 font-semibold">Zero compound interest</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-cyan-100">
                <strong className="block text-slate-900">Monthly Plan (12m)</strong>
                <span className="text-cyan-800 font-black text-sm block mt-0.5 tabular-nums">
                  {formatUGX((plot.priceUGX * 0.7) / 12)} /mo
                </span>
                <span className="text-[11px] text-slate-500">After 30% initial deposit</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-cyan-100">
                <strong className="block text-slate-900">Annual Plan (2y)</strong>
                <span className="text-cyan-800 font-black text-sm block mt-0.5 tabular-nums">
                  {formatUGX((plot.priceUGX * 0.7) / 2)} /yr
                </span>
                <span className="text-[11px] text-slate-500">2 yearly instalments</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-cyan-100">
                <strong className="block text-slate-900">Full Cash Price</strong>
                <span className="text-emerald-700 font-black text-sm block mt-0.5 tabular-nums">
                  {formatUGX(plot.priceUGX * 0.95)}
                </span>
                <span className="text-[11px] text-emerald-600">5% Instant Discount</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {plot.status === 'available' ? (
              <button
                onClick={() => {
                  onClose();
                  onBuyPlot(plot);
                }}
                className="w-full sm:flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>BUY THIS PLOT (PAY DEPOSIT)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-full sm:flex-1 py-3 px-4 text-xs font-bold text-center text-slate-600 bg-slate-100 rounded-xl">
                Plot is currently {plot.status.toUpperCase()}
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                onCalculatePlot(plot);
              }}
              className="w-full sm:w-auto py-3 px-5 text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 hover:bg-cyan-200 rounded-xl transition-colors"
            >
              Open Calculator
            </button>

            <button
              onClick={() => {
                onClose();
                onInquirePlot(plot);
              }}
              className="w-full sm:w-auto py-3 px-4 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Book Site Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
