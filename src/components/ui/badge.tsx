import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseStyles =
    'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors';

  const variants = {
    default:
      'bg-[#111111] text-white',
    secondary:
      'bg-[#F8F8F8] text-[#111111] border border-[#EAEAEA]',
    destructive:
      'bg-rose-50 text-rose-700 border border-rose-200',
    outline:
      'text-[#111111] border border-[#EAEAEA] bg-white',
    success:
      'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning:
      'bg-amber-50 text-amber-700 border border-amber-200',
    info:
      'bg-zinc-100 text-zinc-800 border border-zinc-200',
  };

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />;
}
