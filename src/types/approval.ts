// Expanded Approval types for Step 4

import { Role } from '@/configs/roleConfig';

export type ApprovalType = 
  | 'quality_hold' 
  | 'ncr' 
  | 'deviation' 
  | 'rework' 
  | 'release' 
  | 'scrap'
  | 'process_change';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AuditTrailEntry {
  id: string;
  entityType: 'approval' | 'workorder' | 'notification';
  entityId: string;
  action: string;
  performedBy: string;
  performedByName: string;
  performedAt: Date;
  details?: Record<string, unknown>;
  ipAddress?: string;
  signature?: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  type: ApprovalType;
  requestedByUserId: string;
  requestedByName: string;
  roleRequired: Role;
  status: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
  relatedWorkOrderId?: string;
  relatedWorkOrderNumber?: string;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  approvedByUserId?: string;
  approvedByName?: string;
  approvedAt?: Date;
  rejectedByUserId?: string;
  rejectedByName?: string;
  rejectedAt?: Date;
  comments?: string;
  auditTrail: AuditTrailEntry[];
}

export interface ESignData {
  approvalId: string;
  decision: 'approve' | 'reject';
  attestation: boolean;
  typedName: string;
  comments: string;
  timestamp: Date;
}

export interface ApprovalFilters {
  status?: ApprovalStatus[];
  type?: ApprovalType[];
  roleRequired?: Role;
  priority?: string[];
  search?: string;
}
