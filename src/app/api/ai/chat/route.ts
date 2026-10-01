import { NextResponse } from 'next/server';
import { executeAITool } from '@/lib/ai/tools';
import { INITIAL_DOCTORS, INITIAL_DEPARTMENTS, HOSPITAL_KNOWLEDGE_BASE } from '@/lib/data/mock-data';
import { generateTicketNumber } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body.messages)
      ? body.messages
      : body.message
      ? [{ content: body.message }]
      : [];
    const patientMrn = body.patientMrn;
    const lastMessage = messages[messages.length - 1];
    const userPrompt = (lastMessage?.content || '').toLowerCase();

    // 1. Check for Appointment Booking Intent
    if (userPrompt.includes('book') || userPrompt.includes('schedule') || userPrompt.includes('appointment with')) {
      // Find doctor if mentioned
      const matchedDoctor = INITIAL_DOCTORS.find((d) => {
        const parts = d.fullName.toLowerCase().replace('dr.', '').trim().split(/\s+/);
        return (
          userPrompt.includes(d.fullName.toLowerCase()) ||
          parts.some((p) => p.length > 2 && userPrompt.includes(p)) ||
          userPrompt.includes(d.departmentName.toLowerCase().split(' ')[0])
        );
      });

      if (matchedDoctor) {
        return NextResponse.json({
          role: 'assistant',
          content: `I found ${matchedDoctor.fullName} (${matchedDoctor.specialization}). They are available on ${matchedDoctor.availableDays.join(', ')} with slots starting from ${matchedDoctor.availableSlots[0]}. Would you like me to confirm a booking for you?`,
          toolCall: {
            toolName: 'createAppointment',
            params: {
              doctorId: matchedDoctor.id,
              doctorName: matchedDoctor.fullName,
              doctorSpecialty: matchedDoctor.specialization,
              date: '2026-10-05',
              time: matchedDoctor.availableSlots[0] || '10:00',
              fee: matchedDoctor.consultationFee,
            },
            status: 'pending_confirmation',
          },
          suggestedActions: [
            `Confirm Booking with ${matchedDoctor.fullName}`,
            'View other doctors',
            'Check visiting hours',
          ],
        });
      }

      const docList = await executeAITool('searchDoctors', { query: '' });
      return NextResponse.json({
        role: 'assistant',
        content: `I can certainly help you schedule a consultation! Which medical department or doctor are you looking for? Here are some of our top specialists:\n\n` +
          INITIAL_DOCTORS.slice(0, 3).map((d) => `• **${d.fullName}** - ${d.specialization} (${d.departmentName})`).join('\n') +
          `\n\nYou can say *"Book appointment with Dr. Jenkins"* or select below.`,
        suggestedActions: [
          'Book with Dr. Sarah Jenkins (Cardiology)',
          'Book with Dr. Marcus Chen (Neurology)',
          'Book with Dr. Robert Hayes (Orthopedics)',
        ],
      });
    }

    // 2. Check for Lab Results / Reports Intent
    if (userPrompt.includes('lab') || userPrompt.includes('report') || userPrompt.includes('test result')) {
      const mrn = patientMrn || 'MRN-84291';
      const labData = await executeAITool('getPatientReports', { patientMrn: mrn });
      if (labData.reports && labData.reports.length > 0) {
        const latest = labData.reports[0];
        return NextResponse.json({
          role: 'assistant',
          content: `Here are your recent lab results for **${mrn}**:\n\n**Test:** ${latest.testName}\n**Status:** ${latest.status.toUpperCase()}\n**Conclusion:** ${latest.conclusion}\n\nYou can inspect all numerical biomarkers and download verified PDF summaries in the Patient Portal under **Lab Reports**.`,
          suggestedActions: [
            'Go to Lab Reports page',
            'View active prescriptions',
            'Contact care team',
          ],
        });
      }
    }

    // 3. Check for Prescriptions / Medications Intent
    if (userPrompt.includes('prescription') || userPrompt.includes('medicine') || userPrompt.includes('refill') || userPrompt.includes('drugs')) {
      const mrn = patientMrn || 'MRN-84291';
      const rxData = await executeAITool('getPatientPrescriptions', { patientMrn: mrn });
      if (rxData.prescriptions && rxData.prescriptions.length > 0) {
        const first = rxData.prescriptions[0];
        return NextResponse.json({
          role: 'assistant',
          content: `You currently have an active prescription **${first.prescriptionNumber}** prescribed by **${first.doctor}**:\n\n` +
            first.items.map((i: string) => `• ${i}`).join('\n') +
            `\n\n*Instructions:* ${first.instructions}\nWould you like me to request an electronic refill from the hospital pharmacy?`,
          suggestedActions: [
            'Request Medication Refill',
            'Check pharmacy hours',
            'View doctor notes',
          ],
        });
      }
    }

    // 4. Check for Billing / Cost Intent
    if (userPrompt.includes('bill') || userPrompt.includes('cost') || userPrompt.includes('pay') || userPrompt.includes('invoice') || userPrompt.includes('fee')) {
      const mrn = patientMrn || 'MRN-84291';
      const billData = await executeAITool('getBillingInformation', { patientMrn: mrn });
      const invoices = (billData as any).invoices || [];
      return NextResponse.json({
        role: 'assistant',
        content: `Here is your billing statement for **${mrn}**:\n\n` +
          invoices.map((inv: any) => `• **${inv.invoiceNumber}**: Total ${inv.total} | Paid: ${inv.paid} | Balance: **${inv.balanceDue}** (Status: ${inv.status.toUpperCase()})`).join('\n') +
          `\n\nYou can make online payments securely using credit/debit cards or submit insurance claims in the **Billing** tab.`,
        suggestedActions: [
          'Pay Outstanding Balance',
          'Download Invoice Receipt',
          'Insurance Help',
        ],
      });
    }

    // 5. Check for Visiting Hours, Emergency, Insurance, Location, Policies (Knowledge Base)
    if (
      userPrompt.includes('visiting') ||
      userPrompt.includes('hours') ||
      userPrompt.includes('emergency') ||
      userPrompt.includes('insurance') ||
      userPrompt.includes('parking') ||
      userPrompt.includes('location') ||
      userPrompt.includes('contact')
    ) {
      const info = await executeAITool('getHospitalInformation', { topic: userPrompt });
      const answers = ((info as any).answers || (info as any).allInfo || []).map((a: any) => `**${a.topic}**\n${a.details}`).join('\n\n');
      return NextResponse.json({
        role: 'assistant',
        content: `Here is the authoritative information from ApexCare Medical Center:\n\n${answers}`,
        suggestedActions: [
          'Find a Doctor',
          'Book an Appointment',
          'Emergency Hotline',
        ],
      });
    }

    // 6. Check for Doctor Search Intent
    if (userPrompt.includes('doctor') || userPrompt.includes('cardiologist') || userPrompt.includes('neurologist') || userPrompt.includes('surgeon')) {
      const results = await executeAITool('searchDoctors', { query: userPrompt.replace('doctor', '').trim() });
      const docs = (results as any).doctors || [];
      return NextResponse.json({
        role: 'assistant',
        content: `I found **${docs.length}** matching medical specialists at ApexCare:\n\n` +
          docs.slice(0, 3).map((d: any) => `• **${d.name}** - ${d.specialization}\n  Fee: ${d.fee} | ${d.rating} | Days: ${d.availableDays}`).join('\n\n'),
        suggestedActions: [
          `Book with ${docs[0]?.name || 'a specialist'}`,
          'View all departments',
          'Speak with support desk',
        ],
      });
    }

    // 7. Human Escalation / Complex Query Fallback (Section 23 Human Handoff)
    const ticketId = generateTicketNumber();
    return NextResponse.json({
      role: 'assistant',
      content: `I understand your inquiry. To ensure you receive precise clinical and administrative assistance, **would you like me to create a formal support ticket for you with our concierge desk?**\n\nIf confirmed, ticket **${ticketId}** will be routed directly to an on-duty hospital coordinator.`,
      handoffTicketId: ticketId,
      suggestedActions: [
        `Yes, create ticket ${ticketId}`,
        'Book an appointment instead',
        'Show hospital contact numbers',
      ],
    });
  } catch (error: any) {
    console.error('AI chat error details:', error);
    return NextResponse.json(
      { role: 'assistant', content: `Error: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
