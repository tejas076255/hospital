import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}

export function generateMrn(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `MRN-${rand}`;
}

export function generateInvoiceNumber(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `INV-${year}-${rand}`;
}

export function generatePrescriptionNumber(): string {
  const rand = Math.floor(100 + Math.random() * 900);
  const year = new Date().getFullYear();
  return `RX-${year}-${rand}`;
}

export function generateTicketNumber(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `HSP-${rand}`;
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (!heightCm || !weightKg) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}
