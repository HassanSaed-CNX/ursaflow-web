import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { AlertTriangle } from 'lucide-react';

export function NcrCapa() {
  return (
    <PlaceholderTemplate
      icon={AlertTriangle}
      titleKey="pages.ncrCapa"
      breadcrumbLabel="NCR / CAPA"
    />
  );
}
