import { useState, ReactNode } from 'react';
import { useStrings } from '@/i18n/useStrings';
import { PageHeader, PageCard } from '@/components/ui/PageCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BaseButton } from '@/components/BaseButton';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { SkeletonCard, SkeletonTable } from '@/components/ui/Skeleton';
import { type LucideIcon, RefreshCw } from 'lucide-react';

type ViewState = 'loading' | 'empty' | 'error' | 'data';

interface PlaceholderTemplateProps {
  icon: LucideIcon;
  titleKey: string;
  breadcrumbLabel: string;
  children?: ReactNode;
}

export function PlaceholderTemplate({ 
  icon, 
  titleKey, 
  breadcrumbLabel,
  children 
}: PlaceholderTemplateProps) {
  const { t } = useStrings();
  const [viewState, setViewState] = useState<ViewState>('data');

  return (
    <div className="space-y-spacing-lg">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: breadcrumbLabel }]} />

      {/* Page Header */}
      <PageHeader
        icon={icon}
        title={t(titleKey)}
        description="Placeholder page demonstrating loading, empty, and error states."
        actions={
          <BaseButton 
            variant="secondary" 
            size="sm" 
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={() => setViewState('loading')}
          >
            {t('common.refresh')}
          </BaseButton>
        }
      />

      {/* State Toggle Controls */}
      <PageCard>
        <h3 className="text-sm font-semibold text-text mb-spacing-md">
          View State Demo
        </h3>
        <div className="flex flex-wrap gap-spacing-sm">
          <BaseButton
            variant={viewState === 'data' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewState('data')}
          >
            Data
          </BaseButton>
          <BaseButton
            variant={viewState === 'loading' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewState('loading')}
          >
            Loading
          </BaseButton>
          <BaseButton
            variant={viewState === 'empty' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewState('empty')}
          >
            Empty
          </BaseButton>
          <BaseButton
            variant={viewState === 'error' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewState('error')}
          >
            Error
          </BaseButton>
        </div>
      </PageCard>

      {/* Content based on state */}
      {viewState === 'loading' && (
        <div className="space-y-spacing-lg">
          <div className="grid gap-spacing-md sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonTable rows={4} columns={5} />
        </div>
      )}

      {viewState === 'empty' && (
        <PageCard>
          <EmptyState
            title={t('common.noData')}
            description="There are no items to display. Create a new item to get started."
            action={{
              label: t('common.create'),
              onClick: () => setViewState('data'),
            }}
          />
        </PageCard>
      )}

      {viewState === 'error' && (
        <div className="space-y-spacing-md">
          <ErrorBanner
            title="Failed to load data"
            message={t('errors.network')}
            onRetry={() => setViewState('data')}
            onDismiss={() => setViewState('data')}
          />
          <ErrorBanner
            variant="warning"
            title="Partial data loaded"
            message="Some items could not be retrieved."
            onRetry={() => setViewState('data')}
          />
        </div>
      )}

      {viewState === 'data' && (
        <div className="space-y-spacing-lg">
          {/* Status Chips Demo */}
          <PageCard>
            <h3 className="text-sm font-semibold text-text mb-spacing-md">
              Status Chips
            </h3>
            <div className="flex flex-wrap gap-spacing-sm">
              <StatusChip status="pass" />
              <StatusChip status="fail" />
              <StatusChip status="hold" />
              <StatusChip status="ready" />
              <StatusChip status="pending" />
              <StatusChip status="inProgress" />
              <StatusChip status="aging" />
              <StatusChip status="approved" />
              <StatusChip status="rejected" />
            </div>
          </PageCard>

          {/* Form Labels Demo */}
          <PageCard>
            <h3 className="text-sm font-semibold text-text mb-spacing-md">
              Form Labels (i18n)
            </h3>
            <div className="grid gap-spacing-md sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-text">{t('labels.mpn')}</label>
                <p className="text-xs text-text-muted">Part identification number</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text">{t('labels.serialNumber')}</label>
                <p className="text-xs text-text-muted">Unique serial identifier</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text">{t('labels.workOrder')}</label>
                <p className="text-xs text-text-muted">Work order reference</p>
              </div>
            </div>
          </PageCard>

          {/* Responsive Check */}
          <PageCard>
            <h3 className="text-sm font-semibold text-text mb-spacing-md">
              Responsive Layout Check
            </h3>
            <div className="grid gap-spacing-sm grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-accent/10 border border-accent/20 rounded-radius flex items-center justify-center"
                >
                  <span className="text-sm font-medium text-accent">{i + 1}</span>
                </div>
              ))}
            </div>
          </PageCard>

          {/* Custom children */}
          {children}
        </div>
      )}
    </div>
  );
}
