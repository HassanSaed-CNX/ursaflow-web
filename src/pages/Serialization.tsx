import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { PageCard } from '@/components/ui/PageCard';
import { useStrings } from '@/i18n/useStrings';
import { Tag } from 'lucide-react';

export function Serialization() {
  const { t } = useStrings();

  return (
    <PlaceholderTemplate
      icon={Tag}
      titleKey="pages.serialization"
      breadcrumbLabel="Serialization & Labels"
    >
      {/* MPN # Demo */}
      <PageCard>
        <h3 className="text-sm font-semibold text-text mb-spacing-md">
          Serialization Fields
        </h3>
        <div className="grid gap-spacing-md sm:grid-cols-2">
          <div className="space-y-spacing-xs">
            <label className="block text-sm font-medium text-text">
              {t('labels.mpn')}
            </label>
            <input
              type="text"
              placeholder="Enter MPN #"
              className="w-full h-10 px-3 rounded-radius border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
              aria-label={t('labels.mpn')}
            />
            <p className="text-xs text-text-muted">Manufacturer Part Number</p>
          </div>
          <div className="space-y-spacing-xs">
            <label className="block text-sm font-medium text-text">
              {t('labels.serialNumber')}
            </label>
            <input
              type="text"
              placeholder="Enter Serial Number"
              className="w-full h-10 px-3 rounded-radius border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
              aria-label={t('labels.serialNumber')}
            />
            <p className="text-xs text-text-muted">Unique device identifier</p>
          </div>
        </div>
      </PageCard>
    </PlaceholderTemplate>
  );
}
