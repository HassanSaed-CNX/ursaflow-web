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
import { Badge } from '@/components/ui/badge';
import { NotificationFilters as FilterType } from '@/types/notification';
import { useStrings } from '@/i18n/useStrings';

interface NotificationFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  totalCount: number;
  filteredCount: number;
}

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
];

const CATEGORY_OPTIONS = [
  { value: 'quality', label: 'Quality' },
  { value: 'test', label: 'Test' },
  { value: 'production', label: 'Production' },
  { value: 'resource', label: 'Resource' },
  { value: 'exception', label: 'Exception' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'audit', label: 'Audit' },
];

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'closed', label: 'Closed' },
];

const SLA_OPTIONS = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due Today' },
  { value: 'thisWeek', label: 'Due This Week' },
  { value: 'all', label: 'All' },
];

export function NotificationFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: NotificationFiltersProps) {
  const { t } = useStrings();

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleSeverityChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, severity: undefined });
    } else {
      onFiltersChange({ ...filters, severity: [value as FilterType['severity'][0]] });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, category: undefined });
    } else {
      onFiltersChange({ ...filters, category: [value as FilterType['category'][0]] });
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, status: undefined });
    } else {
      onFiltersChange({ ...filters, status: [value as FilterType['status'][0]] });
    }
  };

  const handleSlaChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, slaDue: undefined });
    } else {
      onFiltersChange({ ...filters, slaDue: value as FilterType['slaDue'] });
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = 
    filters.search || 
    filters.severity?.length || 
    filters.category?.length || 
    filters.status?.length || 
    filters.slaDue;

  return (
    <div className="space-y-spacing-md">
      {/* Search and quick filters */}
      <div className="flex flex-wrap gap-spacing-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder={`${t('common.search')} notifications...`}
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select 
          value={filters.severity?.[0] || 'all'} 
          onValueChange={handleSeverityChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            {SEVERITY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.category?.[0] || 'all'} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.status?.[0] || 'all'} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.slaDue || 'all'} 
          onValueChange={handleSlaChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="SLA Due" />
          </SelectTrigger>
          <SelectContent>
            {SLA_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filters summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-spacing-sm">
          <Filter className="h-4 w-4 text-text-muted" />
          <span className="text-sm text-text-muted">
            Showing {filteredCount} of {totalCount} notifications
          </span>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary hover:text-primary/80"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Filter badges */}
        <div className="flex flex-wrap gap-spacing-xs">
          {filters.severity?.map(s => (
            <Badge key={s} variant="secondary" className="text-xs">
              {s}
            </Badge>
          ))}
          {filters.category?.map(c => (
            <Badge key={c} variant="secondary" className="text-xs">
              {c}
            </Badge>
          ))}
          {filters.status?.map(st => (
            <Badge key={st} variant="secondary" className="text-xs">
              {st}
            </Badge>
          ))}
          {filters.slaDue && filters.slaDue !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {SLA_OPTIONS.find(o => o.value === filters.slaDue)?.label}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
