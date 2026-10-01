'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Invoice } from '@/types';
import { CreditCard, Printer, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PatientBillingPage() {
  const { currentUser, invoices, payInvoice } = useHospitalStore();
  const userMrn = currentUser.patientMrn || 'MRN-84291';
  const myInvoices = invoices.filter((i) => i.patientMrn === userMrn);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(myInvoices[0] || null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    payInvoice(selectedInvoice.id, selectedInvoice.balanceDue, 'Credit Card');
    setShowPayModal(false);
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Financial Concierge
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            Billing Statements & Online Settlements
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review itemized statements, insurance claim deductions, and settle outstanding balances securely.
          </p>
        </div>

        {paymentSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Payment processed successfully! Your updated statement and electronic receipt are ready below.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Invoices List */}
          <div className="lg:col-span-5 space-y-3">
            {myInvoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedInvoice?.id === inv.id
                    ? 'bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900 shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-zinc-950">{inv.invoiceNumber}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-zinc-950 mt-1">
                  Total Billed: ${inv.totalAmount.toFixed(2)}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Due: {formatDate(inv.dueDate)}
                </p>

                <div className="mt-3 pt-2 border-t border-zinc-100 flex justify-between text-[11px]">
                  <span className="text-zinc-500">Paid: ${inv.paidAmount.toFixed(2)}</span>
                  <span className={inv.balanceDue > 0 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {inv.balanceDue > 0 ? `Balance Due: $${inv.balanceDue.toFixed(2)}` : 'Fully Paid'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Statement View & Pay CTA */}
          <div className="lg:col-span-7">
            {selectedInvoice ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-6 printable-area">
                <div className="flex items-start justify-between pb-6 border-b border-zinc-100">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-950">
                      Statement #{selectedInvoice.invoiceNumber}
                    </h3>
                    <p className="text-xs text-zinc-500">Issued: {formatDate(selectedInvoice.issuedDate)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block">Remaining Due</span>
                    <span className="text-xl font-black text-rose-600">${selectedInvoice.balanceDue.toFixed(2)}</span>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Services Billed</h4>
                  <div className="divide-y divide-zinc-100 text-xs">
                    {selectedInvoice.items.map((item) => (
                      <div key={item.id} className="py-2.5 flex justify-between">
                        <div>
                          <p className="font-semibold text-zinc-950">{item.description}</p>
                          <p className="text-[10px] text-zinc-500">{item.category}</p>
                        </div>
                        <span className="font-mono font-bold text-zinc-950">${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="pt-3 border-t border-zinc-100 text-xs space-y-1 text-zinc-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-zinc-900">${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Insurance Allowance:</span>
                    <span className="font-mono font-bold">-${selectedInvoice.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-zinc-950 pt-2 border-t border-zinc-100">
                    <span>Net Amount:</span>
                    <span className="font-mono">${selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between no-print">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition-colors shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Statement
                  </button>

                  {selectedInvoice.balanceDue > 0 && (
                    <button
                      onClick={() => setShowPayModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay ${selectedInvoice.balanceDue.toFixed(2)} Online
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mock Payment Modal */}
        {showPayModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in">
            <div className="fixed inset-0" onClick={() => setShowPayModal(false)} />
            <div className="relative w-full max-w-md rounded-2xl bg-white border border-zinc-200 p-6 z-10 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-zinc-950">
                Pay Statement {selectedInvoice.invoiceNumber}
              </h3>
              <p className="text-xs text-zinc-500">
                Amount to settle: <strong className="text-zinc-950">${selectedInvoice.balanceDue.toFixed(2)}</strong>
              </p>

              <form onSubmit={handlePay} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-zinc-700">Card Number</label>
                  <input
                    type="text"
                    required
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-zinc-700">Expiration</label>
                    <input
                      type="text"
                      required
                      defaultValue="12/28"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-zinc-700">CVV / CVC</label>
                    <input
                      type="text"
                      required
                      defaultValue="321"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                  >
                    Authorize Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
