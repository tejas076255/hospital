'use client';

import { PortalLayout } from '@/components/layout/PortalLayout';
import { useHospitalStore } from '@/lib/data/store';
import {
  Cpu,
  CheckCircle2,
  Wrench,
} from 'lucide-react';
import { AI_AVAILABLE_TOOLS } from '@/lib/ai/tools';
import { formatDateTime } from '@/lib/utils';

export default function AdminAIMonitoringPage() {
  const { auditLogs } = useHospitalStore();

  const aiLogs = auditLogs.filter(
    (l) => l.action.includes('AI') || l.action.includes('APPOINTMENT') || l.action.includes('TICKET')
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            AI Clinical Agent Telemetry
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Audit log of AI assistant conversations, tool invocations, user confirmations, and human handoffs.
          </p>
        </div>

        {/* AI Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <span className="text-[10px] uppercase font-semibold text-[#6B7280]">Total Interactions</span>
            <p className="text-2xl font-bold text-[#111111] mt-1">1,842</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">94.8% First-turn resolution</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <span className="text-[10px] uppercase font-semibold text-[#6B7280]">Autonomous Tool Calls</span>
            <p className="text-2xl font-bold text-[#111111] mt-1">426</p>
            <p className="text-[11px] text-[#6B7280] mt-1">Appointments, labs, and policies</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <span className="text-[10px] uppercase font-semibold text-[#6B7280]">Human Handoffs</span>
            <p className="text-2xl font-bold text-[#111111] mt-1">3.2%</p>
            <p className="text-[11px] text-[#6B7280] mt-1">Escalated to support tickets</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#EAEAEA]">
            <span className="text-[10px] uppercase font-semibold text-[#6B7280]">Compliance Standard</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">100%</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">HIPAA verified server actions</p>
          </div>
        </div>

        {/* Registered Backend Tools Matrix */}
        <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#111111]" />
                Controlled AI Execution Tools
              </h3>
              <p className="text-xs text-[#6B7280]">
                Every sensitive database mutation is restricted behind verified server actions.
              </p>
            </div>
            <span className="text-xs font-medium text-[#111111] bg-[#F8F8F8] px-2.5 py-1 rounded-md border border-[#EAEAEA]">
              {AI_AVAILABLE_TOOLS.length} Active Tools
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {AI_AVAILABLE_TOOLS.map((t) => (
              <div
                key={t.name}
                className="p-3.5 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-xs text-[#111111]">
                    {t.name}()
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Audit Log of Tool Executions & Handoffs */}
        <div className="p-5 rounded-xl bg-white border border-[#EAEAEA] space-y-4">
          <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#111111]" />
            AI & Audit Operations Stream
          </h3>

          <div className="space-y-2">
            {aiLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-white border border-[#EAEAEA] text-[#111111]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono font-semibold text-[#111111] text-[11px]">
                      {log.action}
                    </span>
                    <p className="text-[#111111] font-medium">{log.details}</p>
                    <p className="text-[10px] text-[#6B7280]">Actor: {log.userName} ({log.userRole})</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-mono">
                  {formatDateTime(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
