import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

    const variants = {
      default:
        'bg-[#111111] text-white hover:bg-black',
      destructive:
        'bg-red-600 text-white hover:bg-red-700',
      outline:
        'border border-[#EAEAEA] bg-white hover:bg-zinc-50 text-[#111111]',
      secondary:
        'bg-[#F8F8F8] text-[#111111] border border-[#EAEAEA] hover:bg-zinc-100',
      ghost:
        'hover:bg-zinc-100 text-[#111111]',
      link: 'text-[#111111] underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-9 px-4 py-2 text-xs',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-10 px-5 text-sm',
      icon: 'h-8 w-8 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
