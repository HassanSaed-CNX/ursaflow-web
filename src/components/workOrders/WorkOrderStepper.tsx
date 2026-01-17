import { RoutingStep } from '@/types/workOrder';
import { cn } from '@/lib/utils';
import { Check, Clock, Pause, XCircle, AlertTriangle } from 'lucide-react';

interface WorkOrderStepperProps {
  steps: RoutingStep[];
  currentStepId: string;
  compact?: boolean;
}

const statusIcons = {
  pending: Clock,
  in_progress: Clock,
  complete: Check,
  skipped: Check,
  failed: XCircle,
  on_hold: Pause,
};

const statusStyles = {
  pending: 'bg-border text-text-muted',
  in_progress: 'bg-accent text-accent-foreground ring-2 ring-accent/30 ring-offset-2 ring-offset-surface',
  complete: 'bg-success text-success-foreground',
  skipped: 'bg-text-muted text-surface',
  failed: 'bg-danger text-danger-foreground',
  on_hold: 'bg-warning text-warning-foreground',
};

const lineStyles = {
  pending: 'bg-border',
  in_progress: 'bg-accent',
  complete: 'bg-success',
  skipped: 'bg-text-muted',
  failed: 'bg-danger',
  on_hold: 'bg-warning',
};

export function WorkOrderStepper({ steps, currentStepId, compact = false }: WorkOrderStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className={cn('hidden md:flex items-start', compact && 'md:hidden')}>
        {steps.map((step, index) => {
          const Icon = statusIcons[step.status];
          const isLast = index === steps.length - 1;
          const isCurrent = step.id === currentStepId;
          
          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {!isLast && (
                <div 
                  className={cn(
                    'absolute top-4 left-1/2 w-full h-0.5',
                    step.status === 'complete' || step.status === 'skipped'
                      ? lineStyles.complete
                      : lineStyles.pending
                  )}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}
              
              {/* Step circle */}
              <div 
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center',
                  statusStyles[step.status]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              
              {/* Step label */}
              <div className="mt-spacing-sm text-center">
                <p className={cn(
                  'text-xs font-medium',
                  isCurrent ? 'text-accent' : 'text-text-muted'
                )}>
                  {step.shortName}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile / Compact stepper */}
      <div className={cn('md:hidden space-y-spacing-xs', compact && 'block md:block')}>
        {steps.map((step, index) => {
          const Icon = statusIcons[step.status];
          const isCurrent = step.id === currentStepId;
          
          return (
            <div 
              key={step.id}
              className={cn(
                'flex items-center gap-spacing-sm px-spacing-sm py-spacing-xs rounded-radius',
                isCurrent && 'bg-accent/10 border border-accent/20'
              )}
            >
              <div 
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                  statusStyles[step.status]
                )}
              >
                <Icon className="h-3 w-3" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm truncate',
                  isCurrent ? 'text-accent font-medium' : 'text-text'
                )}>
                  {step.name}
                </p>
              </div>
              
              <span className={cn(
                'text-xs uppercase shrink-0',
                step.status === 'complete' && 'text-success',
                step.status === 'in_progress' && 'text-accent',
                step.status === 'failed' && 'text-danger',
                step.status === 'on_hold' && 'text-warning',
                step.status === 'pending' && 'text-text-muted',
              )}>
                {step.status.replace('_', ' ')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Progress bar variant
export function WorkOrderProgressBar({ steps, currentStepId }: WorkOrderStepperProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStepId);
  const completedSteps = steps.filter(s => s.status === 'complete').length;
  const progress = (completedSteps / steps.length) * 100;
  
  return (
    <div className="space-y-spacing-xs">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">
          Step {currentIndex + 1} of {steps.length}
        </span>
        <span className="font-medium text-accent">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
