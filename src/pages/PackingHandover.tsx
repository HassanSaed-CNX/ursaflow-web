import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { Archive } from 'lucide-react';

export function PackingHandover() {
  return (
    <PlaceholderTemplate
      icon={Archive}
      titleKey="pages.packingHandover"
      breadcrumbLabel="Packing & Handover"
    />
  );
}
