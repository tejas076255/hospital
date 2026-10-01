'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  Department,
  Doctor,
  Patient,
  Appointment,
  MedicalRecord,
  Prescription,
  LabRequest,
  Medicine,
  Room,
  Bed,
  Invoice,
  NotificationItem,
  SupportTicket,
  AuditLog,
  UserRole,
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_REQUESTS,
  INITIAL_MEDICINES,
  INITIAL_ROOMS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_AUDIT_LOGS,
} from './mock-data';
import { generateMrn, generateInvoiceNumber, generatePrescriptionNumber, generateTicketNumber } from '../utils';

// Global in-memory state shared across client components
let state = {
  currentUser: INITIAL_USERS[0], // default Admin
  users: INITIAL_USERS,
  departments: INITIAL_DEPARTMENTS,
  doctors: INITIAL_DOCTORS,
  patients: INITIAL_PATIENTS,
  appointments: INITIAL_APPOINTMENTS,
  medicalRecords: INITIAL_MEDICAL_RECORDS,
  prescriptions: INITIAL_PRESCRIPTIONS,
  labRequests: INITIAL_LAB_REQUESTS,
  medicines: INITIAL_MEDICINES,
  rooms: INITIAL_ROOMS,
  invoices: INITIAL_INVOICES,
  notifications: INITIAL_NOTIFICATIONS,
  supportTickets: INITIAL_SUPPORT_TICKETS,
  auditLogs: INITIAL_AUDIT_LOGS,
};

const listeners = new Set<() => void>();

function notifyListeners() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('apexcare_store_v1', JSON.stringify({
        appointments: state.appointments,
        patients: state.patients,
        doctors: state.doctors,
        medicalRecords: state.medicalRecords,
        prescriptions: state.prescriptions,
        labRequests: state.labRequests,
        medicines: state.medicines,
        rooms: state.rooms,
        invoices: state.invoices,
        notifications: state.notifications,
        supportTickets: state.supportTickets,
        auditLogs: state.auditLogs,
        currentUserId: state.currentUser.id,
      }));
    } catch {
      // Storage quota or SSR safe
    }
  }
  listeners.forEach((listener) => listener());
}

export function initializeStoreFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem('apexcare_store_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.appointments) state.appointments = parsed.appointments;
      if (parsed.patients) state.patients = parsed.patients;
      if (parsed.doctors) state.doctors = parsed.doctors;
      if (parsed.medicalRecords) state.medicalRecords = parsed.medicalRecords;
      if (parsed.prescriptions) state.prescriptions = parsed.prescriptions;
      if (parsed.labRequests) state.labRequests = parsed.labRequests;
      if (parsed.medicines) state.medicines = parsed.medicines;
      if (parsed.rooms) state.rooms = parsed.rooms;
      if (parsed.invoices) state.invoices = parsed.invoices;
      if (parsed.notifications) state.notifications = parsed.notifications;
      if (parsed.supportTickets) state.supportTickets = parsed.supportTickets;
      if (parsed.auditLogs) state.auditLogs = parsed.auditLogs;
      if (parsed.currentUserId) {
        const found = state.users.find((u) => u.id === parsed.currentUserId);
        if (found) state.currentUser = found;
      }
    }
  } catch {
    // Graceful fallback
  }
}

// React Hook to access and mutate the store
export function useHospitalStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    initializeStoreFromStorage();
    const update = () => setTick((t) => t + 1);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const match = state.users.find((u) => u.role === role);
    if (match) {
      state.currentUser = match;
    } else {
      // Fallback create user for role
      state.currentUser = {
        id: `usr-${role}-${Date.now()}`,
        email: `${role}@apexcare.com`,
        fullName: `${role.replace('_', ' ').toUpperCase()} User`,
        role,
        createdAt: new Date().toISOString(),
      };
    }
    notifyListeners();
  }, []);

  const setCurrentUser = useCallback((user: UserProfile) => {
    state.currentUser = user;
    notifyListeners();
  }, []);

  const addAuditLog = useCallback((action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: state.currentUser.id,
      userName: state.currentUser.fullName,
      userRole: state.currentUser.role,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    state.auditLogs = [newLog, ...state.auditLogs];
    notifyListeners();
  }, []);

  const bookAppointment = useCallback((data: {
    patientId: string;
    patientName: string;
    patientMrn: string;
    patientPhone: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    departmentId: string;
    departmentName: string;
    date: string;
    time: string;
    type?: 'in_person' | 'video_consult' | 'emergency' | 'follow_up';
    reason: string;
    fee: number;
  }) => {
    // Prevent double booking backend check
    const isConflict = state.appointments.some(
      (a) => a.doctorId === data.doctorId && a.date === data.date && a.time === data.time && a.status !== 'cancelled'
    );
    if (isConflict) {
      throw new Error(`Doctor already has a confirmed booking for ${data.date} at ${data.time}. Please pick another time slot.`);
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName,
      patientMrn: data.patientMrn,
      patientPhone: data.patientPhone,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      doctorSpecialty: data.doctorSpecialty,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      date: data.date,
      time: data.time,
      type: data.type || 'in_person',
      status: 'confirmed',
      reason: data.reason,
      fee: data.fee,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    state.appointments = [newApt, ...state.appointments];

    // Auto notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: data.patientId,
      title: 'Appointment Confirmed',
      message: `Your appointment with ${data.doctorName} is confirmed for ${data.date} at ${data.time}.`,
      type: 'appointment',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/patient/appointments',
    };
    state.notifications = [newNotif, ...state.notifications];

    // Audit log
    addAuditLog('APPOINTMENT_BOOKED', 'Appointment', newApt.id, `Booked with ${data.doctorName} for ${data.date}`);
    notifyListeners();
    return newApt;
  }, [addAuditLog]);

  const cancelAppointment = useCallback((appointmentId: string, reason?: string) => {
    state.appointments = state.appointments.map((a) =>
      a.id === appointmentId ? { ...a, status: 'cancelled', notes: reason ? `Cancelled: ${reason}` : a.notes } : a
    );
    addAuditLog('APPOINTMENT_CANCELLED', 'Appointment', appointmentId, reason || 'Cancelled by user');
    notifyListeners();
  }, [addAuditLog]);

  const rescheduleAppointment = useCallback((appointmentId: string, newDate: string, newTime: string) => {
    const existing = state.appointments.find((a) => a.id === appointmentId);
    if (!existing) return;

    // Check conflict
    const conflict = state.appointments.some(
      (a) => a.id !== appointmentId && a.doctorId === existing.doctorId && a.date === newDate && a.time === newTime && a.status !== 'cancelled'
    );
    if (conflict) {
      throw new Error(`Doctor is unavailable on ${newDate} at ${newTime}. Please choose another slot.`);
    }

    state.appointments = state.appointments.map((a) =>
      a.id === appointmentId ? { ...a, date: newDate, time: newTime, status: 'confirmed' } : a
    );
    addAuditLog('APPOINTMENT_RESCHEDULED', 'Appointment', appointmentId, `Moved to ${newDate} ${newTime}`);
    notifyListeners();
  }, [addAuditLog]);

  const updateAppointmentStatus = useCallback((appointmentId: string, status: Appointment['status']) => {
    state.appointments = state.appointments.map((a) =>
      a.id === appointmentId ? { ...a, status } : a
    );
    addAuditLog('APPOINTMENT_STATUS_UPDATED', 'Appointment', appointmentId, `Status changed to ${status}`);
    notifyListeners();
  }, [addAuditLog]);

  const addPatient = useCallback((data: Omit<Patient, 'id' | 'mrn' | 'registeredDate'>) => {
    const newPatient: Patient = {
      ...data,
      id: `pat-${Date.now()}`,
      mrn: generateMrn(),
      registeredDate: new Date().toISOString().split('T')[0],
    };
    state.patients = [newPatient, ...state.patients];
    addAuditLog('PATIENT_REGISTERED', 'Patient', newPatient.id, `Patient registered: ${newPatient.fullName} (${newPatient.mrn})`);
    notifyListeners();
    return newPatient;
  }, [addAuditLog]);

  const createPrescription = useCallback((data: Omit<Prescription, 'id' | 'prescriptionNumber' | 'dateIssued' | 'status'>) => {
    const newRx: Prescription = {
      ...data,
      id: `rx-${Date.now()}`,
      prescriptionNumber: generatePrescriptionNumber(),
      dateIssued: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    state.prescriptions = [newRx, ...state.prescriptions];
    addAuditLog('PRESCRIPTION_CREATED', 'Prescription', newRx.id, `Prescription ${newRx.prescriptionNumber} for ${newRx.patientName}`);
    notifyListeners();
    return newRx;
  }, [addAuditLog]);

  const createLabRequest = useCallback((data: Omit<LabRequest, 'id' | 'requestNumber' | 'requestedDate' | 'status'>) => {
    const newLab: LabRequest = {
      ...data,
      id: `lab-req-${Date.now()}`,
      requestNumber: `LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      requestedDate: new Date().toISOString(),
      status: 'requested',
    };
    state.labRequests = [newLab, ...state.labRequests];
    addAuditLog('LAB_REQUEST_CREATED', 'LabRequest', newLab.id, `Test ${newLab.testName} ordered for ${newLab.patientName}`);
    notifyListeners();
    return newLab;
  }, [addAuditLog]);

  const updateLabStatus = useCallback((labId: string, status: LabRequest['status'], results?: LabRequest['results'], conclusion?: string) => {
    state.labRequests = state.labRequests.map((lab) => {
      if (lab.id === labId) {
        return {
          ...lab,
          status,
          results: results || lab.results,
          summaryConclusion: conclusion || lab.summaryConclusion,
          completedDate: status === 'completed' ? new Date().toISOString() : lab.completedDate,
        };
      }
      return lab;
    });
    addAuditLog('LAB_STATUS_UPDATED', 'LabRequest', labId, `Status updated to ${status}`);
    notifyListeners();
  }, [addAuditLog]);

  const updateBedStatus = useCallback((bedId: string, status: Bed['status'], patient?: { id: string; name: string; mrn: string }, doctorName?: string) => {
    state.rooms = state.rooms.map((room) => ({
      ...room,
      beds: room.beds.map((bed) => {
        if (bed.id === bedId) {
          return {
            ...bed,
            status,
            patientId: patient?.id,
            patientName: patient?.name,
            patientMrn: patient?.mrn,
            admissionDate: status === 'occupied' ? new Date().toISOString() : undefined,
            assignedDoctorName: doctorName || bed.assignedDoctorName,
          };
        }
        return bed;
      }),
    }));
    addAuditLog('BED_STATUS_CHANGED', 'Bed', bedId, `Bed status updated to ${status}`);
    notifyListeners();
  }, [addAuditLog]);

  const dischargeBed = useCallback((bedId: string) => {
    updateBedStatus(bedId, 'cleaning');
  }, [updateBedStatus]);

  const updateMedicineStock = useCallback((medicineId: string, deltaQty: number) => {
    state.medicines = state.medicines.map((med) => {
      if (med.id === medicineId) {
        const newQty = Math.max(0, med.quantityInStock + deltaQty);
        const status = newQty === 0 ? 'out_of_stock' : newQty <= med.minStockLevel ? 'low_stock' : 'in_stock';
        return {
          ...med,
          quantityInStock: newQty,
          status,
        };
      }
      return med;
    });
    addAuditLog('MEDICINE_STOCK_ADJUSTED', 'Medicine', medicineId, `Stock adjusted by ${deltaQty}`);
    notifyListeners();
  }, [addAuditLog]);

  const payInvoice = useCallback((invoiceId: string, amount: number, paymentMethod: Invoice['paymentMethod']) => {
    state.invoices = state.invoices.map((inv) => {
      if (inv.id === invoiceId) {
        const newPaid = inv.paidAmount + amount;
        const newBalance = Math.max(0, inv.totalAmount - newPaid);
        const status: Invoice['status'] = newBalance === 0 ? 'paid' : 'partially_paid';
        return {
          ...inv,
          paidAmount: newPaid,
          balanceDue: newBalance,
          status,
          paymentMethod: paymentMethod || inv.paymentMethod,
        };
      }
      return inv;
    });
    addAuditLog('INVOICE_PAID', 'Invoice', invoiceId, `Payment of $${amount} via ${paymentMethod}`);
    notifyListeners();
  }, [addAuditLog]);

  const createSupportTicket = useCallback((data: {
    patientId?: string;
    patientName: string;
    patientEmail: string;
    subject: string;
    category: SupportTicket['category'];
    priority: SupportTicket['priority'];
    description: string;
  }) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: generateTicketNumber(),
      patientId: data.patientId || 'pat-guest',
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'open',
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'patient',
          senderName: data.patientName,
          content: data.description,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    state.supportTickets = [newTicket, ...state.supportTickets];
    addAuditLog('TICKET_CREATED', 'SupportTicket', newTicket.id, `Ticket ${newTicket.ticketNumber} created`);
    notifyListeners();
    return newTicket;
  }, [addAuditLog]);

  const replyToSupportTicket = useCallback((ticketId: string, sender: 'patient' | 'support_staff' | 'ai_agent', senderName: string, content: string) => {
    state.supportTickets = state.supportTickets.map((tkt) => {
      if (tkt.id === ticketId) {
        return {
          ...tkt,
          updatedAt: new Date().toISOString(),
          status: sender === 'support_staff' ? 'in_progress' : tkt.status,
          messages: [
            ...tkt.messages,
            {
              id: `msg-${Date.now()}`,
              sender,
              senderName,
              content,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return tkt;
    });
    notifyListeners();
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    state.notifications = state.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    notifyListeners();
  }, []);

  return {
    currentUser: state.currentUser,
    users: state.users,
    departments: state.departments,
    doctors: state.doctors,
    patients: state.patients,
    appointments: state.appointments,
    medicalRecords: state.medicalRecords,
    prescriptions: state.prescriptions,
    labRequests: state.labRequests,
    medicines: state.medicines,
    rooms: state.rooms,
    invoices: state.invoices,
    notifications: state.notifications,
    supportTickets: state.supportTickets,
    auditLogs: state.auditLogs,
    // Actions
    switchRole,
    setCurrentUser,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    updateAppointmentStatus,
    addPatient,
    createPrescription,
    createLabRequest,
    updateLabStatus,
    updateBedStatus,
    dischargeBed,
    updateMedicineStock,
    payInvoice,
    createSupportTicket,
    replyToSupportTicket,
    markNotificationRead,
    addAuditLog,
  };
}
