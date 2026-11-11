import React, { useState } from 'react';
import { COMPANY_DETAILS } from '../data/mockData';
import { Estate, Inquiry, PaymentPlanType, Plot } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface ContactSectionProps {
  estates: Estate[];
  plots: Plot[];
  onAddInquiry: (inquiry: Inquiry) => void;
  preselectedPlot?: Plot | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  estates,
  plots,
  onAddInquiry,
  preselectedPlot,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredEstate, setPreferredEstate] = useState(preselectedPlot?.estateName || estates[0]?.name || '');
  const [preferredPlot, setPreferredPlot] = useState(preselectedPlot?.plotNumber || '');
  const [preferredPlan, setPreferredPlan] = useState<PaymentPlanType>('monthly');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      fullName,
      phone,
      email,
      preferredEstateName: preferredEstate,
      preferredPlotNumber: preferredPlot || undefined,
      preferredPaymentPlan: preferredPlan,
      message,
      date: new Date().toISOString(),
      status: 'new',
    };

    onAddInquiry(newInquiry);
    setSubmitted(true);
    setTimeout(() => {
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section className="space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
          <span>Get in Touch</span>
          <span aria-hidden="true">·</span>
          <span>Bahai Road, Uganda</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Visit Our Office or Schedule a Free Site Inspection
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Our surveyors and land acquisition advisors are available Monday to Saturday to guide you through property verifications and title search records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Office Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-md">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block">
                HEADQUARTERS
              </span>
              <h3 className="text-2xl font-black mt-1">E-HOMES Uganda</h3>
              <p className="text-xs text-slate-400">BUILDING VALUE</p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Physical Location</strong>
                  <span className="text-slate-300">{COMPANY_DETAILS.location}</span>
                  <a
                    href={COMPANY_DETAILS.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold mt-1 block"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Call Sales & Inquiries</strong>
                  <a
                    href={`tel:${COMPANY_DETAILS.phoneClean}`}
                    className="text-cyan-300 hover:text-white font-mono text-sm font-bold transition-colors"
                  >
                    {COMPANY_DETAILS.phoneDisplay}
                  </a>
                  <span className="block text-[11px] text-slate-400">Direct phone line (Uganda)</span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Office & Inspection Hours</strong>
                  <span className="text-slate-300">{COMPANY_DETAILS.workingHours}</span>
                  <span className="block text-[11px] text-slate-400">Site visits conduct daily by appointment</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-2">
              <a
                href={COMPANY_DETAILS.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp (+256 787 004962)</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Maps Viewport Frame */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 aspect-[16/10] relative shadow-xs">
            <iframe
              title="E-HOMES Bahai Road Kampala Location"
              src={COMPANY_DETAILS.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block">
              Direct Property Inquiry
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              Submit Your Request
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill out the form below and an E-HOMES property manager will respond within 2 hours.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Inquiry Received Successfully!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you! Our Bahai Road office has received your inquiry. We will call you shortly at {phone} to coordinate your site visit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Namagembe"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Uganda Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +256 787 004962"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Preferred Estate
                  </label>
                  <select
                    value={preferredEstate}
                    onChange={(e) => setPreferredEstate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                  >
                    {estates.map((e) => (
                      <option key={e.id} value={e.name}>
                        {e.name.split('-')[0].trim()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Plot # (Optional)
                  </label>
                  <input
                    type="text"
                    value={preferredPlot}
                    onChange={(e) => setPreferredPlot(e.target.value)}
                    placeholder="e.g. Plot 101"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Payment Plan
                  </label>
                  <select
                    value={preferredPlan}
                    onChange={(e) => setPreferredPlan(e.target.value as PaymentPlanType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                  >
                    <option value="monthly">Monthly Plan</option>
                    <option value="annual">Annual Plan</option>
                    <option value="full">Full Settlement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Additional Message or Preferred Site Visit Date *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us when you want to inspect the site, or if you require legal title verification details..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Submit Inquiry to Bahai Road Office</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
