import {
  CalibrationRecord,
  CleanlinessCheck,
  SerialScanRecord,
  TestVerdictRecord,
  FinalQcSignoff,
  StepCompletionRecord,
} from '@/types/gates';

// Calibration Records
export const mockCalibrationRecords: CalibrationRecord[] = [
  {
    id: 'cal-001',
    equipmentId: 'eq-001',
    equipmentName: 'Torque Wrench A1',
    calibrationDate: '2024-01-01',
    expiryDate: '2025-01-01',
    status: 'valid',
  },
  {
    id: 'cal-002',
    equipmentId: 'eq-002',
    equipmentName: 'Digital Multimeter B2',
    calibrationDate: '2023-06-15',
    expiryDate: '2024-01-10', // Expired
    status: 'expired',
  },
  {
    id: 'cal-003',
    equipmentId: 'eq-003',
    equipmentName: 'Pressure Gauge C3',
    calibrationDate: '2024-01-05',
    expiryDate: '2024-01-25', // Expiring soon
    status: 'expiring_soon',
  },
];

// Cleanliness Checks by Work Order
export const mockCleanlinessChecks: Record<string, CleanlinessCheck> = {
  'WO-2024-001': {
    id: 'cc-001',
    workOrderId: 'WO-2024-001',
    checkDate: '2024-01-15',
    particleCount: 1500,
    maxAllowed: 1000,
    status: 'fail', // Out of spec
    checkedBy: 'user-003',
  },
  'WO-2024-002': {
    id: 'cc-002',
    workOrderId: 'WO-2024-002',
    checkDate: '2024-01-14',
    particleCount: 450,
    maxAllowed: 1000,
    status: 'pass',
    checkedBy: 'user-003',
  },
  'WO-2024-003': {
    id: 'cc-003',
    workOrderId: 'WO-2024-003',
    checkDate: '2024-01-13',
    particleCount: 0,
    maxAllowed: 1000,
    status: 'pending',
  },
};

// Serial Scans by Work Order
export const mockSerialScans: Record<string, SerialScanRecord[]> = {
  'WO-2024-001': [
    {
      id: 'ss-001',
      workOrderId: 'WO-2024-001',
      serialNumber: 'SN-001',
      scannedAt: '2024-01-15T10:00:00Z',
      scannedBy: 'user-001',
      isValid: true,
      isDuplicate: false,
    },
    // Missing required scans
  ],
  'WO-2024-002': [
    {
      id: 'ss-002',
      workOrderId: 'WO-2024-002',
      serialNumber: 'SN-002',
      scannedAt: '2024-01-14T09:00:00Z',
      scannedBy: 'user-001',
      isValid: true,
      isDuplicate: false,
    },
    {
      id: 'ss-003',
      workOrderId: 'WO-2024-002',
      serialNumber: 'SN-003',
      scannedAt: '2024-01-14T09:05:00Z',
      scannedBy: 'user-001',
      isValid: true,
      isDuplicate: false,
    },
  ],
  'WO-2024-004': [
    {
      id: 'ss-004',
      workOrderId: 'WO-2024-004',
      serialNumber: 'SN-004',
      scannedAt: '2024-01-13T08:00:00Z',
      scannedBy: 'user-001',
      isValid: true,
      isDuplicate: false,
    },
    {
      id: 'ss-005',
      workOrderId: 'WO-2024-004',
      serialNumber: 'SN-004', // Duplicate!
      scannedAt: '2024-01-13T08:05:00Z',
      scannedBy: 'user-002',
      isValid: true,
      isDuplicate: true,
    },
  ],
};

// Test Verdicts by Work Order
export const mockTestVerdicts: Record<string, TestVerdictRecord> = {
  'WO-2024-001': {
    workOrderId: 'WO-2024-001',
    verdict: 'pending',
  },
  'WO-2024-002': {
    workOrderId: 'WO-2024-002',
    verdict: 'pass',
    completedAt: '2024-01-14T14:00:00Z',
    completedBy: 'user-002',
  },
  'WO-2024-003': {
    workOrderId: 'WO-2024-003',
    verdict: 'pass',
    completedAt: '2024-01-13T16:00:00Z',
    completedBy: 'user-002',
  },
  'WO-2024-004': {
    workOrderId: 'WO-2024-004',
    verdict: 'fail',
    completedAt: '2024-01-12T11:00:00Z',
    completedBy: 'user-002',
  },
};

// Final QC Signoffs by Work Order
export const mockFinalQcSignoffs: Record<string, FinalQcSignoff> = {
  'WO-2024-001': {
    workOrderId: 'WO-2024-001',
    isSigned: false,
  },
  'WO-2024-002': {
    workOrderId: 'WO-2024-002',
    isSigned: true,
    signedAt: '2024-01-14T15:00:00Z',
    signedBy: 'user-003',
    signedByName: 'QA Tech',
  },
  'WO-2024-003': {
    workOrderId: 'WO-2024-003',
    isSigned: false,
  },
  'WO-2024-004': {
    workOrderId: 'WO-2024-004',
    isSigned: false,
  },
};

// Step Completions by Work Order
export const mockStepCompletions: Record<string, StepCompletionRecord[]> = {
  'WO-2024-001': [
    { stepId: 'kitting', stepName: 'Kitting', isComplete: true, completedAt: '2024-01-15T08:00:00Z' },
    { stepId: 'assembly', stepName: 'Assembly', isComplete: false },
    { stepId: 'testing', stepName: 'Testing', isComplete: false },
    { stepId: 'final_qc', stepName: 'Final QC', isComplete: false },
    { stepId: 'packing', stepName: 'Packing', isComplete: false },
  ],
  'WO-2024-002': [
    { stepId: 'kitting', stepName: 'Kitting', isComplete: true, completedAt: '2024-01-14T08:00:00Z' },
    { stepId: 'assembly', stepName: 'Assembly', isComplete: true, completedAt: '2024-01-14T10:00:00Z' },
    { stepId: 'testing', stepName: 'Testing', isComplete: true, completedAt: '2024-01-14T14:00:00Z' },
    { stepId: 'final_qc', stepName: 'Final QC', isComplete: true, completedAt: '2024-01-14T15:00:00Z' },
    { stepId: 'packing', stepName: 'Packing', isComplete: false },
  ],
};

// Required serial counts per work order
export const mockRequiredSerialCounts: Record<string, number> = {
  'WO-2024-001': 3,
  'WO-2024-002': 2,
  'WO-2024-003': 1,
  'WO-2024-004': 2,
};
