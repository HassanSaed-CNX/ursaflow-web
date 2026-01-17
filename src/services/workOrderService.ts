import { 
  WorkOrder, 
  WorkOrderFilters,
  WorkOrderEvent 
} from '@/types/workOrder';
import { 
  getWorkOrderStore, 
  updateWorkOrderInStore, 
  addEventToWorkOrder 
} from '@/mocks/workOrders';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const workOrderService = {
  // GET /api/workorders
  async list(filters?: WorkOrderFilters): Promise<ApiResponse<PaginatedResponse<WorkOrder>>> {
    await delay(300);
    
    let results = getWorkOrderStore();
    
    // Apply filters
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        results = results.filter(wo => wo.status === filters.status);
      }
      if (filters.line && filters.line !== 'all') {
        results = results.filter(wo => wo.line === filters.line);
      }
      if (filters.priority && filters.priority !== 'all') {
        results = results.filter(wo => wo.priority === filters.priority);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(wo => 
          wo.woNumber.toLowerCase().includes(searchLower) ||
          wo.item.itemNumber.toLowerCase().includes(searchLower) ||
          wo.item.mpn.toLowerCase().includes(searchLower) ||
          wo.item.description.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Sort by priority and due date
    results.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    return {
      data: {
        data: results,
        total: results.length,
        page: 1,
        pageSize: 50,
      },
      status: 200,
    };
  },

  // GET /api/workorders/:id
  async getById(id: string): Promise<ApiResponse<WorkOrder | null>> {
    await delay(200);
    
    const wo = getWorkOrderStore().find(w => w.id === id || w.woNumber === id);
    
    if (!wo) {
      return { data: null, status: 404, message: 'Work order not found' };
    }
    
    return { data: wo, status: 200 };
  },

  // GET /api/workorders/by-barcode/:barcode
  async getByBarcode(barcode: string): Promise<ApiResponse<WorkOrder | null>> {
    await delay(200);
    
    const wo = getWorkOrderStore().find(w => 
      w.woNumber.toUpperCase() === barcode.toUpperCase() ||
      w.id === barcode
    );
    
    if (!wo) {
      return { data: null, status: 404, message: 'Work order not found' };
    }
    
    return { data: wo, status: 200 };
  },

  // POST /api/workorders/:id/events
  async appendEvent(
    id: string, 
    event: Omit<WorkOrderEvent, 'id' | 'timestamp'>
  ): Promise<ApiResponse<WorkOrder | null>> {
    await delay(200);
    
    const wo = addEventToWorkOrder(id, event);
    
    if (!wo) {
      return { data: null, status: 404, message: 'Work order not found' };
    }
    
    return { data: wo, status: 200 };
  },

  // POST /api/workorders/:id/advance-step
  async advanceStep(id: string, notes?: string): Promise<ApiResponse<WorkOrder | null>> {
    await delay(300);
    
    const store = getWorkOrderStore();
    const wo = store.find(w => w.id === id);
    
    if (!wo) {
      return { data: null, status: 404, message: 'Work order not found' };
    }
    
    // Find current step index
    const currentIndex = wo.routing.findIndex(s => s.id === wo.currentStepId);
    if (currentIndex === -1 || currentIndex >= wo.routing.length - 1) {
      return { data: wo, status: 400, message: 'Cannot advance step' };
    }
    
    // Complete current step
    wo.routing[currentIndex].status = 'complete';
    wo.routing[currentIndex].completedAt = new Date().toISOString();
    
    // Move to next step
    const nextStep = wo.routing[currentIndex + 1];
    nextStep.status = 'in_progress';
    nextStep.startedAt = new Date().toISOString();
    wo.currentStepId = nextStep.id as typeof wo.currentStepId;
    
    // Add event
    wo.events.push({
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'step_complete',
      description: `${wo.routing[currentIndex].name} completed${notes ? `: ${notes}` : ''}`,
      userName: 'Current User',
    });
    
    // Check if complete
    if (nextStep.id === 'handover') {
      wo.status = 'complete';
    }
    
    wo.updatedAt = new Date().toISOString();
    
    return { data: wo, status: 200 };
  },

  // Get tasks by role
  async getTasksByRole(role: string): Promise<ApiResponse<WorkOrder[]>> {
    await delay(200);
    
    const roleStepMap: Record<string, string[]> = {
      'operator': ['kitting', 'assembly'],
      'test_bench_operator': ['test_bench'],
      'qa_tech': ['in_process_qc', 'final_qc'],
      'packaging': ['serialization', 'packing'],
      'supervisor': [], // Sees all
      'admin': [], // Sees all
    };
    
    const allowedSteps = roleStepMap[role] || [];
    let results = getWorkOrderStore().filter(wo => 
      wo.status === 'in_progress' || wo.status === 'on_hold'
    );
    
    if (allowedSteps.length > 0) {
      results = results.filter(wo => allowedSteps.includes(wo.currentStepId));
    }
    
    return { data: results, status: 200 };
  },
};
