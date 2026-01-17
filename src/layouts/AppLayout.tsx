import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarLayout } from './SidebarLayout';
import { SingleScreenLayout } from './SingleScreenLayout';
import { Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, roleConfig, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-spacing-md">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // No user state
  if (!user || !roleConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-text mb-spacing-sm">Not Authenticated</h1>
          <p className="text-text-muted">Please log in to continue.</p>
        </div>
      </div>
    );
  }

  // Choose layout based on role config
  if (roleConfig.layoutMode === 'sidebar') {
    return <SidebarLayout>{children}</SidebarLayout>;
  }

  return <SingleScreenLayout>{children}</SingleScreenLayout>;
}
