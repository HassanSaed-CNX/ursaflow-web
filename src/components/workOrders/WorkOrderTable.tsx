import { useNavigate } from 'react-router-dom';
import { WorkOrder } from '@/types/workOrder';
import { StatusChip } from '@/components/ui/StatusChip';
import { GateBadges } from './GateBanner';
import { useStrings } from '@/i18n/useStrings';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AlertCircle, ChevronRight } from 'lucide-react';

interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  isLoading?: boolean;
}

// Map WO status to StatusChip status
const statusMap: Record<string, 'pending' | 'inProgress' | 'hold' | 'complete' | 'fail'> = {
  'pending': 'pending',
  'in_progress': 'inProgress',
  'on_hold': 'hold',
  'complete': 'complete',
  'failed': 'fail',
};

// Priority colors
const priorityColors: Record<string, string> = {
  'low': 'text-text-muted',
  'medium': 'text-accent',
  'high': 'text-warning',
  'critical': 'text-danger font-semibold',
};

export function WorkOrderTable({ workOrders, isLoading }: WorkOrderTableProps) {
  const navigate = useNavigate();
  const { t } = useStrings();

  const handleRowClick = (wo: WorkOrder) => {
    navigate(`/work-orders/${wo.id}`);
  };

  if (workOrders.length === 0 && !isLoading) {
    return (
      <div className="text-center py-spacing-xl text-text-muted">
        <AlertCircle className="h-8 w-8 mx-auto mb-spacing-sm opacity-50" />
        <p>{t('empty.workOrders')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-radius-lg border border-border">
      <table className="w-full border-collapse min-w-[800px]">
        <thead className="sticky top-0 z-10">
          <tr className="bg-header text-header-foreground">
            <th className="px-spacing-md py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              WO #
            </th>
            <th className="px-spacing-md py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              {t('common.status')}
            </th>
            <th className="px-spacing-md py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Line
            </th>
            <th className="px-spacing-md py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Item / {t('labels.mpn')}
            </th>
            <th className="px-spacing-md py-spacing-sm text-center text-xs font-semibold uppercase tracking-wider">
              Qty
            </th>
            <th className="px-spacing-md py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Current Step
            </th>
            <th className="px-spacing-md py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Priority
            </th>
            <th className="px-spacing-md py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-spacing-md py-spacing-sm text-center text-xs font-semibold uppercase tracking-wider">
              Flags
            </th>
            <th className="px-spacing-md py-spacing-sm w-10"></th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-border">
          {workOrders.map((wo) => {
            const isDue = new Date(wo.dueDate) < new Date() && wo.status !== 'complete';
            const currentStep = wo.routing.find(s => s.id === wo.currentStepId);
            
            return (
              <tr
                key={wo.id}
                onClick={() => handleRowClick(wo)}
                className="cursor-pointer transition-colors hover:bg-background focus-visible:bg-background"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowClick(wo);
                  }
                }}
              >
                <td className="px-spacing-md py-spacing-sm">
                  <span className="font-mono font-medium text-text">
                    {wo.woNumber}
                  </span>
                </td>
                <td className="px-spacing-md py-spacing-sm">
                  <StatusChip status={statusMap[wo.status] || 'pending'} />
                </td>
                <td className="px-spacing-md py-spacing-sm text-sm text-text">
                  {wo.line}
                </td>
                <td className="px-spacing-md py-spacing-sm">
                  <div className="text-sm text-text">{wo.item.itemNumber}</div>
                  <div className="text-xs text-text-muted">{wo.item.mpn}</div>
                </td>
                <td className="px-spacing-md py-spacing-sm text-center text-sm text-text">
                  {wo.quantity}
                </td>
                <td className="px-spacing-md py-spacing-sm">
                  <span className="text-sm text-accent font-medium">
                    {currentStep?.shortName || '-'}
                  </span>
                </td>
                <td className="px-spacing-md py-spacing-sm">
                  <span className={cn('text-sm uppercase', priorityColors[wo.priority])}>
                    {wo.priority}
                  </span>
                </td>
                <td className="px-spacing-md py-spacing-sm">
                  <span className={cn(
                    'text-sm',
                    isDue ? 'text-danger font-medium' : 'text-text'
                  )}>
                    {format(new Date(wo.dueDate), 'MMM d, yyyy')}
                  </span>
                </td>
                <td className="px-spacing-md py-spacing-sm">
                  <GateBadges flags={wo.gateFlags} />
                </td>
                <td className="px-spacing-md py-spacing-sm">
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
