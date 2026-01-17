import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { ScanLine } from 'lucide-react';

export function InProcessQC() {
  return (
    <PlaceholderTemplate
      icon={ScanLine}
      titleKey="pages.inProcessQc"
      breadcrumbLabel="In-Process QC"
    />
  );
}
