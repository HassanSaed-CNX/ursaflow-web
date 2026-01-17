import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, ClipboardList, Package, TestTube, AlertTriangle, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const { user, roleConfig, can } = useAuth();

  const stats = [
    { label: 'Active Work Orders', value: 24, icon: ClipboardList, color: 'accent' },
    { label: 'Inventory Items', value: 1847, icon: Package, color: 'success' },
    { label: 'Pending Tests', value: 12, icon: TestTube, color: 'warning' },
    { label: 'AGING Alerts', value: 3, icon: AlertTriangle, color: 'danger' },
  ];

  return (
    <div className="space-y-spacing-lg">
      {/* Page header */}
      <div className="flex items-center gap-spacing-md">
        <div className="p-spacing-sm rounded-radius bg-accent/10">
          <LayoutDashboard className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-sm text-text-muted">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      {can('view_dashboard') && (
        <div className="grid gap-spacing-md sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="bg-surface border border-border rounded-radius-lg p-spacing-lg shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center justify-between mb-spacing-sm">
                <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                <span className={`text-2xl font-bold text-${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Role info card */}
      <div className="bg-surface border border-border rounded-radius-lg p-spacing-lg">
        <h2 className="text-lg font-semibold text-text mb-spacing-md flex items-center gap-spacing-sm">
          <CheckCircle className="h-5 w-5 text-success" />
          Current Session
        </h2>
        
        <dl className="grid gap-spacing-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs text-text-muted uppercase tracking-wider">User</dt>
            <dd className="text-sm font-medium text-text">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted uppercase tracking-wider">Role</dt>
            <dd className="text-sm font-medium text-text">{roleConfig?.label}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted uppercase tracking-wider">Layout Mode</dt>
            <dd className="text-sm font-medium text-text capitalize">{roleConfig?.layoutMode}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-xs text-text-muted uppercase tracking-wider mb-spacing-xs">Permissions</dt>
            <dd className="flex flex-wrap gap-spacing-xs">
              {roleConfig?.allowedActions.slice(0, 6).map((action) => (
                <span 
                  key={action}
                  className="px-2 py-1 text-xs rounded-full bg-background border border-border text-text-muted"
                >
                  {action.replace(/_/g, ' ')}
                </span>
              ))}
              {(roleConfig?.allowedActions.length || 0) > 6 && (
                <span className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent">
                  +{(roleConfig?.allowedActions.length || 0) - 6} more
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Nav items preview */}
      <div className="bg-surface border border-border rounded-radius-lg p-spacing-lg">
        <h2 className="text-lg font-semibold text-text mb-spacing-md">
          Available Navigation
        </h2>
        <div className="flex flex-wrap gap-spacing-sm">
          {roleConfig?.navItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-spacing-xs px-3 py-2 rounded-radius bg-background border border-border"
            >
              <item.icon className="h-4 w-4 text-accent" />
              <span className="text-sm text-text">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
