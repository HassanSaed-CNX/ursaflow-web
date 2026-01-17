import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { BaseButton } from '@/components/BaseButton';
import { t } from '@/i18n/useStrings';

interface ErrorBannerProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'error' | 'warning';
  className?: string;
}

export function ErrorBanner({
  title,
  message,
  onRetry,
  onDismiss,
  variant = 'error',
  className,
}: ErrorBannerProps) {
  const isError = variant === 'error';
  
  return (
    <div
      className={cn(
        'rounded-radius-lg border p-spacing-md flex items-start gap-spacing-md',
        isError
          ? 'bg-danger/10 border-danger/25 text-danger'
          : 'bg-warning/10 border-warning/25 text-warning',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm">
          {title || (isError ? t('a11y.error') : 'Warning')}
        </h4>
        <p className="text-sm mt-spacing-xs opacity-90">
          {message || t('errors.generic')}
        </p>

        {onRetry && (
          <BaseButton
            variant="ghost"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            className={cn(
              'mt-spacing-sm -ml-2',
              isError ? 'text-danger hover:bg-danger/10' : 'text-warning hover:bg-warning/10'
            )}
          >
            {t('common.retry')}
          </BaseButton>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'p-1 rounded-radius-sm transition-colors',
            isError ? 'hover:bg-danger/20' : 'hover:bg-warning/20'
          )}
          aria-label={t('common.close')}
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
