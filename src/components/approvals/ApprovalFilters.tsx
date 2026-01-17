import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApprovalFilters as FilterType } from '@/types/approval';
import { useStrings } from '@/i18n/useStrings';

interface ApprovalFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  totalCount: number;
  filteredCount: number;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'quality_hold', label: 'Quality Hold' },
  { value: 'ncr', label: 'NCR' },
  { value: 'deviation', label: 'Deviation' },
  { value: 'rework', label: 'Rework' },
  { value: 'release', label: 'Release' },
  { value: 'scrap', label: 'Scrap' },
  { value: 'process_change', label: 'Process Change' },
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function ApprovalFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: ApprovalFiltersProps) {
  const { t } = useStrings();

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === 'all' ? undefined : [value as 'pending' | 'approved' | 'rejected'],
    });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      type: value === 'all' ? undefined : [value as any],
    });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      priority: value === 'all' ? undefined : [value],
    });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key as keyof FilterType] !== undefined
  );

  return (
    <div className="space-y-spacing-sm">
      <div className="flex flex-wrap items-center gap-spacing-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder={t('common.search')}
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status?.[0] || 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={filters.type?.[0] || 'all'}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority?.[0] || 'all'}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Filter className="h-4 w-4" />
        <span>
          Showing {filteredCount} of {totalCount} approval requests
        </span>
      </div>
    </div>
  );
}
