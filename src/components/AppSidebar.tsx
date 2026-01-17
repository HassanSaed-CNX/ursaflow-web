import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { roleConfig } = useAuth();

  if (!roleConfig) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar
      className={collapsed ? 'w-14' : 'w-60'}
      collapsible="icon"
    >
      <SidebarContent className="pt-spacing-md">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider px-spacing-sm">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {roleConfig.navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={`
                        flex items-center gap-spacing-sm px-spacing-sm py-spacing-sm rounded-radius
                        text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                        transition-colors
                        ${isActive(item.path) ? 'bg-sidebar-accent text-accent font-medium' : ''}
                      `}
                      activeClassName="bg-sidebar-accent text-accent font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
