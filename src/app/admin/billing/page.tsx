'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Invoice, InvoiceStatus } from '@/types';
import {
  CreditCard,
  Search,
  Printer,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminBillingPage() {
  const { invoices, payInvoice } = useHospitalStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<Invoice['paymentMethod']>('Credit Card');
  const [showPayModal, setShowPayModal] = useState(false);

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientMrn.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'partially_paid':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'pending':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'refunded':
        return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
    }
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    payInvoice(selectedInvoice.id, payAmount, payMethod);
    setShowPayModal(false);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Billing & Invoicing
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Itemized inpatient and outpatient statements, insurance claim reimbursements, and payment settlements.
          </p>
        </div>

        {/* Master & Itemized Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice # or patient..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
              />
            </div>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {filtered.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedInvoice?.id === inv.id
                      ? 'bg-[#F8F8F8] border-[#111111]'
                      : 'bg-white border-[#EAEAEA] hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#6B7280]">{inv.invoiceNumber}</span>
                      <h4 className="font-semibold text-xs text-[#111111] mt-0.5">{inv.patientName}</h4>
                      <p className="text-[11px] text-[#6B7280]">{inv.patientMrn}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-xs text-[#111111]">${inv.totalAmount.toFixed(2)}</p>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] capitalize ${getStatusBadge(inv.status)}`}>
                        {inv.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#EAEAEA] flex items-center justify-between text-[11px] text-[#6B7280]">
                    <span>Due: {formatDate(inv.dueDate)}</span>
                    <span className="text-rose-600 font-medium">
                      {inv.balanceDue > 0 ? `Balance Due: $${inv.balanceDue.toFixed(2)}` : 'Settled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Printable Invoice Statement View */}
          <div className="lg:col-span-7">
            {selectedInvoice ? (
              <div className="p-6 rounded-xl bg-white border border-[#EAEAEA] space-y-5 printable-area">
                {/* Invoice Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#EAEAEA]">
                  <div>
                    <h3 className="font-bold text-base text-[#111111] tracking-tight">
                      ApexCare Medical Center
                    </h3>
                    <p className="text-[11px] text-[#6B7280]">800 Medical Center Pkwy, Chicago, IL 60611</p>
                    <p className="text-[11px] text-[#6B7280]">Tax ID: 36-2481902 • Provider NPI: 1982740112</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-[#111111] block">{selectedInvoice.invoiceNumber}</span>
                    <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-md text-[10px] uppercase ${getStatusBadge(selectedInvoice.status)}`}>
                      {selectedInvoice.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Patient & Invoice Meta */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[#6B7280] font-semibold uppercase">Billed Patient:</span>
                    <p className="font-semibold text-[#111111] mt-0.5">{selectedInvoice.patientName}</p>
                    <p className="text-[#6B7280]">{selectedInvoice.patientMrn}</p>
                    <p className="text-[#6B7280]">{selectedInvoice.patientEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#6B7280] font-semibold uppercase">Statement Details:</span>
                    <p className="text-[#6B7280] mt-0.5">Date: {formatDate(selectedInvoice.issuedDate)}</p>
                    <p className="text-[#6B7280]">Due: {formatDate(selectedInvoice.dueDate)}</p>
                    {selectedInvoice.paymentMethod && (
                      <p className="text-[#6B7280]">Method: {selectedInvoice.paymentMethod}</p>
                    )}
                  </div>
                </div>

                {/* Itemized Line Items Table */}
                <div className="rounded-lg border border-[#EAEAEA] overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F8F8F8] text-[#6B7280] uppercase text-[10px] font-semibold border-b border-[#EAEAEA]">
                      <tr>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5">Service Description</th>
                        <th className="px-4 py-2.5 text-center">Qty</th>
                        <th className="px-4 py-2.5 text-right">Unit Price</th>
                        <th className="px-4 py-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAEAEA]">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-50">
                          <td className="px-4 py-2.5 font-medium text-[#111111]">{item.category}</td>
                          <td className="px-4 py-2.5 text-[#6B7280]">{item.description}</td>
                          <td className="px-4 py-2.5 text-center text-[#111111]">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-[#6B7280]">${item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-semibold text-[#111111]">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculations Summary */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-1.5 text-xs text-[#6B7280]">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold text-[#111111]">${selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedInvoice.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Insurance Adjustment:</span>
                        <span className="font-mono font-semibold">-${selectedInvoice.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#EAEAEA]">
                      <span>Total Billed:</span>
                      <span className="font-mono">${selectedInvoice.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Amount Paid:</span>
                      <span className="font-mono">${selectedInvoice.paidAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-rose-600 pt-1 border-t border-[#EAEAEA]">
                      <span>Remaining Balance:</span>
                      <span className="font-mono">${selectedInvoice.balanceDue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Bar (Print & Settle Payment) */}
                <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between no-print">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#EAEAEA] text-xs font-medium text-[#111111] bg-white hover:bg-zinc-50 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print Statement
                  </button>

                  {selectedInvoice.balanceDue > 0 && (
                    <button
                      onClick={() => {
                        setPayAmount(selectedInvoice.balanceDue);
                        setShowPayModal(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Record Settlement (${selectedInvoice.balanceDue.toFixed(2)})
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-[#6B7280] bg-white rounded-xl border border-[#EAEAEA]">
                Select an invoice statement to inspect breakdown or settle payment.
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {showPayModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="fixed inset-0" onClick={() => setShowPayModal(false)} />
            <div className="relative w-full max-w-md rounded-xl bg-white border border-[#EAEAEA] p-6 z-10 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-[#111111]">
                Record Payment for {selectedInvoice.invoiceNumber}
              </h3>
              <p className="text-xs text-[#6B7280]">
                Patient: {selectedInvoice.patientName} • Remaining Due: ${selectedInvoice.balanceDue.toFixed(2)}
              </p>

              <form onSubmit={handleExecutePayment} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">Payment Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    max={selectedInvoice.balanceDue}
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs font-mono font-semibold text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">Settlement Channel</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111]"
                  >
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Insurance</option>
                    <option>Cash</option>
                    <option>Online Banking</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#EAEAEA]">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="px-3.5 py-2 rounded-lg border border-[#EAEAEA] text-xs font-medium text-[#111111] hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
                  >
                    Confirm Settlement
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
