import React from 'react';
import { PaymentTransaction, PlotPurchase } from '../types';
import { formatUGX, formatDate } from '../utils/formatters';
import { COMPANY_DETAILS } from '../data/mockData';
import { BrandLogo } from './BrandLogo';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction;
  purchase?: PlotPurchase | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  purchase,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Top Action Bar (hidden in print) */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Official E-HOMES Electronic Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-8 sm:p-10 space-y-8 bg-white text-slate-900 font-sans">
          {/* Header Lockup */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <BrandLogo size="lg" />
              <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                <p>E-HOMES PROPERTY INVESTMENTS LIMITED</p>
                <p>{COMPANY_DETAILS.location}</p>
                <p>Tel: {COMPANY_DETAILS.phone} | Web: ehomesuganda.com</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                OFFICIAL PAYMENT RECEIPT
              </span>
              <span className="text-xl font-mono font-black text-slate-900 block mt-1">
                {transaction.reference}
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                Date: {formatDate(transaction.date)}
              </span>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                <span>{transaction.status.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Receipt Details Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                RECEIVED FROM (PURCHASER)
              </span>
              <p className="text-sm font-bold text-slate-900">{transaction.customerName}</p>
              <p className="text-slate-600">Tel: {transaction.phoneNumber || 'N/A'}</p>
              <p className="text-slate-500 font-mono text-[11px]">Ref: {transaction.customerId}</p>
            </div>

            {/* Property Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                PROPERTY DESCRIPTION
              </span>
              <p className="text-sm font-bold text-slate-900">{transaction.plotNumber}</p>
              <p className="text-slate-600">{transaction.estateName}</p>
              <p className="text-slate-500 text-[11px]">Ready Titled Surveyed Land</p>
            </div>
          </div>

          {/* Transaction Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-2.5 px-4 font-bold uppercase tracking-wider">Item Description</th>
                  <th className="py-2.5 px-4 font-bold uppercase tracking-wider">Payment Method</th>
                  <th className="py-2.5 px-4 font-bold uppercase tracking-wider">Telecom / Bank Ref</th>
                  <th className="py-2.5 px-4 font-bold uppercase tracking-wider text-right">Amount (UGX)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <strong className="block text-slate-900">{transaction.notes || 'Land Deposit Instalment'}</strong>
                    <span className="text-[11px] text-slate-500">{transaction.plotNumber} allocation</span>
                  </td>
                  <td className="py-3 px-4 font-medium uppercase text-slate-700">
                    {transaction.method.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {transaction.providerRef}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 tabular-nums">
                    {formatUGX(transaction.amountUGX)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-xs">
                    Total Amount Received:
                  </td>
                  <td className="py-3 px-4 text-right text-base font-black text-cyan-800 tabular-nums">
                    {formatUGX(transaction.amountUGX)}
                  </td>
                </tr>
                {purchase && (
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-right text-xs text-slate-500">
                      Remaining Land Balance:
                    </td>
                    <td className="py-2 px-4 text-right text-xs font-bold text-slate-700 tabular-nums">
                      {formatUGX(purchase.balanceRemainingUGX)}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {/* Stamp & Verification Watermark */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="space-y-1">
              <p className="font-semibold text-slate-700">Important Notice:</p>
              <p className="max-w-xs text-[11px] leading-relaxed">
                This receipt certifies payment allocation towards land purchase at E-HOMES. Keep this safe for title deed processing.
              </p>
            </div>

            {/* Simulated Official Corporate Seal / Stamp */}
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-700/60 p-2 flex flex-col items-center justify-center text-center text-cyan-800 rotate-[-8deg] select-none">
              <span className="text-[9px] font-black uppercase tracking-wider">E-HOMES UGANDA</span>
              <span className="text-[8px] font-bold text-slate-600">BUILDING VALUE</span>
              <span className="text-[8px] font-mono text-cyan-900 mt-0.5">VERIFIED</span>
              <span className="text-[8px] text-slate-500">BAHAI ROAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
