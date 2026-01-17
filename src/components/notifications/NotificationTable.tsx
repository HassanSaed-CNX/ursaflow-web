import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  MessageSquare, 
  Bell,
  CheckCircle,
  XCircle,
  RotateCcw,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusChip } from '@/components/ui/StatusChip';
import { SlaTimerCell } from './SlaTimer';
import { NotificationItem } from '@/types/notification';
import { useStrings } from '@/i18n/useStrings';
import { useRelativeTime } from '@/hooks/useSlaTimer';

interface NotificationTableProps {
  notifications: NotificationItem[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onAcknowledge: (id: string) => void;
  onApprove: (notification: NotificationItem) => void;
  onReject: (notification: NotificationItem) => void;
  onRouteToRework: (notification: NotificationItem) => void;
}

// Map notification severity to StatusChip status
const severityToStatus = {
  critical: 'fail',
  error: 'fail',
  warning: 'hold',
  info: 'ready',
} as const;

// Notification row component
function NotificationRow({
  notification,
  isSelected,
  onSelect,
  onAcknowledge,
  onApprove,
  onReject,
  onRouteToRework,
}: {
  notification: NotificationItem;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onAcknowledge: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRouteToRework: () => void;
}) {
  const { t } = useStrings();
  const relativeTime = useRelativeTime(notification.createdAt);
  
  const isNew = notification.status === 'new';
  const hasWorkOrder = !!notification.workOrderId;
  
  return (
    <tr className={cn(
      'border-b border-border transition-colors',
      isNew ? 'bg-surface' : 'bg-background',
      'hover:bg-muted/50'
    )}>
      {/* Checkbox */}
      <td className="px-spacing-sm py-spacing-sm w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          disabled={!isNew}
          aria-label={`Select notification ${notification.id}`}
        />
      </td>
      
      {/* Severity + Title */}
      <td className="px-spacing-sm py-spacing-sm">
        <div className="flex items-start gap-spacing-sm">
          <StatusChip 
            status={severityToStatus[notification.severity]} 
          />
          <div className="min-w-0">
            <p className={cn(
              'text-sm font-medium text-text truncate',
              isNew && 'font-semibold'
            )}>
              {notification.title}
            </p>
            <p className="text-xs text-text-muted truncate max-w-[300px]">
              {notification.description}
            </p>
          </div>
        </div>
      </td>
      
      {/* Work Order Link */}
      <td className="px-spacing-sm py-spacing-sm">
        {hasWorkOrder ? (
          <Link 
            to={`/work-orders/${notification.workOrderId}`}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {notification.workOrderNumber}
            <ExternalLink className="h-3 w-3" />
          </Link>
        ) : (
          <span className="text-sm text-text-muted">—</span>
        )}
      </td>
      
      {/* Category */}
      <td className="px-spacing-sm py-spacing-sm">
        <span className="inline-block px-2 py-1 text-xs rounded bg-muted text-text-muted capitalize">
          {notification.category}
        </span>
      </td>
      
      {/* SLA Timer */}
      <td className="px-spacing-sm py-spacing-sm">
        <SlaTimerCell slaDueAt={notification.slaDueAt} />
      </td>
      
      {/* Channels */}
      <td className="px-spacing-sm py-spacing-sm">
        <div className="flex items-center gap-1">
          {notification.channels.inApp && (
            <Bell className="h-4 w-4 text-text-muted" aria-label="In-App" />
          )}
          {notification.channels.email && (
            <Mail className="h-4 w-4 text-text-muted" aria-label="Email" />
          )}
          {notification.channels.teams && (
            <MessageSquare className="h-4 w-4 text-text-muted" aria-label="Teams" />
          )}
        </div>
      </td>
      
      {/* Status */}
      <td className="px-spacing-sm py-spacing-sm">
        <StatusChip 
          status={
            notification.status === 'new' ? 'pending' : 
            notification.status === 'acknowledged' ? 'pass' : 
            'complete'
          } 
        />
      </td>
      
      {/* Created */}
      <td className="px-spacing-sm py-spacing-sm text-sm text-text-muted">
        {relativeTime}
      </td>
      
      {/* Actions */}
      <td className="px-spacing-sm py-spacing-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">{t('common.actions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isNew && (
              <DropdownMenuItem onClick={onAcknowledge}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onApprove}>
              <CheckCircle className="h-4 w-4 mr-2 text-status-pass" />
              {t('actions.approve')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReject}>
              <XCircle className="h-4 w-4 mr-2 text-status-fail" />
              {t('actions.reject')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {hasWorkOrder && (
              <DropdownMenuItem onClick={onRouteToRework}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Route to Rework
              </DropdownMenuItem>
            )}
            {hasWorkOrder && (
              <DropdownMenuItem asChild>
                <Link to={`/work-orders/${notification.workOrderId}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Work Order
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export function NotificationTable({
  notifications,
  selectedIds,
  onSelectionChange,
  onAcknowledge,
  onApprove,
  onReject,
  onRouteToRework,
}: NotificationTableProps) {
  const { t } = useStrings();
  
  // Only 'new' notifications can be selected
  const selectableIds = notifications
    .filter(n => n.status === 'new')
    .map(n => n.id);
  
  const allSelected = selectableIds.length > 0 && 
    selectableIds.every(id => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0 && !allSelected;
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(selectableIds);
    } else {
      onSelectionChange([]);
    }
  };
  
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(i => i !== id));
    }
  };
  
  if (notifications.length === 0) {
    return (
      <div className="rounded-radius-lg border border-border bg-surface p-spacing-xl text-center">
        <Bell className="h-12 w-12 mx-auto text-text-muted mb-spacing-md" />
        <p className="text-text-muted">{t('empty.notifications')}</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-auto rounded-radius-lg border border-border">
      <table className="w-full border-collapse min-w-[900px]">
        <thead className="sticky top-0 z-10">
          <tr className="bg-header text-header-foreground">
            <th className="px-spacing-sm py-spacing-sm w-12">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) {
                    (el as HTMLButtonElement).dataset.indeterminate = someSelected ? 'true' : 'false';
                  }
                }}
                onCheckedChange={handleSelectAll}
                aria-label="Select all notifications"
              />
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Notification
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Work Order
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Category
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              SLA
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Channels
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              {t('common.status')}
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Created
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider w-16">
              {t('common.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-border">
          {notifications.map(notification => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              isSelected={selectedIds.includes(notification.id)}
              onSelect={(checked) => handleSelectRow(notification.id, checked)}
              onAcknowledge={() => onAcknowledge(notification.id)}
              onApprove={() => onApprove(notification)}
              onReject={() => onReject(notification)}
              onRouteToRework={() => onRouteToRework(notification)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
