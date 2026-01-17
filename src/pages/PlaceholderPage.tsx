import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

export function PlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname.slice(1).replace(/-/g, ' ') || 'Home';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-spacing-lg rounded-full bg-accent/10 mb-spacing-lg">
        <Construction className="h-12 w-12 text-accent" />
      </div>
      
      <h1 className="text-2xl font-bold text-text mb-spacing-sm capitalize">
        {pageName}
      </h1>
      
      <p className="text-text-muted max-w-md">
        This page is under construction. The route is configured and accessible based on your role permissions.
      </p>
      
      <div className="mt-spacing-lg px-4 py-2 rounded-radius bg-surface border border-border">
        <code className="text-sm text-accent">{location.pathname}</code>
      </div>
    </div>
  );
}
