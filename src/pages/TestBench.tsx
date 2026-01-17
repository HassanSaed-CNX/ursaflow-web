import { PlaceholderTemplate } from '@/components/PlaceholderTemplate';
import { TestTube } from 'lucide-react';

export function TestBench() {
  return (
    <PlaceholderTemplate
      icon={TestTube}
      titleKey="pages.testBench"
      breadcrumbLabel="Test Bench"
    />
  );
}
