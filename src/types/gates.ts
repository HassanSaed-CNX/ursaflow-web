// Gate System Types

export type GateId =
  | 'calibration_expired'
  | 'cleanliness_out_of_spec'
  | 'serial_scans_missing'
  | 'serial_scans_duplicate'
  | 'test_verdict_pending'
  | 'test_verdict_fail'
  | 'final_qc_not_signed'
  | 'sod_violation'
  | 'approval_pending'
  | 'previous_step_incomplete'
  | 'required_documents_missing';

export type BlockedAction =
  | 'start_test'
  | 'complete_step'
  | 'print_label'
  | 'start_kitting'
  | 'start_assembly'
  | 'approve_own_request'
  | 'complete_packing'
  | 'handover'
  | 'proceed_next_step';

export interface Gate {
  id: GateId;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  blockedActions: BlockedAction[];
  isActive: boolean;
  details?: string;
}

export interface GateCheckResult {
  allPassed: boolean;
  activeGates: Gate[];
  blockedActions: Map<BlockedAction, Gate[]>;
  canPerformAction: (action: BlockedAction) => boolean;
  getBlockingGates: (action: BlockedAction) => Gate[];
}

// Input entities for gate evaluation
export interface CalibrationRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  calibrationDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface CleanlinessCheck {
  id: string;
  workOrderId: string;
  checkDate: string;
  particleCount: number;
  maxAllowed: number;
  status: 'pass' | 'fail' | 'pending';
  checkedBy?: string;
}

export interface SerialScanRecord {
  id: string;
  workOrderId: string;
  serialNumber: string;
  scannedAt: string;
  scannedBy: string;
  isValid: boolean;
  isDuplicate: boolean;
}

export interface TestVerdictRecord {
  workOrderId: string;
  verdict: 'pending' | 'pass' | 'fail';
  completedAt?: string;
  completedBy?: string;
}

export interface FinalQcSignoff {
  workOrderId: string;
  isSigned: boolean;
  signedAt?: string;
  signedBy?: string;
  signedByName?: string;
}

export interface ApprovalRecord {
  id: string;
  workOrderId?: string;
  requestedByUserId: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface StepCompletionRecord {
  stepId: string;
  stepName: string;
  isComplete: boolean;
  completedAt?: string;
}

// Combined input for gate evaluation
export interface GateEvaluationInput {
  workOrderId: string;
  currentUserId: string;
  currentStep?: string;
  calibrationRecords?: CalibrationRecord[];
  cleanlinessCheck?: CleanlinessCheck;
  serialScans?: SerialScanRecord[];
  requiredSerialCount?: number;
  testVerdict?: TestVerdictRecord;
  finalQcSignoff?: FinalQcSignoff;
  pendingApprovals?: ApprovalRecord[];
  stepCompletions?: StepCompletionRecord[];
  requiredDocuments?: { id: string; name: string; isComplete: boolean }[];
}
