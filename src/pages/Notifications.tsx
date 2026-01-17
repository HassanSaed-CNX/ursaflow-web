import { useState, useEffect, useCallback } from 'react';
import { Bell, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageCard } from '@/components/ui/PageCard';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { CustomSkeleton } from '@/components/ui/CustomSkeleton';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { NotificationTable } from '@/components/notifications/NotificationTable';
import { BulkActions } from '@/components/notifications/BulkActions';
import { ApprovalDialog } from '@/components/notifications/ApprovalDialog';
import { RouteToReworkDialog } from '@/components/notifications/RouteToReworkDialog';
import { notificationService } from '@/services/notificationService';
import { NotificationItem, NotificationFilters as FilterType } from '@/types/notification';
import { ApprovalFormData, RouteToReworkFormData } from '@/schemas/notificationSchema';
import { useStrings } from '@/i18n/useStrings';
import { toast } from 'sonner';

type ViewState = 'loading' | 'error' | 'empty' | 'data';

export function Notifications() {
  const { t } = useStrings();
  
  // State
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationItem[]>([]);
  const [filters, setFilters] = useState<FilterType>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Stats
  const [stats, setStats] = useState({ new: 0, critical: 0, overdue: 0 });
  
  // Dialog state
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    notification: NotificationItem | null;
    mode: 'approve' | 'reject';
  }>({ open: false, notification: null, mode: 'approve' });
  
  const [reworkDialog, setReworkDialog] = useState<{
    open: boolean;
    notification: NotificationItem | null;
  }>({ open: false, notification: null });
  
  // Load notifications
  const loadNotifications = useCallback(async () => {
    setViewState('loading');
    try {
      const [data, counts] = await Promise.all([
        notificationService.list(),
        notificationService.getCounts(),
      ]);
      setNotifications(data);
      setFilteredNotifications(data);
      setStats(counts);
      setViewState(data.length === 0 ? 'empty' : 'data');
    } catch (err) {
      setErrorMessage(t('errors.generic'));
      setViewState('error');
    }
  }, [t]);
  
  // Apply filters
  useEffect(() => {
    const applyFilters = async () => {
      if (Object.keys(filters).length === 0) {
        setFilteredNotifications(notifications);
      } else {
        const filtered = await notificationService.list(filters);
        setFilteredNotifications(filtered);
      }
    };
    applyFilters();
  }, [filters, notifications]);
  
  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);
  
  // Handlers
  const handleAcknowledge = async (id: string) => {
    try {
      await notificationService.acknowledge(id, 'current_user');
      toast.success('Notification acknowledged');
      loadNotifications();
    } catch {
      toast.error('Failed to acknowledge notification');
    }
  };
  
  const handleBulkAcknowledge = async () => {
    setIsProcessing(true);
    try {
      const result = await notificationService.bulkAcknowledge(selectedIds, 'current_user');
      toast.success(`Acknowledged ${result.success.length} notifications`);
      setSelectedIds([]);
      loadNotifications();
    } catch {
      toast.error('Failed to acknowledge notifications');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleApprove = (notification: NotificationItem) => {
    setApprovalDialog({ open: true, notification, mode: 'approve' });
  };
  
  const handleReject = (notification: NotificationItem) => {
    setApprovalDialog({ open: true, notification, mode: 'reject' });
  };
  
  const handleApprovalSubmit = async (data: ApprovalFormData) => {
    // In a real app, this would call an approval service
    toast.success(`Notification ${data.decision === 'approve' ? 'approved' : 'rejected'}`);
    loadNotifications();
  };
  
  const handleRouteToRework = (notification: NotificationItem) => {
    setReworkDialog({ open: true, notification });
  };
  
  const handleReworkSubmit = async (data: RouteToReworkFormData) => {
    // In a real app, this would update the work order and add audit trail
    toast.success(`Work order routed to rework${data.targetStep ? ` at ${data.targetStep}` : ''}`);
    loadNotifications();
  };
  
  const handleExport = () => {
    const dataToExport = selectedIds.length > 0
      ? filteredNotifications.filter(n => selectedIds.includes(n.id))
      : filteredNotifications;
    
    const csv = notificationService.exportToCSV(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${dataToExport.length} notifications`);
  };
  
  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: t('pages.notifications') },
  ];
  
  return (
    <div className="p-spacing-md lg:p-spacing-lg space-y-spacing-md">
      <Breadcrumbs items={breadcrumbs} />
      
      {/* Header with stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md">
        <div className="flex items-center gap-spacing-sm">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-text">{t('pages.notifications')}</h1>
        </div>
        
        {viewState === 'data' && (
          <div className="flex flex-wrap gap-spacing-sm">
            <div className="flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-muted rounded-radius-md">
              <Bell className="h-4 w-4 text-text-muted" />
              <span className="text-sm font-medium">{stats.new} New</span>
            </div>
            <div className="flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-status-fail/10 text-status-fail rounded-radius-md">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{stats.critical} Critical</span>
            </div>
            <div className="flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-status-warning/10 text-status-warning rounded-radius-md">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{stats.overdue} Overdue</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <PageCard>
        {viewState === 'loading' && (
          <div className="space-y-spacing-md">
            <CustomSkeleton variant="text" className="h-10 w-full" />
            <CustomSkeleton variant="table" rows={5} />
          </div>
        )}
        
        {viewState === 'error' && (
          <ErrorBanner
            type="error"
            message={errorMessage}
            onRetry={loadNotifications}
          />
        )}
        
        {viewState === 'empty' && (
          <div className="text-center py-spacing-2xl">
            <CheckCircle className="h-16 w-16 mx-auto text-status-pass mb-spacing-md" />
            <h3 className="text-lg font-medium text-text mb-spacing-xs">
              All caught up!
            </h3>
            <p className="text-text-muted">{t('empty.notifications')}</p>
          </div>
        )}
        
        {viewState === 'data' && (
          <div className="space-y-spacing-md">
            {/* Filters */}
            <NotificationFilters
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={notifications.length}
              filteredCount={filteredNotifications.length}
            />
            
            {/* Bulk actions */}
            <BulkActions
              selectedCount={selectedIds.length}
              onAcknowledge={handleBulkAcknowledge}
              onExport={handleExport}
              onClearSelection={() => setSelectedIds([])}
              isProcessing={isProcessing}
            />
            
            {/* Table */}
            <NotificationTable
              notifications={filteredNotifications}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onAcknowledge={handleAcknowledge}
              onApprove={handleApprove}
              onReject={handleReject}
              onRouteToRework={handleRouteToRework}
            />
          </div>
        )}
      </PageCard>
      
      {/* Dialogs */}
      <ApprovalDialog
        notification={approvalDialog.notification}
        mode={approvalDialog.mode}
        open={approvalDialog.open}
        onClose={() => setApprovalDialog({ ...approvalDialog, open: false })}
        onSubmit={handleApprovalSubmit}
      />
      
      <RouteToReworkDialog
        notification={reworkDialog.notification}
        open={reworkDialog.open}
        onClose={() => setReworkDialog({ ...reworkDialog, open: false })}
        onSubmit={handleReworkSubmit}
      />
    </div>
  );
}
