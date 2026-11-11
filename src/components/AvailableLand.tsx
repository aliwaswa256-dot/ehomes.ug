import React, { useState, useMemo } from 'react';
import { Estate, Plot } from '../types';
import { formatUGX } from '../utils/formatters';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Ban,
  MapPin,
  Maximize2,
  Heart,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface AvailableLandProps {
  estates: Estate[];
  plots: Plot[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewPlotDetails: (plot: Plot, estate: Estate) => void;
  onBuyPlot: (plot: Plot) => void;
  onSelectOnMap: (plot: Plot) => void;
}

export const AvailableLand: React.FC<AvailableLandProps> = ({
  estates,
  plots,
  favorites,
  onToggleFavorite,
  onViewPlotDetails,
  onBuyPlot,
  onSelectOnMap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved' | 'sold'>('available');
  const [maxPrice, setMaxPrice] = useState<number>(70000000); // 70M UGX max
  const [sizeFilter, setSizeFilter] = useState('all');

  // Filtered plot listing
  const filteredPlots = useMemo(() => {
    return plots.filter((plot) => {
      const estate = estates.find((e) => e.id === plot.estateId);
      const matchesSearch =
        plot.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plot.estateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (estate && estate.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        plot.dimensions.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === 'all' ||
        (estate && estate.district.toLowerCase().includes(selectedLocation.toLowerCase())) ||
        (estate && estate.location.toLowerCase().includes(selectedLocation.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || plot.status === statusFilter;

      const matchesPrice = plot.priceUGX <= maxPrice;

      const matchesSize =
        sizeFilter === 'all' ||
        (sizeFilter === '50x100' && plot.dimensions.includes('50 × 100')) ||
        (sizeFilter === '100x100' && plot.dimensions.includes('100 × 100'));

      return matchesSearch && matchesLocation && matchesStatus && matchesPrice && matchesSize;
    });
  }, [plots, estates, searchTerm, selectedLocation, statusFilter, maxPrice, sizeFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLocation('all');
    setStatusFilter('available');
    setMaxPrice(70000000);
    setSizeFilter('all');
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
            <span>Verified Land Marketplace</span>
            <span aria-hidden="true">·</span>
            <span>Surveyed Plots in Uganda</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Browse Available Land Sites
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover titled residential plots with flexible monthly or annual payment options across Wakiso, Mukono, and Kampala.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong className="text-slate-900">{filteredPlots.length}</strong> of{' '}
          <strong className="text-slate-900">{plots.length}</strong> total plots
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by estate name (e.g. Gayaza, Entebbe, Mukono), plot number, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Location / District
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800"
            >
              <option value="all">All Locations (Uganda)</option>
              <option value="wakiso">Wakiso District (Gayaza & Entebbe)</option>
              <option value="mukono">Mukono District</option>
              <option value="kampala">Kampala City (Bahai Road)</option>
            </select>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Availability Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800"
            >
              <option value="available">Available Plots Only</option>
              <option value="all">All Statuses (Available, Reserved, Sold)</option>
              <option value="reserved">Reserved Plots</option>
              <option value="sold">Sold Out Plots</option>
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Plot Dimensions
            </label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800"
            >
              <option value="all">All Sizes</option>
              <option value="50x100">50 × 100 ft (Standard 12.5 Decimals)</option>
              <option value="100x100">100 × 100 ft (Quarter Acre / 25 Decimals)</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Budget Cap</span>
              <span className="text-cyan-700">{formatUGX(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="15000000"
              max="70000000"
              step="2000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-600 h-2 bg-slate-200 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Active Filter chips + Reset button */}
        {(searchTerm || selectedLocation !== 'all' || statusFilter !== 'available' || maxPrice < 70000000 || sizeFilter !== 'all') && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Filtered view active</span>
            <button
              onClick={resetFilters}
              className="text-cyan-700 hover:text-cyan-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Property Cards Grid */}
      {filteredPlots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlots.map((plot) => {
            const estate = estates.find((e) => e.id === plot.estateId) || estates[0];
            const isFav = favorites.includes(plot.id);

            return (
              <div
                key={plot.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Slot with Status Badge & Favorite Button */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={estate.coverImage}
                      alt={`${plot.plotNumber} at ${estate.name}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status Pill in corner */}
                    <div className="absolute top-3 left-3">
                      {plot.status === 'available' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                          <CheckCircle className="w-3 h-3" />
                          AVAILABLE
                        </span>
                      )}
                      {plot.status === 'reserved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                          <Clock className="w-3 h-3" />
                          RESERVED
                        </span>
                      )}
                      {plot.status === 'sold' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-700 text-white shadow-xs">
                          <Ban className="w-3 h-3" />
                          SOLD
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => onToggleFavorite(plot.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFav
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
                      }`}
                      aria-label="Add to favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Price Tag Overlay at bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end justify-between text-white">
                      <div>
                        <span className="text-[10px] text-slate-300 uppercase tracking-wider block">
                          Total Price
                        </span>
                        <span className="text-lg font-black tracking-tight tabular-nums">
                          {formatUGX(plot.priceUGX)}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono bg-cyan-500/90 text-white px-2 py-0.5 rounded">
                        {plot.dimensions}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                        <span className="truncate">{estate.location} · {estate.district}</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                        {plot.plotNumber} — {estate.name.split('-')[0].trim()}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {plot.description}
                      </p>
                    </div>

                    {/* Metadata unboxed text */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>Title: <strong className="text-slate-900">{estate.titleType}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Deposit (30%): <strong className="text-slate-900">{formatUGX(plot.priceUGX * 0.3)}</strong></span>
                    </div>

                    {/* Payment Plans Preview */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Est. Monthly:</span>
                      <strong className="text-cyan-800 font-bold tabular-nums">
                        {formatUGX((plot.priceUGX * 0.7) / 12)} /mo (12 mos)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onViewPlotDetails(plot, estate)}
                    className="py-2.5 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                  >
                    View Details
                  </button>

                  {plot.status === 'available' ? (
                    <button
                      onClick={() => onBuyPlot(plot)}
                      className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>Buy This Plot</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectOnMap(plot)}
                      className="py-2.5 px-3 text-xs font-medium text-slate-500 bg-slate-100 rounded-xl cursor-default text-center"
                    >
                      {plot.status === 'reserved' ? 'Reserved' : 'Sold Out'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Ban className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <h4 className="text-base font-bold text-slate-800">No matching plots found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your price filter, location, or search term to see more available land.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
