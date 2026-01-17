import { LabelTemplate } from '@/types/packaging';
import { Card } from '@/components/ui/card';
import { QrCode, Barcode } from 'lucide-react';

interface LabelPreviewProps {
  template: LabelTemplate;
  data: Record<string, string>;
}

export function LabelPreview({ template, data }: LabelPreviewProps) {
  return (
    <Card className="p-spacing-md border-2 border-dashed border-border bg-white">
      <div className="space-y-spacing-sm">
        {/* Label Header */}
        <div className="flex justify-between items-start">
          <div className="text-xs text-text-muted uppercase tracking-wide">
            {template.name}
          </div>
          <div className="flex gap-2">
            <QrCode className="h-8 w-8 text-text-muted" />
            <Barcode className="h-8 w-8 text-text-muted" />
          </div>
        </div>

        {/* Label Fields */}
        <div className="space-y-spacing-xs pt-spacing-sm border-t border-border">
          {template.fields.map((field) => (
            <div key={field.key} className="flex justify-between text-sm">
              <span className="font-medium text-text">{field.label}:</span>
              <span className="text-text-muted font-mono">
                {data[field.key] || '—'}
              </span>
            </div>
          ))}
        </div>

        {/* Mock Barcode */}
        <div className="pt-spacing-sm border-t border-border">
          <div className="h-10 bg-gradient-to-r from-text via-white to-text bg-[length:4px_100%] opacity-80" />
          <p className="text-center text-xs font-mono text-text-muted mt-1">
            {data.serialNumber || 'SERIAL-NUMBER'}
          </p>
        </div>
      </div>
    </Card>
  );
}
