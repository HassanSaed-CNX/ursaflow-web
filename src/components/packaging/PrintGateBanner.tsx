import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PrintGateStatus } from '@/types/packaging';
import { useStrings } from '@/i18n/useStrings';

interface PrintGateBannerProps {
  status: PrintGateStatus;
}

export function PrintGateBanner({ status }: PrintGateBannerProps) {
  const { t } = useStrings();

  if (status.canPrint) {
    return (
      <div className="flex items-center gap-spacing-sm p-spacing-md bg-success/10 border border-success/30 rounded-radius-md">
        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
        <div>
          <p className="font-medium text-success">
            {t('packaging.printGate.ready')}
          </p>
          <p className="text-sm text-success/80">
            {t('packaging.printGate.allGatesPassed')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-spacing-md bg-warning/10 border border-warning/30 rounded-radius-md">
      <div className="flex items-start gap-spacing-sm">
        <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-warning">
            {t('packaging.printGate.blocked')}
          </p>
          <p className="text-sm text-warning/80 mb-spacing-sm">
            {t('packaging.printGate.mustComplete')}
          </p>

          <div className="space-y-spacing-xs">
            {/* Test Verdict Gate */}
            <div className="flex items-center gap-spacing-sm text-sm">
              {status.testVerdict === 'pass' ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : status.testVerdict === 'fail' ? (
                <XCircle className="h-4 w-4 text-danger" />
              ) : (
                <Clock className="h-4 w-4 text-text-muted" />
              )}
              <span className={status.testVerdict === 'pass' ? 'text-success' : 'text-text-muted'}>
                {t('packaging.printGate.testVerdict')}: {' '}
                <span className="font-medium uppercase">{status.testVerdict}</span>
              </span>
            </div>

            {/* Final QC Gate */}
            <div className="flex items-center gap-spacing-sm text-sm">
              {status.finalQcSigned ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <Clock className="h-4 w-4 text-text-muted" />
              )}
              <span className={status.finalQcSigned ? 'text-success' : 'text-text-muted'}>
                {t('packaging.printGate.finalQcSign')}: {' '}
                <span className="font-medium">
                  {status.finalQcSigned ? t('common.completed') : t('common.pending')}
                </span>
              </span>
            </div>
          </div>

          {status.blockedReasons.length > 0 && (
            <ul className="mt-spacing-sm text-sm text-warning/80 list-disc list-inside">
              {status.blockedReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
