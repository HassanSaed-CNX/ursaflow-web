import { WorkOrderFilters, ProductLine, WorkOrderStatus, Priority } from '@/types/workOrder';
import { useStrings } from '@/i18n/useStrings';
import { Search, X } from 'lucide-react';
import { BaseButton } from '@/components/BaseButton';

interface WorkOrderFiltersProps {
  filters: WorkOrderFilters;
  onChange: (filters: WorkOrderFilters) => void;
  onReset: () => void;
}

const PRODUCT_LINES: ProductLine[] = [
  'Cylinders', 'Pumps', 'Motors', 'Valves', 'Manifolds', 'HPUs', 'Hose & Fittings'
];

const STATUSES: WorkOrderStatus[] = [
  'pending', 'in_progress', 'on_hold', 'complete', 'failed'
];

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'critical'];

export function WorkOrderFiltersBar({ filters, onChange, onReset }: WorkOrderFiltersProps) {
  const { t } = useStrings();
  
  const hasFilters = filters.status !== 'all' || 
                     filters.line !== 'all' || 
                     filters.priority !== 'all' || 
                     (filters.search && filters.search.length > 0);

  return (
    <div className="flex flex-col gap-spacing-md lg:flex-row lg:items-center">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type="text"
          placeholder={`${t('common.search')} WO#, Item, MPN...`}
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full h-10 pl-10 pr-4 rounded-radius border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
          aria-label="Search work orders"
        />
      </div>

      {/* Filter dropdowns */}
      <div className="flex flex-wrap gap-spacing-sm">
        {/* Status */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => onChange({ ...filters, status: e.target.value as WorkOrderStatus | 'all' })}
          className="h-10 px-3 rounded-radius border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-focus"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>

        {/* Line */}
        <select
          value={filters.line || 'all'}
          onChange={(e) => onChange({ ...filters, line: e.target.value as ProductLine | 'all' })}
          className="h-10 px-3 rounded-radius border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-focus"
          aria-label="Filter by product line"
        >
          <option value="all">All Lines</option>
          {PRODUCT_LINES.map((line) => (
            <option key={line} value={line}>{line}</option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={filters.priority || 'all'}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as Priority | 'all' })}
          className="h-10 px-3 rounded-radius border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-focus"
          aria-label="Filter by priority"
        >
          <option value="all">All Priority</option>
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Reset */}
        {hasFilters && (
          <BaseButton
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<X className="h-4 w-4" />}
          >
            Clear
          </BaseButton>
        )}
      </div>
    </div>
  );
}
