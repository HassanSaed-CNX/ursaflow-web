import { useState, useEffect, useCallback } from 'react';
import { ClipboardCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageCard } from '@/components/ui/PageCard';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Skeleton, SkeletonCard } from '@/components/ui/CustomSkeleton';
import { ApprovalFilters } from '@/components/approvals/ApprovalFilters';
import { ApprovalCard } from '@/components/approvals/ApprovalCard';
import { ApprovalDetailDrawer } from '@/components/approvals/ApprovalDetailDrawer';
import { ESignModal } from '@/components/approvals/ESignModal';
import { approvalService } from '@/services/approvalService';
import { ApprovalRequest, ApprovalFilters as FilterType } from '@/types/approval';
import { ESignFormData } from '@/schemas/approvalSchema';
import { useStrings } from '@/i18n/useStrings';
import { toast } from 'sonner';

type ViewState = 'loading' | 'error' | 'empty' | 'data';

export function Approvals() {
  const { t } = useStrings();

  // State
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [filteredApprovals, setFilteredApprovals] = useState<ApprovalRequest[]>([]);
  const [filters, setFilters] = useState<FilterType>({});
  const [errorMessage, setErrorMessage] = useState('');

  // Counts
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });

  // Detail drawer
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // E-Sign modal
  const [eSignModal, setESignModal] = useState<{
    open: boolean;
    approval: ApprovalRequest | null;
    decision: 'approve' | 'reject';
    sodError: string | null;
  }>({ open: false, approval: null, decision: 'approve', sodError: null });

  const currentUserId = approvalService.getCurrentUserId();

  // Load approvals
  const loadApprovals = useCallback(async () => {
    setViewState('loading');
    try {
      const [data, countData] = await Promise.all([
        approvalService.list(),
        approvalService.getCounts(),
      ]);
      setApprovals(data);
      setFilteredApprovals(data);
      setCounts(countData);
      setViewState(data.length === 0 ? 'empty' : 'data');
    } catch {
      setErrorMessage(t('errors.generic'));
      setViewState('error');
    }
  }, [t]);

  // Apply filters
  useEffect(() => {
    const applyFilters = async () => {
      if (Object.keys(filters).length === 0) {
        setFilteredApprovals(approvals);
      } else {
        const filtered = await approvalService.list(filters);
        setFilteredApprovals(filtered);
      }
    };
    applyFilters();
  }, [filters, approvals]);

  // Initial load
  useEffect(() => {
    loadApprovals();
  }, [loadApprovals]);

  // Handlers
  const handleViewDetails = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setIsDrawerOpen(true);
  };

  const openESignModal = (approval: ApprovalRequest, decision: 'approve' | 'reject') => {
    // Check SoD before opening modal
    const sodCheck = approvalService.checkSoD(approval, currentUserId);
    
    setESignModal({
      open: true,
      approval,
      decision,
      sodError: sodCheck.allowed ? null : sodCheck.reason || null,
    });
  };

  const handleApprove = (approval: ApprovalRequest) => {
    openESignModal(approval, 'approve');
  };

  const handleReject = (approval: ApprovalRequest) => {
    openESignModal(approval, 'reject');
  };

  const handleESignSubmit = async (
    data: ESignFormData
  ): Promise<{ success: boolean; error?: string }> => {
    const { approval, decision } = eSignModal;
    if (!approval) return { success: false, error: 'No approval selected' };

    try {
      const result =
        decision === 'approve'
          ? await approvalService.approve(approval.id, data, currentUserId)
          : await approvalService.reject(approval.id, data, currentUserId);

      if (result.success) {
        toast.success(
          `Approval ${decision === 'approve' ? 'approved' : 'rejected'} successfully`
        );
        setIsDrawerOpen(false);
        loadApprovals();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch {
      return { success: false, error: t('errors.generic') };
    }
  };

  const isCurrentUserRequest = (approval: ApprovalRequest) =>
    approval.requestedByUserId === currentUserId;

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: t('pages.notifications'), href: '/notifications' },
    { label: 'Approvals' },
  ];

  return (
    <div className="p-spacing-md lg:p-spacing-lg space-y-spacing-md">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header with stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md">
        <div className="flex items-center gap-spacing-sm">
          <ClipboardCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-text">Approval Requests</h1>
        </div>

        {viewState === 'data' && (
          <div className="flex flex-wrap gap-spacing-sm">
            <div className="flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-warning/10 text-warning rounded-radius-md">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{counts.pending} Pending</span>
            </div>
            <div className="flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-success/10 text-success rounded-radius-md">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{counts.approved} Approved</span>
            </div>
            <div className="flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-danger/10 text-danger rounded-radius-md">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{counts.rejected} Rejected</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <PageCard>
        {viewState === 'loading' && (
          <div className="space-y-spacing-md">
            <Skeleton variant="text" className="h-10 w-full" />
            <div className="grid gap-spacing-md md:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        )}

        {viewState === 'error' && (
          <ErrorBanner variant="error" message={errorMessage} onRetry={loadApprovals} />
        )}

        {viewState === 'empty' && (
          <div className="text-center py-spacing-2xl">
            <ClipboardCheck className="h-16 w-16 mx-auto text-text-muted mb-spacing-md" />
            <h3 className="text-lg font-medium text-text mb-spacing-xs">
              No approval requests
            </h3>
            <p className="text-text-muted">
              There are no approval requests at this time.
            </p>
          </div>
        )}

        {viewState === 'data' && (
          <div className="space-y-spacing-md">
            {/* Filters */}
            <ApprovalFilters
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={approvals.length}
              filteredCount={filteredApprovals.length}
            />

            {/* Approval Cards Grid */}
            <div className="grid gap-spacing-md md:grid-cols-2">
              {filteredApprovals.map((approval) => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                  isCurrentUserRequest={isCurrentUserRequest(approval)}
                />
              ))}
            </div>

            {filteredApprovals.length === 0 && (
              <div className="text-center py-spacing-xl">
                <p className="text-text-muted">{t('common.noResults')}</p>
              </div>
            )}
          </div>
        )}
      </PageCard>

      {/* Detail Drawer */}
      <ApprovalDetailDrawer
        approval={selectedApproval}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        isCurrentUserRequest={
          selectedApproval ? isCurrentUserRequest(selectedApproval) : false
        }
      />

      {/* E-Sign Modal */}
      <ESignModal
        isOpen={eSignModal.open}
        onClose={() =>
          setESignModal({ ...eSignModal, open: false, sodError: null })
        }
        approval={eSignModal.approval}
        decision={eSignModal.decision}
        onSubmit={handleESignSubmit}
        sodError={eSignModal.sodError}
      />
    </div>
  );
}
