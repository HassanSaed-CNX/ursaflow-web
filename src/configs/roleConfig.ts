import { 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  TestTube, 
  Wrench,
  Users,
  Settings,
  BarChart3,
  Archive,
  CheckSquare,
  Truck,
  AlertTriangle,
  type LucideIcon
} from 'lucide-react';

// Role definitions
export const ROLES = [
  'operator',
  'test_bench_operator', 
  'qa_tech',
  'packaging',
  'supervisor',
  'admin'
] as const;

export type Role = typeof ROLES[number];

export const ROLE_LABELS: Record<Role, string> = {
  operator: 'Operator',
  test_bench_operator: 'Test Bench Operator',
  qa_tech: 'QA Tech',
  packaging: 'Packaging',
  supervisor: 'Supervisor/Planner',
  admin: 'Admin',
};

// Layout modes
export type LayoutMode = 'sidebar' | 'singleScreen';

// Navigation item definition
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  children?: NavItem[];
}

// Actions/permissions
export type Action = 
  | 'view_dashboard'
  | 'view_work_orders'
  | 'create_work_order'
  | 'edit_work_order'
  | 'delete_work_order'
  | 'view_inventory'
  | 'manage_inventory'
  | 'view_test_results'
  | 'submit_test_results'
  | 'approve_test_results'
  | 'view_packaging'
  | 'process_packaging'
  | 'view_reports'
  | 'manage_users'
  | 'manage_settings'
  | 'view_spares_aging';

// Complete role configuration
export interface RoleConfig {
  role: Role;
  label: string;
  layoutMode: LayoutMode;
  navItems: NavItem[];
  allowedActions: Action[];
}

// Central role configuration
export const roleConfigs: Record<Role, RoleConfig> = {
  operator: {
    role: 'operator',
    label: ROLE_LABELS.operator,
    layoutMode: 'singleScreen',
    navItems: [
      { id: 'work-orders', label: 'Work Orders', path: '/work-orders', icon: ClipboardList },
      { id: 'inventory', label: 'Inventory', path: '/inventory', icon: Package },
    ],
    allowedActions: [
      'view_work_orders',
      'view_inventory',
    ],
  },

  test_bench_operator: {
    role: 'test_bench_operator',
    label: ROLE_LABELS.test_bench_operator,
    layoutMode: 'singleScreen',
    navItems: [
      { id: 'test-bench', label: 'Test Bench', path: '/test-bench', icon: TestTube },
      { id: 'work-orders', label: 'Work Orders', path: '/work-orders', icon: ClipboardList },
    ],
    allowedActions: [
      'view_work_orders',
      'view_test_results',
      'submit_test_results',
    ],
  },

  qa_tech: {
    role: 'qa_tech',
    label: ROLE_LABELS.qa_tech,
    layoutMode: 'singleScreen',
    navItems: [
      { id: 'qa-review', label: 'QA Review', path: '/qa-review', icon: CheckSquare },
      { id: 'test-results', label: 'Test Results', path: '/test-results', icon: TestTube },
      { id: 'spares-aging', label: 'Spares AGING', path: '/spares-aging', icon: AlertTriangle },
    ],
    allowedActions: [
      'view_test_results',
      'approve_test_results',
      'view_spares_aging',
    ],
  },

  packaging: {
    role: 'packaging',
    label: ROLE_LABELS.packaging,
    layoutMode: 'singleScreen',
    navItems: [
      { id: 'packaging-queue', label: 'Packaging Queue', path: '/packaging', icon: Archive },
      { id: 'shipping', label: 'Shipping', path: '/shipping', icon: Truck },
    ],
    allowedActions: [
      'view_packaging',
      'process_packaging',
    ],
  },

  supervisor: {
    role: 'supervisor',
    label: ROLE_LABELS.supervisor,
    layoutMode: 'sidebar',
    navItems: [
      { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { id: 'work-orders', label: 'Work Orders', path: '/work-orders', icon: ClipboardList },
      { id: 'inventory', label: 'Inventory', path: '/inventory', icon: Package },
      { id: 'test-results', label: 'Test Results', path: '/test-results', icon: TestTube },
      { id: 'spares-aging', label: 'Spares AGING', path: '/spares-aging', icon: AlertTriangle },
      { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3 },
    ],
    allowedActions: [
      'view_dashboard',
      'view_work_orders',
      'create_work_order',
      'edit_work_order',
      'view_inventory',
      'manage_inventory',
      'view_test_results',
      'approve_test_results',
      'view_spares_aging',
      'view_reports',
    ],
  },

  admin: {
    role: 'admin',
    label: ROLE_LABELS.admin,
    layoutMode: 'sidebar',
    navItems: [
      { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { id: 'work-orders', label: 'Work Orders', path: '/work-orders', icon: ClipboardList },
      { id: 'inventory', label: 'Inventory', path: '/inventory', icon: Package },
      { id: 'maintenance', label: 'Maintenance', path: '/maintenance', icon: Wrench },
      { id: 'test-results', label: 'Test Results', path: '/test-results', icon: TestTube },
      { id: 'spares-aging', label: 'Spares AGING', path: '/spares-aging', icon: AlertTriangle },
      { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3 },
      { id: 'users', label: 'Users', path: '/users', icon: Users },
      { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
    ],
    allowedActions: [
      'view_dashboard',
      'view_work_orders',
      'create_work_order',
      'edit_work_order',
      'delete_work_order',
      'view_inventory',
      'manage_inventory',
      'view_test_results',
      'submit_test_results',
      'approve_test_results',
      'view_packaging',
      'process_packaging',
      'view_spares_aging',
      'view_reports',
      'manage_users',
      'manage_settings',
    ],
  },
};

// Helper to get config for a role
export function getRoleConfig(role: Role): RoleConfig {
  return roleConfigs[role];
}

// Helper to check if role has permission
export function hasPermission(role: Role, action: Action): boolean {
  return roleConfigs[role].allowedActions.includes(action);
}
