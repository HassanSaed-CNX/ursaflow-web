// Work Order Types

export type ProductLine = 
  | 'Cylinders' 
  | 'Pumps' 
  | 'Motors' 
  | 'Valves' 
  | 'Manifolds' 
  | 'HPUs' 
  | 'Hose & Fittings';

export type WorkOrderStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'on_hold' 
  | 'complete' 
  | 'failed';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type RoutingStepStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'complete' 
  | 'skipped' 
  | 'failed' 
  | 'on_hold';

// Routing step definition
export interface RoutingStep {
  id: string;
  name: string;
  shortName: string;
  order: number;
  status: RoutingStepStatus;
  assignedRole?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

// Standard routing template
export const ROUTING_STEPS = [
  { id: 'wo', name: 'Work Order Created', shortName: 'WO' },
  { id: 'kitting', name: 'Kitting', shortName: 'Kit' },
  { id: 'assembly', name: 'Assembly', shortName: 'Assy' },
  { id: 'in_process_qc', name: 'In-Process QC', shortName: 'IPQC' },
  { id: 'test_bench', name: 'Test Bench', shortName: 'Test' },
  { id: 'final_qc', name: 'Final QC', shortName: 'FQC' },
  { id: 'serialization', name: 'Serialization & Labeling', shortName: 'S/N' },
  { id: 'packing', name: 'Final Packing', shortName: 'Pack' },
  { id: 'handover', name: 'Handover', shortName: 'Done' },
] as const;

export type RoutingStepId = typeof ROUTING_STEPS[number]['id'];

// BOM Item
export interface BOMItem {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  unit: string;
  isKitted?: boolean;
}

// Item Revision
export interface ItemRevision {
  id: string;
  itemNumber: string;
  revision: string;
  description: string;
  mpn: string; // Manufacturer Part Number
}

// Work Order Event
export interface WorkOrderEvent {
  id: string;
  timestamp: string;
  type: 'status_change' | 'step_complete' | 'note' | 'ncr_raised' | 'hold' | 'resume';
  description: string;
  userId?: string;
  userName?: string;
  data?: Record<string, unknown>;
}

// Gate flags for validation
export interface GateFlags {
  calibrationExpired?: boolean;
  cleanlinessOutOfSpec?: boolean;
  missingSerialScans?: boolean;
  approvalsPending?: boolean;
  ncrOpen?: boolean;
}

// Main Work Order type
export interface WorkOrder {
  id: string;
  woNumber: string;
  line: ProductLine;
  item: ItemRevision;
  quantity: number;
  status: WorkOrderStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedRole?: string;
  assignedUser?: string;
  currentStepId: RoutingStepId;
  routing: RoutingStep[];
  bom: BOMItem[];
  events: WorkOrderEvent[];
  gateFlags: GateFlags;
  notes?: string;
}

// Filter params
export interface WorkOrderFilters {
  status?: WorkOrderStatus | 'all';
  line?: ProductLine | 'all';
  priority?: Priority | 'all';
  search?: string;
}
