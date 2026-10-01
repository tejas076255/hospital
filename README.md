# 🏥 ApexCare — Enterprise AI-Powered Hospital Management System (HMS)

> A modern, clinical-grade full-stack Hospital Management System designed with Next.js 15, TypeScript, Tailwind CSS, Supabase PostgreSQL, and an Autonomous Clinical AI Assistant.

---

## 🌟 Overview

**ApexCare** streamlines end-to-end clinical and administrative operations across quaternary medical institutions. The platform integrates:

* **Executive Administration:** Real-time clinical KPIs, revenue tracking, visual bed allocation matrix, and RBAC control.
* **Physician & Consultation Suite:** Bedside vital signs monitoring, ICD-10 clinical diagnosis notes, and 1-click digital prescriptions (Rx).
* **Patient Self-Service:** Online department & specialist doctor appointment scheduling, lab test diagnostics, and electronic bill pay.
* **Dispensary & Pharmacy:** Lot tracking, real-time stock decrements, and automatic minimum reorder threshold alerts.
* **Laboratory Pathology:** 4-stage specimen pipeline (*Requested → Sample Collected → Processing → Verified*).
* **Autonomous AI Clinical Assistant:** Interactive AI concierge with backend tool calling (`createAppointment`, `checkLabResults`, `createSupportTicket`) and sensitive action confirmation guards.

---

## 🎨 Design System: White & Black Minimalist Aesthetic

The UI strictly adheres to a **white-first design system** (90% White / 10% Black accent) inspired by minimalist healthcare interfaces:
* **Backgrounds:** Pure White (`#FFFFFF`) canvas with subtle `#F8F8F8` surfaces.
* **Dividers & Borders:** Thin, crisp hairline borders (`#EAEAEA` / `border-zinc-200`).
* **Buttons:** High-contrast `#111111` primary actions with 8px (`rounded-lg`) border radius.
* **Typography:** Bold, legible sans-serif hierarchy with `#111111` headers and `#6B7280` secondary text.
* **Distraction-Free:** No colorful gradients, heavy glassmorphism, or dark themes.

---

## 👥 Integrated Role Portals

| Portal | Route | Primary Responsibilities |
| :--- | :--- | :--- |
| **Hospital Admin** | `/admin/dashboard` | Executive telemetry, bed occupancy, doctor registry, staff directory, billing |
| **Doctor / Specialist** | `/doctor/dashboard` | OPD schedule, consultation room, digital Rx prescription writer, lab orders |
| **Patient Portal** | `/patient/dashboard` | Appointment bookings, certified lab reports, prescriptions, payment records |
| **Front Desk / Reception** | `/receptionist/dashboard` | Walk-in patient intake, auto-MRN generation, triage check-in |
| **Pharmacy Dispensary** | `/pharmacy/dashboard` | Formulary inventory, batch/expiry alerts, stock dispensing & restocking |
| **Laboratory Diagnostics** | `/laboratory/dashboard` | Biomarker specimen assays, reference range evaluations, pathologist sign-off |

---

## 🛠️ Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/) inspired design tokens
* **Icons:** [Lucide React](https://lucide.dev/)
* **Telemetry & Charts:** [Recharts](https://recharts.org/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) with LocalStorage persistence
* **Database & Auth:** [Supabase](https://supabase.com/) PostgreSQL with Row-Level Security (RLS)

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18.x or higher
* npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tejas076255/hospital.git
   cd hospital
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local` and set your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Open Application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Compliance Standards

* **Role-Based Access Control (RBAC):** Strict permissions matrix enforced via Next.js middleware and PostgreSQL RLS.
* **Audit Logging:** Every critical modification (admissions, medicine stock, prescriptions, AI tool calls) logs user timestamps and actor IDs.
* **Human-in-the-Loop AI:** Autonomous clinical agent actions require patient and physician confirmation before database mutation.

---

## 📄 License

This project is licensed under the MIT License.
