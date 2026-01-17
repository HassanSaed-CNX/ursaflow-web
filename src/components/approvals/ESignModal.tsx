import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PenTool, CheckCircle, XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { eSignFormSchema, ESignFormData } from '@/schemas/approvalSchema';
import { ApprovalRequest } from '@/types/approval';
import { useStrings } from '@/i18n/useStrings';
import { cn } from '@/lib/utils';

interface ESignModalProps {
  isOpen: boolean;
  onClose: () => void;
  approval: ApprovalRequest | null;
  decision: 'approve' | 'reject';
  onSubmit: (data: ESignFormData) => Promise<{ success: boolean; error?: string }>;
  sodError?: string | null;
}

export function ESignModal({
  isOpen,
  onClose,
  approval,
  decision,
  onSubmit,
  sodError,
}: ESignModalProps) {
  const { t } = useStrings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ESignFormData>({
    resolver: zodResolver(eSignFormSchema),
    defaultValues: {
      approvalId: approval?.id || '',
      decision,
      attestation: false as boolean,
      typedName: '',
      comments: '',
    },
  });

  const attestation = watch('attestation');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && approval) {
      reset({
        approvalId: approval.id,
        decision,
        attestation: false as boolean,
        typedName: '',
        comments: '',
      });
      setServerError(null);
    }
  }, [isOpen, approval, decision, reset]);

  const handleFormSubmit = async (data: ESignFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await onSubmit(data);
      if (result.success) {
        reset();
        onClose();
      } else {
        setServerError(result.error || t('errors.generic'));
      }
    } catch {
      setServerError(t('errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const isApprove = decision === 'approve';
  const Icon = isApprove ? CheckCircle : XCircle;
  const actionLabel = isApprove ? t('actions.approve') : t('actions.reject');
  const buttonColor = isApprove
    ? 'bg-success hover:bg-success/90'
    : 'bg-danger hover:bg-danger/90';

  const attestationText = isApprove
    ? 'I attest that I have reviewed this request and confirm my approval. I understand this action will be recorded in the audit trail.'
    : 'I attest that I have reviewed this request and confirm my rejection. I understand this action will be recorded in the audit trail.';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Electronic Signature - ${actionLabel}`}
    >
      {/* SoD Error Banner */}
      {sodError && (
        <div className="mb-spacing-md">
          <div className="rounded-radius-lg border border-danger bg-danger/10 p-spacing-md flex items-start gap-spacing-md">
            <ShieldAlert className="h-5 w-5 text-danger shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-danger text-sm">
                Separation of Duties Violation
              </h4>
              <p className="text-sm text-danger/90 mt-1">{sodError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Server Error */}
      {serverError && !sodError && (
        <div className="mb-spacing-md">
          <ErrorBanner variant="error" message={serverError} />
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-spacing-md"
      >
        {/* Request Summary */}
        <div className="p-spacing-md bg-muted rounded-radius-md">
          <div className="flex items-start gap-spacing-sm">
            <Icon
              className={cn(
                'h-5 w-5 mt-0.5',
                isApprove ? 'text-success' : 'text-danger'
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-text">{approval?.title}</p>
              <p className="text-sm text-text-muted mt-1">
                {approval?.description}
              </p>
              {approval?.relatedWorkOrderNumber && (
                <p className="text-sm text-primary mt-1">
                  WO: {approval.relatedWorkOrderNumber}
                </p>
              )}
              <p className="text-xs text-text-muted mt-2">
                Requested by: {approval?.requestedByName}
              </p>
            </div>
          </div>
        </div>

        {/* Hidden fields */}
        <input type="hidden" {...register('approvalId')} />
        <input type="hidden" {...register('decision')} />

        {/* Attestation Checkbox */}
        <div className="space-y-spacing-xs">
          <div className="flex items-start gap-spacing-sm p-spacing-md border border-border rounded-radius-md bg-background">
            <Checkbox
              id="attestation"
              checked={attestation}
              onCheckedChange={(checked) =>
                setValue('attestation', checked === true, {
                  shouldValidate: true,
                })
              }
              disabled={!!sodError}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label
                htmlFor="attestation"
                className="text-sm font-medium cursor-pointer"
              >
                {attestationText}
              </Label>
              {errors.attestation && (
                <p className="text-sm text-danger mt-1">
                  {errors.attestation.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Typed Name (E-Signature) */}
        <div className="space-y-spacing-xs">
          <Label htmlFor="typedName" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Type Your Full Name (Electronic Signature){' '}
            <span className="text-danger">*</span>
          </Label>
          <Input
            id="typedName"
            {...register('typedName')}
            placeholder="Enter your full legal name"
            disabled={!!sodError}
            className={cn(errors.typedName && 'border-danger')}
            autoComplete="name"
          />
          {errors.typedName && (
            <p className="text-sm text-danger">{errors.typedName.message}</p>
          )}
        </div>

        {/* Comments */}
        <div className="space-y-spacing-xs">
          <Label htmlFor="comments">
            Comments <span className="text-danger">*</span>
          </Label>
          <Textarea
            id="comments"
            {...register('comments')}
            placeholder={`Enter reason for ${decision}...`}
            rows={4}
            disabled={!!sodError}
            className={cn(errors.comments && 'border-danger')}
          />
          {errors.comments && (
            <p className="text-sm text-danger">{errors.comments.message}</p>
          )}
        </div>

        {/* Warning about audit trail */}
        <div className="flex items-start gap-spacing-sm p-spacing-sm bg-warning/10 rounded-radius-md border border-warning/25">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-warning">
            This action will be permanently recorded in the audit trail with
            your electronic signature, timestamp, and IP address.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-spacing-sm pt-spacing-sm">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            className={cn('text-white', buttonColor)}
            disabled={isSubmitting || !!sodError}
          >
            {isSubmitting ? t('common.loading') : `Sign & ${actionLabel}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
