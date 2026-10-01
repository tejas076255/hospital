import { INITIAL_DEPARTMENTS, INITIAL_DOCTORS, INITIAL_APPOINTMENTS, INITIAL_LAB_REQUESTS, INITIAL_PRESCRIPTIONS, INITIAL_INVOICES, HOSPITAL_KNOWLEDGE_BASE } from '../data/mock-data';
import { generateTicketNumber } from '../utils';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required?: string[];
  };
}

export const AI_AVAILABLE_TOOLS: ToolDefinition[] = [
  {
    name: 'searchDoctors',
    description: 'Search doctors by name, specialty, or department.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term e.g. "Cardiology", "Dr. Jenkins", "Neurosurgery"' },
        departmentId: { type: 'string', description: 'Optional department ID filter' },
      },
    },
  },
  {
    name: 'getDoctorAvailability',
    description: 'Get available consultation days and time slots for a specific doctor.',
    parameters: {
      type: 'object',
      properties: {
        doctorId: { type: 'string', description: 'Doctor ID or Doctor name' },
      },
      required: ['doctorId'],
    },
  },
  {
    name: 'getDepartments',
    description: 'List medical departments, specialized clinics, and service details.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional search filter' },
      },
    },
  },
  {
    name: 'getHospitalInformation',
    description: 'Get authoritative hospital policies, visiting hours, emergency hotline, insurance networks, and facilities.',
    parameters: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'e.g. "visiting hours", "emergency", "insurance", "parking", "prescriptions"' },
      },
    },
  },
  {
    name: 'getPatientAppointments',
    description: 'Look up current or past appointments for a patient using MRN or patient name.',
    parameters: {
      type: 'object',
      properties: {
        patientIdentifier: { type: 'string', description: 'Patient MRN or Name e.g. "MRN-84291" or "James Wilson"' },
      },
      required: ['patientIdentifier'],
    },
  },
  {
    name: 'getPatientReports',
    description: 'Retrieve verified laboratory results and status for a patient.',
    parameters: {
      type: 'object',
      properties: {
        patientMrn: { type: 'string', description: 'Patient MRN e.g. "MRN-84291"' },
      },
      required: ['patientMrn'],
    },
  },
  {
    name: 'getPatientPrescriptions',
    description: 'Retrieve active prescriptions and medication instructions for a patient.',
    parameters: {
      type: 'object',
      properties: {
        patientMrn: { type: 'string', description: 'Patient MRN e.g. "MRN-84291"' },
      },
      required: ['patientMrn'],
    },
  },
  {
    name: 'getBillingInformation',
    description: 'Get outstanding invoices and payment status for a patient.',
    parameters: {
      type: 'object',
      properties: {
        patientMrn: { type: 'string', description: 'Patient MRN e.g. "MRN-84291"' },
      },
      required: ['patientMrn'],
    },
  },
  {
    name: 'createAppointment',
    description: 'Book a medical consultation with a doctor (Requires user confirmation).',
    parameters: {
      type: 'object',
      properties: {
        doctorId: { type: 'string', description: 'Doctor ID or Name' },
        patientName: { type: 'string', description: 'Patient Full Name' },
        patientPhone: { type: 'string', description: 'Patient Phone Number' },
        date: { type: 'string', description: 'Appointment date YYYY-MM-DD' },
        time: { type: 'string', description: 'Appointment time HH:mm' },
        reason: { type: 'string', description: 'Medical reason for visit' },
      },
      required: ['doctorId', 'patientName', 'date', 'time', 'reason'],
    },
  },
  {
    name: 'cancelAppointment',
    description: 'Cancel an existing appointment (Requires user confirmation).',
    parameters: {
      type: 'object',
      properties: {
        appointmentId: { type: 'string', description: 'Appointment ID e.g. "apt-101"' },
        reason: { type: 'string', description: 'Reason for cancellation' },
      },
      required: ['appointmentId'],
    },
  },
  {
    name: 'createSupportTicket',
    description: 'Escalate to human support desk and create a formal tracked hospital support ticket.',
    parameters: {
      type: 'object',
      properties: {
        patientName: { type: 'string', description: 'Patient Name' },
        patientEmail: { type: 'string', description: 'Patient Email' },
        subject: { type: 'string', description: 'Ticket subject' },
        category: { type: 'string', description: 'Category: Appointment, Billing, Technical Issue, Medical Record, General' },
        description: { type: 'string', description: 'Detailed problem description' },
      },
      required: ['patientName', 'patientEmail', 'subject', 'description'],
    },
  },
];

// Backend tool executor with validation
export async function executeAITool(toolName: string, args: Record<string, any>) {
  switch (toolName) {
    case 'searchDoctors': {
      const rawQ = (args.query || '').toLowerCase();
      const stopWords = ['can', 'you', 'recommend', 'a', 'an', 'the', 'find', 'me', 'i', 'need', 'want', 'to', 'see', 'doctor', 'specialist', 'please', 'looking', 'for', 'who', 'is'];
      const tokens = rawQ
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w: string) => w.length > 2 && !stopWords.includes(w));

      const results = INITIAL_DOCTORS.filter((d) => {
        if (tokens.length === 0) return true;
        const text = `${d.fullName} ${d.specialization} ${d.departmentName}`.toLowerCase();
        return tokens.some((token: string) => {
          const stem = token.slice(0, 5);
          return text.includes(token) || (stem.length >= 4 && text.includes(stem));
        });
      }).map((d) => ({
        id: d.id,
        name: d.fullName,
        department: d.departmentName,
        specialization: d.specialization,
        fee: `$${d.consultationFee}`,
        rating: `${d.rating} ★ (${d.reviewCount} reviews)`,
        availableDays: d.availableDays.join(', '),
      }));
      return { success: true, count: results.length, doctors: results };
    }

    case 'getDoctorAvailability': {
      const q = (args.doctorId || '').toLowerCase();
      const doctor = INITIAL_DOCTORS.find(
        (d) => d.id.toLowerCase() === q || d.fullName.toLowerCase().includes(q)
      );
      if (!doctor) return { success: false, error: 'Doctor not found in directory.' };
      return {
        success: true,
        doctorId: doctor.id,
        doctorName: doctor.fullName,
        specialization: doctor.specialization,
        availableDays: doctor.availableDays,
        slots: doctor.availableSlots,
        fee: `$${doctor.consultationFee}`,
      };
    }

    case 'getDepartments': {
      const q = (args.query || '').toLowerCase();
      const depts = INITIAL_DEPARTMENTS.filter(
        (d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
      ).map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        headOfDepartment: d.headDoctorName,
        location: d.location,
        phone: d.phone,
        totalBeds: d.totalBedsCount,
        availableBeds: d.availableBedsCount,
      }));
      return { success: true, departments: depts };
    }

    case 'getHospitalInformation': {
      const topic = (args.topic || '').toLowerCase();
      const found = HOSPITAL_KNOWLEDGE_BASE.filter(
        (k) => k.topic.toLowerCase().includes(topic) || k.details.toLowerCase().includes(topic)
      );
      if (found.length > 0) {
        return { success: true, answers: found };
      }
      return { success: true, allInfo: HOSPITAL_KNOWLEDGE_BASE };
    }

    case 'getPatientAppointments': {
      const id = (args.patientIdentifier || '').toLowerCase();
      const results = INITIAL_APPOINTMENTS.filter(
        (a) => a.patientMrn.toLowerCase().includes(id) || a.patientName.toLowerCase().includes(id)
      ).map((a) => ({
        appointmentId: a.id,
        doctor: a.doctorName,
        specialty: a.doctorSpecialty,
        date: a.date,
        time: a.time,
        status: a.status,
        type: a.type,
      }));
      return { success: true, appointments: results };
    }

    case 'getPatientReports': {
      const mrn = (args.patientMrn || '').toUpperCase();
      const reports = INITIAL_LAB_REQUESTS.filter((l) => l.patientMrn.toUpperCase() === mrn).map((l) => ({
        testName: l.testName,
        status: l.status,
        requestedDate: l.requestedDate,
        conclusion: l.summaryConclusion || 'Pending processing',
        results: l.results || [],
      }));
      return { success: true, reports };
    }

    case 'getPatientPrescriptions': {
      const mrn = (args.patientMrn || '').toUpperCase();
      const rxs = INITIAL_PRESCRIPTIONS.filter((p) => p.patientMrn.toUpperCase() === mrn).map((p) => ({
        prescriptionNumber: p.prescriptionNumber,
        doctor: p.doctorName,
        diagnosis: p.diagnosis,
        items: p.items.map((i) => `${i.medicineName} (${i.dosage}) - ${i.frequency}`),
        instructions: p.generalInstructions,
        expiryDate: p.expiryDate,
      }));
      return { success: true, prescriptions: rxs };
    }

    case 'getBillingInformation': {
      const mrn = (args.patientMrn || '').toUpperCase();
      const invoices = INITIAL_INVOICES.filter((inv) => inv.patientMrn.toUpperCase() === mrn).map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        total: `$${inv.totalAmount.toFixed(2)}`,
        paid: `$${inv.paidAmount.toFixed(2)}`,
        balanceDue: `$${inv.balanceDue.toFixed(2)}`,
        status: inv.status,
        dueDate: inv.dueDate,
      }));
      return { success: true, invoices };
    }

    case 'createSupportTicket': {
      const ticketNumber = generateTicketNumber();
      return {
        success: true,
        ticketNumber,
        status: 'Open',
        message: `Support ticket ${ticketNumber} has been opened for ${args.patientName}. A clinical concierge representative will respond within 2 hours.`,
      };
    }

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}
