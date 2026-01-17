import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { Bell } from 'lucide-react';

export function Notifications() {
  return (
    <PlaceholderTemplate
      icon={Bell}
      titleKey="pages.notifications"
      breadcrumbLabel="Notifications & Approvals"
    />
  );
}
