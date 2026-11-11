import React, { useState } from 'react';
import { Customer, Estate, PaymentTransaction, Plot, PlotPurchase } from '../types';
import { formatUGX, formatDate } from '../utils/formatters';
import {
  User,
  CreditCard,
  Heart,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Layers,
  Phone,
  ShieldCheck,
  ChevronRight,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface CustomerDashboardProps {
  currentUser: Customer;
  purchases: PlotPurchase[];
  transactions: PaymentTransaction[];
  plots: Plot[];
  estates: Estate[];
  favorites: string[];
  onOpenReceipt: (tx: PaymentTransaction, purchase?: PlotPurchase) => void;
  onPayNextInstalment: (purchase: PlotPurchase) => void;
  onExplorePlots: () => void;
  onLogout: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  purchases,
  transactions,
  plots,
  estates,
  favorites,
  onOpenReceipt,
  onPayNextInstalment,
  onExplorePlots,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'purchases' | 'transactions' | 'favorites'>('purchases');

  // Filter for this customer by ID or Email
  const userPurchases = purchases.filter(
    (p) =>
      p.customerId === currentUser.id ||
      (p.customerEmail && p.customerEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
  );
  const userTransactions = transactions.filter(
    (t) =>
      t.customerId === currentUser.id ||
      (t.customerEmail && t.customerEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
  );
  const favoritePlots = plots.filter((p) => favorites.includes(p.id));

  // Cumulative financial stats
  const totalInvested = userPurchases.reduce((acc, p) => acc + p.depositPaidUGX, 0);
  const totalOutstanding = userPurchases.reduce((acc, p) => acc + p.balanceRemainingUGX, 0);

  return (
    <div className="space-y-8">
      {/* Customer Header Profile Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-2xl">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{currentUser.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  VERIFIED INVESTOR
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>{currentUser.phone}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.email}</span>
                {currentUser.nin && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-300">NIN: {currentUser.nin}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Amount Paid
            </span>
            <span className="text-2xl font-black text-cyan-300 tracking-tight block mt-1 tabular-nums">
              {formatUGX(totalInvested)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Across {userPurchases.length} land parcel(s)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Outstanding Balance
            </span>
            <span className="text-2xl font-black text-amber-300 tracking-tight block mt-1 tabular-nums">
              {formatUGX(totalOutstanding)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              On scheduled instalment plans
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Title Processing Status
            </span>
            <span className="text-2xl font-black text-emerald-400 tracking-tight block mt-1">
              {totalOutstanding === 0 && userPurchases.length > 0 ? 'Ready for Transfer' : 'Under Plan'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Registered with Ministry Zonal Office
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'purchases'
              ? 'border-cyan-600 text-cyan-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Land Investments ({userPurchases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'border-cyan-600 text-cyan-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Payment Receipts ({userTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'border-cyan-600 text-cyan-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Plots ({favoritePlots.length})</span>
        </button>
      </div>

      {/* TAB 1: PURCHASES / PLOT INVESTMENTS */}
      {activeTab === 'purchases' && (
        <div className="space-y-6">
          {userPurchases.length > 0 ? (
            userPurchases.map((purchase) => {
              const pctPaid = Math.min(
                100,
                Math.round((purchase.depositPaidUGX / purchase.totalPriceUGX) * 100)
              );

              return (
                <div
                  key={purchase.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
                        {purchase.estateName}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-0.5">
                        {purchase.plotNumber}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Purchase Initiated: {formatDate(purchase.purchaseDate)} · Plan: {purchase.planType.toUpperCase()} ({purchase.tenurePeriod})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        purchase.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                      }`}>
                        {purchase.status === 'completed' ? '100% Fully Paid' : 'Active Instalment'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Payment Progress</span>
                      <strong className="text-cyan-800 font-black">{pctPaid}% Paid</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-600 to-teal-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pctPaid}%` }}
                      />
                    </div>
                  </div>

                  {/* Breakdown Numbers */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 block">Total Agreed Price:</span>
                      <strong className="text-slate-900 font-black text-sm block mt-0.5 tabular-nums">
                        {formatUGX(purchase.totalPriceUGX)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Total Paid So Far:</span>
                      <strong className="text-emerald-700 font-black text-sm block mt-0.5 tabular-nums">
                        {formatUGX(purchase.depositPaidUGX)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Outstanding Balance:</span>
                      <strong className="text-amber-800 font-black text-sm block mt-0.5 tabular-nums">
                        {formatUGX(purchase.balanceRemainingUGX)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Next Due Date:</span>
                      <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                        {purchase.nextDueDate ? formatDate(purchase.nextDueDate) : 'N/A'}
                      </strong>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Boundary Beacons Surveyed & Recorded under {currentUser.name}</span>
                    </div>

                    {purchase.balanceRemainingUGX > 0 && (
                      <button
                        onClick={() => onPayNextInstalment(purchase)}
                        className="py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-2"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Pay Next Instalment ({formatUGX(purchase.instalmentAmountUGX)})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-slate-800">No Land Purchases Yet</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Explore our verified estates in Gayaza, Entebbe, and Mukono to begin your investment journey.
                </p>
              </div>
              <button
                onClick={onExplorePlots}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 rounded-xl"
              >
                Browse Available Plots
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENT TRANSACTIONS & RECEIPTS */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Payment History & Tax Receipts</h3>
            <span className="text-xs text-slate-500 font-mono">Uganda Shillings (UGX)</span>
          </div>

          {userTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Receipt Ref</th>
                    <th className="py-3 px-4">Property & Plot</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount (UGX)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {tx.reference}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="block text-slate-900">{tx.plotNumber}</strong>
                        <span className="text-[11px] text-slate-500">{tx.estateName}</span>
                      </td>
                      <td className="py-3.5 px-4 uppercase text-slate-700">
                        {tx.method.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 tabular-nums text-sm">
                        {formatUGX(tx.amountUGX)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          tx.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {tx.status === 'verified' ? 'Verified ✓' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenReceipt(tx, userPurchases[0])}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No transactions recorded yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FAVORITE SAVED PLOTS */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoritePlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePlots.map((plot) => (
                <div
                  key={plot.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold uppercase">
                        {plot.estateName}
                      </span>
                      <h4 className="text-lg font-black text-slate-900">{plot.plotNumber}</h4>
                      <span className="text-xs text-slate-500 font-mono">{plot.dimensions}</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700">
                      {plot.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Price:</span>
                    <strong className="text-slate-900 font-black text-sm tabular-nums">
                      {formatUGX(plot.priceUGX)}
                    </strong>
                  </div>

                  <button
                    onClick={onExplorePlots}
                    className="w-full py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 rounded-xl"
                  >
                    View in Marketplace
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              You haven't saved any favorite plots yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
