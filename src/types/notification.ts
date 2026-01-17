// Notification types and interfaces

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'critical';

export type NotificationCategory = 
  | 'quality'
  | 'test'
  | 'production'
  | 'resource'
  | 'exception'
  | 'packaging'
  | 'logistics'
  | 'compliance'
  | 'audit';

export type NotificationStatus = 'new' | 'acknowledged' | 'closed';

export interface NotificationChannels {
  inApp: boolean;
  email: boolean;
  teams: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  roleTarget: string[];
  module: string;
  workOrderId?: string;
  workOrderNumber?: string;
  itemNumber?: string;
  status: NotificationStatus;
  createdAt: Date;
  slaDueAt?: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  closedAt?: Date;
  channels: NotificationChannels;
}

export interface ApprovalRequest {
  id: string;
  notificationId: string;
  type: 'quality_hold' | 'ncr' | 'deviation' | 'rework';
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  comments?: string;
}

export interface AuditTrailEntry {
  id: string;
  entityType: 'notification' | 'approval' | 'workorder';
  entityId: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  details?: Record<string, unknown>;
}

// Filter types for notification queries
export interface NotificationFilters {
  severity?: NotificationSeverity[];
  category?: NotificationCategory[];
  status?: NotificationStatus[];
  roleTarget?: string;
  module?: string;
  workOrderId?: string;
  slaDue?: 'overdue' | 'today' | 'thisWeek' | 'all';
  search?: string;
}
