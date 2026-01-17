import { AlertTriangle, CheckCircle, Info, XCircle, RefreshCw } from 'lucide-react';
import { Gate, GateCheckResult, BlockedAction } from '@/types/gates';
import { Button } from '@/components/ui/button';
import { useStrings } from '@/i18n/useStrings';

interface GateBannerProps {
  gateStatus: GateCheckResult;
  targetAction?: BlockedAction;
  showAllGates?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const severityConfig = {
  error: {
    icon: XCircle,
    containerClass: 'bg-danger/10 border-danger/30',
    iconClass: 'text-danger',
    textClass: 'text-danger',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-warning/10 border-warning/30',
    iconClass: 'text-warning',
    textClass: 'text-warning',
  },
  info: {
    icon: Info,
    containerClass: 'bg-primary/10 border-primary/30',
    iconClass: 'text-primary',
    textClass: 'text-primary',
  },
};

function GateItem({ gate }: { gate: Gate }) {
  const config = severityConfig[gate.severity];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-spacing-sm p-spacing-sm rounded-radius-sm border ${config.containerClass}`}>
      <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${config.iconClass}`} />
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${config.textClass}`}>{gate.name}</p>
        <p className="text-xs text-text-muted">{gate.description}</p>
        {gate.details && (
          <p className="text-xs text-text-muted mt-1 font-mono">{gate.details}</p>
        )}
      </div>
    </div>
  );
}

export function GateBanner({
  gateStatus,
  targetAction,
  showAllGates = false,
  onRefresh,
  isRefreshing = false,
}: GateBannerProps) {
  const { t } = useStrings();

  // If targeting a specific action, show only gates blocking that action
  const gatesToShow = targetAction
    ? gateStatus.getBlockingGates(targetAction)
    : showAllGates
    ? gateStatus.activeGates
    : gateStatus.activeGates.filter((g) => g.severity === 'error');

  // All gates passed
  if (gateStatus.allPassed || gatesToShow.length === 0) {
    return (
      <div className="flex items-center justify-between p-spacing-md bg-success/10 border border-success/30 rounded-radius-md">
        <div className="flex items-center gap-spacing-sm">
          <CheckCircle className="h-5 w-5 text-success" />
          <div>
            <p className="font-medium text-success">{t('gates.allPassed')}</p>
            <p className="text-sm text-success/80">{t('gates.readyToProceed')}</p>
          </div>
        </div>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-success hover:text-success"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
    );
  }

  // Determine overall severity
  const hasError = gatesToShow.some((g) => g.severity === 'error');
  const overallSeverity = hasError ? 'error' : 'warning';
  const config = severityConfig[overallSeverity];

  return (
    <div className={`p-spacing-md rounded-radius-md border ${config.containerClass}`}>
      <div className="flex items-start justify-between mb-spacing-sm">
        <div className="flex items-center gap-spacing-sm">
          <AlertTriangle className={`h-5 w-5 ${config.iconClass}`} />
          <div>
            <p className={`font-medium ${config.textClass}`}>
              {targetAction
                ? t('gates.actionBlocked')
                : t('gates.gatesNotPassed')}
            </p>
            <p className="text-sm text-text-muted">
              {gatesToShow.length} {gatesToShow.length === 1 ? 'gate' : 'gates'} blocking
            </p>
          </div>
        </div>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      <div className="space-y-spacing-xs">
        {gatesToShow.map((gate) => (
          <GateItem key={gate.id} gate={gate} />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact gate indicator for inline use
 */
export function GateIndicator({
  gateStatus,
  action,
}: {
  gateStatus: GateCheckResult;
  action: BlockedAction;
}) {
  const canPerform = gateStatus.canPerformAction(action);
  const blockingGates = gateStatus.getBlockingGates(action);

  if (canPerform) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-success">
        <CheckCircle className="h-3 w-3" />
        Ready
      </span>
    );
  }

  const hasError = blockingGates.some((g) => g.severity === 'error');

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${
        hasError ? 'text-danger' : 'text-warning'
      }`}
      title={blockingGates.map((g) => g.name).join(', ')}
    >
      {hasError ? (
        <XCircle className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      {blockingGates.length} gate{blockingGates.length !== 1 ? 's' : ''}
    </span>
  );
}
