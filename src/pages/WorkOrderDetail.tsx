import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  AlertTriangle, 
  HelpCircle,
  MessageSquare 
} from 'lucide-react';
import { PageCard } from '@/components/ui/PageCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BaseButton } from '@/components/BaseButton';
import { StatusChip } from '@/components/ui/StatusChip';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { SkeletonCard } from '@/components/ui/CustomSkeleton';
import { WorkOrderStepper } from '@/components/workOrders/WorkOrderStepper';
import { GateBanner as LegacyGateBanner } from '@/components/workOrders/GateBanner';
import { GateBanner } from '@/components/gates/GateBanner';
import { useGates } from '@/hooks/useGates';
import { workOrderService } from '@/services/workOrderService';
import { WorkOrder } from '@/types/workOrder';
import { useStrings } from '@/i18n/useStrings';
import { cn } from '@/lib/utils';
import { mockUsers } from '@/mocks/users';

const statusMap: Record<string, 'pending' | 'inProgress' | 'hold' | 'complete' | 'fail'> = {
  'pending': 'pending',
  'in_progress': 'inProgress',
  'on_hold': 'hold',
  'complete': 'complete',
  'failed': 'fail',
};

export function WorkOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useStrings();
  
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showNcrModal, setShowNcrModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Use centralized GateEngine
  const currentStep = workOrder?.routing.find(s => s.id === workOrder?.currentStepId);
  const {
    gateStatus,
    isLoading: isGateLoading,
    refresh: refreshGates,
    canPerformAction,
  } = useGates({
    workOrderId: id || '',
    currentUserId: mockUsers.supervisor.id,
    currentStep: currentStep?.name?.toLowerCase().replace(/\s+/g, '_'),
  });

  const canAdvance = canPerformAction('complete_step') && canPerformAction('proceed_next_step');

  const fetchWorkOrder = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await workOrderService.getById(id);
      if (response.status === 404 || !response.data) {
        setError('Work order not found');
      } else {
        setWorkOrder(response.data);
      }
    } catch (err) {
      setError(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, [id]);

  const handleAdvanceStep = async () => {
    if (!workOrder) return;
    
    setIsAdvancing(true);
    try {
      const response = await workOrderService.advanceStep(workOrder.id);
      if (response.data) {
        setWorkOrder(response.data);
        refreshGates(); // Refresh gates after step change
      }
    } catch (err) {
      setError('Failed to advance step');
    } finally {
      setIsAdvancing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-spacing-lg">
        <div className="h-8 w-48 bg-border animate-pulse rounded" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !workOrder) {
    return (
      <div className="space-y-spacing-lg">
        <Breadcrumbs items={[
          { label: t('pages.workOrders'), path: '/work-orders' },
          { label: 'Not Found' }
        ]} />
        <EmptyState
          variant="error"
          title="Work Order Not Found"
          description={error || 'The requested work order could not be found.'}
          action={{ label: 'Back to List', onClick: () => navigate('/work-orders') }}
        />
      </div>
    );
  }

  const activeStep = workOrder.routing.find(s => s.id === workOrder.currentStepId);
  const hasLegacyGates = Object.values(workOrder.gateFlags).some(Boolean);
  const hasGateEngineGates = gateStatus && !gateStatus.allPassed;
  const hasAnyGates = hasLegacyGates || hasGateEngineGates;
  const isComplete = workOrder.status === 'complete';
  const isFailed = workOrder.status === 'failed';
  const isOnHold = workOrder.status === 'on_hold';

  return (
    <div className="space-y-spacing-lg">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: t('pages.workOrders'), path: '/work-orders' },
        { label: workOrder.woNumber }
      ]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-spacing-md">
        <div className="flex items-start gap-spacing-md">
          <BaseButton
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/work-orders')}
            aria-label="Back to list"
          >
            <ArrowLeft className="h-5 w-5" />
          </BaseButton>
          
          <div>
            <div className="flex items-center gap-spacing-sm flex-wrap">
              <h1 className="text-2xl font-bold text-text">{workOrder.woNumber}</h1>
              <StatusChip status={statusMap[workOrder.status]} />
            </div>
            <p className="text-text-muted mt-spacing-xs">
              {workOrder.item.description}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-spacing-sm">
          <BaseButton
            variant="secondary"
            size="sm"
            leftIcon={<HelpCircle className="h-4 w-4" />}
            onClick={() => setShowHelpModal(true)}
          >
            Request Help
          </BaseButton>
          <BaseButton
            variant="warning"
            size="sm"
            leftIcon={<AlertTriangle className="h-4 w-4" />}
            onClick={() => setShowNcrModal(true)}
          >
            Raise NCR
          </BaseButton>
        </div>
      </div>

      {/* Gate Banners - GateEngine (primary) */}
      {gateStatus && !gateStatus.allPassed && (
        <GateBanner
          gateStatus={gateStatus}
          showAllGates
          onRefresh={refreshGates}
          isRefreshing={isGateLoading}
        />
      )}

      {/* Legacy Gate Banners (from work order flags) */}
      {hasLegacyGates && (
        <LegacyGateBanner flags={workOrder.gateFlags} />
      )}

      {/* Summary Card */}
      <PageCard>
        <div className="grid gap-spacing-md sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-text-muted uppercase tracking-wider">Line</dt>
            <dd className="text-sm font-medium text-text mt-spacing-xs">{workOrder.line}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted uppercase tracking-wider">{t('labels.mpn')}</dt>
            <dd className="text-sm font-mono font-medium text-text mt-spacing-xs">{workOrder.item.mpn}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted uppercase tracking-wider">{t('labels.quantity')}</dt>
            <dd className="text-sm font-medium text-text mt-spacing-xs">{workOrder.quantity}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted uppercase tracking-wider">Due Date</dt>
            <dd className={cn(
              'text-sm font-medium mt-spacing-xs',
              new Date(workOrder.dueDate) < new Date() && !isComplete ? 'text-danger' : 'text-text'
            )}>
              {format(new Date(workOrder.dueDate), 'MMM d, yyyy')}
            </dd>
          </div>
        </div>
      </PageCard>

      {/* Stepper */}
      <PageCard>
        <div className="flex items-center justify-between mb-spacing-lg">
          <h2 className="text-lg font-semibold text-text">Routing Progress</h2>
          {activeStep && !isComplete && !isFailed && (
            <div className="flex items-center gap-spacing-sm">
              <span className="text-sm text-text-muted">
                Current: <span className="text-accent font-medium">{activeStep.name}</span>
              </span>
            </div>
          )}
        </div>
        
        <WorkOrderStepper 
          steps={workOrder.routing} 
          currentStepId={workOrder.currentStepId} 
        />

        {/* Advance Step Button */}
        {!isComplete && !isFailed && !isOnHold && (
          <div className="mt-spacing-lg pt-spacing-lg border-t border-border">
            <BaseButton
              variant="success"
              onClick={handleAdvanceStep}
              isLoading={isAdvancing}
              leftIcon={<Play className="h-4 w-4" />}
              disabled={!canAdvance || hasLegacyGates}
            >
              Complete {activeStep?.name} & Advance
            </BaseButton>
            {(!canAdvance || hasLegacyGates) && (
              <p className="text-xs text-warning mt-spacing-sm">
                Resolve gate issues before advancing
              </p>
            )}
          </div>
        )}
      </PageCard>

      {/* Collapsible Details */}
      <PageCard>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={showDetails}
        >
          <h2 className="text-lg font-semibold text-text">Additional Details</h2>
          {showDetails ? (
            <ChevronUp className="h-5 w-5 text-text-muted" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-muted" />
          )}
        </button>

        {showDetails && (
          <div className="mt-spacing-lg space-y-spacing-lg">
            {/* BOM */}
            <div>
              <h3 className="text-sm font-semibold text-text mb-spacing-sm">Bill of Materials</h3>
              <div className="border border-border rounded-radius overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-header text-header-foreground">
                    <tr>
                      <th className="px-spacing-md py-spacing-sm text-left text-xs">Part #</th>
                      <th className="px-spacing-md py-spacing-sm text-left text-xs">Description</th>
                      <th className="px-spacing-md py-spacing-sm text-center text-xs">Qty</th>
                      <th className="px-spacing-md py-spacing-sm text-center text-xs">Kitted</th>
                    </tr>
                  </thead>
                  <tbody className="bg-surface divide-y divide-border">
                    {workOrder.bom.map((item) => (
                      <tr key={item.id}>
                        <td className="px-spacing-md py-spacing-sm font-mono">{item.partNumber}</td>
                        <td className="px-spacing-md py-spacing-sm">{item.description}</td>
                        <td className="px-spacing-md py-spacing-sm text-center">{item.quantity} {item.unit}</td>
                        <td className="px-spacing-md py-spacing-sm text-center">
                          {item.isKitted ? '✓' : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Events */}
            {workOrder.events.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text mb-spacing-sm">Event History</h3>
                <div className="space-y-spacing-sm">
                  {workOrder.events.map((event) => (
                    <div 
                      key={event.id}
                      className="flex gap-spacing-md p-spacing-sm bg-background rounded-radius border border-border"
                    >
                      <MessageSquare className="h-4 w-4 text-text-muted shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-text">{event.description}</p>
                        <p className="text-xs text-text-muted mt-spacing-xs">
                          {event.userName} • {format(new Date(event.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </PageCard>

      {/* NCR Modal */}
      <Modal
        isOpen={showNcrModal}
        onClose={() => setShowNcrModal(false)}
        title="Raise NCR"
        description="Create a Non-Conformance Report for this work order"
        footer={
          <>
            <BaseButton variant="secondary" onClick={() => setShowNcrModal(false)}>
              {t('common.cancel')}
            </BaseButton>
            <BaseButton variant="danger" onClick={() => setShowNcrModal(false)}>
              Submit NCR
            </BaseButton>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          NCR functionality is a placeholder. In production, this would open the full NCR form.
        </p>
      </Modal>

      {/* Help Modal */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="Request Help"
        description="Notify supervisor or support team"
        footer={
          <>
            <BaseButton variant="secondary" onClick={() => setShowHelpModal(false)}>
              {t('common.cancel')}
            </BaseButton>
            <BaseButton onClick={() => setShowHelpModal(false)}>
              Send Request
            </BaseButton>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          Help request functionality is a placeholder. In production, this would notify the appropriate team.
        </p>
      </Modal>
    </div>
  );
}
