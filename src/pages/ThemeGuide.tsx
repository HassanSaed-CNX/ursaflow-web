import { useState } from 'react';
import { Palette } from 'lucide-react';
import { PageHeader, PageCard } from '@/components/ui/PageCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BaseButton } from '@/components/BaseButton';
import { StatusChip } from '@/components/ui/StatusChip';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { SkeletonCard, SkeletonTable, Skeleton } from '@/components/ui/CustomSkeleton';
import { DataTable } from '@/components/ui/DataTable';
import { useStrings } from '@/i18n/useStrings';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeGuide() {
  const { t } = useStrings();
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleData = [
    { id: '1', mpn: 'MPN-001', status: 'pass', quantity: 150 },
    { id: '2', mpn: 'MPN-002', status: 'fail', quantity: 23 },
    { id: '3', mpn: 'MPN-003', status: 'hold', quantity: 87 },
    { id: '4', mpn: 'MPN-004', status: 'aging', quantity: 42 },
  ];

  return (
    <div className="space-y-spacing-lg">
      <Breadcrumbs items={[{ label: 'Admin', path: '/admin' }, { label: 'Theme Guide' }]} />

      <PageHeader
        icon={Palette}
        title={t('pages.themeGuide')}
        description={`Current theme: ${theme}`}
      />

      {/* Colors */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Color Tokens</h3>
        <div className="grid gap-spacing-sm grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { name: 'Background', class: 'bg-background border' },
            { name: 'Surface', class: 'bg-surface border' },
            { name: 'Header', class: 'bg-header' },
            { name: 'Accent', class: 'bg-accent' },
            { name: 'Success', class: 'bg-success' },
            { name: 'Warning', class: 'bg-warning' },
            { name: 'Danger', class: 'bg-danger' },
            { name: 'Border', class: 'bg-border' },
            { name: 'Text', class: 'bg-text' },
            { name: 'Text Muted', class: 'bg-text-muted' },
          ].map((color) => (
            <div key={color.name} className="text-center">
              <div className={`h-12 rounded-radius ${color.class}`} />
              <p className="text-xs text-text-muted mt-spacing-xs">{color.name}</p>
            </div>
          ))}
        </div>
      </PageCard>

      {/* Buttons */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Buttons</h3>
        <div className="flex flex-wrap gap-spacing-sm">
          <BaseButton variant="primary">Primary</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="success">Success</BaseButton>
          <BaseButton variant="warning">Warning</BaseButton>
          <BaseButton variant="danger">Danger</BaseButton>
          <BaseButton variant="ghost">Ghost</BaseButton>
          <BaseButton variant="link">Link</BaseButton>
        </div>
        <div className="flex flex-wrap gap-spacing-sm mt-spacing-md">
          <BaseButton size="xs">XS</BaseButton>
          <BaseButton size="sm">Small</BaseButton>
          <BaseButton size="md">Medium</BaseButton>
          <BaseButton size="lg">Large</BaseButton>
          <BaseButton isLoading>Loading</BaseButton>
          <BaseButton disabled>Disabled</BaseButton>
        </div>
      </PageCard>

      {/* Status Chips */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Status Chips</h3>
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
          <StatusChip status="open" />
          <StatusChip status="closed" />
        </div>
      </PageCard>

      {/* Data Table */}
      <PageCard padding="none">
        <div className="p-spacing-lg pb-0">
          <h3 className="text-lg font-semibold text-text mb-spacing-md">Data Table</h3>
        </div>
        <DataTable
          columns={[
            { key: 'mpn', header: t('labels.mpn') },
            { 
              key: 'status', 
              header: t('common.status'),
              render: (row) => <StatusChip status={row.status as 'pass' | 'fail' | 'hold' | 'aging'} />
            },
            { key: 'quantity', header: t('labels.quantity'), align: 'right' },
          ]}
          data={sampleData}
          keyExtractor={(row) => row.id}
        />
      </PageCard>

      {/* Skeletons */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Skeletons</h3>
        <div className="grid gap-spacing-lg sm:grid-cols-2">
          <div>
            <p className="text-sm text-text-muted mb-spacing-sm">Card Skeleton</p>
            <SkeletonCard />
          </div>
          <div>
            <p className="text-sm text-text-muted mb-spacing-sm">Text Skeleton</p>
            <Skeleton variant="text" lines={4} />
          </div>
        </div>
        <div className="mt-spacing-lg">
          <p className="text-sm text-text-muted mb-spacing-sm">Table Skeleton</p>
          <SkeletonTable rows={3} columns={4} />
        </div>
      </PageCard>

      {/* Empty & Error States */}
      <div className="grid gap-spacing-lg sm:grid-cols-2">
        <PageCard>
          <h3 className="text-lg font-semibold text-text mb-spacing-md">Empty State</h3>
          <EmptyState
            title="No items found"
            description="Get started by creating your first item."
            action={{ label: 'Create Item', onClick: () => {} }}
          />
        </PageCard>
        <PageCard>
          <h3 className="text-lg font-semibold text-text mb-spacing-md">Error States</h3>
          <div className="space-y-spacing-md">
            <ErrorBanner
              title="Error loading data"
              message="Unable to fetch records from the server."
              onRetry={() => {}}
            />
            <ErrorBanner
              variant="warning"
              title="Warning"
              message="Some data may be outdated."
            />
          </div>
        </PageCard>
      </div>

      {/* Modal Demo */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Modal</h3>
        <BaseButton onClick={() => setIsModalOpen(true)}>Open Modal</BaseButton>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Sample Modal"
          description="This modal demonstrates focus trap and ESC to close."
          footer={
            <>
              <BaseButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </BaseButton>
              <BaseButton onClick={() => setIsModalOpen(false)}>
                Confirm
              </BaseButton>
            </>
          }
        >
          <p className="text-text">
            Press <kbd className="px-1.5 py-0.5 rounded bg-background border text-xs">Tab</kbd> to 
            navigate, <kbd className="px-1.5 py-0.5 rounded bg-background border text-xs">Esc</kbd> to close.
          </p>
          <div className="mt-spacing-md">
            <label className="block text-sm font-medium text-text mb-spacing-xs">
              {t('labels.mpn')}
            </label>
            <input
              type="text"
              className="w-full h-10 px-3 rounded-radius border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-focus"
              placeholder="Enter value..."
            />
          </div>
        </Modal>
      </PageCard>
    </div>
  );
}
