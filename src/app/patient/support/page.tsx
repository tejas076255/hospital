'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { Plus, Send } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { SupportTicket } from '@/types';

export default function PatientSupportPage() {
  const { currentUser, supportTickets, createSupportTicket, replyToSupportTicket } = useHospitalStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(supportTickets[0] || null);
  const [replyText, setReplyText] = useState('');

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('General');
  const [description, setDescription] = useState('');

  const myTickets = supportTickets.filter(
    (t) => t.patientEmail === currentUser.email || t.patientName === currentUser.fullName
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const tkt = createSupportTicket({
      patientId: currentUser.id,
      patientName: currentUser.fullName || 'James Wilson',
      patientEmail: currentUser.email || 'james.wilson@gmail.com',
      subject,
      category,
      priority: 'medium',
      description,
    });
    setSelectedTicket(tkt);
    setShowCreateModal(false);
    setSubject('');
    setDescription('');
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    replyToSupportTicket(
      selectedTicket.id,
      'patient',
      currentUser.fullName || 'James Wilson',
      replyText
    );
    setReplyText('');
  };

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Patient Care Concierge
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Help Desk & Clinical Inquiries
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Submit support tickets for insurance pre-authorizations, medical record copies, and medication refill queries.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Support Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tickets List */}
          <div className="lg:col-span-5 space-y-3">
            {myTickets.map((tkt) => (
              <div
                key={tkt.id}
                onClick={() => setSelectedTicket(tkt)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedTicket?.id === tkt.id
                    ? 'bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900 shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-zinc-900">{tkt.ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-zinc-100 text-zinc-800 border border-zinc-200">
                    {tkt.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-zinc-950 mt-1 truncate">{tkt.subject}</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">Category: {tkt.category}</p>
                <div className="mt-3 pt-2 border-t border-zinc-100 flex justify-between text-[10px] text-zinc-400">
                  <span>Priority: {tkt.priority}</span>
                  <span>{formatDate(tkt.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Messages Thread */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col h-[600px]">
                <div className="pb-4 border-b border-zinc-100 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-zinc-950">{selectedTicket.ticketNumber}</span>
                    <span className="text-xs font-semibold capitalize text-zinc-500">{selectedTicket.category}</span>
                  </div>
                  <h3 className="font-bold text-base text-zinc-950 mt-1">{selectedTicket.subject}</h3>
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {selectedTicket.messages.map((m) => {
                    const isMe = m.sender === 'patient';
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-xl text-xs max-w-[85%] space-y-1 ${
                          isMe
                            ? 'ml-auto bg-zinc-900 text-white rounded-br-xs'
                            : 'bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-bl-xs'
                        }`}
                      >
                        <div className="flex justify-between gap-4 text-[10px] opacity-75 font-semibold">
                          <span>{m.senderName}</span>
                          <span>{formatDateTime(m.timestamp)}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleReply} className="pt-3 border-t border-zinc-100 flex gap-2 shrink-0">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type reply to hospital staff..."
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in">
            <div className="fixed inset-0" onClick={() => setShowCreateModal(false)} />
            <div className="relative w-full max-w-lg rounded-2xl bg-white border border-zinc-200 p-6 z-10 space-y-4 shadow-xl">
              <h3 className="font-bold text-base text-zinc-950">Create Support Inquiry</h3>

              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-zinc-700">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of request..."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-zinc-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                  >
                    <option>Appointment</option>
                    <option>Billing</option>
                    <option>Medical Record</option>
                    <option>Pharmacy</option>
                    <option>Lab</option>
                    <option>Technical Issue</option>
                    <option>General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-zinc-700">Details</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details so our coordinators can assist you..."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
                  >
                    Submit Ticket
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
