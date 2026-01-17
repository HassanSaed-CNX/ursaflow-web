import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { PageCard } from '@/components/ui/PageCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { useStrings } from '@/i18n/useStrings';
import { AlertTriangle } from 'lucide-react';

export function SparesAging() {
  const { t } = useStrings();

  return (
    <PlaceholderTemplate
      icon={AlertTriangle}
      titleKey="pages.sparesAging"
      breadcrumbLabel="Spares AGING"
    >
      {/* AGING Demo */}
      <PageCard>
        <h3 className="text-sm font-semibold text-text mb-spacing-md flex items-center gap-spacing-sm">
          <AlertTriangle className="h-5 w-5 text-warning" />
          {t('status.aging')} Items
        </h3>
        <p className="text-sm text-text-muted mb-spacing-lg">
          Items flagged with <StatusChip status="aging" /> status require attention.
        </p>
        <div className="grid gap-spacing-md sm:grid-cols-2 lg:grid-cols-3">
          {[
            { mpn: 'MPN-A001', days: 45, location: 'Shelf B-12' },
            { mpn: 'MPN-A002', days: 62, location: 'Shelf C-03' },
            { mpn: 'MPN-A003', days: 38, location: 'Shelf A-08' },
          ].map((item) => (
            <div
              key={item.mpn}
              className="p-spacing-md rounded-radius border border-warning/30 bg-warning/5"
            >
              <div className="flex items-center justify-between mb-spacing-sm">
                <span className="font-medium text-text">{item.mpn}</span>
                <StatusChip status="aging" />
              </div>
              <dl className="text-xs space-y-spacing-xs">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Days:</dt>
                  <dd className="text-warning font-semibold">{item.days}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Location:</dt>
                  <dd className="text-text">{item.location}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </PageCard>
    </PlaceholderTemplate>
  );
}
