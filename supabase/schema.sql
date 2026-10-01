-- ====================================================================
-- APEX CARE MEDICAL CENTER - ENTERPRISE HOSPITAL MANAGEMENT SYSTEM
-- PostgreSQL Schema with Row Level Security (RLS) and Audit Logging
-- Compatible with Supabase PostgreSQL
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'doctor',
  'nurse',
  'receptionist',
  'lab_staff',
  'pharmacy_staff',
  'patient'
);

CREATE TYPE appointment_status AS ENUM (
  'pending',
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE bed_status AS ENUM (
  'available',
  'occupied',
  'reserved',
  'cleaning',
  'maintenance'
);

CREATE TYPE bed_type AS ENUM (
  'ICU',
  'General',
  'Semi-Private',
  'VIP Suite',
  'Pediatric',
  'Emergency'
);

CREATE TYPE lab_status AS ENUM (
  'requested',
  'sample_collected',
  'processing',
  'completed',
  'cancelled'
);

CREATE TYPE invoice_status AS ENUM (
  'paid',
  'partially_paid',
  'pending',
  'refunded'
);

CREATE TYPE ticket_status AS ENUM (
  'open',
  'in_progress',
  'waiting_for_patient',
  'resolved',
  'closed'
);

-- 3. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  phone TEXT,
  avatar_url TEXT,
  department_id UUID,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  head_doctor_id UUID,
  location TEXT,
  icon_name TEXT DEFAULT 'Activity',
  phone TEXT,
  email TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DOCTORS
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id),
  specialization TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 1,
  consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
  rating NUMERIC(3, 2) DEFAULT 4.9,
  review_count INTEGER DEFAULT 0,
  room_number TEXT,
  bio TEXT,
  available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  available_slots TEXT[] DEFAULT ARRAY['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PATIENTS
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  mrn TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  blood_group TEXT,
  address TEXT,
  allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
  chronic_diseases TEXT[] DEFAULT ARRAY[]::TEXT[],
  emergency_contact_name TEXT,
  emergency_contact_relationship TEXT,
  emergency_contact_phone TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  registered_date DATE DEFAULT CURRENT_DATE,
  last_visit_date DATE,
  primary_doctor_id UUID REFERENCES public.doctors(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. APPOINTMENTS
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id),
  date DATE NOT NULL,
  time_slot TIME NOT NULL,
  type TEXT DEFAULT 'in_person',
  status appointment_status DEFAULT 'pending',
  reason TEXT NOT NULL,
  notes TEXT,
  fee NUMERIC(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_double_booking UNIQUE (doctor_id, date, time_slot)
);

-- 8. MEDICAL RECORDS
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  blood_pressure TEXT,
  heart_rate INTEGER,
  temperature NUMERIC(4, 1),
  respiratory_rate INTEGER,
  oxygen_saturation INTEGER,
  weight_kg NUMERIC(5, 2),
  height_cm NUMERIC(5, 2),
  bmi NUMERIC(4, 1),
  chief_complaint TEXT NOT NULL,
  symptoms TEXT[] DEFAULT ARRAY[]::TEXT[],
  diagnosis TEXT NOT NULL,
  icd10_code TEXT,
  clinical_notes TEXT,
  treatment_plan TEXT,
  follow_up_date DATE,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PRESCRIPTIONS & PRESCRIPTION ITEMS
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_number TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  medical_record_id UUID REFERENCES public.medical_records(id) ON DELETE SET NULL,
  diagnosis TEXT,
  general_instructions TEXT,
  date_issued DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  generic_name TEXT,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  route TEXT DEFAULT 'Oral',
  instructions TEXT
);

-- 10. LAB TESTS, REQUESTS & REPORTS
CREATE TABLE IF NOT EXISTS public.lab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  standard_cost NUMERIC(10, 2) NOT NULL,
  turnaround_hours INTEGER DEFAULT 24,
  reference_ranges JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.lab_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  test_category TEXT NOT NULL,
  priority TEXT DEFAULT 'routine',
  status lab_status DEFAULT 'requested',
  requested_date TIMESTAMPTZ DEFAULT NOW(),
  sample_collected_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  technician_name TEXT,
  clinical_notes TEXT,
  results JSONB DEFAULT '[]'::jsonb,
  summary_conclusion TEXT,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00
);

-- 11. PHARMACY INVENTORY
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  generic_name TEXT,
  category TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  quantity_in_stock INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 20,
  unit_price NUMERIC(10, 2) NOT NULL,
  selling_price NUMERIC(10, 2) NOT NULL,
  dosage_form TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  location_rack TEXT,
  requires_prescription BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'in_stock',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ROOMS & BEDS
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT UNIQUE NOT NULL,
  floor INTEGER NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  type bed_type NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_number TEXT UNIQUE NOT NULL,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  floor INTEGER NOT NULL,
  type bed_type NOT NULL DEFAULT 'General',
  status bed_status NOT NULL DEFAULT 'available',
  daily_rate NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  admission_date TIMESTAMPTZ,
  assigned_doctor_name TEXT,
  assigned_nurse_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. BILLING, INVOICES & PAYMENTS
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  issued_date DATE DEFAULT CURRENT_DATE,
  due_date DATE DEFAULT CURRENT_DATE + INTERVAL '14 days',
  status invoice_status DEFAULT 'pending',
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  balance_due NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  insurance_claim_amount NUMERIC(10, 2) DEFAULT 0.00,
  insurance_approved BOOLEAN DEFAULT FALSE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SUPPORT TICKETS & MESSAGES
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  description TEXT NOT NULL,
  assigned_staff_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'patient', 'support_staff', 'ai_agent'
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. KNOWLEDGE BASE & AI LOGS
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  tool_invocations JSONB DEFAULT '[]'::jsonb,
  escalated_to_ticket BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AUDIT LOGS (Section 32)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON public.appointments(doctor_id, date);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON public.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_requests_patient ON public.lab_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_beds_status ON public.beds(status);
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON public.invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity, entity_id);

-- 19. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: Users can read their own profile, Admins can read all
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.get_current_role() IN ('admin', 'super_admin'));

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.get_current_role() IN ('admin', 'super_admin'));

-- Patients: Patient views own record; Doctors/Nurses/Admins view all
CREATE POLICY "Patients view own record" ON public.patients
  FOR SELECT USING (
    profile_id = auth.uid() OR
    public.get_current_role() IN ('admin', 'super_admin', 'doctor', 'nurse', 'receptionist')
  );

-- Appointments: Patients view own, Doctors view theirs, Admins/Receptionists view all
CREATE POLICY "Appointment access" ON public.appointments
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM public.doctors WHERE profile_id = auth.uid()) OR
    public.get_current_role() IN ('admin', 'super_admin', 'receptionist', 'nurse')
  );

-- Medical Records: Only treating doctor, patient, and clinical admins
CREATE POLICY "Medical records privacy" ON public.medical_records
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM public.doctors WHERE profile_id = auth.uid()) OR
    public.get_current_role() IN ('admin', 'super_admin')
  );

-- Prescriptions: Patient sees own, Doctor and Pharmacy Staff see all
CREATE POLICY "Prescription access" ON public.prescriptions
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()) OR
    public.get_current_role() IN ('admin', 'super_admin', 'doctor', 'pharmacy_staff')
  );

-- Invoices: Patient sees own, Billing and Admins see all
CREATE POLICY "Invoice access" ON public.invoices
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()) OR
    public.get_current_role() IN ('admin', 'super_admin', 'receptionist')
  );
