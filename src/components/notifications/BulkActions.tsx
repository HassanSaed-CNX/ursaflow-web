import { CheckCircle, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BulkActionsProps {
  selectedCount: number;
  onAcknowledge: () => void;
  onExport: () => void;
  onClearSelection: () => void;
  isProcessing?: boolean;
}

export function BulkActions({
  selectedCount,
  onAcknowledge,
  onExport,
  onClearSelection,
  isProcessing = false,
}: BulkActionsProps) {
  if (selectedCount === 0) {
    return (
      <div className="flex items-center gap-spacing-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export View
        </Button>
      </div>
    );
  }
  
  return (
    <div className={cn(
      'flex items-center gap-spacing-sm p-spacing-sm',
      'bg-primary/10 border border-primary/20 rounded-radius-md',
      'animate-in slide-in-from-top-2 duration-200'
    )}>
      <span className="text-sm font-medium text-text">
        {selectedCount} selected
      </span>
      
      <div className="flex items-center gap-spacing-xs ml-spacing-sm">
        <Button
          size="sm"
          onClick={onAcknowledge}
          disabled={isProcessing}
          className="gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          {isProcessing ? 'Processing...' : 'Acknowledge Selected'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isProcessing}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export Selected
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isProcessing}
          className="gap-1 text-text-muted"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
