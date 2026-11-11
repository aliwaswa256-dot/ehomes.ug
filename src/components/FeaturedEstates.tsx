import React from 'react';
import { Estate } from '../types';
import { formatUGX } from '../utils/formatters';
import { MapPin, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FeaturedEstatesProps {
  estates: Estate[];
  onSelectEstate: (estateId: string) => void;
  onExploreAll: () => void;
}

export const FeaturedEstates: React.FC<FeaturedEstatesProps> = ({
  estates,
  onSelectEstate,
  onExploreAll,
}) => {
  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
            <span>Prime Developments</span>
            <span aria-hidden="true">·</span>
            <span>Surveyed & Registered</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            Featured Land Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Carefully curated estate developments with ready infrastructure, electricity, and clean titles.
          </p>
        </div>

        <button
          onClick={onExploreAll}
          className="text-xs font-bold uppercase tracking-wider text-cyan-800 hover:text-cyan-900 inline-flex items-center gap-1.5 transition-colors"
        >
          <span>View All Estates</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {estates.slice(0, 3).map((estate) => (
          <div
            key={estate.id}
            onClick={() => onSelectEstate(estate.id)}
            className="group cursor-pointer rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={estate.coverImage}
                  alt={estate.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-slate-900/90 text-cyan-300 border border-slate-700 backdrop-blur-xs">
                    {estate.titleType}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-slate-300 uppercase tracking-wider block">
                      Starting From
                    </span>
                    <span className="text-xl font-black tabular-nums">
                      {formatUGX(estate.startingPriceUGX)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-slate-950/70 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    {estate.availablePlotsCount} Plots Available
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>{estate.location} · {estate.district}</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                  {estate.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {estate.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {estate.amenities.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white rounded-xl transition-colors flex items-center justify-center gap-1.5">
                <span>View Estate Master Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
