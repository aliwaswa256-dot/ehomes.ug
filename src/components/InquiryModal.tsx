import React, { useState } from 'react';
import { Estate, Inquiry, PaymentPlanType, Plot } from '../types';
import { COMPANY_DETAILS } from '../data/mockData';
import { X, Send, CheckCircle2, Phone, MessageSquare } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  estates: Estate[];
  plots: Plot[];
  initialPlot?: Plot | null;
  onAddInquiry: (inquiry: Inquiry) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  estates,
  plots,
  initialPlot,
  onAddInquiry,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [estateName, setEstateName] = useState(initialPlot?.estateName || estates[0]?.name || '');
  const [plotNumber, setPlotNumber] = useState(initialPlot?.plotNumber || '');
  const [planType, setPlanType] = useState<PaymentPlanType>('monthly');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInq: Inquiry = {
      id: `inq-${Date.now()}`,
      fullName,
      phone,
      email,
      preferredEstateName: estateName,
      preferredPlotNumber: plotNumber || undefined,
      preferredPaymentPlan: planType,
      message,
      date: new Date().toISOString(),
      status: 'new',
    };

    onAddInquiry(newInq);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider block">
              E-HOMES Customer Desk
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              Property Inquiry & Site Visit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Inquiry Sent Successfully!</h4>
            <p className="text-xs text-slate-500">
              Our Bahai Road team has received your message and will call you at {phone}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Mukasa"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+256 787 004962"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Estate</label>
                <select
                  value={estateName}
                  onChange={(e) => setEstateName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50"
                >
                  {estates.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name.split('-')[0].trim()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Plot #</label>
                <input
                  type="text"
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  placeholder="e.g. Plot 101"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Message</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I would like to arrange a site visit or ask about title transfer..."
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Submit Inquiry</span>
              </button>

              <a
                href={COMPANY_DETAILS.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>Or Chat with Agent on WhatsApp</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
