import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { Settings } from 'lucide-react';

export function Admin() {
  return (
    <PlaceholderTemplate
      icon={Settings}
      titleKey="pages.admin"
      breadcrumbLabel="Admin"
    />
  );
}
