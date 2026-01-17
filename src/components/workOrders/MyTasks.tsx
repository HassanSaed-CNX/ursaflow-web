import { WorkOrder } from '@/types/workOrder';
import { useNavigate } from 'react-router-dom';
import { StatusChip } from '@/components/ui/StatusChip';
import { GateBadges } from './GateBanner';
import { WorkOrderProgressBar } from './WorkOrderStepper';
import { useStrings } from '@/i18n/useStrings';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChevronRight, Clock, AlertTriangle } from 'lucide-react';

interface MyTasksProps {
  tasks: WorkOrder[];
  isLoading?: boolean;
}

const statusMap: Record<string, 'pending' | 'inProgress' | 'hold' | 'complete' | 'fail'> = {
  'pending': 'pending',
  'in_progress': 'inProgress',
  'on_hold': 'hold',
  'complete': 'complete',
  'failed': 'fail',
};

export function MyTasks({ tasks, isLoading }: MyTasksProps) {
  const navigate = useNavigate();
  const { t } = useStrings();

  if (isLoading) {
    return (
      <div className="space-y-spacing-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-border animate-pulse rounded-radius-lg" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-spacing-xl bg-surface border border-border rounded-radius-lg">
        <Clock className="h-10 w-10 mx-auto mb-spacing-sm text-text-muted opacity-50" />
        <p className="text-text-muted font-medium">No tasks assigned</p>
        <p className="text-xs text-text-muted mt-spacing-xs">
          Scan a work order to start working
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-spacing-sm">
      {tasks.map((wo) => {
        const currentStep = wo.routing.find(s => s.id === wo.currentStepId);
        const isDue = new Date(wo.dueDate) < new Date();
        const hasGates = Object.values(wo.gateFlags).some(Boolean);
        
        return (
          <div
            key={wo.id}
            onClick={() => navigate(`/work-orders/${wo.id}`)}
            className={cn(
              'bg-surface border rounded-radius-lg p-spacing-md cursor-pointer',
              'transition-all hover:shadow-card-hover hover:border-accent/30',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              hasGates ? 'border-warning/50' : 'border-border'
            )}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(`/work-orders/${wo.id}`);
              }
            }}
            role="button"
            aria-label={`Work order ${wo.woNumber}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-spacing-sm">
              <div>
                <div className="flex items-center gap-spacing-sm">
                  <span className="font-mono font-semibold text-text">{wo.woNumber}</span>
                  <StatusChip status={statusMap[wo.status]} />
                </div>
                <p className="text-sm text-text-muted mt-spacing-xs">
                  {wo.item.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted shrink-0" />
            </div>

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-x-spacing-lg gap-y-spacing-xs text-xs mb-spacing-md">
              <span className="text-text-muted">
                Line: <span className="text-text">{wo.line}</span>
              </span>
              <span className="text-text-muted">
                Qty: <span className="text-text">{wo.quantity}</span>
              </span>
              <span className={cn(
                isDue ? 'text-danger font-medium' : 'text-text-muted'
              )}>
                Due: {format(new Date(wo.dueDate), 'MMM d')}
              </span>
              <span className="text-accent font-medium">
                → {currentStep?.name}
              </span>
            </div>

            {/* Progress */}
            <WorkOrderProgressBar steps={wo.routing} currentStepId={wo.currentStepId} />

            {/* Gate flags */}
            {hasGates && (
              <div className="flex items-center gap-spacing-sm mt-spacing-sm pt-spacing-sm border-t border-border">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-xs text-warning font-medium">Gate check required</span>
                <GateBadges flags={wo.gateFlags} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
