import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  ExternalLink, 
  User, 
  Calendar,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NCR, NcrStatus } from '@/types/quality';
import { useStrings } from '@/i18n/useStrings';

interface NcrBoardProps {
  ncrs: NCR[];
  onStatusChange: (ncrId: string, newStatus: NcrStatus) => void;
  onViewDetails: (ncr: NCR) => void;
}

const statusConfig: Record<NcrStatus, { label: string; color: string; bgColor: string }> = {
  raised: { label: 'Raised', color: 'text-danger', bgColor: 'bg-danger/10 border-danger/25' },
  disposition: { label: 'Disposition', color: 'text-warning', bgColor: 'bg-warning/10 border-warning/25' },
  rework: { label: 'Rework', color: 'text-accent', bgColor: 'bg-accent/10 border-accent/25' },
  retest: { label: 'Retest', color: 'text-primary', bgColor: 'bg-primary/10 border-primary/25' },
  closed: { label: 'Closed', color: 'text-success', bgColor: 'bg-success/10 border-success/25' },
};

const severityIcons = {
  critical: <AlertTriangle className="h-4 w-4 text-danger" />,
  major: <AlertCircle className="h-4 w-4 text-warning" />,
  minor: <Info className="h-4 w-4 text-accent" />,
};

const statusOrder: NcrStatus[] = ['raised', 'disposition', 'rework', 'retest', 'closed'];

function NcrCard({ 
  ncr, 
  onStatusChange, 
  onViewDetails 
}: { 
  ncr: NCR; 
  onStatusChange: (newStatus: NcrStatus) => void;
  onViewDetails: () => void;
}) {
  const { t } = useStrings();
  const currentIndex = statusOrder.indexOf(ncr.status);
  const nextStatus = currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;

  return (
    <div className="p-spacing-sm bg-surface rounded-radius-md border border-border hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {severityIcons[ncr.severity]}
          <span className="text-xs font-semibold text-text-muted">{ncr.ncrNumber}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewDetails}>
              View Details
            </DropdownMenuItem>
            {ncr.workOrderId && (
              <DropdownMenuItem asChild>
                <Link to={`/work-orders/${ncr.workOrderId}`}>
                  View Work Order
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-text line-clamp-2 mb-2">{ncr.title}</h4>

      {/* Item info */}
      <div className="text-xs text-text-muted mb-2">
        <span className="font-medium">{ncr.itemNumber}</span>
        <span className="mx-1">•</span>
        <span>Qty: {ncr.quantity}</span>
      </div>

      {/* Work Order Link */}
      {ncr.workOrderNumber && (
        <Link
          to={`/work-orders/${ncr.workOrderId}`}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-2"
        >
          <ExternalLink className="h-3 w-3" />
          {ncr.workOrderNumber}
        </Link>
      )}

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {ncr.raisedByName}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {format(new Date(ncr.raisedAt), 'MMM d')}
        </span>
      </div>

      {/* Status Change Dropdown */}
      <div className="flex items-center gap-2">
        <Select
          value={ncr.status}
          onValueChange={(value) => onStatusChange(value as NcrStatus)}
        >
          <SelectTrigger className="h-8 text-xs flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOrder.map((status) => (
              <SelectItem key={status} value={status}>
                <span className={statusConfig[status].color}>
                  {statusConfig[status].label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {nextStatus && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2"
            onClick={() => onStatusChange(nextStatus)}
            title={`Move to ${statusConfig[nextStatus].label}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function NcrBoard({ ncrs, onStatusChange, onViewDetails }: NcrBoardProps) {
  const groupedNcrs = statusOrder.reduce((acc, status) => {
    acc[status] = ncrs.filter((n) => n.status === status);
    return acc;
  }, {} as Record<NcrStatus, NCR[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-spacing-md">
      {statusOrder.map((status) => (
        <div key={status} className="space-y-spacing-sm">
          {/* Column Header */}
          <div className={cn(
            'p-spacing-sm rounded-radius-md border',
            statusConfig[status].bgColor
          )}>
            <div className="flex items-center justify-between">
              <span className={cn('text-sm font-semibold', statusConfig[status].color)}>
                {statusConfig[status].label}
              </span>
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                statusConfig[status].bgColor,
                statusConfig[status].color
              )}>
                {groupedNcrs[status].length}
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-spacing-sm min-h-[200px]">
            {groupedNcrs[status].map((ncr) => (
              <NcrCard
                key={ncr.id}
                ncr={ncr}
                onStatusChange={(newStatus) => onStatusChange(ncr.id, newStatus)}
                onViewDetails={() => onViewDetails(ncr)}
              />
            ))}
            {groupedNcrs[status].length === 0 && (
              <div className="p-spacing-md text-center text-sm text-text-muted border border-dashed border-border rounded-radius-md">
                No NCRs
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
