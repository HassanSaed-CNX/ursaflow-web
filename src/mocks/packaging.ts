import {
  LabelTemplate,
  SerialRecord,
  PackChecklist,
  DocumentBundle,
  PrintGateStatus,
  SparesAgingItem,
} from '@/types/packaging';

export const mockLabelTemplates: LabelTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Serial Label - Standard',
    type: 'serial',
    fields: [
      { key: 'serialNumber', label: 'Serial Number', value: '', required: true },
      { key: 'mpn', label: 'MPN #', value: '', required: true },
      { key: 'description', label: 'Description', value: '', required: true },
      { key: 'mfgDate', label: 'Mfg Date', value: '', required: true },
    ],
  },
  {
    id: 'tpl-002',
    name: 'Box Label - Standard',
    type: 'box',
    fields: [
      { key: 'boxId', label: 'Box ID', value: '', required: true },
      { key: 'contents', label: 'Contents', value: '', required: true },
      { key: 'quantity', label: 'Quantity', value: '', required: true },
    ],
  },
  {
    id: 'tpl-003',
    name: 'Shipping Label',
    type: 'shipping',
    fields: [
      { key: 'shipTo', label: 'Ship To', value: '', required: true },
      { key: 'poNumber', label: 'PO Number', value: '', required: true },
      { key: 'weight', label: 'Weight', value: '', required: false },
    ],
  },
];

export const mockSerialRecords: SerialRecord[] = [
  {
    id: 'sr-001',
    workOrderId: 'WO-2024-001',
    serialNumber: 'SN-2024-00001',
    mpn: 'MPN-ABC-12345',
    itemDescription: 'Hydraulic Pump Assembly',
    status: 'pending',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'sr-002',
    workOrderId: 'WO-2024-001',
    serialNumber: 'SN-2024-00002',
    mpn: 'MPN-ABC-12345',
    itemDescription: 'Hydraulic Pump Assembly',
    status: 'printed',
    labelPrintedAt: '2024-01-15T10:30:00Z',
    labelPrintedBy: 'user-003',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'sr-003',
    workOrderId: 'WO-2024-002',
    serialNumber: 'SN-2024-00003',
    mpn: 'MPN-XYZ-67890',
    itemDescription: 'Control Valve Unit',
    status: 'verified',
    labelPrintedAt: '2024-01-14T14:00:00Z',
    labelPrintedBy: 'user-003',
    createdAt: '2024-01-14T09:00:00Z',
  },
];

export const mockPackChecklists: PackChecklist[] = [
  {
    id: 'pc-001',
    workOrderId: 'WO-2024-001',
    status: 'in_progress',
    items: [
      { id: 'pci-001', label: 'Product cleaned and inspected', category: 'physical', required: true, checked: true, checkedAt: '2024-01-15T11:00:00Z', checkedBy: 'user-004' },
      { id: 'pci-002', label: 'Serial label applied', category: 'physical', required: true, checked: true, checkedAt: '2024-01-15T11:05:00Z', checkedBy: 'user-004' },
      { id: 'pci-003', label: 'Protective packaging applied', category: 'physical', required: true, checked: false },
      { id: 'pci-004', label: 'CoC document included', category: 'document', required: true, checked: false },
      { id: 'pci-005', label: 'Test report included', category: 'document', required: true, checked: false },
      { id: 'pci-006', label: 'Packing list verified', category: 'verification', required: true, checked: false },
      { id: 'pci-007', label: 'Weight recorded', category: 'verification', required: false, checked: false },
    ],
  },
  {
    id: 'pc-002',
    workOrderId: 'WO-2024-002',
    status: 'completed',
    items: [
      { id: 'pci-101', label: 'Product cleaned and inspected', category: 'physical', required: true, checked: true, checkedAt: '2024-01-14T15:00:00Z', checkedBy: 'user-004' },
      { id: 'pci-102', label: 'Serial label applied', category: 'physical', required: true, checked: true, checkedAt: '2024-01-14T15:05:00Z', checkedBy: 'user-004' },
      { id: 'pci-103', label: 'Protective packaging applied', category: 'physical', required: true, checked: true, checkedAt: '2024-01-14T15:10:00Z', checkedBy: 'user-004' },
      { id: 'pci-104', label: 'CoC document included', category: 'document', required: true, checked: true, checkedAt: '2024-01-14T15:15:00Z', checkedBy: 'user-004' },
      { id: 'pci-105', label: 'Test report included', category: 'document', required: true, checked: true, checkedAt: '2024-01-14T15:20:00Z', checkedBy: 'user-004' },
      { id: 'pci-106', label: 'Packing list verified', category: 'verification', required: true, checked: true, checkedAt: '2024-01-14T15:25:00Z', checkedBy: 'user-004' },
    ],
    completedAt: '2024-01-14T15:30:00Z',
    completedBy: 'user-004',
  },
];

export const mockDocumentBundles: DocumentBundle[] = [
  {
    id: 'db-001',
    workOrderId: 'WO-2024-001',
    isComplete: false,
    documents: [
      { id: 'doc-001', type: 'coc', name: 'Certificate of Conformance', status: 'pending' },
      { id: 'doc-002', type: 'test_report', name: 'Test Report', status: 'generated' },
      { id: 'doc-003', type: 'ppap', name: 'PPAP Documentation', status: 'pending' },
      { id: 'doc-004', type: 'fair', name: 'First Article Inspection Report', status: 'pending' },
      { id: 'doc-005', type: 'packing_list', name: 'Packing List', status: 'pending' },
    ],
  },
  {
    id: 'db-002',
    workOrderId: 'WO-2024-002',
    isComplete: true,
    documents: [
      { id: 'doc-101', type: 'coc', name: 'Certificate of Conformance', status: 'approved', url: '/docs/coc-001.pdf' },
      { id: 'doc-102', type: 'test_report', name: 'Test Report', status: 'approved', url: '/docs/test-001.pdf' },
      { id: 'doc-103', type: 'packing_list', name: 'Packing List', status: 'approved', url: '/docs/pack-001.pdf' },
    ],
  },
];

// Simulate print gate status based on work order
export const mockPrintGateStatuses: Record<string, PrintGateStatus> = {
  'WO-2024-001': {
    canPrint: false,
    testVerdict: 'pending',
    finalQcSigned: false,
    blockedReasons: ['Test verdict pending', 'Final QC e-sign not completed'],
  },
  'WO-2024-002': {
    canPrint: true,
    testVerdict: 'pass',
    finalQcSigned: true,
    blockedReasons: [],
  },
  'WO-2024-003': {
    canPrint: false,
    testVerdict: 'pass',
    finalQcSigned: false,
    blockedReasons: ['Final QC e-sign not completed'],
  },
  'WO-2024-004': {
    canPrint: false,
    testVerdict: 'fail',
    finalQcSigned: false,
    blockedReasons: ['Test verdict is FAIL', 'Final QC e-sign not completed'],
  },
};

export const mockSparesAgingItems: SparesAgingItem[] = [
  {
    id: 'sa-001',
    mpn: 'MPN-SPARE-001',
    description: 'Bearing Assembly',
    quantity: 5,
    locationCode: 'A-12-03',
    receivedDate: '2023-06-15',
    agingDays: 215,
    status: 'critical',
    lastMovementDate: '2023-09-01',
  },
  {
    id: 'sa-002',
    mpn: 'MPN-SPARE-002',
    description: 'Seal Kit',
    quantity: 12,
    locationCode: 'B-05-01',
    receivedDate: '2023-10-01',
    agingDays: 107,
    status: 'warning',
    lastMovementDate: '2023-12-15',
  },
  {
    id: 'sa-003',
    mpn: 'MPN-SPARE-003',
    description: 'O-Ring Set',
    quantity: 50,
    locationCode: 'C-02-08',
    receivedDate: '2024-01-01',
    agingDays: 15,
    status: 'active',
  },
  {
    id: 'sa-004',
    mpn: 'MPN-SPARE-004',
    description: 'Filter Element',
    quantity: 3,
    locationCode: 'A-08-02',
    receivedDate: '2023-01-10',
    agingDays: 371,
    status: 'expired',
    lastMovementDate: '2023-03-20',
  },
];
