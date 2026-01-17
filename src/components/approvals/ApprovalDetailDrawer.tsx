import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  X,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  User,
  Calendar,
  FileText,
  History,
  PenTool,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusChip } from '@/components/ui/StatusChip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApprovalRequest, AuditTrailEntry } from '@/types/approval';
import { useStrings } from '@/i18n/useStrings';

interface ApprovalDetailDrawerProps {
  approval: ApprovalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (approval: ApprovalRequest) => void;
  onReject: (approval: ApprovalRequest) => void;
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

function AuditTrailItem({ entry }: { entry: AuditTrailEntry }) {
  const actionIcons: Record<string, React.ReactNode> = {
    created: <FileText className="h-4 w-4 text-primary" />,
    approved: <CheckCircle className="h-4 w-4 text-success" />,
    rejected: <XCircle className="h-4 w-4 text-danger" />,
  };

  return (
    <div className="flex gap-spacing-sm py-spacing-sm border-b border-border last:border-b-0">
      <div className="shrink-0 mt-0.5">
        {actionIcons[entry.action] || <History className="h-4 w-4 text-text-muted" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm text-text capitalize">
            {entry.action}
          </span>
          <span className="text-xs text-text-muted">
            {format(new Date(entry.performedAt), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
        <p className="text-sm text-text-muted">
          by {entry.performedByName}
        </p>
        {entry.signature && (
          <div className="flex items-center gap-1 mt-1 text-xs text-primary">
            <PenTool className="h-3 w-3" />
            Signed: {entry.signature}
          </div>
        )}
        {entry.details?.comments && (
          <p className="text-sm text-text mt-1 italic">
            "{String(entry.details.comments)}"
          </p>
        )}
      </div>
    </div>
  );
}

export function ApprovalDetailDrawer({
  approval,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isCurrentUserRequest,
}: ApprovalDetailDrawerProps) {
  const { t } = useStrings();

  if (!isOpen || !approval) return null;

  const isPending = approval.status === 'pending';
  const statusToChip = {
    pending: 'pending' as const,
    approved: 'approved' as const,
    rejected: 'rejected' as const,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-lg bg-surface border-l border-border z-50',
          'transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between p-spacing-lg border-b border-border bg-background">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-text-muted">
                  {typeLabels[approval.type]}
                </span>
                <StatusChip status={statusToChip[approval.status]} />
              </div>
              <h2 id="drawer-title" className="text-lg font-semibold text-text">
                {approval.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-radius-sm text-text-muted hover:text-text hover:bg-muted transition-colors"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-spacing-lg space-y-spacing-lg">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-text">{approval.description}</p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-spacing-md">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    Requested By
                  </p>
                  <div className="flex items-center gap-1 text-text">
                    <User className="h-4 w-4 text-text-muted" />
                    {approval.requestedByName}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    Created
                  </p>
                  <div className="flex items-center gap-1 text-text">
                    <Calendar className="h-4 w-4 text-text-muted" />
                    {format(new Date(approval.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    Priority
                  </p>
                  <span className="font-medium text-text capitalize">
                    {approval.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    Due Date
                  </p>
                  <div className="flex items-center gap-1 text-text">
                    <Clock className="h-4 w-4 text-text-muted" />
                    {approval.dueDate
                      ? format(new Date(approval.dueDate), 'MMM d, h:mm a')
                      : '—'}
                  </div>
                </div>
              </div>

              {/* Work Order Link */}
              {approval.relatedWorkOrderNumber && (
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    Related Work Order
                  </p>
                  <Link
                    to={`/work-orders/${approval.relatedWorkOrderId}`}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {approval.relatedWorkOrderNumber}
                  </Link>
                </div>
              )}

              {/* Reason */}
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Reason for Request
                </h3>
                <div className="p-spacing-md bg-muted rounded-radius-md">
                  <p className="text-text">{approval.reason}</p>
                </div>
              </div>

              {/* Resolution (if completed) */}
              {!isPending && approval.comments && (
                <div>
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                    {approval.status === 'approved' ? 'Approval' : 'Rejection'}{' '}
                    Comments
                  </h3>
                  <div
                    className={cn(
                      'p-spacing-md rounded-radius-md border-l-4',
                      approval.status === 'approved'
                        ? 'bg-success/10 border-success'
                        : 'bg-danger/10 border-danger'
                    )}
                  >
                    <p className="text-sm text-text">{approval.comments}</p>
                    <p className="text-xs text-text-muted mt-2">
                      {approval.status === 'approved'
                        ? `Approved by ${approval.approvedByName} on ${format(
                            new Date(approval.approvedAt!),
                            'MMM d, yyyy h:mm a'
                          )}`
                        : `Rejected by ${approval.rejectedByName} on ${format(
                            new Date(approval.rejectedAt!),
                            'MMM d, yyyy h:mm a'
                          )}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Audit Trail */}
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Audit Trail
                </h3>
                <div className="border border-border rounded-radius-md bg-background">
                  {approval.auditTrail.map((entry) => (
                    <AuditTrailItem key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          {isPending && (
            <div className="p-spacing-lg border-t border-border bg-background">
              {isCurrentUserRequest && (
                <div className="mb-spacing-md p-spacing-sm bg-warning/10 rounded-radius-md border border-warning/25">
                  <p className="text-sm text-warning">
                    ⚠️ You created this request and cannot approve/reject it
                    (Separation of Duties).
                  </p>
                </div>
              )}
              <div className="flex items-center justify-end gap-spacing-sm">
                <Button
                  variant="outline"
                  onClick={() => onReject(approval)}
                  className="text-danger hover:bg-danger/10 border-danger/25"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {t('actions.reject')}
                </Button>
                <Button
                  onClick={() => onApprove(approval)}
                  className="bg-success hover:bg-success/90 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('actions.approve')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
