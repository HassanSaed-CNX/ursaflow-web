import { useState, useEffect } from 'react';
import { ClipboardList, Plus, RefreshCw } from 'lucide-react';
import { PageHeader, PageCard } from '@/components/ui/PageCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BaseButton } from '@/components/BaseButton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { SkeletonTable } from '@/components/ui/CustomSkeleton';
import { WorkOrderFiltersBar } from '@/components/workOrders/WorkOrderFilters';
import { WorkOrderTable } from '@/components/workOrders/WorkOrderTable';
import { workOrderService } from '@/services/workOrderService';
import { WorkOrder, WorkOrderFilters } from '@/types/workOrder';
import { useStrings } from '@/i18n/useStrings';

const defaultFilters: WorkOrderFilters = {
  status: 'all',
  line: 'all',
  priority: 'all',
  search: '',
};

export function WorkOrders() {
  const { t } = useStrings();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filters, setFilters] = useState<WorkOrderFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await workOrderService.list(filters);
      setWorkOrders(response.data.data);
    } catch (err) {
      setError(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="space-y-spacing-lg">
      <Breadcrumbs items={[{ label: t('pages.workOrders') }]} />

      <PageHeader
        icon={ClipboardList}
        title={t('pages.workOrders')}
        description={`${workOrders.length} work orders`}
        actions={
          <div className="flex gap-spacing-sm">
            <BaseButton
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={fetchWorkOrders}
              isLoading={isLoading}
            >
              {t('common.refresh')}
            </BaseButton>
            <BaseButton
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              {t('actions.createWorkOrder')}
            </BaseButton>
          </div>
        }
      />

      {/* Filters */}
      <PageCard>
        <WorkOrderFiltersBar
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />
      </PageCard>

      {/* Error State */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={fetchWorkOrders}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <SkeletonTable rows={6} columns={8} />
      )}

      {/* Data */}
      {!isLoading && !error && (
        <WorkOrderTable workOrders={workOrders} />
      )}
    </div>
  );
}
