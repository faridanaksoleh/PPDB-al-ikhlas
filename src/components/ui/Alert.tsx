import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  children,
  onDismiss,
  ...props
}) => {
  const configs = {
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-900',
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />,
      closeBtn: 'text-sky-600 hover:bg-sky-100',
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
      closeBtn: 'text-emerald-600 hover:bg-emerald-100',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
      closeBtn: 'text-amber-600 hover:bg-amber-100',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />,
      closeBtn: 'text-red-600 hover:bg-red-100',
    },
  };

  const config = configs[variant];

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border text-sm transition-all',
        config.container,
        className
      )}
      {...props}
    >
      {config.icon}
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold text-sm leading-tight">{title}</h5>}
        <div className="text-xs sm:text-sm leading-relaxed opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn('p-1 rounded-md transition-colors -mr-1 -mt-1', config.closeBtn)}
          aria-label="Tutup pemberitahuan"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
