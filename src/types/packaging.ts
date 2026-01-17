// Packaging & Serialization Types

export interface LabelTemplate {
  id: string;
  name: string;
  type: 'serial' | 'box' | 'pallet' | 'shipping';
  fields: LabelField[];
  previewUrl?: string;
}

export interface LabelField {
  key: string;
  label: string;
  value: string;
  required: boolean;
}

export interface SerialRecord {
  id: string;
  workOrderId: string;
  serialNumber: string;
  mpn: string; // Manufacturer Part Number
  itemDescription: string;
  labelPrintedAt?: string;
  labelPrintedBy?: string;
  status: 'pending' | 'printed' | 'applied' | 'verified';
  createdAt: string;
}

export interface TraceRecord {
  id: string;
  serialNumber: string;
  workOrderId: string;
  events: TraceEvent[];
}

export interface TraceEvent {
  id: string;
  action: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  details?: string;
}

export interface PackChecklist {
  id: string;
  workOrderId: string;
  status: 'pending' | 'in_progress' | 'completed';
  items: PackChecklistItem[];
  completedAt?: string;
  completedBy?: string;
}

export interface PackChecklistItem {
  id: string;
  label: string;
  category: 'physical' | 'document' | 'verification';
  required: boolean;
  checked: boolean;
  checkedAt?: string;
  checkedBy?: string;
}

export interface DocumentBundle {
  id: string;
  workOrderId: string;
  documents: BundleDocument[];
  isComplete: boolean;
}

export interface BundleDocument {
  id: string;
  type: 'coc' | 'test_report' | 'ppap' | 'fair' | 'packing_list';
  name: string;
  status: 'pending' | 'generated' | 'reviewed' | 'approved';
  url?: string;
}

export interface PrintGateStatus {
  canPrint: boolean;
  testVerdict: 'pending' | 'pass' | 'fail';
  finalQcSigned: boolean;
  blockedReasons: string[];
}

export interface LabelPrintRequest {
  serialRecordId: string;
  templateId: string;
  copies: number;
}

export interface LabelPrintResponse {
  success: boolean;
  printJobId?: string;
  error?: string;
}

// Spares Aging
export interface SparesAgingItem {
  id: string;
  mpn: string;
  description: string;
  quantity: number;
  locationCode: string;
  receivedDate: string;
  agingDays: number;
  status: 'active' | 'warning' | 'critical' | 'expired';
  lastMovementDate?: string;
}
