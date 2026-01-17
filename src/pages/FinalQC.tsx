import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { CheckSquare } from 'lucide-react';

export function FinalQC() {
  return (
    <PlaceholderTemplate
      icon={CheckSquare}
      titleKey="pages.finalQc"
      breadcrumbLabel="Final QC"
    />
  );
}
