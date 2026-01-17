import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  className?: string;
  stickyHeader?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  className,
  stickyHeader = true,
  onRowClick,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  if (data.length === 0) {
    return (
      <div className="rounded-radius-lg border border-border bg-surface p-spacing-xl text-center">
        <p className="text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-auto rounded-radius-lg border border-border', className)}>
      <table className="w-full border-collapse">
        <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>
          <tr className="bg-header text-header-foreground">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-spacing-md py-spacing-sm text-xs font-semibold uppercase tracking-wider',
                  alignClasses[column.align || 'left'],
                  column.width
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-border">
          {data.map((row, rowIndex) => (
            <tr
              key={keyExtractor(row, rowIndex)}
              className={cn(
                'transition-colors',
                onRowClick && 'cursor-pointer hover:bg-background focus-visible:bg-background',
              )}
              onClick={() => onRowClick?.(row)}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(row);
                }
              }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-spacing-md py-spacing-sm text-sm text-text',
                    alignClasses[column.align || 'left']
                  )}
                >
                  {column.render
                    ? column.render(row, rowIndex)
                    : String(row[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
