import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ExternalLink, CheckCircle, XCircle, Clock, PauseCircle, PlayCircle, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusChip } from '@/components/ui/StatusChip';
import { Inspection } from '@/types/quality';
import { useStrings } from '@/i18n/useStrings';

interface InspectionTableProps {
  inspections: Inspection[];
  onSignOff?: (inspection: Inspection) => void;
  showSignOff?: boolean;
}

const statusToChip = {
  pending: 'pending' as const,
  in_progress: 'inProgress' as const,
  pass: 'pass' as const,
  fail: 'fail' as const,
  hold: 'hold' as const,
};

export function InspectionTable({ inspections, onSignOff, showSignOff = false }: InspectionTableProps) {
  const { t } = useStrings();

  if (inspections.length === 0) {
    return (
      <div className="rounded-radius-lg border border-border bg-surface p-spacing-xl text-center">
        <Clock className="h-12 w-12 mx-auto text-text-muted mb-spacing-md" />
        <p className="text-text-muted">No inspections found</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-radius-lg border border-border">
      <table className="w-full border-collapse min-w-[800px]">
        <thead className="sticky top-0 z-10">
          <tr className="bg-header text-header-foreground">
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Work Order
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Item
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Qty
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              {t('common.status')}
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Inspector
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Signed Off
            </th>
            <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider">
              Date
            </th>
            {showSignOff && (
              <th className="px-spacing-sm py-spacing-sm text-left text-xs font-semibold uppercase tracking-wider w-24">
                {t('common.actions')}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-border">
          {inspections.map((inspection) => (
            <tr key={inspection.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-spacing-sm py-spacing-sm">
                <Link
                  to={`/work-orders/${inspection.workOrderId}`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                >
                  {inspection.workOrderNumber}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </td>
              <td className="px-spacing-sm py-spacing-sm">
                <div>
                  <p className="text-sm font-medium text-text">{inspection.itemNumber}</p>
                  <p className="text-xs text-text-muted truncate max-w-[200px]">
                    {inspection.itemDescription}
                  </p>
                </div>
              </td>
              <td className="px-spacing-sm py-spacing-sm text-sm text-text">
                {inspection.quantity}
              </td>
              <td className="px-spacing-sm py-spacing-sm">
                <StatusChip status={statusToChip[inspection.status]} />
              </td>
              <td className="px-spacing-sm py-spacing-sm text-sm text-text-muted">
                {inspection.inspectorName || '—'}
              </td>
              <td className="px-spacing-sm py-spacing-sm">
                {inspection.signedOff ? (
                  <div className="flex items-center gap-1 text-success">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs">{inspection.signedOffBy}</span>
                  </div>
                ) : (
                  <span className="text-xs text-text-muted">Pending</span>
                )}
              </td>
              <td className="px-spacing-sm py-spacing-sm text-sm text-text-muted">
                {format(new Date(inspection.createdAt), 'MMM d, yyyy')}
              </td>
              {showSignOff && (
                <td className="px-spacing-sm py-spacing-sm">
                  {!inspection.signedOff && (inspection.status === 'pass' || inspection.status === 'fail' || inspection.status === 'hold') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSignOff?.(inspection)}
                      className="text-primary"
                    >
                      <PenTool className="h-3.5 w-3.5 mr-1" />
                      Sign
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
