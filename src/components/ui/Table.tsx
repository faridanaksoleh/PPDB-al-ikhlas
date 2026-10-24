import React from 'react';
import { cn } from '../../lib/utils';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className={cn('w-full text-left text-sm text-slate-700', className)} {...props} />
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => {
  return (
    <thead
      className={cn('bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider', className)}
      {...props}
    />
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => {
  return <tbody className={cn('divide-y divide-slate-100 bg-white', className)} {...props} />;
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  ...props
}) => {
  return (
    <tr
      className={cn('hover:bg-slate-50/80 transition-colors h-11', className)}
      {...props}
    />
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...props
}) => {
  return (
    <th
      className={cn('px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider select-none', className)}
      {...props}
    />
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...props
}) => {
  return <td className={cn('px-4 py-3 text-sm text-slate-700 align-middle', className)} {...props} />;
};
