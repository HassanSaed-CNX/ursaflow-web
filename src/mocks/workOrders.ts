import { 
  WorkOrder, 
  ProductLine, 
  Priority, 
  WorkOrderStatus,
  RoutingStep,
  ROUTING_STEPS,
  BOMItem,
  WorkOrderEvent,
  GateFlags
} from '@/types/workOrder';

// Helper to create routing steps
function createRouting(currentStepIndex: number, statuses?: Partial<Record<string, 'failed' | 'on_hold'>>): RoutingStep[] {
  return ROUTING_STEPS.map((step, index) => {
    let status: RoutingStep['status'] = 'pending';
    
    if (statuses?.[step.id]) {
      status = statuses[step.id]!;
    } else if (index < currentStepIndex) {
      status = 'complete';
    } else if (index === currentStepIndex) {
      status = 'in_progress';
    }
    
    return {
      id: step.id,
      name: step.name,
      shortName: step.shortName,
      order: index,
      status,
      startedAt: index <= currentStepIndex ? new Date(Date.now() - (currentStepIndex - index) * 86400000).toISOString() : undefined,
      completedAt: index < currentStepIndex ? new Date(Date.now() - (currentStepIndex - index - 1) * 86400000).toISOString() : undefined,
    };
  });
}

// Helper to create sample BOM
function createBOM(line: ProductLine): BOMItem[] {
  const bomTemplates: Record<ProductLine, BOMItem[]> = {
    'Cylinders': [
      { id: 'b1', partNumber: 'CYL-TUBE-100', description: 'Cylinder Tube 100mm', quantity: 1, unit: 'EA', isKitted: true },
      { id: 'b2', partNumber: 'CYL-PISTON-100', description: 'Piston Assembly', quantity: 1, unit: 'EA', isKitted: true },
      { id: 'b3', partNumber: 'SEAL-KIT-CYL', description: 'Seal Kit', quantity: 1, unit: 'KIT', isKitted: false },
    ],
    'Pumps': [
      { id: 'b1', partNumber: 'PMP-BODY-A1', description: 'Pump Body Cast', quantity: 1, unit: 'EA', isKitted: true },
      { id: 'b2', partNumber: 'PMP-IMPELLER', description: 'Impeller Assembly', quantity: 1, unit: 'EA', isKitted: true },
    ],
    'Motors': [
      { id: 'b1', partNumber: 'MTR-STATOR', description: 'Stator Assembly', quantity: 1, unit: 'EA', isKitted: true },
      { id: 'b2', partNumber: 'MTR-ROTOR', description: 'Rotor Assembly', quantity: 1, unit: 'EA', isKitted: true },
    ],
    'Valves': [
      { id: 'b1', partNumber: 'VLV-BODY-2IN', description: 'Valve Body 2"', quantity: 1, unit: 'EA', isKitted: true },
      { id: 'b2', partNumber: 'VLV-SEAT', description: 'Valve Seat', quantity: 2, unit: 'EA', isKitted: true },
    ],
    'Manifolds': [
      { id: 'b1', partNumber: 'MNF-BLOCK-6P', description: 'Manifold Block 6-Port', quantity: 1, unit: 'EA', isKitted: true },
    ],
    'HPUs': [
      { id: 'b1', partNumber: 'HPU-TANK-50', description: 'Reservoir Tank 50L', quantity: 1, unit: 'EA', isKitted: true },
      { id: 'b2', partNumber: 'HPU-PUMP-ASY', description: 'Pump Motor Assembly', quantity: 1, unit: 'EA', isKitted: false },
    ],
    'Hose & Fittings': [
      { id: 'b1', partNumber: 'HOSE-HYD-1M', description: 'Hydraulic Hose 1m', quantity: 4, unit: 'EA', isKitted: true },
      { id: 'b2', partNumber: 'FIT-QUICK-M', description: 'Quick Connect Male', quantity: 4, unit: 'EA', isKitted: true },
    ],
  };
  return bomTemplates[line];
}

// Sample work orders
export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo-001',
    woNumber: 'WO-2024-0001',
    line: 'Cylinders',
    item: {
      id: 'item-001',
      itemNumber: 'CYL-HYD-100-A',
      revision: 'B',
      description: 'Hydraulic Cylinder 100mm Bore',
      mpn: 'MPN-CYL-001',
    },
    quantity: 5,
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedRole: 'operator',
    currentStepId: 'assembly',
    routing: createRouting(2),
    bom: createBOM('Cylinders'),
    events: [
      { id: 'e1', timestamp: new Date(Date.now() - 5 * 86400000).toISOString(), type: 'status_change', description: 'Work order created', userName: 'System' },
      { id: 'e2', timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), type: 'step_complete', description: 'Kitting complete', userName: 'John Operator' },
    ],
    gateFlags: {},
  },
  {
    id: 'wo-002',
    woNumber: 'WO-2024-0002',
    line: 'Pumps',
    item: {
      id: 'item-002',
      itemNumber: 'PMP-CENT-50',
      revision: 'A',
      description: 'Centrifugal Pump 50GPM',
      mpn: 'MPN-PMP-002',
    },
    quantity: 2,
    status: 'in_progress',
    priority: 'critical',
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedRole: 'test_bench_operator',
    currentStepId: 'test_bench',
    routing: createRouting(4),
    bom: createBOM('Pumps'),
    events: [],
    gateFlags: { calibrationExpired: true },
  },
  {
    id: 'wo-003',
    woNumber: 'WO-2024-0003',
    line: 'Motors',
    item: {
      id: 'item-003',
      itemNumber: 'MTR-AC-5HP',
      revision: 'C',
      description: 'AC Motor 5HP 3-Phase',
      mpn: 'MPN-MTR-003',
    },
    quantity: 10,
    status: 'on_hold',
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedRole: 'qa_tech',
    currentStepId: 'in_process_qc',
    routing: createRouting(3, { in_process_qc: 'on_hold' }),
    bom: createBOM('Motors'),
    events: [
      { id: 'e1', timestamp: new Date().toISOString(), type: 'hold', description: 'On hold - awaiting parts', userName: 'Mike Quality' },
    ],
    gateFlags: { approvalsPending: true },
  },
  {
    id: 'wo-004',
    woNumber: 'WO-2024-0004',
    line: 'Valves',
    item: {
      id: 'item-004',
      itemNumber: 'VLV-BALL-2IN',
      revision: 'A',
      description: 'Ball Valve 2" SS',
      mpn: 'MPN-VLV-004',
    },
    quantity: 20,
    status: 'in_progress',
    priority: 'low',
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedRole: 'operator',
    currentStepId: 'kitting',
    routing: createRouting(1),
    bom: createBOM('Valves'),
    events: [],
    gateFlags: {},
  },
  {
    id: 'wo-005',
    woNumber: 'WO-2024-0005',
    line: 'Manifolds',
    item: {
      id: 'item-005',
      itemNumber: 'MNF-HYD-6P',
      revision: 'B',
      description: 'Hydraulic Manifold 6-Port',
      mpn: 'MPN-MNF-005',
    },
    quantity: 3,
    status: 'failed',
    priority: 'high',
    dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedRole: 'qa_tech',
    currentStepId: 'final_qc',
    routing: createRouting(5, { final_qc: 'failed' }),
    bom: createBOM('Manifolds'),
    events: [
      { id: 'e1', timestamp: new Date().toISOString(), type: 'ncr_raised', description: 'NCR raised - pressure test failure', userName: 'Mike Quality' },
    ],
    gateFlags: { ncrOpen: true },
  },
  {
    id: 'wo-006',
    woNumber: 'WO-2024-0006',
    line: 'HPUs',
    item: {
      id: 'item-006',
      itemNumber: 'HPU-STD-50L',
      revision: 'A',
      description: 'Standard HPU 50L Tank',
      mpn: 'MPN-HPU-006',
    },
    quantity: 1,
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedRole: 'packaging',
    currentStepId: 'serialization',
    routing: createRouting(6),
    bom: createBOM('HPUs'),
    events: [],
    gateFlags: { missingSerialScans: true },
  },
  {
    id: 'wo-007',
    woNumber: 'WO-2024-0007',
    line: 'Hose & Fittings',
    item: {
      id: 'item-007',
      itemNumber: 'HOSE-KIT-A1',
      revision: 'A',
      description: 'Hose Assembly Kit',
      mpn: 'MPN-HSE-007',
    },
    quantity: 50,
    status: 'complete',
    priority: 'medium',
    dueDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    currentStepId: 'handover',
    routing: createRouting(8),
    bom: createBOM('Hose & Fittings'),
    events: [],
    gateFlags: {},
  },
  {
    id: 'wo-008',
    woNumber: 'WO-2024-0008',
    line: 'Cylinders',
    item: {
      id: 'item-008',
      itemNumber: 'CYL-HYD-150-B',
      revision: 'A',
      description: 'Heavy Duty Cylinder 150mm',
      mpn: 'MPN-CYL-008',
    },
    quantity: 3,
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStepId: 'wo',
    routing: createRouting(0),
    bom: createBOM('Cylinders'),
    events: [],
    gateFlags: {},
  },
  {
    id: 'wo-009',
    woNumber: 'WO-2024-0009',
    line: 'Pumps',
    item: {
      id: 'item-009',
      itemNumber: 'PMP-GEAR-25',
      revision: 'B',
      description: 'Gear Pump 25GPM',
      mpn: 'MPN-PMP-009',
    },
    quantity: 8,
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedRole: 'packaging',
    currentStepId: 'packing',
    routing: createRouting(7),
    bom: createBOM('Pumps'),
    events: [],
    gateFlags: {},
  },
  {
    id: 'wo-010',
    woNumber: 'WO-2024-0010',
    line: 'Motors',
    item: {
      id: 'item-010',
      itemNumber: 'MTR-DC-2HP',
      revision: 'A',
      description: 'DC Motor 2HP Variable Speed',
      mpn: 'MPN-MTR-010',
    },
    quantity: 4,
    status: 'in_progress',
    priority: 'critical',
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedRole: 'test_bench_operator',
    currentStepId: 'test_bench',
    routing: createRouting(4),
    bom: createBOM('Motors'),
    events: [],
    gateFlags: { cleanlinessOutOfSpec: true },
  },
];

// Mutable store for runtime updates
let workOrderStore = [...mockWorkOrders];

export function getWorkOrderStore(): WorkOrder[] {
  return workOrderStore;
}

export function updateWorkOrderInStore(id: string, updates: Partial<WorkOrder>): WorkOrder | null {
  const index = workOrderStore.findIndex(wo => wo.id === id);
  if (index === -1) return null;
  
  workOrderStore[index] = { ...workOrderStore[index], ...updates, updatedAt: new Date().toISOString() };
  return workOrderStore[index];
}

export function addEventToWorkOrder(id: string, event: Omit<WorkOrderEvent, 'id' | 'timestamp'>): WorkOrder | null {
  const wo = workOrderStore.find(w => w.id === id);
  if (!wo) return null;
  
  const newEvent: WorkOrderEvent = {
    ...event,
    id: `evt-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  
  wo.events.push(newEvent);
  wo.updatedAt = new Date().toISOString();
  
  return wo;
}

export function resetWorkOrderStore(): void {
  workOrderStore = [...mockWorkOrders];
}
