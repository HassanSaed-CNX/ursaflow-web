import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, XCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { approvalFormSchema, ApprovalFormData } from '@/schemas/notificationSchema';
import { NotificationItem } from '@/types/notification';
import { useStrings } from '@/i18n/useStrings';
import { cn } from '@/lib/utils';

interface ApprovalDialogProps {
  notification: NotificationItem | null;
  mode: 'approve' | 'reject';
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ApprovalFormData) => Promise<void>;
}

export function ApprovalDialog({
  notification,
  mode,
  open,
  onClose,
  onSubmit,
}: ApprovalDialogProps) {
  const { t } = useStrings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalFormSchema),
    defaultValues: {
      notificationId: notification?.id || '',
      decision: mode,
      comments: '',
    },
  });
  
  const handleFormSubmit = async (data: ApprovalFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    reset();
    onClose();
  };
  
  const isApprove = mode === 'approve';
  const Icon = isApprove ? CheckCircle : XCircle;
  const title = isApprove ? t('actions.approve') : t('actions.reject');
  const buttonColor = isApprove ? 'bg-status-pass hover:bg-status-pass/90' : 'bg-status-fail hover:bg-status-fail/90';
  
  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={`${title} Notification`}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-spacing-md">
        {/* Notification summary */}
        <div className="p-spacing-md bg-muted rounded-radius-md">
          <div className="flex items-start gap-spacing-sm">
            <Icon className={cn(
              'h-5 w-5 mt-0.5',
              isApprove ? 'text-status-pass' : 'text-status-fail'
            )} />
            <div>
              <p className="font-medium text-text">{notification?.title}</p>
              <p className="text-sm text-text-muted">{notification?.description}</p>
              {notification?.workOrderNumber && (
                <p className="text-sm text-primary mt-1">
                  WO: {notification.workOrderNumber}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Hidden fields */}
        <input 
          type="hidden" 
          {...register('notificationId')} 
          value={notification?.id || ''} 
        />
        <input 
          type="hidden" 
          {...register('decision')} 
          value={mode} 
        />
        
        {/* Comments */}
        <div className="space-y-spacing-xs">
          <Label htmlFor="comments">
            Comments <span className="text-status-fail">*</span>
          </Label>
          <Textarea
            id="comments"
            {...register('comments')}
            placeholder={`Enter reason for ${mode === 'approve' ? 'approval' : 'rejection'}...`}
            rows={4}
            className={cn(errors.comments && 'border-status-fail')}
          />
          {errors.comments && (
            <p className="text-sm text-status-fail">{errors.comments.message}</p>
          )}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') : title}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
