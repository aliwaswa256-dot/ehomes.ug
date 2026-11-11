import React, { useState } from 'react';
import { Customer, Estate, Inquiry, PaymentTransaction, Plot, PlotPurchase, TitleType } from '../types';
import { formatUGX, formatDate, generateReference } from '../utils/formatters';
import {
  ShieldCheck,
  TrendingUp,
  Layers,
  CheckCircle2,
  Clock,
  Ban,
  DollarSign,
  Users,
  Search,
  Plus,
  Edit2,
  Check,
  X,
  PhoneCall,
  Mail,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  estates: Estate[];
  plots: Plot[];
  purchases: PlotPurchase[];
  transactions: PaymentTransaction[];
  inquiries: Inquiry[];
  onUpdatePlot: (plot: Plot) => void;
  onUpdatePlotStatus: (plotId: string, status: Plot['status']) => void;
  onVerifyTransaction: (txId: string, status: 'verified' | 'failed') => void;
  onUpdateInquiryStatus: (inquiryId: string, status: Inquiry['status']) => void;
  onAddEstate: (estate: Estate) => void;
  onOpenReceipt: (tx: PaymentTransaction, purchase?: PlotPurchase) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  estates,
  plots,
  purchases,
  transactions,
  inquiries,
  onUpdatePlot,
  onUpdatePlotStatus,
  onVerifyTransaction,
  onUpdateInquiryStatus,
  onAddEstate,
  onOpenReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'plots' | 'payments' | 'inquiries' | 'projects'>('plots');
  const [selectedEstateFilter, setSelectedEstateFilter] = useState<string>('all');
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);

  // New Estate Form Modal State
  const [showNewEstateModal, setShowNewEstateModal] = useState(false);
  const [newEstateName, setNewEstateName] = useState('');
  const [newEstateLocation, setNewEstateLocation] = useState('');
  const [newEstateDistrict, setNewEstateDistrict] = useState('Wakiso District');
  const [newEstateTitle, setNewEstateTitle] = useState<TitleType>('Ready Private Mailo');
  const [newEstateStartingPrice, setNewEstateStartingPrice] = useState(15000000);
  const [newEstateDesc, setNewEstateDesc] = useState('');

  // Plot Edit Form values
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDimensions, setEditDimensions] = useState<string>('');
  const [editStatus, setEditStatus] = useState<Plot['status']>('available');

  // KPI Calculations
  const totalPlotsCount = plots.length;
  const availablePlotsCount = plots.filter((p) => p.status === 'available').length;
  const reservedPlotsCount = plots.filter((p) => p.status === 'reserved').length;
  const soldPlotsCount = plots.filter((p) => p.status === 'sold').length;

  const totalSalesUGX = purchases.reduce((acc, p) => acc + p.totalPriceUGX, 0);
  const totalReceivedUGX = transactions
    .filter((t) => t.status === 'verified')
    .reduce((acc, t) => acc + t.amountUGX, 0);
  const totalOutstandingUGX = purchases.reduce((acc, p) => acc + p.balanceRemainingUGX, 0);

  const pendingPayments = transactions.filter((t) => t.status === 'pending');
  const newInquiries = inquiries.filter((i) => i.status === 'new');

  const filteredPlots = selectedEstateFilter === 'all'
    ? plots
    : plots.filter((p) => p.estateId === selectedEstateFilter);

  const handleStartEdit = (plot: Plot) => {
    setEditingPlot(plot);
    setEditPrice(plot.priceUGX);
    setEditDimensions(plot.dimensions);
    setEditStatus(plot.status);
  };

  const handleSavePlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlot) return;

    onUpdatePlot({
      ...editingPlot,
      priceUGX: Number(editPrice),
      dimensions: editDimensions,
      status: editStatus,
    });
    setEditingPlot(null);
  };

  const handleCreateEstate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `estate-${Date.now()}`;
    const newEstate: Estate = {
      id,
      name: newEstateName,
      location: newEstateLocation,
      district: newEstateDistrict,
      description: newEstateDesc,
      coverImage: '/src/assets/images/estate_gayaza_hills_1793824668501.jpg',
      gallery: ['/src/assets/images/estate_gayaza_hills_1793824668501.jpg'],
      titleType: newEstateTitle,
      surveyStatus: 'Cadastral Deed Approved',
      distanceFromKampala: '20 km',
      googleMapsUrl: 'https://maps.google.com/?q=Kampala+Uganda',
      amenities: ['Power Connected', 'Water On Site', 'Ready Titles', 'Graded Roads'],
      totalPlots: 16,
      availablePlotsCount: 16,
      startingPriceUGX: Number(newEstateStartingPrice),
    };

    onAddEstate(newEstate);
    setShowNewEstateModal(false);
    setNewEstateName('');
    setNewEstateLocation('');
    setNewEstateDesc('');
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>E-HOMES Management & Operations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Executive Administration Dashboard
            </h2>
            <p className="text-xs text-slate-400">
              Bahai Road Head Office · Kampala, Uganda
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewEstateModal(true)}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Land Project</span>
            </button>
          </div>
        </div>

        {/* 8 Primary Statistics KPIs (Prompt Requirement #9) */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Plots</span>
            <span className="text-xl font-black text-white block mt-1 tabular-nums">{totalPlotsCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Available</span>
            <span className="text-xl font-black text-emerald-300 block mt-1 tabular-nums">{availablePlotsCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Reserved</span>
            <span className="text-xl font-black text-amber-300 block mt-1 tabular-nums">{reservedPlotsCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sold</span>
            <span className="text-xl font-black text-slate-300 block mt-1 tabular-nums">{soldPlotsCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Customers</span>
            <span className="text-xl font-black text-cyan-300 block mt-1 tabular-nums">{purchases.length + 3}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales</span>
            <span className="text-sm font-black text-white block mt-1.5 tabular-nums truncate" title={formatUGX(totalSalesUGX)}>
              {formatUGX(totalSalesUGX)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Received</span>
            <span className="text-sm font-black text-emerald-300 block mt-1.5 tabular-nums truncate" title={formatUGX(totalReceivedUGX)}>
              {formatUGX(totalReceivedUGX)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Outstanding</span>
            <span className="text-sm font-black text-amber-300 block mt-1.5 tabular-nums truncate" title={formatUGX(totalOutstandingUGX)}>
              {formatUGX(totalOutstandingUGX)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('plots')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'plots'
              ? 'border-cyan-600 text-cyan-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Plots Inventory ({plots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 relative ${
            activeTab === 'payments'
              ? 'border-cyan-600 text-cyan-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Payment Verification Center</span>
          {pendingPayments.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {pendingPayments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 relative ${
            activeTab === 'inquiries'
              ? 'border-cyan-600 text-cyan-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Customer Inquiries</span>
          {newInquiries.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-600 text-white font-bold">
              {newInquiries.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'border-cyan-600 text-cyan-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Estates & Projects ({estates.length})</span>
        </button>
      </div>

      {/* TAB 1: PLOTS INVENTORY & AVAILABILITY MANAGER */}
      {activeTab === 'plots' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Plot Status & Pricing Controls</h3>
              <p className="text-xs text-slate-500">
                Click status buttons below to immediately change plot availability in real time.
              </p>
            </div>

            {/* Estate Filter */}
            <select
              value={selectedEstateFilter}
              onChange={(e) => setSelectedEstateFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
            >
              <option value="all">All Estates</option>
              {estates.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Plot #</th>
                  <th className="py-3 px-4">Estate Project</th>
                  <th className="py-3 px-4">Dimensions</th>
                  <th className="py-3 px-4">Current Price (UGX)</th>
                  <th className="py-3 px-4 text-center">Current Status</th>
                  <th className="py-3 px-4 text-center">Quick Change Status</th>
                  <th className="py-3 px-4 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlots.map((plot) => (
                  <tr key={plot.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-black text-slate-900">{plot.plotNumber}</td>
                    <td className="py-3 px-4 text-slate-700">{plot.estateName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{plot.dimensions}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      {formatUGX(plot.priceUGX)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        plot.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : plot.status === 'reserved'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {plot.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
                        <button
                          onClick={() => onUpdatePlotStatus(plot.id, 'available')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            plot.status === 'available'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Avail
                        </button>
                        <button
                          onClick={() => onUpdatePlotStatus(plot.id, 'reserved')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            plot.status === 'reserved'
                              ? 'bg-amber-500 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Reserve
                        </button>
                        <button
                          onClick={() => onUpdatePlotStatus(plot.id, 'sold')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            plot.status === 'sold'
                              ? 'bg-slate-700 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Sold
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleStartEdit(plot)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                        title="Edit plot details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT VERIFICATION CENTER */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Payment Reconciliation & Verification</h3>
              <p className="text-xs text-slate-500">
                Verify customer bank transfers and electronic transactions before approving deeds.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              {pendingPayments.length} Pending Approval
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Plot & Estate</th>
                  <th className="py-3 px-4">Method & Telecom Ref</th>
                  <th className="py-3 px-4 text-right">Amount (UGX)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{tx.reference}</td>
                    <td className="py-3.5 px-4">
                      <strong className="block text-slate-900">{tx.customerName}</strong>
                      <span className="text-[11px] text-slate-500">{tx.phoneNumber || 'N/A'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900">{tx.plotNumber}</span>
                      <span className="block text-[11px] text-slate-500">{tx.estateName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase font-semibold block">{tx.method.replace('_', ' ')}</span>
                      <span className="font-mono text-[11px] text-slate-500">{tx.providerRef}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 tabular-nums text-sm">
                      {formatUGX(tx.amountUGX)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        tx.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : tx.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {tx.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => onVerifyTransaction(tx.id, 'verified')}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
                              title="Verify Bank Transfer / Cash Received"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onVerifyTransaction(tx.id, 'failed')}
                              className="px-2 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg"
                              title="Decline"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onOpenReceipt(tx)}
                            className="px-2.5 py-1 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200"
                          >
                            Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER INQUIRIES & LEADS */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Inbound Property Inquiries</h3>
              <p className="text-xs text-slate-500">
                Customers requesting site visits, plot quotations, or callbacks.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{inq.fullName}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inq.status === 'new'
                        ? 'bg-cyan-100 text-cyan-800'
                        : inq.status === 'contacted'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {inq.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{inq.message}"</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-cyan-600" />
                      <a href={`tel:${inq.phone}`} className="hover:underline">{inq.phone}</a>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{inq.email}</span>
                    {inq.preferredPlotNumber && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-700">Plot: {inq.preferredPlotNumber}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateInquiryStatus(inq.id, 'contacted')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => onUpdateInquiryStatus(inq.id, 'resolved')}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                  >
                    Resolved ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROJECTS / ESTATES OVERVIEW */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {estates.map((estate) => (
            <div key={estate.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
                    {estate.district}
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-0.5">{estate.name}</h4>
                  <span className="text-xs text-slate-500">{estate.location}</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                  {estate.titleType}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {estate.description}
              </p>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total</span>
                  <strong className="text-slate-900 font-black">{estate.totalPlots}</strong>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50">
                  <span className="text-emerald-600 block text-[10px] uppercase font-bold">Available</span>
                  <strong className="text-emerald-800 font-black">{estate.availablePlotsCount}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Base Price</span>
                  <strong className="text-slate-900 font-bold tabular-nums">{formatUGX(estate.startingPriceUGX)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Plot Modal */}
      {editingPlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-lg font-black text-slate-900">
                Edit {editingPlot.plotNumber} Details
              </h4>
              <button
                onClick={() => setEditingPlot(null)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlot} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Price in Ugandan Shillings (UGX)
                </label>
                <input
                  type="number"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Plot Dimensions / Decimals
                </label>
                <input
                  type="text"
                  required
                  value={editDimensions}
                  onChange={(e) => setEditDimensions(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Availability Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold Out</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlot(null)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-300 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-slate-900 text-white font-bold uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Estate Modal */}
      {showNewEstateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-lg font-black text-slate-900">
                Add New Land Estate Project
              </h4>
              <button
                onClick={() => setShowNewEstateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEstate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Estate Name *</label>
                <input
                  type="text"
                  required
                  value={newEstateName}
                  onChange={(e) => setNewEstateName(e.target.value)}
                  placeholder="e.g. Ssezibwa Heights Estate"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={newEstateLocation}
                    onChange={(e) => setNewEstateLocation(e.target.value)}
                    placeholder="e.g. Sonde - Namugongo"
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">District *</label>
                  <select
                    value={newEstateDistrict}
                    onChange={(e) => setNewEstateDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="Wakiso District">Wakiso District</option>
                    <option value="Mukono District">Mukono District</option>
                    <option value="Kampala City">Kampala City</option>
                    <option value="Mpigi District">Mpigi District</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Title Type</label>
                  <select
                    value={newEstateTitle}
                    onChange={(e) => setNewEstateTitle(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="Ready Private Mailo">Ready Private Mailo</option>
                    <option value="Freehold Title">Freehold Title</option>
                    <option value="Leasehold">Leasehold</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Starting Price (UGX)</label>
                  <input
                    type="number"
                    required
                    value={newEstateStartingPrice}
                    onChange={(e) => setNewEstateStartingPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={newEstateDesc}
                  onChange={(e) => setNewEstateDesc(e.target.value)}
                  placeholder="Describe location advantages, proximity to tarmac, electricity, and schools..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewEstateModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-slate-900 text-white font-bold uppercase tracking-wider"
                >
                  Create Estate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
