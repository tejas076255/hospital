'use client';

import { useState, useRef, useEffect } from 'react';
import { useHospitalStore } from '@/lib/data/store';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Calendar,
  CheckCircle2,
  Minimize2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { AIMessage } from '@/types';

export function AIAssistantWidget() {
  const { currentUser, bookAppointment, createSupportTicket, doctors } = useHospitalStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello ${currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'there'}! I am **ApexCare AI**, your clinical concierge. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Book an appointment',
        'Check my lab results',
        'Find a cardiologist',
        'Hospital visiting hours',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          patientMrn: currentUser.patientMrn || 'MRN-84291',
        }),
      });

      const data = await res.json();

      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCall: data.toolCall,
        suggestedActions: data.suggestedActions,
        handoffTicketId: data.handoffTicketId,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: 'I had trouble connecting to the hospital servers. Please try again or call our hotline at +1 (555) 911-APEX.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async (msgId: string, toolCall: NonNullable<AIMessage['toolCall']>) => {
    if (toolCall.toolName === 'createAppointment') {
      try {
        const doc = doctors.find((d) => d.id === toolCall.params.doctorId) || doctors[0];
        bookAppointment({
          patientId: currentUser.id || 'pat-1',
          patientName: currentUser.fullName || 'James Wilson',
          patientMrn: currentUser.patientMrn || 'MRN-84291',
          patientPhone: currentUser.phone || '+1 (555) 890-1234',
          doctorId: doc.id,
          doctorName: doc.fullName,
          doctorSpecialty: doc.specialization,
          departmentId: doc.departmentId,
          departmentName: doc.departmentName,
          date: (toolCall.params.date as string) || '2026-10-05',
          time: (toolCall.params.time as string) || '10:00',
          reason: 'Scheduled via ApexCare AI Clinical Assistant',
          fee: doc.consultationFee,
        });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  toolCall: { ...toolCall, status: 'completed' },
                  content: `${m.content}\n\n✅ **Appointment Confirmed!** Your consultation with ${doc.fullName} is registered for ${toolCall.params.date} at ${toolCall.params.time}.`,
                }
              : m
          )
        );
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleCreateHandoffTicket = (ticketNumber: string) => {
    createSupportTicket({
      patientId: currentUser.id,
      patientName: currentUser.fullName || 'Guest Patient',
      patientEmail: currentUser.email || 'patient@apexcare.com',
      subject: `AI Escalation: Inquiry (${ticketNumber})`,
      category: 'General',
      priority: 'high',
      description: 'Patient escalated from ApexCare AI Assistant for specialized coordinator assistance.',
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `ai-handoff-${Date.now()}`,
        role: 'assistant',
        content: `🎫 **Support Ticket Created: ${ticketNumber}**\nStatus: **Open**\n\nYour request has been routed to our Priority Patient Concierge. Track updates under **Support** in your dashboard.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 ai-floating-widget">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#111111] hover:bg-black text-white shadow-lg transition-transform active:scale-95"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold leading-tight">ApexCare AI</p>
            <p className="text-[10px] text-[#9CA3AF] leading-tight">Clinical Assistant</p>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`flex flex-col rounded-xl bg-white shadow-2xl border border-[#EAEAEA] transition-all duration-200 overflow-hidden ${
            isExpanded
              ? 'w-[92vw] sm:w-[580px] h-[80vh] fixed bottom-6 right-4 sm:right-6'
              : 'w-[92vw] sm:w-[400px] h-[520px]'
          }`}
        >
          {/* Header - Clean White */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#EAEAEA] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#111111] text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-[#111111]">ApexCare AI</h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#F8F8F8] border border-[#EAEAEA] text-[#6B7280]">
                    Agent
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#6B7280]">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-md hover:text-[#111111] hover:bg-zinc-100 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:text-[#111111] hover:bg-zinc-100 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F8F8]">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-white text-[#111111] border border-[#EAEAEA]'
                        : 'bg-[#111111] text-white rounded-br-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Sensitive Tool Confirmation Card */}
                    {msg.toolCall && msg.toolCall.status === 'pending_confirmation' && (
                      <div className="mt-3 p-3 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] space-y-2">
                        <div className="flex items-center gap-2 text-[#111111] font-semibold text-xs">
                          <Calendar className="w-4 h-4 text-[#111111]" />
                          <span>Appointment Confirmation Required</span>
                        </div>
                        <div className="text-[11px] text-[#6B7280] space-y-0.5">
                          <p><strong>Doctor:</strong> {String(msg.toolCall.params.doctorName)}</p>
                          <p><strong>Schedule:</strong> {String(msg.toolCall.params.date)} at {String(msg.toolCall.params.time)}</p>
                          <p><strong>Fee:</strong> ${String(msg.toolCall.params.fee)}</p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleConfirmAction(msg.id, msg.toolCall!)}
                            className="flex-1 py-1.5 px-3 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setMessages((prev) =>
                                prev.map((m) =>
                                  m.id === msg.id
                                    ? { ...m, toolCall: { ...m.toolCall!, status: 'cancelled' } }
                                    : m
                                )
                              );
                            }}
                            className="py-1.5 px-3 rounded-md border border-[#EAEAEA] bg-white hover:bg-zinc-50 text-[#111111] text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Human Handoff Ticket Trigger */}
                    {msg.handoffTicketId && (
                      <div className="mt-2.5 p-2 rounded-lg bg-white border border-[#EAEAEA]">
                        <button
                          onClick={() => handleCreateHandoffTicket(msg.handoffTicketId!)}
                          className="w-full py-1.5 px-3 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Create Support Ticket {msg.handoffTicketId}
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-[#9CA3AF] mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Suggested Quick Action Chips */}
                  {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(action)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white text-[#111111] border border-[#EAEAEA] hover:border-[#111111] transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white border border-[#EAEAEA] text-xs text-[#6B7280] max-w-[75%]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#111111]" />
                <span>Consulting hospital clinical systems...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-1.5 bg-white border-t border-[#EAEAEA] flex items-center gap-1.5 overflow-x-auto text-[11px] text-[#6B7280] shrink-0">
            <span className="text-[#9CA3AF] shrink-0 font-medium">Try:</span>
            <button
              onClick={() => handleSend('Book appointment with Dr. Jenkins')}
              className="px-2 py-0.5 rounded-md bg-[#F8F8F8] border border-[#EAEAEA] hover:border-[#111111] text-[#111111] whitespace-nowrap"
            >
              📅 Book Doctor
            </button>
            <button
              onClick={() => handleSend('Show my lab results')}
              className="px-2 py-0.5 rounded-md bg-[#F8F8F8] border border-[#EAEAEA] hover:border-[#111111] text-[#111111] whitespace-nowrap"
            >
              🧪 Lab Results
            </button>
            <button
              onClick={() => handleSend('Visiting hours')}
              className="px-2 py-0.5 rounded-md bg-[#F8F8F8] border border-[#EAEAEA] hover:border-[#111111] text-[#111111] whitespace-nowrap"
            >
              🏥 Visiting Hours
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#EAEAEA] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about doctors, appointments, symptoms..."
                className="flex-1 bg-white text-xs text-[#111111] placeholder-[#9CA3AF] px-3 py-2 rounded-lg border border-[#EAEAEA] focus:outline-hidden focus:border-[#111111]"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-[#111111] hover:bg-black disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
