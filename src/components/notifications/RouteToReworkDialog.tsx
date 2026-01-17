import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { routeToReworkSchema, RouteToReworkFormData } from '@/schemas/notificationSchema';
import { NotificationItem } from '@/types/notification';
import { useStrings } from '@/i18n/useStrings';
import { cn } from '@/lib/utils';

interface RouteToReworkDialogProps {
  notification: NotificationItem | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RouteToReworkFormData) => Promise<void>;
}

const ROUTING_STEPS = [
  'Kitting',
  'Assembly',
  'In-Process QC',
  'Test Bench',
  'Final QC',
  'Serialization & Labeling',
  'Final Packing',
];

export function RouteToReworkDialog({
  notification,
  open,
  onClose,
  onSubmit,
}: RouteToReworkDialogProps) {
  const { t } = useStrings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RouteToReworkFormData>({
    resolver: zodResolver(routeToReworkSchema),
    defaultValues: {
      notificationId: notification?.id || '',
      workOrderId: notification?.workOrderId || '',
      reason: '',
      targetStep: '',
    },
  });
  
  const targetStep = watch('targetStep');
  
  const handleFormSubmit = async (data: RouteToReworkFormData) => {
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
  
  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Route to Rework"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-spacing-md">
        {/* Notification summary */}
        <div className="p-spacing-md bg-muted rounded-radius-md">
          <div className="flex items-start gap-spacing-sm">
            <RotateCcw className="h-5 w-5 mt-0.5 text-status-warning" />
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
          {...register('workOrderId')} 
          value={notification?.workOrderId || ''} 
        />
        
        {/* Target step */}
        <div className="space-y-spacing-xs">
          <Label htmlFor="targetStep">Route to Step</Label>
          <Select
            value={targetStep}
            onValueChange={(value) => setValue('targetStep', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target step..." />
            </SelectTrigger>
            <SelectContent>
              {ROUTING_STEPS.map(step => (
                <SelectItem key={step} value={step}>
                  {step}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Reason */}
        <div className="space-y-spacing-xs">
          <Label htmlFor="reason">
            Reason for Rework <span className="text-status-fail">*</span>
          </Label>
          <Textarea
            id="reason"
            {...register('reason')}
            placeholder="Describe the reason for routing to rework..."
            rows={4}
            className={cn(errors.reason && 'border-status-fail')}
          />
          {errors.reason && (
            <p className="text-sm text-status-fail">{errors.reason.message}</p>
          )}
        </div>
        
        {/* Audit preview */}
        <div className="p-spacing-md bg-muted/50 rounded-radius-md border border-border">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-spacing-xs">
            Audit Trail Preview
          </p>
          <p className="text-sm text-text">
            Work order <span className="font-medium">{notification?.workOrderNumber}</span> will be 
            routed to rework{targetStep && <> at step <span className="font-medium">{targetStep}</span></>}.
            This action will be recorded with timestamp and user information.
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
            className="bg-status-warning hover:bg-status-warning/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') : 'Route to Rework'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
