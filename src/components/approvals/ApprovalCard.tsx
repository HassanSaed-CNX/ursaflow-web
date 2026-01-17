import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  AlertTriangle,
  User,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusChip } from '@/components/ui/StatusChip';
import { ApprovalRequest } from '@/types/approval';
import { useStrings } from '@/i18n/useStrings';
import { format, formatDistanceToNow } from 'date-fns';

interface ApprovalCardProps {
  approval: ApprovalRequest;
  onApprove: (approval: ApprovalRequest) => void;
  onReject: (approval: ApprovalRequest) => void;
  onViewDetails: (approval: ApprovalRequest) => void;
  isCurrentUserRequest: boolean;
}

const typeLabels: Record<string, string> = {
  quality_hold: 'Quality Hold',
  ncr: 'NCR',
  deviation: 'Deviation',
  rework: 'Rework',
  release: 'Release',
  scrap: 'Scrap',
  process_change: 'Process Change',
};

const priorityStyles: Record<string, string> = {
  critical: 'bg-danger/15 text-danger border-danger/25',
  high: 'bg-warning/15 text-warning border-warning/25',
  medium: 'bg-accent/15 text-accent border-accent/25',
  low: 'bg-text-muted/15 text-text-muted border-text-muted/25',
};

export function ApprovalCard({
  approval,
  onApprove,
  onReject,
  onViewDetails,
  isCurrentUserRequest,
}: ApprovalCardProps) {
  const { t } = useStrings();
  const isPending = approval.status === 'pending';
  const isOverdue = approval.dueDate && new Date(approval.dueDate) < new Date();

  const statusToChip = {
    pending: 'pending' as const,
    approved: 'approved' as const,
    rejected: 'rejected' as const,
  };

  return (
    <div
      className={cn(
        'rounded-radius-lg border bg-surface p-spacing-md',
        isPending ? 'border-border' : 'border-border/50 opacity-80',
        isCurrentUserRequest && isPending && 'ring-2 ring-warning/50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-spacing-sm mb-spacing-sm">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-spacing-sm flex-wrap mb-1">
            {/* Type badge */}
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-muted text-text-muted">
              {typeLabels[approval.type] || approval.type}
            </span>
            {/* Priority badge */}
            <span
              className={cn(
                'inline-block px-2 py-0.5 text-xs font-semibold rounded border uppercase',
                priorityStyles[approval.priority]
              )}
            >
              {approval.priority}
            </span>
            {/* SoD Warning */}
            {isCurrentUserRequest && isPending && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-warning/15 text-warning border border-warning/25">
                <AlertTriangle className="h-3 w-3" />
                Your Request
              </span>
            )}
          </div>
          <h3 className="font-semibold text-text truncate">{approval.title}</h3>
          <p className="text-sm text-text-muted line-clamp-2 mt-1">
            {approval.description}
          </p>
        </div>
        <StatusChip status={statusToChip[approval.status]} />
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-x-spacing-md gap-y-1 text-sm text-text-muted mb-spacing-md">
        <span className="flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          {approval.requestedByName}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDistanceToNow(new Date(approval.createdAt), { addSuffix: true })}
        </span>
        {approval.dueDate && (
          <span
            className={cn(
              'flex items-center gap-1',
              isOverdue && 'text-danger font-medium'
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {isOverdue ? 'Overdue' : 'Due'}{' '}
            {format(new Date(approval.dueDate), 'MMM d, h:mm a')}
          </span>
        )}
        {approval.relatedWorkOrderNumber && (
          <Link
            to={`/work-orders/${approval.relatedWorkOrderId}`}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {approval.relatedWorkOrderNumber}
          </Link>
        )}
      </div>

      {/* Reason */}
      <div className="p-spacing-sm bg-muted rounded-radius-sm mb-spacing-md">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
          Reason
        </p>
        <p className="text-sm text-text">{approval.reason}</p>
      </div>

      {/* Resolution info for completed approvals */}
      {!isPending && approval.comments && (
        <div className="p-spacing-sm bg-muted/50 rounded-radius-sm border-l-2 border-primary mb-spacing-md">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            {approval.status === 'approved' ? 'Approved' : 'Rejected'} by{' '}
            {approval.approvedByName || approval.rejectedByName}
          </p>
          <p className="text-sm text-text">{approval.comments}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-spacing-sm pt-spacing-sm border-t border-border">
        <Button variant="ghost" size="sm" onClick={() => onViewDetails(approval)}>
          View Details
        </Button>

        {isPending && (
          <div className="flex items-center gap-spacing-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(approval)}
              className="text-danger hover:bg-danger/10 hover:text-danger border-danger/25"
            >
              <XCircle className="h-4 w-4 mr-1" />
              {t('actions.reject')}
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(approval)}
              className="bg-success hover:bg-success/90 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {t('actions.approve')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
