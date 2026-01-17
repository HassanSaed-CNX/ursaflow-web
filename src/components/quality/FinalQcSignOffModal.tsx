import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PenTool, CheckCircle, XCircle, AlertTriangle, PauseCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { finalQcSignOffSchema, FinalQcSignOffData } from '@/schemas/qualitySchema';
import { Inspection } from '@/types/quality';
import { useStrings } from '@/i18n/useStrings';
import { cn } from '@/lib/utils';

interface FinalQcSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: Inspection | null;
  onSubmit: (data: FinalQcSignOffData) => Promise<{ success: boolean; error?: string }>;
}

export function FinalQcSignOffModal({
  isOpen,
  onClose,
  inspection,
  onSubmit,
}: FinalQcSignOffModalProps) {
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
  } = useForm<FinalQcSignOffData>({
    resolver: zodResolver(finalQcSignOffSchema),
    defaultValues: {
      inspectionId: inspection?.id || '',
      attestation: false as boolean,
      typedName: '',
      result: 'pass',
      comments: '',
    },
  });

  const attestation = watch('attestation');
  const result = watch('result');

  useEffect(() => {
    if (isOpen && inspection) {
      reset({
        inspectionId: inspection.id,
        attestation: false as boolean,
        typedName: '',
        result: inspection.status === 'fail' ? 'fail' : inspection.status === 'hold' ? 'hold' : 'pass',
        comments: '',
      });
      setServerError(null);
    }
  }, [isOpen, inspection, reset]);

  const handleFormSubmit = async (data: FinalQcSignOffData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const submitResult = await onSubmit(data);
      if (submitResult.success) {
        reset();
        onClose();
      } else {
        setServerError(submitResult.error || t('errors.generic'));
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

  const resultIcons = {
    pass: <CheckCircle className="h-5 w-5 text-success" />,
    fail: <XCircle className="h-5 w-5 text-danger" />,
    hold: <PauseCircle className="h-5 w-5 text-warning" />,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Final QC Sign-Off"
      size="md"
    >
      {serverError && (
        <div className="mb-spacing-md">
          <ErrorBanner variant="error" message={serverError} />
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-spacing-md">
        {/* Inspection Summary */}
        <div className="p-spacing-md bg-muted rounded-radius-md">
          <div className="grid grid-cols-2 gap-spacing-sm text-sm">
            <div>
              <span className="text-text-muted">Work Order:</span>
              <span className="ml-2 font-medium text-text">{inspection?.workOrderNumber}</span>
            </div>
            <div>
              <span className="text-text-muted">Item:</span>
              <span className="ml-2 font-medium text-text">{inspection?.itemNumber}</span>
            </div>
            <div className="col-span-2">
              <span className="text-text-muted">Description:</span>
              <span className="ml-2 text-text">{inspection?.itemDescription}</span>
            </div>
          </div>
        </div>

        <input type="hidden" {...register('inspectionId')} />

        {/* Result Selection */}
        <div className="space-y-spacing-xs">
          <Label>Final Result</Label>
          <RadioGroup
            value={result}
            onValueChange={(value) => setValue('result', value as 'pass' | 'fail' | 'hold')}
            className="grid grid-cols-3 gap-spacing-sm"
          >
            {(['pass', 'fail', 'hold'] as const).map((option) => (
              <label
                key={option}
                className={cn(
                  'flex items-center gap-2 p-spacing-sm rounded-radius-md border cursor-pointer transition-colors',
                  result === option
                    ? option === 'pass'
                      ? 'border-success bg-success/10'
                      : option === 'fail'
                      ? 'border-danger bg-danger/10'
                      : 'border-warning bg-warning/10'
                    : 'border-border hover:bg-muted'
                )}
              >
                <RadioGroupItem value={option} id={option} />
                {resultIcons[option]}
                <span className="font-medium capitalize">{option}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Attestation Checkbox */}
        <div className="flex items-start gap-spacing-sm p-spacing-md border border-border rounded-radius-md bg-background">
          <Checkbox
            id="attestation"
            checked={attestation}
            onCheckedChange={(checked) =>
              setValue('attestation', checked === true, { shouldValidate: true })
            }
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label htmlFor="attestation" className="text-sm font-medium cursor-pointer">
              I attest that I have reviewed all inspection checkpoints and confirm this final QC result. 
              This action will be permanently recorded in the audit trail.
            </Label>
            {errors.attestation && (
              <p className="text-sm text-danger mt-1">{errors.attestation.message}</p>
            )}
          </div>
        </div>

        {/* Typed Name (E-Signature) */}
        <div className="space-y-spacing-xs">
          <Label htmlFor="typedName" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Type Your Full Name (Electronic Signature)
            <span className="text-danger">*</span>
          </Label>
          <Input
            id="typedName"
            {...register('typedName')}
            placeholder="Enter your full legal name"
            className={cn(errors.typedName && 'border-danger')}
            autoComplete="name"
          />
          {errors.typedName && (
            <p className="text-sm text-danger">{errors.typedName.message}</p>
          )}
        </div>

        {/* Comments */}
        <div className="space-y-spacing-xs">
          <Label htmlFor="comments">Comments (Optional)</Label>
          <Textarea
            id="comments"
            {...register('comments')}
            placeholder="Add any additional notes..."
            rows={3}
            className={cn(errors.comments && 'border-danger')}
          />
          {errors.comments && (
            <p className="text-sm text-danger">{errors.comments.message}</p>
          )}
        </div>

        {/* Warning */}
        <div className="flex items-start gap-spacing-sm p-spacing-sm bg-warning/10 rounded-radius-md border border-warning/25">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-warning">
            This action will be permanently recorded with your electronic signature, timestamp, and cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-spacing-sm pt-spacing-sm">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            className={cn(
              'text-white',
              result === 'pass' ? 'bg-success hover:bg-success/90' :
              result === 'fail' ? 'bg-danger hover:bg-danger/90' :
              'bg-warning hover:bg-warning/90'
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') : 'Sign & Complete'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
