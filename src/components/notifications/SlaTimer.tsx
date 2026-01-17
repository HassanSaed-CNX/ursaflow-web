import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSlaTimer } from '@/hooks/useSlaTimer';

interface SlaTimerProps {
  slaDueAt?: Date | null;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export function SlaTimer({ 
  slaDueAt, 
  className, 
  showIcon = true,
  size = 'md' 
}: SlaTimerProps) {
  const timer = useSlaTimer(slaDueAt);
  
  if (!timer) return null;
  
  const urgencyStyles = {
    normal: 'text-text-muted',
    warning: 'text-status-warning',
    critical: 'text-status-fail',
    overdue: 'text-white bg-status-fail px-2 py-0.5 rounded',
  };
  
  const Icon = timer.urgencyLevel === 'overdue' 
    ? AlertCircle 
    : timer.urgencyLevel === 'critical' 
      ? AlertTriangle 
      : Clock;
  
  return (
    <div 
      className={cn(
        'flex items-center gap-1',
        urgencyStyles[timer.urgencyLevel],
        size === 'sm' ? 'text-xs' : 'text-sm',
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(
          size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
          timer.urgencyLevel === 'overdue' && 'animate-pulse'
        )} />
      )}
      <span className="font-medium whitespace-nowrap">
        {timer.timeRemaining}
      </span>
    </div>
  );
}

// Compact version for table cells
export function SlaTimerCell({ slaDueAt }: { slaDueAt?: Date | null }) {
  const timer = useSlaTimer(slaDueAt);
  
  if (!timer) return <span className="text-text-muted text-sm">—</span>;
  
  const bgStyles = {
    normal: 'bg-muted',
    warning: 'bg-status-warning/10 text-status-warning',
    critical: 'bg-status-fail/10 text-status-fail',
    overdue: 'bg-status-fail text-white',
  };
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
      bgStyles[timer.urgencyLevel]
    )}>
      {timer.urgencyLevel === 'overdue' && (
        <AlertCircle className="h-3 w-3" />
      )}
      {timer.timeRemaining}
    </span>
  );
}
