'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import { SupportTicket, TicketStatus } from '@/types';
import {
  Search,
  Send,
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function AdminSupportPage() {
  const { supportTickets, replyToSupportTicket, currentUser } = useHospitalStore();
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(supportTickets[0] || null);
  const [replyText, setReplyText] = useState('');

  const filtered = supportTickets.filter((t) => {
    return (
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.patientName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'in_progress':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'waiting_for_patient':
        return 'bg-zinc-100 text-zinc-800 border border-zinc-200';
      case 'resolved':
      case 'closed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    replyToSupportTicket(
      selectedTicket.id,
      'support_staff',
      currentUser.fullName || 'Elena Rostova (Admin Concierge)',
      replyText
    );
    setReplyText('');
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Support Desk & Tickets
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage inquiries, insurance authorizations, billing disputes, and human-handoff requests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket # or subject..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
              />
            </div>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {filtered.map((tkt) => (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedTicket?.id === tkt.id
                      ? 'bg-[#F8F8F8] border-[#111111]'
                      : 'bg-white border-[#EAEAEA] hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-xs text-[#111111]">{tkt.ticketNumber}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] capitalize ${getStatusBadge(tkt.status)}`}>
                      {tkt.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-[#111111] mt-1 truncate">{tkt.subject}</h4>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    {tkt.patientName} • Category: {tkt.category}
                  </p>
                  <div className="mt-2 pt-2 border-t border-[#EAEAEA] flex justify-between text-[10px] text-[#9CA3AF]">
                    <span>Priority: <strong className="uppercase text-rose-600 font-semibold">{tkt.priority}</strong></span>
                    <span>{formatDate(tkt.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Conversation Thread */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="p-6 rounded-xl bg-white border border-[#EAEAEA] flex flex-col h-[700px]">
                {/* Header */}
                <div className="pb-4 border-b border-[#EAEAEA] shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-xs text-[#111111]">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-xs capitalize ${getStatusBadge(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-[#111111] mt-1">
                    {selectedTicket.subject}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Requester: <strong className="text-[#111111]">{selectedTicket.patientName}</strong> ({selectedTicket.patientEmail})
                  </p>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {selectedTicket.messages.map((m) => {
                    const isStaff = m.sender === 'support_staff';
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-lg text-xs max-w-[85%] space-y-1 ${
                          isStaff
                            ? 'ml-auto bg-[#111111] text-white'
                            : 'bg-[#F8F8F8] text-[#111111] border border-[#EAEAEA]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 font-semibold text-[11px] opacity-80">
                          <span>{m.senderName}</span>
                          <span>{formatDateTime(m.timestamp)}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-[#EAEAEA] flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official response..."
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111111]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Reply
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-[#6B7280] bg-white rounded-xl border border-[#EAEAEA]">
                Select a ticket to review message history.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
