export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'lab_staff'
  | 'pharmacy_staff'
  | 'patient';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  departmentId?: string;
  doctorSpecialty?: string;
  patientMrn?: string; // Medical Record Number
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string;
  headDoctorName: string;
  headDoctorId: string;
  location: string;
  iconName: string;
  phone: string;
  email: string;
  activeDoctorsCount: number;
  totalBedsCount: number;
  availableBedsCount: number;
  image?: string;
}

export interface Doctor {
  id: string;
  profileId: string;
  fullName: string;
  departmentId: string;
  departmentName: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  bio: string;
  availableDays: string[];
  availableSlots: string[]; // e.g. ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30']
  status: 'active' | 'on_leave' | 'busy';
  roomNumber: string;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number e.g. "MRN-84291"
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  allergies: string[];
  chronicDiseases: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  registeredDate: string;
  lastVisitDate?: string;
  primaryDoctorId?: string;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentType = 'in_person' | 'video_consult' | 'emergency' | 'follow_up';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  departmentId: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  fee: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  visitDate: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number; // in °F or °C
    respiratoryRate: number;
    oxygenSaturation: number; // %
    weightKg: number;
    heightCm: number;
    bmi: number;
  };
  symptoms: string[];
  chiefComplaint: string;
  diagnosis: string;
  icd10Code?: string;
  clinicalNotes: string;
  treatmentPlan: string;
  followUpDate?: string;
  attachments?: { name: string; url: string; size: string; date: string }[];
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  genericName: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "Twice daily after meals"
  duration: string; // e.g. "7 days"
  route: 'Oral' | 'Topical' | 'Inhalation' | 'Intravenous' | 'Intramuscular';
  instructions: string; // e.g. "Take with plenty of water"
}

export interface Prescription {
  id: string;
  prescriptionNumber: string; // e.g. "RX-2026-904"
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  medicalRecordId?: string;
  diagnosis: string;
  items: PrescriptionItem[];
  generalInstructions: string;
  dateIssued: string;
  expiryDate: string;
  status: 'active' | 'dispensed' | 'expired';
}

export type LabStatus = 'requested' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';

export interface LabTestItem {
  name: string;
  result: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface LabRequest {
  id: string;
  requestNumber: string; // e.g. "LAB-8819"
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  testCategory: string; // Hematology, Biochemistry, Radiology, Microbiology, Pathology
  testName: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: LabStatus;
  requestedDate: string;
  sampleCollectedDate?: string;
  completedDate?: string;
  technicianName?: string;
  clinicalNotes?: string;
  results?: LabTestItem[];
  summaryConclusion?: string;
  cost: number;
}

export interface Medicine {
  id: string;
  sku: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Analgesic' | 'Cardiovascular' | 'Antidiabetic' | 'Antihistamine' | 'Respiratory' | 'GI' | 'Other';
  manufacturer: string;
  batchNumber: string;
  quantityInStock: number;
  minStockLevel: number;
  unitPrice: number;
  sellingPrice: number;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Inhaler';
  expiryDate: string;
  locationRack: string;
  requiresPrescription: boolean;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
}

export type BedStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';
export type BedType = 'ICU' | 'General' | 'Semi-Private' | 'VIP Suite' | 'Pediatric' | 'Emergency';

export interface Bed {
  id: string;
  bedNumber: string; // e.g. "ICU-04", "GW-201"
  roomId: string;
  roomNumber: string;
  floor: number;
  type: BedType;
  status: BedStatus;
  dailyRate: number;
  patientId?: string;
  patientName?: string;
  patientMrn?: string;
  admissionDate?: string;
  assignedDoctorName?: string;
  assignedNurseName?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  departmentId: string;
  departmentName: string;
  type: BedType;
  totalBeds: number;
  occupiedBeds: number;
  beds: Bed[];
}

export type InvoiceStatus = 'paid' | 'partially_paid' | 'pending' | 'refunded';

export interface InvoiceItem {
  id: string;
  category: 'Consultation' | 'Pharmacy' | 'Laboratory' | 'Room Charge' | 'Procedure' | 'Other';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-4401"
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientEmail: string;
  patientPhone: string;
  issuedDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  insuranceClaimAmount?: number;
  insuranceApproved?: boolean;
  paymentMethod?: 'Credit Card' | 'Debit Card' | 'Cash' | 'Insurance' | 'Online Banking';
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'lab' | 'billing' | 'prescription' | 'system' | 'alert';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export type TicketCategory =
  | 'Appointment'
  | 'Billing'
  | 'Technical Issue'
  | 'Medical Record'
  | 'Pharmacy'
  | 'Lab'
  | 'General';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_for_patient' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. "HSP-10245"
  patientId: string;
  patientName: string;
  patientEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'patient' | 'support_staff' | 'ai_agent';
    senderName: string;
    content: string;
    timestamp: string;
  }[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCall?: {
    toolName: string;
    params: Record<string, unknown>;
    result?: unknown;
    status: 'pending_confirmation' | 'executing' | 'completed' | 'cancelled';
  };
  suggestedActions?: string[];
  handoffTicketId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}
