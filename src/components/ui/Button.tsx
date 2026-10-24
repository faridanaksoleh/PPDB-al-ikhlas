import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap shrink-0 active:scale-[0.99]';

    const variants = {
      primary:
        'bg-[#14532D] hover:bg-[#166534] text-white focus-visible:ring-[#166534] shadow-sm',
      secondary:
        'bg-[#166534] hover:bg-[#14532D] text-white focus-visible:ring-[#14532D] shadow-sm',
      gold:
        'bg-[#D4A853] hover:bg-[#C59740] text-slate-900 font-semibold focus-visible:ring-[#D4A853] shadow-sm',
      outline:
        'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 focus-visible:ring-[#166534]',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus-visible:ring-slate-400',
      danger:
        'bg-[#DC2626] hover:bg-red-700 text-white focus-visible:ring-red-600 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2 h-10 gap-2',
      lg: 'text-base px-5 py-2.5 h-12 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
