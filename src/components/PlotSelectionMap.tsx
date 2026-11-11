import React, { useState } from 'react';
import { Estate, Plot } from '../types';
import { formatUGX } from '../utils/formatters';
import {
  Compass,
  CheckCircle,
  Clock,
  Ban,
  ArrowRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface PlotSelectionMapProps {
  estates: Estate[];
  plots: Plot[];
  selectedEstateId: string;
  setSelectedEstateId: (id: string) => void;
  onSelectPlotForPurchase: (plot: Plot) => void;
  onCalculatePlot: (plot: Plot) => void;
  onInquirePlot: (plot: Plot) => void;
}

export const PlotSelectionMap: React.FC<PlotSelectionMapProps> = ({
  estates,
  plots,
  selectedEstateId,
  setSelectedEstateId,
  onSelectPlotForPurchase,
  onCalculatePlot,
  onInquirePlot,
}) => {
  const currentEstate = estates.find((e) => e.id === selectedEstateId) || estates[0];
  const estatePlots = plots.filter((p) => p.estateId === currentEstate.id);

  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(
    estatePlots.find((p) => p.status === 'available') || estatePlots[0] || null
  );

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Status statistics for this estate
  const total = estatePlots.length;
  const availableCount = estatePlots.filter((p) => p.status === 'available').length;
  const reservedCount = estatePlots.filter((p) => p.status === 'reserved').length;
  const soldCount = estatePlots.filter((p) => p.status === 'sold').length;

  const handlePlotClick = (plot: Plot) => {
    setSelectedPlot(plot);
  };

  const getPlotFill = (status: Plot['status'], isSelected: boolean) => {
    if (isSelected) {
      return '#06b6d4'; // bright cyan highlight
    }
    switch (status) {
      case 'available':
        return '#10b981'; // emerald green
      case 'reserved':
        return '#f59e0b'; // amber orange
      case 'sold':
        return '#64748b'; // slate grey
      default:
        return '#cbd5e1';
    }
  };

  const getPlotStroke = (status: Plot['status'], isSelected: boolean) => {
    if (isSelected) {
      return '#0891b2';
    }
    switch (status) {
      case 'available':
        return '#047857';
      case 'reserved':
        return '#b45309';
      case 'sold':
        return '#475569';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar & Estate Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Interactive Site Layout Master Plan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Select Your Preferred Plot
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any demarcated plot on the estate master plan to view real-time survey specs, prices, and available payment terms.
            </p>
          </div>

          {/* Estate Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {estates.map((estate) => (
              <button
                key={estate.id}
                onClick={() => {
                  setSelectedEstateId(estate.id);
                  const firstPlot = plots.find((p) => p.estateId === estate.id && p.status === 'available');
                  setSelectedPlot(firstPlot || null);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all duration-150 ${
                  estate.id === currentEstate.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {estate.name.split('-')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Legend and Real-time Status Counter */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 shadow-xs"></span>
              <span className="font-semibold text-slate-800">Available ({availableCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-600 shadow-xs"></span>
              <span className="font-semibold text-slate-800">Reserved ({reservedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-500 border border-slate-600 shadow-xs"></span>
              <span className="font-semibold text-slate-800">Sold ({soldCount})</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-cyan-400 border border-cyan-600 shadow-xs"></span>
              <span className="font-semibold text-cyan-800">Selected Plot</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span>Title: <strong className="text-slate-800">{currentEstate.titleType}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Total Plots: <strong className="text-slate-800">{total}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Site Map on Left (8 cols) + Selected Plot Sidebar on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Master Plan Canvas */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800 relative overflow-hidden">
          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-4 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono text-cyan-400 border border-slate-700">
                {currentEstate.name}
              </span>
              <span className="hidden sm:inline text-xs text-slate-400">
                {currentEstate.location} ({currentEstate.district})
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Site Map Container */}
          <div className="relative w-full overflow-auto rounded-xl bg-slate-950/80 border border-slate-800 p-2 sm:p-4 min-h-[380px] flex items-center justify-center">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="w-full max-w-[640px] aspect-[16/10] relative select-none"
            >
              <svg
                viewBox="0 0 640 400"
                className="w-full h-full drop-shadow-lg"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Terrain Grass Pattern */}
                <rect width="640" height="400" fill="#0d1b1e" rx="12" />

                {/* Compass Rose */}
                <g transform="translate(590, 45)">
                  <circle r="18" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                  <path d="M0 -14 L4 0 L0 14 L-4 0 Z" fill="#06b6d4" />
                  <path d="M0 -14 L4 0 L0 0 Z" fill="#22d3ee" />
                  <text x="0" y="-17" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="bold">
                    N
                  </text>
                </g>

                {/* Main 50ft Estate Access Boulevard */}
                <rect x="0" y="195" width="640" height="40" fill="#2d3748" />
                <line x1="0" y1="215" x2="640" y2="215" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="12,12" opacity="0.6" />
                <text x="320" y="219" fill="#94a3b8" fontSize="10" fontWeight="bold" letterSpacing="3" textAnchor="middle">
                  MAIN 40FT ESTATE ACCESS ROAD
                </text>

                {/* Estate Gate & Entrance Marker */}
                <rect x="0" y="185" width="25" height="60" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="12" y="218" fill="#38bdf8" fontSize="8" fontWeight="bold" transform="rotate(-90 12,218)" textAnchor="middle">
                  SECURITY GATE
                </text>

                {/* Green Reserve Buffer / Tree Line */}
                <rect x="0" y="365" width="640" height="35" fill="#14532d" opacity="0.8" />
                <text x="320" y="386" fill="#86efac" fontSize="9" fontWeight="bold" letterSpacing="2" textAnchor="middle">
                  PLANNED ESTATE COMMUNITY GREEN BELT & PLAYGROUND
                </text>

                {/* Individual Demarcated Plots */}
                {estatePlots.map((plot) => {
                  const coords = plot.svgCoords || { x: 50, y: 50, width: 80, height: 60 };
                  const isSelected = selectedPlot?.id === plot.id;
                  const fillColor = getPlotFill(plot.status, isSelected);
                  const strokeColor = getPlotStroke(plot.status, isSelected);

                  return (
                    <g
                      key={plot.id}
                      onClick={() => handlePlotClick(plot)}
                      className="cursor-pointer transition-all duration-150 group"
                      tabIndex={0}
                      role="button"
                      aria-label={`${plot.plotNumber} - ${plot.status} - ${formatUGX(plot.priceUGX)}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handlePlotClick(plot);
                        }
                      }}
                    >
                      {/* Plot Boundary Rectangle */}
                      <rect
                        x={coords.x}
                        y={coords.y}
                        width={coords.width}
                        height={coords.height}
                        rx="4"
                        fill={fillColor}
                        fillOpacity={isSelected ? 0.95 : 0.8}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="transition-transform group-hover:filter group-hover:brightness-110"
                      />

                      {/* Boundary Corner Beacons */}
                      <circle cx={coords.x + 3} cy={coords.y + 3} r="2" fill="#ffffff" opacity="0.7" />
                      <circle cx={coords.x + coords.width - 3} cy={coords.y + 3} r="2" fill="#ffffff" opacity="0.7" />
                      <circle cx={coords.x + 3} cy={coords.y + coords.height - 3} r="2" fill="#ffffff" opacity="0.7" />
                      <circle cx={coords.x + coords.width - 3} cy={coords.y + coords.height - 3} r="2" fill="#ffffff" opacity="0.7" />

                      {/* Plot Label */}
                      <text
                        x={coords.x + coords.width / 2}
                        y={coords.y + coords.height / 2 - 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={coords.width > 100 ? '12' : '10'}
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow-sm"
                      >
                        {plot.plotNumber}
                      </text>

                      {/* Dimensions or Status Pill */}
                      <text
                        x={coords.x + coords.width / 2}
                        y={coords.y + coords.height / 2 + 10}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="8"
                        opacity="0.9"
                        className="pointer-events-none drop-shadow-xs"
                      >
                        {plot.status === 'available'
                          ? plot.dimensions.split('(')[0].trim()
                          : plot.status.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-3 text-center text-xs text-slate-400">
            <span>Tip: Click on any plot above to view exact pricing, flexible payment schedule, or book for site inspection.</span>
          </div>
        </div>

        {/* Selected Plot Detail Card / Action Drawer */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
          {selectedPlot ? (
            <>
              {/* Header with Plot Number & Availability Status */}
              <div className="flex items-start justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {selectedPlot.estateName}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    {selectedPlot.plotNumber}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {selectedPlot.blockNumber}
                  </span>
                </div>

                {/* Status Badge */}
                <div>
                  {selectedPlot.status === 'available' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Available
                    </span>
                  )}
                  {selectedPlot.status === 'reserved' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      Reserved
                    </span>
                  )}
                  {selectedPlot.status === 'sold' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
                      <Ban className="w-3.5 h-3.5" />
                      Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Deposit Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Total Purchase Price
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {formatUGX(selectedPlot.priceUGX)}
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>Initial 30% Deposit:</span>
                  <strong className="text-slate-900 font-bold">
                    {formatUGX(selectedPlot.priceUGX * 0.3)}
                  </strong>
                </div>
              </div>

              {/* Plot Specs */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Dimensions:</span>
                  <span className="font-semibold text-slate-900">{selectedPlot.dimensions}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Land Title Type:</span>
                  <span className="font-semibold text-slate-900">{currentEstate.titleType}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Survey Verification:</span>
                  <span className="font-semibold text-emerald-700">Beacons In Place ✓</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Road Frontage:</span>
                  <span className="font-semibold text-slate-900">40ft Graded Access</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Plot Highlights
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlot.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded bg-cyan-50 text-cyan-800 border border-cyan-100 font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div className="pt-2 space-y-2.5">
                {selectedPlot.status === 'available' ? (
                  <>
                    <button
                      onClick={() => onSelectPlotForPurchase(selectedPlot)}
                      className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>BUY THIS PLOT NOW</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onCalculatePlot(selectedPlot)}
                      className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Calculate Payment Plan</span>
                    </button>
                  </>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                    <p className="font-semibold">
                      This plot is {selectedPlot.status === 'reserved' ? 'currently reserved' : 'sold out'}.
                    </p>
                    <p className="text-amber-700">
                      You cannot double-book this plot. You can make an inquiry to be notified if the reservation expires or explore neighboring available plots.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => onInquirePlot(selectedPlot)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                >
                  Book Free Site Visit for {selectedPlot.plotNumber}
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Compass className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm">Click on any plot in the site map to inspect details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
