import { ApprovalRequest, AuditTrailEntry } from '@/types/approval';
import { mockUsers } from './users';

// Current mock user for testing SoD
export const CURRENT_USER_ID = mockUsers.admin.id; // 'user-006'

// Helper to generate dates
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

const hoursFromNow = (hours: number) => {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d;
};

// Seed 10+ approval requests
export const mockApprovalRequests: ApprovalRequest[] = [
  // Pending - requested by current user (SoD test case)
  {
    id: 'apr-001',
    title: 'Quality Hold Release - Cylinder Batch',
    description: 'Request to release quality hold on cylinder batch CYL-2024-001',
    type: 'quality_hold',
    requestedByUserId: CURRENT_USER_ID, // Same as current user - SoD violation
    requestedByName: mockUsers.admin.name,
    roleRequired: 'supervisor',
    status: 'pending',
    createdAt: hoursAgo(4),
    updatedAt: hoursAgo(4),
    relatedWorkOrderId: 'wo-001',
    relatedWorkOrderNumber: 'WO-2024-001',
    reason: 'Initial inspection passed, awaiting final approval for release',
    priority: 'high',
    dueDate: hoursFromNow(8),
    auditTrail: [
      {
        id: 'aud-001',
        entityType: 'approval',
        entityId: 'apr-001',
        action: 'created',
        performedBy: CURRENT_USER_ID,
        performedByName: mockUsers.admin.name,
        performedAt: hoursAgo(4),
        details: { type: 'quality_hold', priority: 'high' },
      },
    ],
  },
  // Pending - requested by another user (can be approved)
  {
    id: 'apr-002',
    title: 'NCR Approval - Motor Assembly Defect',
    description: 'Non-conformance report for motor assembly defect requires disposition',
    type: 'ncr',
    requestedByUserId: mockUsers.qa_tech.id,
    requestedByName: mockUsers.qa_tech.name,
    roleRequired: 'supervisor',
    status: 'pending',
    createdAt: hoursAgo(12),
    updatedAt: hoursAgo(12),
    relatedWorkOrderId: 'wo-003',
    relatedWorkOrderNumber: 'WO-2024-003',
    reason: 'Motor winding resistance out of spec, requires rework decision',
    priority: 'critical',
    dueDate: hoursFromNow(4),
    auditTrail: [
      {
        id: 'aud-002',
        entityType: 'approval',
        entityId: 'apr-002',
        action: 'created',
        performedBy: mockUsers.qa_tech.id,
        performedByName: mockUsers.qa_tech.name,
        performedAt: hoursAgo(12),
      },
    ],
  },
  // Pending - deviation request
  {
    id: 'apr-003',
    title: 'Process Deviation - Pump Test Parameters',
    description: 'Request to use alternate test parameters for pump batch',
    type: 'deviation',
    requestedByUserId: mockUsers.test_bench_operator.id,
    requestedByName: mockUsers.test_bench_operator.name,
    roleRequired: 'qa_tech',
    status: 'pending',
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(6),
    relatedWorkOrderId: 'wo-002',
    relatedWorkOrderNumber: 'WO-2024-002',
    reason: 'Customer specification allows ±5% tolerance vs standard ±2%',
    priority: 'medium',
    dueDate: hoursFromNow(24),
    auditTrail: [
      {
        id: 'aud-003',
        entityType: 'approval',
        entityId: 'apr-003',
        action: 'created',
        performedBy: mockUsers.test_bench_operator.id,
        performedByName: mockUsers.test_bench_operator.name,
        performedAt: hoursAgo(6),
      },
    ],
  },
  // Pending - rework approval (requested by current user - SoD test)
  {
    id: 'apr-004',
    title: 'Rework Approval - Valve Assembly',
    description: 'Authorize rework of valve assembly to correct seal installation',
    type: 'rework',
    requestedByUserId: CURRENT_USER_ID, // SoD violation
    requestedByName: mockUsers.admin.name,
    roleRequired: 'supervisor',
    status: 'pending',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    relatedWorkOrderId: 'wo-004',
    relatedWorkOrderNumber: 'WO-2024-004',
    reason: 'O-ring installed incorrectly, needs disassembly and proper installation',
    priority: 'high',
    dueDate: hoursFromNow(2),
    auditTrail: [
      {
        id: 'aud-004',
        entityType: 'approval',
        entityId: 'apr-004',
        action: 'created',
        performedBy: CURRENT_USER_ID,
        performedByName: mockUsers.admin.name,
        performedAt: daysAgo(1),
      },
    ],
  },
  // Pending - release approval
  {
    id: 'apr-005',
    title: 'Product Release - HPU Final QC',
    description: 'Final QC approval for HPU shipment to customer',
    type: 'release',
    requestedByUserId: mockUsers.qa_tech.id,
    requestedByName: mockUsers.qa_tech.name,
    roleRequired: 'supervisor',
    status: 'pending',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    relatedWorkOrderId: 'wo-006',
    relatedWorkOrderNumber: 'WO-2024-006',
    reason: 'All tests passed, documentation complete, ready for shipment',
    priority: 'high',
    dueDate: hoursFromNow(6),
    auditTrail: [
      {
        id: 'aud-005',
        entityType: 'approval',
        entityId: 'apr-005',
        action: 'created',
        performedBy: mockUsers.qa_tech.id,
        performedByName: mockUsers.qa_tech.name,
        performedAt: hoursAgo(2),
      },
    ],
  },
  // Approved
  {
    id: 'apr-006',
    title: 'NCR Disposition - Manifold Machining',
    description: 'NCR disposition for out-of-tolerance manifold bore',
    type: 'ncr',
    requestedByUserId: mockUsers.operator.id,
    requestedByName: mockUsers.operator.name,
    roleRequired: 'qa_tech',
    status: 'approved',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
    relatedWorkOrderId: 'wo-005',
    relatedWorkOrderNumber: 'WO-2024-005',
    reason: 'Bore diameter 0.002" under spec',
    priority: 'medium',
    approvedByUserId: mockUsers.qa_tech.id,
    approvedByName: mockUsers.qa_tech.name,
    approvedAt: daysAgo(2),
    comments: 'Approved for rework. Bore can be salvaged with liner.',
    auditTrail: [
      {
        id: 'aud-006a',
        entityType: 'approval',
        entityId: 'apr-006',
        action: 'created',
        performedBy: mockUsers.operator.id,
        performedByName: mockUsers.operator.name,
        performedAt: daysAgo(3),
      },
      {
        id: 'aud-006b',
        entityType: 'approval',
        entityId: 'apr-006',
        action: 'approved',
        performedBy: mockUsers.qa_tech.id,
        performedByName: mockUsers.qa_tech.name,
        performedAt: daysAgo(2),
        details: { decision: 'approve', comments: 'Approved for rework. Bore can be salvaged with liner.' },
        signature: 'Mike Quality',
      },
    ],
  },
  // Approved
  {
    id: 'apr-007',
    title: 'Deviation Approval - Hose Fitting Torque',
    description: 'Approved deviation for alternate torque specification',
    type: 'deviation',
    requestedByUserId: mockUsers.operator.id,
    requestedByName: mockUsers.operator.name,
    roleRequired: 'supervisor',
    status: 'approved',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(4),
    relatedWorkOrderId: 'wo-007',
    relatedWorkOrderNumber: 'WO-2024-007',
    reason: 'Customer-supplied fittings require different torque spec',
    priority: 'low',
    approvedByUserId: mockUsers.supervisor.id,
    approvedByName: mockUsers.supervisor.name,
    approvedAt: daysAgo(4),
    comments: 'Approved per customer specification sheet CS-2024-112.',
    auditTrail: [
      {
        id: 'aud-007a',
        entityType: 'approval',
        entityId: 'apr-007',
        action: 'created',
        performedBy: mockUsers.operator.id,
        performedByName: mockUsers.operator.name,
        performedAt: daysAgo(5),
      },
      {
        id: 'aud-007b',
        entityType: 'approval',
        entityId: 'apr-007',
        action: 'approved',
        performedBy: mockUsers.supervisor.id,
        performedByName: mockUsers.supervisor.name,
        performedAt: daysAgo(4),
        signature: 'David Supervisor',
      },
    ],
  },
  // Rejected
  {
    id: 'apr-008',
    title: 'Scrap Request - Cylinder Rod',
    description: 'Request to scrap damaged cylinder rod',
    type: 'scrap',
    requestedByUserId: mockUsers.operator.id,
    requestedByName: mockUsers.operator.name,
    roleRequired: 'supervisor',
    status: 'rejected',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(6),
    relatedWorkOrderId: 'wo-008',
    relatedWorkOrderNumber: 'WO-2024-008',
    reason: 'Chrome plating damaged during handling',
    priority: 'medium',
    rejectedByUserId: mockUsers.supervisor.id,
    rejectedByName: mockUsers.supervisor.name,
    rejectedAt: daysAgo(6),
    comments: 'Rod can be re-plated. Send to vendor for repair instead of scrap.',
    auditTrail: [
      {
        id: 'aud-008a',
        entityType: 'approval',
        entityId: 'apr-008',
        action: 'created',
        performedBy: mockUsers.operator.id,
        performedByName: mockUsers.operator.name,
        performedAt: daysAgo(7),
      },
      {
        id: 'aud-008b',
        entityType: 'approval',
        entityId: 'apr-008',
        action: 'rejected',
        performedBy: mockUsers.supervisor.id,
        performedByName: mockUsers.supervisor.name,
        performedAt: daysAgo(6),
        details: { decision: 'reject' },
        signature: 'David Supervisor',
      },
    ],
  },
  // Pending - process change
  {
    id: 'apr-009',
    title: 'Process Change - Test Sequence Update',
    description: 'Update test sequence for improved efficiency',
    type: 'process_change',
    requestedByUserId: mockUsers.test_bench_operator.id,
    requestedByName: mockUsers.test_bench_operator.name,
    roleRequired: 'admin',
    status: 'pending',
    createdAt: hoursAgo(48),
    updatedAt: hoursAgo(48),
    reason: 'Proposed sequence reduces test time by 15% without affecting quality',
    priority: 'low',
    dueDate: hoursFromNow(72),
    auditTrail: [
      {
        id: 'aud-009',
        entityType: 'approval',
        entityId: 'apr-009',
        action: 'created',
        performedBy: mockUsers.test_bench_operator.id,
        performedByName: mockUsers.test_bench_operator.name,
        performedAt: hoursAgo(48),
      },
    ],
  },
  // Rejected
  {
    id: 'apr-010',
    title: 'Quality Hold Override - Pump Assembly',
    description: 'Request to override quality hold without full inspection',
    type: 'quality_hold',
    requestedByUserId: mockUsers.operator.id,
    requestedByName: mockUsers.operator.name,
    roleRequired: 'qa_tech',
    status: 'rejected',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    relatedWorkOrderId: 'wo-009',
    relatedWorkOrderNumber: 'WO-2024-009',
    reason: 'Customer needs urgent delivery, requesting expedited release',
    priority: 'critical',
    rejectedByUserId: mockUsers.qa_tech.id,
    rejectedByName: mockUsers.qa_tech.name,
    rejectedAt: daysAgo(1),
    comments: 'Cannot bypass quality hold. Safety critical component requires full inspection.',
    auditTrail: [
      {
        id: 'aud-010a',
        entityType: 'approval',
        entityId: 'apr-010',
        action: 'created',
        performedBy: mockUsers.operator.id,
        performedByName: mockUsers.operator.name,
        performedAt: daysAgo(2),
      },
      {
        id: 'aud-010b',
        entityType: 'approval',
        entityId: 'apr-010',
        action: 'rejected',
        performedBy: mockUsers.qa_tech.id,
        performedByName: mockUsers.qa_tech.name,
        performedAt: daysAgo(1),
        signature: 'Mike Quality',
      },
    ],
  },
];

// In-memory store for mutations
let approvalStore = [...mockApprovalRequests];

export function getApprovalStore(): ApprovalRequest[] {
  return approvalStore;
}

export function updateApprovalInStore(updatedApproval: ApprovalRequest): void {
  approvalStore = approvalStore.map(a => 
    a.id === updatedApproval.id ? updatedApproval : a
  );
}

export function resetApprovalStore(): void {
  approvalStore = [...mockApprovalRequests];
}
