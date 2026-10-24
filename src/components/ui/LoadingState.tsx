import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}> = ({ size = 'md', className, label }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 p-6', className)}>
      <Loader2 className={cn('animate-spin text-[#166534]', sizeClasses[size])} />
      {label && <p className="text-xs sm:text-sm text-slate-500 font-medium">{label}</p>}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <div className="w-full space-y-3 p-4 animate-pulse">
      <div className="h-9 bg-slate-100 rounded-md w-full" />
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 items-center">
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="h-6 bg-slate-100 rounded-md flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};
