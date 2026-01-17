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
  AlertTriangle,
  Bell,
  Tag,
  ScanLine,
  Palette,
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
  | 'view_control_tower'
  | 'view_work_orders'
  | 'create_work_order'
  | 'edit_work_order'
  | 'delete_work_order'
  | 'view_kitting'
  | 'view_assembly'
  | 'view_in_process_qc'
  | 'view_inventory'
  | 'manage_inventory'
  | 'view_test_bench'
  | 'view_test_results'
  | 'submit_test_results'
  | 'approve_test_results'
  | 'view_final_qc'
  | 'view_serialization'
  | 'view_packaging'
  | 'process_packaging'
  | 'view_notifications'
  | 'view_ncr_capa'
  | 'view_reports'
  | 'manage_users'
  | 'manage_settings'
  | 'view_spares_aging'
  | 'view_admin';

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
      { id: 'kitting', label: 'Kitting', path: '/kitting', icon: Package },
      { id: 'assembly', label: 'Assembly', path: '/assembly', icon: Wrench },
    ],
    allowedActions: [
      'view_work_orders',
      'view_kitting',
      'view_assembly',
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
      'view_test_bench',
      'view_test_results',
      'submit_test_results',
    ],
  },

  qa_tech: {
    role: 'qa_tech',
    label: ROLE_LABELS.qa_tech,
    layoutMode: 'singleScreen',
    navItems: [
      { id: 'in-process-qc', label: 'In-Process QC', path: '/in-process-qc', icon: ScanLine },
      { id: 'final-qc', label: 'Final QC', path: '/final-qc', icon: CheckSquare },
      { id: 'spares-aging', label: 'Spares AGING', path: '/spares-aging', icon: AlertTriangle },
      { id: 'ncr-capa', label: 'NCR / CAPA', path: '/ncr-capa', icon: AlertTriangle },
    ],
    allowedActions: [
      'view_in_process_qc',
      'view_final_qc',
      'view_test_results',
      'approve_test_results',
      'view_spares_aging',
      'view_ncr_capa',
    ],
  },

  packaging: {
    role: 'packaging',
    label: ROLE_LABELS.packaging,
    layoutMode: 'singleScreen',
    navItems: [
      { id: 'serialization', label: 'Serialization & Labels', path: '/serialization', icon: Tag },
      { id: 'packing', label: 'Packing & Handover', path: '/packing-handover', icon: Archive },
    ],
    allowedActions: [
      'view_serialization',
      'view_packaging',
      'process_packaging',
    ],
  },

  supervisor: {
    role: 'supervisor',
    label: ROLE_LABELS.supervisor,
    layoutMode: 'sidebar',
    navItems: [
      { id: 'control-tower', label: 'Control Tower', path: '/', icon: LayoutDashboard },
      { id: 'work-orders', label: 'Work Orders', path: '/work-orders', icon: ClipboardList },
      { id: 'kitting', label: 'Kitting', path: '/kitting', icon: Package },
      { id: 'assembly', label: 'Assembly', path: '/assembly', icon: Wrench },
      { id: 'test-bench', label: 'Test Bench', path: '/test-bench', icon: TestTube },
      { id: 'final-qc', label: 'Final QC', path: '/final-qc', icon: CheckSquare },
      { id: 'spares-aging', label: 'Spares AGING', path: '/spares-aging', icon: AlertTriangle },
      { id: 'notifications', label: 'Notifications', path: '/notifications', icon: Bell },
      { id: 'approvals', label: 'Approvals', path: '/approvals', icon: CheckSquare },
      { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3 },
    ],
    allowedActions: [
      'view_control_tower',
      'view_work_orders',
      'create_work_order',
      'edit_work_order',
      'view_kitting',
      'view_assembly',
      'view_test_bench',
      'view_test_results',
      'approve_test_results',
      'view_final_qc',
      'view_spares_aging',
      'view_notifications',
      'view_reports',
    ],
  },

  admin: {
    role: 'admin',
    label: ROLE_LABELS.admin,
    layoutMode: 'sidebar',
    navItems: [
      { id: 'control-tower', label: 'Control Tower', path: '/', icon: LayoutDashboard },
      { id: 'work-orders', label: 'Work Orders', path: '/work-orders', icon: ClipboardList },
      { id: 'kitting', label: 'Kitting', path: '/kitting', icon: Package },
      { id: 'assembly', label: 'Assembly', path: '/assembly', icon: Wrench },
      { id: 'in-process-qc', label: 'In-Process QC', path: '/in-process-qc', icon: ScanLine },
      { id: 'test-bench', label: 'Test Bench', path: '/test-bench', icon: TestTube },
      { id: 'final-qc', label: 'Final QC', path: '/final-qc', icon: CheckSquare },
      { id: 'serialization', label: 'Serialization', path: '/serialization', icon: Tag },
      { id: 'packing', label: 'Packing', path: '/packing-handover', icon: Archive },
      { id: 'spares-aging', label: 'Spares AGING', path: '/spares-aging', icon: AlertTriangle },
      { id: 'ncr-capa', label: 'NCR / CAPA', path: '/ncr-capa', icon: AlertTriangle },
      { id: 'notifications', label: 'Notifications', path: '/notifications', icon: Bell },
      { id: 'approvals', label: 'Approvals', path: '/approvals', icon: CheckSquare },
      { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3 },
      { id: 'users', label: 'Users', path: '/users', icon: Users },
      { id: 'admin', label: 'Admin', path: '/admin', icon: Settings },
      { id: 'theme-guide', label: 'Theme Guide', path: '/admin/theme-guide', icon: Palette },
    ],
    allowedActions: [
      'view_dashboard',
      'view_control_tower',
      'view_work_orders',
      'create_work_order',
      'edit_work_order',
      'delete_work_order',
      'view_kitting',
      'view_assembly',
      'view_in_process_qc',
      'view_inventory',
      'manage_inventory',
      'view_test_bench',
      'view_test_results',
      'submit_test_results',
      'approve_test_results',
      'view_final_qc',
      'view_serialization',
      'view_packaging',
      'process_packaging',
      'view_notifications',
      'view_ncr_capa',
      'view_spares_aging',
      'view_reports',
      'manage_users',
      'manage_settings',
      'view_admin',
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
