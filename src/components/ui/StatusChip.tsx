import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Pause, PlayCircle, Clock, AlertTriangle, type LucideIcon } from 'lucide-react';
import { t } from '@/i18n/useStrings';

const statusChipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      status: {
        pass: 'bg-success/15 text-success border border-success/25',
        fail: 'bg-danger/15 text-danger border border-danger/25',
        hold: 'bg-warning/15 text-warning border border-warning/25',
        ready: 'bg-accent/15 text-accent border border-accent/25',
        pending: 'bg-text-muted/15 text-text-muted border border-text-muted/25',
        inProgress: 'bg-accent/15 text-accent border border-accent/25',
        complete: 'bg-success/15 text-success border border-success/25',
        aging: 'bg-warning/15 text-warning border border-warning/25',
        approved: 'bg-success/15 text-success border border-success/25',
        rejected: 'bg-danger/15 text-danger border border-danger/25',
        open: 'bg-accent/15 text-accent border border-accent/25',
        closed: 'bg-text-muted/15 text-text-muted border border-text-muted/25',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  }
);

type StatusType = NonNullable<VariantProps<typeof statusChipVariants>['status']>;

const statusIcons: Record<StatusType, LucideIcon> = {
  pass: CheckCircle,
  fail: XCircle,
  hold: Pause,
  ready: PlayCircle,
  pending: Clock,
  inProgress: Clock,
  complete: CheckCircle,
  aging: AlertTriangle,
  approved: CheckCircle,
  rejected: XCircle,
  open: PlayCircle,
  closed: CheckCircle,
};

const statusLabels: Record<StatusType, string> = {
  pass: t('status.pass'),
  fail: t('status.fail'),
  hold: t('status.hold'),
  ready: t('status.ready'),
  pending: t('status.pending'),
  inProgress: t('status.inProgress'),
  complete: t('status.complete'),
  aging: t('status.aging'),
  approved: t('status.approved'),
  rejected: t('status.rejected'),
  open: t('status.open'),
  closed: t('status.closed'),
};

interface StatusChipProps extends VariantProps<typeof statusChipVariants> {
  className?: string;
  showIcon?: boolean;
  customLabel?: string;
}

export function StatusChip({ status = 'pending', className, showIcon = true, customLabel }: StatusChipProps) {
  const Icon = statusIcons[status!];
  const label = customLabel || statusLabels[status!];

  return (
    <span className={cn(statusChipVariants({ status, className }))} role="status">
      {showIcon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {label}
    </span>
  );
}
