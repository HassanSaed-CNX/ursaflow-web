import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scanInputSchema, ScanInput } from '@/schemas/workOrderSchema';
import { workOrderService } from '@/services/workOrderService';
import { useStrings } from '@/i18n/useStrings';
import { BaseButton } from '@/components/BaseButton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { ScanLine, ArrowRight } from 'lucide-react';

interface ScanToStartProps {
  onWorkOrderFound?: (woId: string) => void;
}

export function ScanToStart({ onWorkOrderFound }: ScanToStartProps) {
  const navigate = useNavigate();
  const { t } = useStrings();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
  } = useForm<ScanInput>({
    resolver: zodResolver(scanInputSchema),
    defaultValues: { barcode: '' },
  });

  const onSubmit = async (data: ScanInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await workOrderService.getByBarcode(data.barcode);
      
      if (response.status === 404 || !response.data) {
        setError(`Work order "${data.barcode}" not found. Please check the number and try again.`);
        return;
      }
      
      if (onWorkOrderFound) {
        onWorkOrderFound(response.data.id);
      } else {
        navigate(`/work-orders/${response.data.id}`);
      }
      
      reset();
    } catch (err) {
      setError(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-radius-lg p-spacing-lg">
      <div className="flex items-center gap-spacing-sm mb-spacing-md">
        <div className="p-spacing-sm rounded-radius bg-accent/10">
          <ScanLine className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-text">Scan to Start</h3>
          <p className="text-xs text-text-muted">Scan barcode or enter work order number</p>
        </div>
      </div>

      {error && (
        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
          className="mb-spacing-md"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-spacing-sm">
        <div className="flex-1">
          <input
            {...register('barcode')}
            type="text"
            placeholder="WO-2024-0001"
            autoComplete="off"
            autoFocus
            className={`
              w-full h-12 px-4 rounded-radius border bg-background text-text font-mono text-lg
              placeholder:text-text-muted placeholder:font-normal
              focus:outline-none focus:ring-2 focus:ring-focus
              ${errors.barcode ? 'border-danger' : 'border-border'}
            `}
            aria-label="Work order barcode"
            aria-invalid={errors.barcode ? 'true' : 'false'}
          />
          {errors.barcode && (
            <p className="mt-spacing-xs text-xs text-danger" role="alert">
              {errors.barcode.message}
            </p>
          )}
        </div>
        
        <BaseButton 
          type="submit" 
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-5 w-5" />}
        >
          Start
        </BaseButton>
      </form>
    </div>
  );
}
