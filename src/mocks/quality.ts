import { Inspection, NCR, CAPA, SpcChart, InspectionCheckpoint } from '@/types/quality';
import { AuditTrailEntry } from '@/types/approval';
import { mockUsers } from './users';

// Helper functions
const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const hoursAgo = (hours: number) => {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
};

// Sample checkpoints
const createCheckpoints = (type: 'incoming' | 'in_process' | 'final'): InspectionCheckpoint[] => {
  if (type === 'incoming') {
    return [
      { id: 'chk-1', name: 'Visual Inspection', specification: 'No visible damage', measured: 'Pass', result: 'pass' },
      { id: 'chk-2', name: 'Dimension Check', specification: '100mm ± 0.5mm', measured: '100.2mm', result: 'pass' },
      { id: 'chk-3', name: 'Material Certificate', specification: 'Valid cert required', measured: 'Verified', result: 'pass' },
      { id: 'chk-4', name: 'Quantity Verification', specification: 'Match PO qty', measured: 'Match', result: 'pass' },
    ];
  } else if (type === 'in_process') {
    return [
      { id: 'chk-1', name: 'Assembly Check', specification: 'Per drawing REV-C', result: 'pass' },
      { id: 'chk-2', name: 'Torque Verification', specification: '25 Nm ± 2 Nm', measured: '24.5 Nm', result: 'pass' },
      { id: 'chk-3', name: 'Leak Test', specification: 'No leaks at 150 PSI', measured: 'Pass', result: 'pass' },
      { id: 'chk-4', name: 'Functional Test', specification: 'Operates smoothly', result: 'pass' },
    ];
  } else {
    return [
      { id: 'chk-1', name: 'Final Visual', specification: 'Clean, no defects', result: 'pass' },
      { id: 'chk-2', name: 'Full Function Test', specification: 'All specs met', result: 'pass' },
      { id: 'chk-3', name: 'Documentation Check', specification: 'Complete packet', result: 'pass' },
      { id: 'chk-4', name: 'Calibration Verify', specification: 'All gauges current', result: 'pass' },
      { id: 'chk-5', name: 'Label Verification', specification: 'MPN # correct', result: 'pass' },
    ];
  }
};

// Mock Inspections
export const mockInspections: Inspection[] = [
  // Incoming Inspections
  {
    id: 'insp-001',
    type: 'incoming',
    workOrderId: 'wo-001',
    workOrderNumber: 'WO-2024-001',
    itemNumber: 'CYL-ROD-100',
    itemDescription: 'Cylinder Rod 100mm Chrome',
    quantity: 10,
    lotNumber: 'LOT-2024-A001',
    status: 'pending',
    checkpoints: createCheckpoints('incoming').map(c => ({ ...c, result: undefined, measured: undefined })),
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    signedOff: false,
  },
  {
    id: 'insp-002',
    type: 'incoming',
    workOrderId: 'wo-002',
    workOrderNumber: 'WO-2024-002',
    itemNumber: 'SEAL-KIT-50',
    itemDescription: 'Seal Kit 50mm Bore',
    quantity: 25,
    lotNumber: 'LOT-2024-A002',
    status: 'pass',
    checkpoints: createCheckpoints('incoming'),
    inspectorId: mockUsers.qa_tech.id,
    inspectorName: mockUsers.qa_tech.name,
    startedAt: hoursAgo(4),
    completedAt: hoursAgo(3),
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(3),
    signedOff: true,
    signedOffBy: mockUsers.qa_tech.name,
    signedOffAt: hoursAgo(3),
    signature: 'Mike Quality',
  },
  {
    id: 'insp-003',
    type: 'incoming',
    workOrderId: 'wo-003',
    workOrderNumber: 'WO-2024-003',
    itemNumber: 'VALVE-BODY-25',
    itemDescription: 'Valve Body 25mm',
    quantity: 5,
    status: 'fail',
    checkpoints: [
      { id: 'chk-1', name: 'Visual Inspection', specification: 'No visible damage', measured: 'Scratch found', result: 'fail' },
      ...createCheckpoints('incoming').slice(1),
    ],
    inspectorId: mockUsers.qa_tech.id,
    inspectorName: mockUsers.qa_tech.name,
    ncrId: 'ncr-001',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    signedOff: false,
  },
  // In-Process Inspections
  {
    id: 'insp-004',
    type: 'in_process',
    workOrderId: 'wo-001',
    workOrderNumber: 'WO-2024-001',
    itemNumber: 'CYL-ASSY-100',
    itemDescription: 'Cylinder Assembly 100mm',
    quantity: 1,
    status: 'in_progress',
    checkpoints: createCheckpoints('in_process').map((c, i) => 
      i < 2 ? c : { ...c, result: undefined, measured: undefined }
    ),
    inspectorId: mockUsers.qa_tech.id,
    inspectorName: mockUsers.qa_tech.name,
    startedAt: hoursAgo(1),
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(1),
    signedOff: false,
  },
  {
    id: 'insp-005',
    type: 'in_process',
    workOrderId: 'wo-004',
    workOrderNumber: 'WO-2024-004',
    itemNumber: 'PUMP-ASSY-75',
    itemDescription: 'Pump Assembly 75 GPM',
    quantity: 1,
    status: 'pass',
    checkpoints: createCheckpoints('in_process'),
    inspectorId: mockUsers.qa_tech.id,
    inspectorName: mockUsers.qa_tech.name,
    completedAt: daysAgo(1),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    signedOff: true,
    signedOffBy: mockUsers.qa_tech.name,
    signedOffAt: daysAgo(1),
    signature: 'Mike Quality',
  },
  // Final QC Inspections
  {
    id: 'insp-006',
    type: 'final',
    workOrderId: 'wo-002',
    workOrderNumber: 'WO-2024-002',
    itemNumber: 'HPU-500',
    itemDescription: 'Hydraulic Power Unit 500 PSI',
    quantity: 1,
    status: 'pending',
    checkpoints: createCheckpoints('final').map(c => ({ ...c, result: undefined })),
    createdAt: hoursAgo(1),
    updatedAt: hoursAgo(1),
    signedOff: false,
  },
  {
    id: 'insp-007',
    type: 'final',
    workOrderId: 'wo-005',
    workOrderNumber: 'WO-2024-005',
    itemNumber: 'MOTOR-ASSY-10HP',
    itemDescription: 'Motor Assembly 10HP',
    quantity: 1,
    status: 'hold',
    checkpoints: createCheckpoints('final').map((c, i) => 
      i === 2 ? { ...c, result: 'fail' as const, notes: 'Missing test report' } : c
    ),
    inspectorId: mockUsers.qa_tech.id,
    inspectorName: mockUsers.qa_tech.name,
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(6),
    signedOff: false,
  },
  {
    id: 'insp-008',
    type: 'final',
    workOrderId: 'wo-006',
    workOrderNumber: 'WO-2024-006',
    itemNumber: 'MANIFOLD-8PORT',
    itemDescription: 'Manifold 8-Port Distribution',
    quantity: 1,
    status: 'pass',
    checkpoints: createCheckpoints('final'),
    inspectorId: mockUsers.qa_tech.id,
    inspectorName: mockUsers.qa_tech.name,
    completedAt: daysAgo(2),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
    signedOff: true,
    signedOffBy: mockUsers.supervisor.name,
    signedOffAt: daysAgo(2),
    signature: 'David Supervisor',
  },
];

// Mock NCRs
export const mockNCRs: NCR[] = [
  {
    id: 'ncr-001',
    ncrNumber: 'NCR-2024-001',
    title: 'Surface Damage on Valve Body',
    description: 'Valve body received with visible scratch on sealing surface. Discovered during incoming inspection.',
    severity: 'major',
    status: 'disposition',
    workOrderId: 'wo-003',
    workOrderNumber: 'WO-2024-003',
    itemNumber: 'VALVE-BODY-25',
    itemDescription: 'Valve Body 25mm',
    quantity: 2,
    defectType: 'Surface Damage',
    raisedByUserId: mockUsers.qa_tech.id,
    raisedByName: mockUsers.qa_tech.name,
    raisedAt: daysAgo(1),
    assignedToUserId: mockUsers.supervisor.id,
    assignedToName: mockUsers.supervisor.name,
    auditTrail: [
      {
        id: 'aud-ncr-001a',
        entityType: 'approval',
        entityId: 'ncr-001',
        action: 'raised',
        performedBy: mockUsers.qa_tech.id,
        performedByName: mockUsers.qa_tech.name,
        performedAt: daysAgo(1),
      },
    ],
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(12),
  },
  {
    id: 'ncr-002',
    ncrNumber: 'NCR-2024-002',
    title: 'Dimension Out of Tolerance - Cylinder Bore',
    description: 'Cylinder bore measured 0.003" undersized. Cannot achieve required seal.',
    severity: 'critical',
    status: 'rework',
    disposition: 'rework',
    workOrderId: 'wo-001',
    workOrderNumber: 'WO-2024-001',
    itemNumber: 'CYL-BODY-100',
    itemDescription: 'Cylinder Body 100mm Bore',
    quantity: 1,
    defectType: 'Dimensional',
    rootCause: 'Tool wear not detected during machining process.',
    correctiveAction: 'Hone bore to specification. Implement tool wear monitoring.',
    raisedByUserId: mockUsers.operator.id,
    raisedByName: mockUsers.operator.name,
    raisedAt: daysAgo(3),
    assignedToUserId: mockUsers.operator.id,
    assignedToName: mockUsers.operator.name,
    auditTrail: [
      {
        id: 'aud-ncr-002a',
        entityType: 'approval',
        entityId: 'ncr-002',
        action: 'raised',
        performedBy: mockUsers.operator.id,
        performedByName: mockUsers.operator.name,
        performedAt: daysAgo(3),
      },
      {
        id: 'aud-ncr-002b',
        entityType: 'approval',
        entityId: 'ncr-002',
        action: 'disposition_set',
        performedBy: mockUsers.qa_tech.id,
        performedByName: mockUsers.qa_tech.name,
        performedAt: daysAgo(2),
        details: { disposition: 'rework' },
      },
    ],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: 'ncr-003',
    ncrNumber: 'NCR-2024-003',
    title: 'Missing O-Ring in Seal Kit',
    description: 'Seal kit missing 1 of 4 required O-rings. Vendor packaging error.',
    severity: 'minor',
    status: 'closed',
    disposition: 'return_to_vendor',
    workOrderId: 'wo-002',
    workOrderNumber: 'WO-2024-002',
    itemNumber: 'SEAL-KIT-50',
    itemDescription: 'Seal Kit 50mm Bore',
    quantity: 1,
    defectType: 'Missing Component',
    rootCause: 'Vendor packaging QC failure.',
    correctiveAction: 'Return kit to vendor for replacement. Issue vendor quality notice.',
    raisedByUserId: mockUsers.operator.id,
    raisedByName: mockUsers.operator.name,
    raisedAt: daysAgo(7),
    closedByUserId: mockUsers.qa_tech.id,
    closedByName: mockUsers.qa_tech.name,
    closedAt: daysAgo(5),
    auditTrail: [
      {
        id: 'aud-ncr-003a',
        entityType: 'approval',
        entityId: 'ncr-003',
        action: 'raised',
        performedBy: mockUsers.operator.id,
        performedByName: mockUsers.operator.name,
        performedAt: daysAgo(7),
      },
      {
        id: 'aud-ncr-003b',
        entityType: 'approval',
        entityId: 'ncr-003',
        action: 'closed',
        performedBy: mockUsers.qa_tech.id,
        performedByName: mockUsers.qa_tech.name,
        performedAt: daysAgo(5),
        signature: 'Mike Quality',
      },
    ],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(5),
  },
  {
    id: 'ncr-004',
    ncrNumber: 'NCR-2024-004',
    title: 'Motor Winding Resistance Out of Spec',
    description: 'Motor winding resistance measured 15% above specification during test bench.',
    severity: 'critical',
    status: 'retest',
    disposition: 'rework',
    workOrderId: 'wo-003',
    workOrderNumber: 'WO-2024-003',
    itemNumber: 'MOTOR-10HP',
    itemDescription: 'Electric Motor 10HP',
    quantity: 1,
    defectType: 'Electrical',
    rootCause: 'Suspected moisture ingress during storage.',
    correctiveAction: 'Dry out motor windings and retest. Review storage conditions.',
    raisedByUserId: mockUsers.test_bench_operator.id,
    raisedByName: mockUsers.test_bench_operator.name,
    raisedAt: daysAgo(2),
    assignedToUserId: mockUsers.test_bench_operator.id,
    assignedToName: mockUsers.test_bench_operator.name,
    auditTrail: [
      {
        id: 'aud-ncr-004a',
        entityType: 'approval',
        entityId: 'ncr-004',
        action: 'raised',
        performedBy: mockUsers.test_bench_operator.id,
        performedByName: mockUsers.test_bench_operator.name,
        performedAt: daysAgo(2),
      },
    ],
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(6),
  },
  {
    id: 'ncr-005',
    ncrNumber: 'NCR-2024-005',
    title: 'Cosmetic Scratch on Housing',
    description: 'Minor cosmetic scratch on pump housing exterior. Does not affect function.',
    severity: 'minor',
    status: 'raised',
    itemNumber: 'PUMP-HSG-75',
    itemDescription: 'Pump Housing 75 GPM',
    quantity: 1,
    defectType: 'Cosmetic',
    raisedByUserId: mockUsers.qa_tech.id,
    raisedByName: mockUsers.qa_tech.name,
    raisedAt: hoursAgo(4),
    auditTrail: [
      {
        id: 'aud-ncr-005a',
        entityType: 'approval',
        entityId: 'ncr-005',
        action: 'raised',
        performedBy: mockUsers.qa_tech.id,
        performedByName: mockUsers.qa_tech.name,
        performedAt: hoursAgo(4),
      },
    ],
    createdAt: hoursAgo(4),
    updatedAt: hoursAgo(4),
  },
];

// Mock CAPAs
export const mockCAPAs: CAPA[] = [
  {
    id: 'capa-001',
    capaNumber: 'CAPA-2024-001',
    type: 'corrective',
    title: 'Implement Tool Wear Monitoring System',
    description: 'Install automated tool wear monitoring to prevent dimensional non-conformances.',
    status: 'in_progress',
    ncrId: 'ncr-002',
    rootCauseAnalysis: 'Tool wear was not detected during machining, leading to undersized bore.',
    proposedActions: 'Install vibration sensors and implement automated tool change alerts.',
    ownerId: mockUsers.supervisor.id,
    ownerName: mockUsers.supervisor.name,
    dueDate: daysAgo(-14), // 14 days in future
    auditTrail: [],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
];

// Mock SPC Data
export const mockSpcCharts: SpcChart[] = [
  {
    id: 'spc-001',
    name: 'Cylinder Bore Diameter',
    parameter: 'Bore Diameter',
    unit: 'mm',
    ucl: 100.5,
    lcl: 99.5,
    target: 100.0,
    data: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (20 - i) * 3600000),
      value: 100 + (Math.random() - 0.5) * 0.8,
      inSpec: true,
    })).map(d => ({
      ...d,
      inSpec: d.value >= 99.5 && d.value <= 100.5,
    })),
  },
  {
    id: 'spc-002',
    name: 'Seal Compression Force',
    parameter: 'Force',
    unit: 'N',
    ucl: 55,
    lcl: 45,
    target: 50,
    data: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (20 - i) * 3600000),
      value: 50 + (Math.random() - 0.5) * 8,
      inSpec: true,
    })).map(d => ({
      ...d,
      inSpec: d.value >= 45 && d.value <= 55,
    })),
  },
];

// In-memory stores for mutations
let inspectionStore = [...mockInspections];
let ncrStore = [...mockNCRs];

export function getInspectionStore(): Inspection[] {
  return inspectionStore;
}

export function updateInspectionInStore(updated: Inspection): void {
  inspectionStore = inspectionStore.map(i => i.id === updated.id ? updated : i);
}

export function getNcrStore(): NCR[] {
  return ncrStore;
}

export function updateNcrInStore(updated: NCR): void {
  ncrStore = ncrStore.map(n => n.id === updated.id ? updated : n);
}
