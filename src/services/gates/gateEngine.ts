/**
 * GateEngine - Centralized hard-gate logic for the MES system
 * 
 * This engine evaluates all gate conditions and returns:
 * - List of active gates (blocking conditions)
 * - Map of blocked actions with their blocking gates
 * - Helper functions to check if actions are allowed
 */

import {
  Gate,
  GateId,
  BlockedAction,
  GateCheckResult,
  GateEvaluationInput,
  CalibrationRecord,
  CleanlinessCheck,
  SerialScanRecord,
  TestVerdictRecord,
  FinalQcSignoff,
  ApprovalRecord,
  StepCompletionRecord,
} from '@/types/gates';

import {
  mockCalibrationRecords,
  mockCleanlinessChecks,
  mockSerialScans,
  mockTestVerdicts,
  mockFinalQcSignoffs,
  mockStepCompletions,
  mockRequiredSerialCounts,
} from '@/mocks/gateEntities';

// Gate definitions with their blocked actions
const GATE_DEFINITIONS: Record<GateId, Omit<Gate, 'isActive' | 'details'>> = {
  calibration_expired: {
    id: 'calibration_expired',
    name: 'Calibration Expired',
    description: 'Equipment calibration has expired. Testing cannot proceed.',
    severity: 'error',
    blockedActions: ['start_test', 'complete_step'],
  },
  cleanliness_out_of_spec: {
    id: 'cleanliness_out_of_spec',
    name: 'Cleanliness Out of Spec',
    description: 'Cleanliness check failed. Cannot proceed to next step.',
    severity: 'error',
    blockedActions: ['proceed_next_step', 'complete_step', 'start_assembly'],
  },
  serial_scans_missing: {
    id: 'serial_scans_missing',
    name: 'Serial Scans Missing',
    description: 'Required serial number scans are missing.',
    severity: 'error',
    blockedActions: ['complete_step', 'complete_packing', 'handover'],
  },
  serial_scans_duplicate: {
    id: 'serial_scans_duplicate',
    name: 'Duplicate Serial Detected',
    description: 'Duplicate serial number detected. Resolve before proceeding.',
    severity: 'error',
    blockedActions: ['complete_step', 'complete_packing', 'handover'],
  },
  test_verdict_pending: {
    id: 'test_verdict_pending',
    name: 'Test Verdict Pending',
    description: 'Test has not been completed.',
    severity: 'warning',
    blockedActions: ['print_label', 'complete_packing', 'handover'],
  },
  test_verdict_fail: {
    id: 'test_verdict_fail',
    name: 'Test Failed',
    description: 'Test verdict is FAIL. Label printing blocked.',
    severity: 'error',
    blockedActions: ['print_label', 'complete_packing', 'handover'],
  },
  final_qc_not_signed: {
    id: 'final_qc_not_signed',
    name: 'Final QC Not Signed',
    description: 'Final QC e-signature is required before proceeding.',
    severity: 'error',
    blockedActions: ['print_label', 'complete_packing', 'handover'],
  },
  sod_violation: {
    id: 'sod_violation',
    name: 'Separation of Duties Violation',
    description: 'You cannot approve a request you created.',
    severity: 'error',
    blockedActions: ['approve_own_request'],
  },
  approval_pending: {
    id: 'approval_pending',
    name: 'Approval Pending',
    description: 'Required approvals are pending.',
    severity: 'warning',
    blockedActions: ['proceed_next_step', 'complete_step'],
  },
  previous_step_incomplete: {
    id: 'previous_step_incomplete',
    name: 'Previous Step Incomplete',
    description: 'Complete the previous step before proceeding.',
    severity: 'error',
    blockedActions: ['proceed_next_step', 'start_test', 'start_assembly', 'start_kitting'],
  },
  required_documents_missing: {
    id: 'required_documents_missing',
    name: 'Required Documents Missing',
    description: 'Required documents must be completed before handover.',
    severity: 'warning',
    blockedActions: ['handover', 'complete_packing'],
  },
};

// Individual gate check functions
function checkCalibrationGate(records: CalibrationRecord[]): Gate | null {
  const expiredRecords = records.filter((r) => r.status === 'expired');
  if (expiredRecords.length > 0) {
    return {
      ...GATE_DEFINITIONS.calibration_expired,
      isActive: true,
      details: `Expired: ${expiredRecords.map((r) => r.equipmentName).join(', ')}`,
    };
  }
  return null;
}

function checkCleanlinessGate(check: CleanlinessCheck | undefined): Gate | null {
  if (!check) return null;
  if (check.status === 'fail') {
    return {
      ...GATE_DEFINITIONS.cleanliness_out_of_spec,
      isActive: true,
      details: `Particle count ${check.particleCount} exceeds max ${check.maxAllowed}`,
    };
  }
  return null;
}

function checkSerialScansMissing(
  scans: SerialScanRecord[],
  requiredCount: number
): Gate | null {
  const validScans = scans.filter((s) => s.isValid && !s.isDuplicate);
  if (validScans.length < requiredCount) {
    return {
      ...GATE_DEFINITIONS.serial_scans_missing,
      isActive: true,
      details: `${validScans.length}/${requiredCount} serials scanned`,
    };
  }
  return null;
}

function checkSerialScansDuplicate(scans: SerialScanRecord[]): Gate | null {
  const duplicates = scans.filter((s) => s.isDuplicate);
  if (duplicates.length > 0) {
    return {
      ...GATE_DEFINITIONS.serial_scans_duplicate,
      isActive: true,
      details: `Duplicate serials: ${duplicates.map((d) => d.serialNumber).join(', ')}`,
    };
  }
  return null;
}

function checkTestVerdictGate(verdict: TestVerdictRecord | undefined): Gate | null {
  if (!verdict || verdict.verdict === 'pending') {
    return {
      ...GATE_DEFINITIONS.test_verdict_pending,
      isActive: true,
      details: 'Test has not been completed',
    };
  }
  if (verdict.verdict === 'fail') {
    return {
      ...GATE_DEFINITIONS.test_verdict_fail,
      isActive: true,
      details: 'Test verdict is FAIL',
    };
  }
  return null;
}

function checkFinalQcGate(signoff: FinalQcSignoff | undefined): Gate | null {
  if (!signoff || !signoff.isSigned) {
    return {
      ...GATE_DEFINITIONS.final_qc_not_signed,
      isActive: true,
      details: 'Final QC e-signature required',
    };
  }
  return null;
}

function checkSodViolation(
  approvals: ApprovalRecord[],
  currentUserId: string
): Gate | null {
  const ownPendingApprovals = approvals.filter(
    (a) => a.requestedByUserId === currentUserId && a.status === 'pending'
  );
  if (ownPendingApprovals.length > 0) {
    return {
      ...GATE_DEFINITIONS.sod_violation,
      isActive: true,
      details: 'Cannot approve your own requests',
    };
  }
  return null;
}

function checkApprovalsPending(approvals: ApprovalRecord[]): Gate | null {
  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  if (pendingApprovals.length > 0) {
    return {
      ...GATE_DEFINITIONS.approval_pending,
      isActive: true,
      details: `${pendingApprovals.length} approval(s) pending`,
    };
  }
  return null;
}

function checkPreviousStepComplete(
  steps: StepCompletionRecord[],
  currentStep: string
): Gate | null {
  const stepOrder = ['kitting', 'assembly', 'testing', 'final_qc', 'packing'];
  const currentIndex = stepOrder.indexOf(currentStep);
  
  if (currentIndex > 0) {
    const previousStep = stepOrder[currentIndex - 1];
    const previousStepRecord = steps.find((s) => s.stepId === previousStep);
    
    if (!previousStepRecord?.isComplete) {
      return {
        ...GATE_DEFINITIONS.previous_step_incomplete,
        isActive: true,
        details: `Complete "${previousStepRecord?.stepName || previousStep}" first`,
      };
    }
  }
  return null;
}

function checkRequiredDocuments(
  documents: { id: string; name: string; isComplete: boolean }[]
): Gate | null {
  const missing = documents.filter((d) => !d.isComplete);
  if (missing.length > 0) {
    return {
      ...GATE_DEFINITIONS.required_documents_missing,
      isActive: true,
      details: `Missing: ${missing.map((d) => d.name).join(', ')}`,
    };
  }
  return null;
}

/**
 * Main gate evaluation function
 */
export function evaluateGates(input: GateEvaluationInput): GateCheckResult {
  const activeGates: Gate[] = [];

  // Check calibration gate
  if (input.calibrationRecords && input.calibrationRecords.length > 0) {
    const gate = checkCalibrationGate(input.calibrationRecords);
    if (gate) activeGates.push(gate);
  }

  // Check cleanliness gate
  if (input.cleanlinessCheck) {
    const gate = checkCleanlinessGate(input.cleanlinessCheck);
    if (gate) activeGates.push(gate);
  }

  // Check serial scans
  if (input.serialScans && input.requiredSerialCount) {
    const missingGate = checkSerialScansMissing(input.serialScans, input.requiredSerialCount);
    if (missingGate) activeGates.push(missingGate);

    const duplicateGate = checkSerialScansDuplicate(input.serialScans);
    if (duplicateGate) activeGates.push(duplicateGate);
  }

  // Check test verdict
  if (input.testVerdict !== undefined) {
    const gate = checkTestVerdictGate(input.testVerdict);
    if (gate) activeGates.push(gate);
  }

  // Check Final QC signoff
  if (input.finalQcSignoff !== undefined) {
    const gate = checkFinalQcGate(input.finalQcSignoff);
    if (gate) activeGates.push(gate);
  }

  // Check SoD violation
  if (input.pendingApprovals && input.pendingApprovals.length > 0) {
    const sodGate = checkSodViolation(input.pendingApprovals, input.currentUserId);
    if (sodGate) activeGates.push(sodGate);

    // Also check for pending approvals blocking progress
    // (optional - only if needed for workflow)
  }

  // Check previous step completion
  if (input.stepCompletions && input.currentStep) {
    const gate = checkPreviousStepComplete(input.stepCompletions, input.currentStep);
    if (gate) activeGates.push(gate);
  }

  // Check required documents
  if (input.requiredDocuments) {
    const gate = checkRequiredDocuments(input.requiredDocuments);
    if (gate) activeGates.push(gate);
  }

  // Build blocked actions map
  const blockedActions = new Map<BlockedAction, Gate[]>();
  
  for (const gate of activeGates) {
    for (const action of gate.blockedActions) {
      const existing = blockedActions.get(action) || [];
      existing.push(gate);
      blockedActions.set(action, existing);
    }
  }

  // Helper functions
  const canPerformAction = (action: BlockedAction): boolean => {
    return !blockedActions.has(action);
  };

  const getBlockingGates = (action: BlockedAction): Gate[] => {
    return blockedActions.get(action) || [];
  };

  return {
    allPassed: activeGates.length === 0,
    activeGates,
    blockedActions,
    canPerformAction,
    getBlockingGates,
  };
}

/**
 * Convenience function to get gate status for a work order
 * Uses mock data - in real app, would fetch from services
 */
export async function getWorkOrderGateStatus(
  workOrderId: string,
  currentUserId: string,
  currentStep?: string
): Promise<GateCheckResult> {
  // Simulate async fetch
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Gather mock data for this work order
  const input: GateEvaluationInput = {
    workOrderId,
    currentUserId,
    currentStep,
    calibrationRecords: mockCalibrationRecords,
    cleanlinessCheck: mockCleanlinessChecks[workOrderId],
    serialScans: mockSerialScans[workOrderId] || [],
    requiredSerialCount: mockRequiredSerialCounts[workOrderId] || 0,
    testVerdict: mockTestVerdicts[workOrderId],
    finalQcSignoff: mockFinalQcSignoffs[workOrderId],
    stepCompletions: mockStepCompletions[workOrderId] || [],
  };

  return evaluateGates(input);
}

/**
 * Check if print label is allowed (convenience function)
 */
export function canPrintLabel(
  testVerdict: TestVerdictRecord | undefined,
  finalQcSignoff: FinalQcSignoff | undefined
): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (!testVerdict || testVerdict.verdict === 'pending') {
    reasons.push('Test verdict pending');
  } else if (testVerdict.verdict === 'fail') {
    reasons.push('Test verdict is FAIL');
  }

  if (!finalQcSignoff || !finalQcSignoff.isSigned) {
    reasons.push('Final QC e-sign not completed');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
  };
}

/**
 * Check SoD violation for approvals (convenience function)
 */
export function checkSodForApproval(
  requestedByUserId: string,
  currentUserId: string,
  preventSelfApproval: boolean
): { allowed: boolean; reason?: string } {
  if (preventSelfApproval && requestedByUserId === currentUserId) {
    return {
      allowed: false,
      reason: 'Separation of Duties: You cannot approve a request you created.',
    };
  }
  return { allowed: true };
}
