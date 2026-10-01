'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import {
  Bot,
  Send,
  Mic,
} from 'lucide-react';
import { AIMessage } from '@/types';

export default function PatientAIAssistantPage() {
  const { currentUser, bookAppointment } = useHospitalStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'ai-page-1',
      role: 'assistant',
      content: `Hello ${currentUser.fullName || 'James'}! I am **ApexCare AI**, your clinical health assistant. I can help look up your appointments, explain lab findings, check prescription dosage schedules, or book a consultation with our hospital specialists.`,
      timestamp: 'Just now',
      suggestedActions: [
        'When is my next appointment?',
        'Explain my lipid panel lab report',
        'Book consultation with Dr. Jenkins',
        'Hospital visiting hours & parking',
      ],
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: q,
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
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCall: data.toolCall,
          suggestedActions: data.suggestedActions,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to reach clinical AI service. Please retry shortly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = async () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        setIsRecording(false);
        handleSend('What are the hospital visiting hours for ICU?');
      }, 2000);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Autonomous Concierge
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1 flex items-center gap-2.5">
            <Bot className="w-8 h-8 text-zinc-950" />
            ApexCare AI Clinical Assistant
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time medical navigation, appointment booking, laboratory explanations, and ticket escalation.
          </p>
        </div>

        {/* Chat Window */}
        <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200'
                        : 'bg-zinc-950 text-white shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {/* Booking confirmation tool view */}
                    {m.toolCall && m.toolCall.status === 'pending_confirmation' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-zinc-900">
                        <p className="font-bold text-zinc-950">
                          Confirm Appointment Booking:
                        </p>
                        <p className="text-zinc-600">
                          Doctor: {String(m.toolCall.params.doctorName)} • Date: {String(m.toolCall.params.date)} at {String(m.toolCall.params.time)}
                        </p>
                        <button
                          onClick={() => {
                            bookAppointment({
                              patientId: currentUser.id,
                              patientName: currentUser.fullName,
                              patientMrn: currentUser.patientMrn || 'MRN-84291',
                              patientPhone: currentUser.phone || '+1 (555) 890-1234',
                              doctorId: String(m.toolCall?.params.doctorId),
                              doctorName: String(m.toolCall?.params.doctorName),
                              doctorSpecialty: String(m.toolCall?.params.doctorSpecialty),
                              departmentId: 'dept-cardio',
                              departmentName: 'Cardiology Center',
                              date: String(m.toolCall?.params.date),
                              time: String(m.toolCall?.params.time),
                              reason: 'Scheduled through ApexCare AI',
                              fee: Number(m.toolCall?.params.fee) || 180,
                            });
                            alert('Appointment successfully booked and synchronized!');
                          }}
                          className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all active:scale-[0.98]"
                        >
                          Confirm & Save Booking
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick suggestion pills */}
                  {isAssistant && m.suggestedActions && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(act)}
                          className="px-3 py-1 rounded-full text-[11px] font-medium bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-950 shadow-2xs transition-colors"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input & Voice Controls */}
          <div className="p-4 bg-white border-t border-zinc-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-3 rounded-xl border transition-colors ${
                  isRecording
                    ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200/80'
                }`}
                title="Voice input (Speech to Text ready)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about medications, appointments, visiting hours, or lab tests..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-50 text-xs text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                Ask AI
              </button>
            </form>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
