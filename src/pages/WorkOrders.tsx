import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { ClipboardList } from 'lucide-react';

export function WorkOrders() {
  return (
    <PlaceholderTemplate
      icon={ClipboardList}
      titleKey="pages.workOrders"
      breadcrumbLabel="Work Orders"
    />
  );
}
