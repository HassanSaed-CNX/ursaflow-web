// Policy configuration for business rules
// Separation of Duties (SoD) and approval workflow policies

export interface ApprovalPolicy {
  // Prevent users from approving their own requests
  preventSelfApproval: boolean;
  // Require e-signature for approvals
  requireESign: boolean;
  // Minimum role level required to approve (future use)
  minApprovalRole?: string;
}

export interface PolicyConfig {
  approval: ApprovalPolicy;
}

export const policyConfig: PolicyConfig = {
  approval: {
    preventSelfApproval: true,
    requireESign: true,
  },
};

// Helper functions
export function canUserApprove(requestedByUserId: string, currentUserId: string): boolean {
  if (policyConfig.approval.preventSelfApproval) {
    return requestedByUserId !== currentUserId;
  }
  return true;
}

export function isESignRequired(): boolean {
  return policyConfig.approval.requireESign;
}
