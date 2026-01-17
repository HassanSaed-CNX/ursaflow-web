import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        
        <div className="flex flex-1 w-full">
          <AppSidebar />
          
          <main className="flex-1 bg-background">
            {/* Sidebar toggle for collapsed state */}
            <div className="p-spacing-sm border-b border-border bg-surface">
              <SidebarTrigger className="p-2 rounded-radius hover:bg-background text-text-muted hover:text-text transition-colors" />
            </div>
            
            <div className="p-spacing-lg">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
