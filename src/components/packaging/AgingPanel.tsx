import { AlertTriangle, Clock, Package } from 'lucide-react';
import { SparesAgingItem } from '@/types/packaging';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStrings } from '@/i18n/useStrings';

interface AgingPanelProps {
  items: SparesAgingItem[];
  counts: Record<SparesAgingItem['status'], number>;
}

const statusColors = {
  active: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  critical: 'bg-danger/10 text-danger border-danger/30',
  expired: 'bg-text-muted/10 text-text-muted border-text-muted/30',
};

const statusBadgeColors = {
  active: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-danger',
  expired: 'bg-text-muted',
};

export function AgingPanel({ items, counts }: AgingPanelProps) {
  const { t } = useStrings();

  const criticalItems = items.filter((i) => i.status === 'critical' || i.status === 'expired');

  return (
    <Card className="p-spacing-md">
      {/* Header with AGING label */}
      <div className="flex items-center justify-between mb-spacing-md">
        <div className="flex items-center gap-spacing-sm">
          <Clock className="h-5 w-5 text-warning" />
          <h3 className="font-semibold text-text">{t('spares.aging')}</h3>
        </div>
        <Badge variant="outline" className="font-bold text-warning border-warning">
          {t('spares.aging')}
        </Badge>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-spacing-sm mb-spacing-md">
        <div className={`p-spacing-sm rounded-radius-sm text-center border ${statusColors.active}`}>
          <div className="text-2xl font-bold">{counts.active}</div>
          <div className="text-xs uppercase tracking-wide">Active</div>
        </div>
        <div className={`p-spacing-sm rounded-radius-sm text-center border ${statusColors.warning}`}>
          <div className="text-2xl font-bold">{counts.warning}</div>
          <div className="text-xs uppercase tracking-wide">Warning</div>
        </div>
        <div className={`p-spacing-sm rounded-radius-sm text-center border ${statusColors.critical}`}>
          <div className="text-2xl font-bold">{counts.critical}</div>
          <div className="text-xs uppercase tracking-wide">Critical</div>
        </div>
        <div className={`p-spacing-sm rounded-radius-sm text-center border ${statusColors.expired}`}>
          <div className="text-2xl font-bold">{counts.expired}</div>
          <div className="text-xs uppercase tracking-wide">Expired</div>
        </div>
      </div>

      {/* Critical/Expired Items Alert */}
      {criticalItems.length > 0 && (
        <div className="space-y-spacing-sm">
          <div className="flex items-center gap-spacing-xs text-sm font-medium text-danger">
            <AlertTriangle className="h-4 w-4" />
            <span>{t('spares.attentionRequired')}</span>
          </div>

          <div className="space-y-spacing-xs max-h-48 overflow-y-auto">
            {criticalItems.map((item) => (
              <div
                key={item.id}
                className={`p-spacing-sm rounded-radius-sm border ${statusColors[item.status]}`}
              >
                <div className="flex items-start justify-between gap-spacing-sm">
                  <div className="flex items-center gap-spacing-sm">
                    <Package className="h-4 w-4 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{t('fields.mpn')}: {item.mpn}</p>
                      <p className="text-xs opacity-80">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge className={`${statusBadgeColors[item.status]} text-white text-xs`}>
                      {item.agingDays} days
                    </Badge>
                    <p className="text-xs mt-1 opacity-70">Qty: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {criticalItems.length === 0 && (
        <div className="text-center py-spacing-md text-text-muted">
          <Clock className="h-8 w-8 mx-auto mb-spacing-sm opacity-50" />
          <p className="text-sm">{t('spares.noCritical')}</p>
        </div>
      )}
    </Card>
  );
}
