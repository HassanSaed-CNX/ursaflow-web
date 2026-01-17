import { ApprovalRequest, ApprovalFilters, AuditTrailEntry } from '@/types/approval';
import { ESignFormData } from '@/schemas/approvalSchema';
import { getApprovalStore, updateApprovalInStore, CURRENT_USER_ID } from '@/mocks/approvals';
import { mockUsers } from '@/mocks/users';
import { canUserApprove } from '@/configs/policyConfig';
import { checkSodForApproval } from '@/services/gates/gateEngine';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ApprovalServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SoDCheckResult {
  allowed: boolean;
  reason?: string;
}

export const approvalService = {
  // GET /api/approvals
  async list(filters?: ApprovalFilters): Promise<ApprovalRequest[]> {
    await delay(300);
    
    let results = getApprovalStore();
    
    if (filters?.status?.length) {
      results = results.filter(a => filters.status!.includes(a.status));
    }
    
    if (filters?.type?.length) {
      results = results.filter(a => filters.type!.includes(a.type));
    }
    
    if (filters?.roleRequired) {
      results = results.filter(a => a.roleRequired === filters.roleRequired);
    }
    
    if (filters?.priority?.length) {
      results = results.filter(a => filters.priority!.includes(a.priority));
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(a => 
        a.title.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        a.relatedWorkOrderNumber?.toLowerCase().includes(search) ||
        a.requestedByName.toLowerCase().includes(search)
      );
    }
    
    // Sort by priority and date
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return results.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  // GET /api/approvals/:id
  async getById(id: string): Promise<ApprovalRequest | null> {
    await delay(200);
    return getApprovalStore().find(a => a.id === id) || null;
  },

  // Check Separation of Duties before approval
  // Uses centralized GateEngine check
  checkSoD(approval: ApprovalRequest, currentUserId: string): SoDCheckResult {
    // Use centralized gate engine for SoD check
    const gateResult = checkSodForApproval(
      approval.requestedByUserId,
      currentUserId,
      true // preventSelfApproval from policyConfig
    );
    
    if (!gateResult.allowed) {
      return {
        allowed: false,
        reason: gateResult.reason || 'Separation of Duties violation',
      };
    }
    
    // Also check using policy config as backup
    const policyAllowed = canUserApprove(approval.requestedByUserId, currentUserId);
    if (!policyAllowed) {
      return {
        allowed: false,
        reason: 'Separation of Duties: You cannot approve a request you created.',
      };
    }
    
    return { allowed: true };
  },

  // POST /api/approvals/:id/approve
  async approve(
    approvalId: string, 
    eSignData: ESignFormData,
    currentUserId: string = CURRENT_USER_ID
  ): Promise<ApprovalServiceResponse<ApprovalRequest>> {
    await delay(500);
    
    const approval = getApprovalStore().find(a => a.id === approvalId);
    
    if (!approval) {
      return { success: false, error: 'Approval request not found' };
    }
    
    if (approval.status !== 'pending') {
      return { success: false, error: 'This request has already been processed' };
    }
    
    // Check SoD
    const sodCheck = this.checkSoD(approval, currentUserId);
    if (!sodCheck.allowed) {
      return { success: false, error: sodCheck.reason };
    }
    
    const currentUser = Object.values(mockUsers).find(u => u.id === currentUserId);
    const now = new Date();
    
    // Create audit entry
    const auditEntry: AuditTrailEntry = {
      id: `aud-${Date.now()}`,
      entityType: 'approval',
      entityId: approvalId,
      action: 'approved',
      performedBy: currentUserId,
      performedByName: currentUser?.name || 'Unknown',
      performedAt: now,
      details: {
        decision: 'approve',
        comments: eSignData.comments,
        attestation: eSignData.attestation,
      },
      signature: eSignData.typedName,
    };
    
    // Update approval
    const updatedApproval: ApprovalRequest = {
      ...approval,
      status: 'approved',
      updatedAt: now,
      approvedByUserId: currentUserId,
      approvedByName: currentUser?.name || 'Unknown',
      approvedAt: now,
      comments: eSignData.comments,
      auditTrail: [...approval.auditTrail, auditEntry],
    };
    
    updateApprovalInStore(updatedApproval);
    
    return { success: true, data: updatedApproval };
  },

  // POST /api/approvals/:id/reject
  async reject(
    approvalId: string,
    eSignData: ESignFormData,
    currentUserId: string = CURRENT_USER_ID
  ): Promise<ApprovalServiceResponse<ApprovalRequest>> {
    await delay(500);
    
    const approval = getApprovalStore().find(a => a.id === approvalId);
    
    if (!approval) {
      return { success: false, error: 'Approval request not found' };
    }
    
    if (approval.status !== 'pending') {
      return { success: false, error: 'This request has already been processed' };
    }
    
    // Check SoD (same user can't reject their own either)
    const sodCheck = this.checkSoD(approval, currentUserId);
    if (!sodCheck.allowed) {
      return { success: false, error: sodCheck.reason };
    }
    
    const currentUser = Object.values(mockUsers).find(u => u.id === currentUserId);
    const now = new Date();
    
    // Create audit entry
    const auditEntry: AuditTrailEntry = {
      id: `aud-${Date.now()}`,
      entityType: 'approval',
      entityId: approvalId,
      action: 'rejected',
      performedBy: currentUserId,
      performedByName: currentUser?.name || 'Unknown',
      performedAt: now,
      details: {
        decision: 'reject',
        comments: eSignData.comments,
        attestation: eSignData.attestation,
      },
      signature: eSignData.typedName,
    };
    
    // Update approval
    const updatedApproval: ApprovalRequest = {
      ...approval,
      status: 'rejected',
      updatedAt: now,
      rejectedByUserId: currentUserId,
      rejectedByName: currentUser?.name || 'Unknown',
      rejectedAt: now,
      comments: eSignData.comments,
      auditTrail: [...approval.auditTrail, auditEntry],
    };
    
    updateApprovalInStore(updatedApproval);
    
    return { success: true, data: updatedApproval };
  },

  // Get counts for dashboard
  async getCounts(): Promise<{ pending: number; approved: number; rejected: number }> {
    await delay(100);
    const store = getApprovalStore();
    
    return {
      pending: store.filter(a => a.status === 'pending').length,
      approved: store.filter(a => a.status === 'approved').length,
      rejected: store.filter(a => a.status === 'rejected').length,
    };
  },

  // Get current user ID (for SoD checks)
  getCurrentUserId(): string {
    return CURRENT_USER_ID;
  },
};
