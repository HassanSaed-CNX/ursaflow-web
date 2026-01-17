import { 
  Inspection, 
  NCR, 
  CAPA, 
  SpcChart,
  InspectionFilters, 
  NcrFilters,
  NcrStatus 
} from '@/types/quality';
import { AuditTrailEntry } from '@/types/approval';
import { FinalQcSignOffData, NcrStatusUpdateData } from '@/schemas/qualitySchema';
import { 
  getInspectionStore, 
  updateInspectionInStore, 
  getNcrStore, 
  updateNcrInStore,
  mockCAPAs,
  mockSpcCharts 
} from '@/mocks/quality';
import { mockUsers } from '@/mocks/users';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const qualityService = {
  // ===== INSPECTIONS =====
  
  async listInspections(filters?: InspectionFilters): Promise<Inspection[]> {
    await delay(300);
    
    let results = getInspectionStore();
    
    if (filters?.type) {
      results = results.filter(i => i.type === filters.type);
    }
    
    if (filters?.status?.length) {
      results = results.filter(i => filters.status!.includes(i.status));
    }
    
    if (filters?.workOrderId) {
      results = results.filter(i => i.workOrderId === filters.workOrderId);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(i => 
        i.workOrderNumber.toLowerCase().includes(search) ||
        i.itemNumber.toLowerCase().includes(search) ||
        i.itemDescription.toLowerCase().includes(search)
      );
    }
    
    return results.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getInspectionById(id: string): Promise<Inspection | null> {
    await delay(200);
    return getInspectionStore().find(i => i.id === id) || null;
  },

  async signOffInspection(data: FinalQcSignOffData, userId: string): Promise<{ success: boolean; error?: string }> {
    await delay(500);
    
    const inspection = getInspectionStore().find(i => i.id === data.inspectionId);
    if (!inspection) {
      return { success: false, error: 'Inspection not found' };
    }
    
    const user = Object.values(mockUsers).find(u => u.id === userId);
    const now = new Date();
    
    const updated: Inspection = {
      ...inspection,
      status: data.result,
      signedOff: true,
      signedOffBy: user?.name || 'Unknown',
      signedOffAt: now,
      signature: data.typedName,
      completedAt: now,
      updatedAt: now,
    };
    
    updateInspectionInStore(updated);
    return { success: true };
  },

  async getInspectionCounts(): Promise<{ pending: number; inProgress: number; pass: number; fail: number }> {
    await delay(100);
    const store = getInspectionStore();
    
    return {
      pending: store.filter(i => i.status === 'pending').length,
      inProgress: store.filter(i => i.status === 'in_progress').length,
      pass: store.filter(i => i.status === 'pass').length,
      fail: store.filter(i => i.status === 'fail').length,
    };
  },

  // ===== NCRs =====
  
  async listNCRs(filters?: NcrFilters): Promise<NCR[]> {
    await delay(300);
    
    let results = getNcrStore();
    
    if (filters?.status?.length) {
      results = results.filter(n => filters.status!.includes(n.status));
    }
    
    if (filters?.severity?.length) {
      results = results.filter(n => filters.severity!.includes(n.severity));
    }
    
    if (filters?.disposition?.length) {
      results = results.filter(n => n.disposition && filters.disposition!.includes(n.disposition));
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(n => 
        n.ncrNumber.toLowerCase().includes(search) ||
        n.title.toLowerCase().includes(search) ||
        n.itemNumber.toLowerCase().includes(search)
      );
    }
    
    return results.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getNcrById(id: string): Promise<NCR | null> {
    await delay(200);
    return getNcrStore().find(n => n.id === id) || null;
  },

  async updateNcrStatus(data: NcrStatusUpdateData, userId: string): Promise<{ success: boolean; error?: string }> {
    await delay(500);
    
    const ncr = getNcrStore().find(n => n.id === data.ncrId);
    if (!ncr) {
      return { success: false, error: 'NCR not found' };
    }
    
    const user = Object.values(mockUsers).find(u => u.id === userId);
    const now = new Date();
    
    const auditEntry: AuditTrailEntry = {
      id: `aud-${Date.now()}`,
      entityType: 'approval',
      entityId: ncr.id,
      action: `status_changed_to_${data.newStatus}`,
      performedBy: userId,
      performedByName: user?.name || 'Unknown',
      performedAt: now,
      details: { comments: data.comments },
    };
    
    const updated: NCR = {
      ...ncr,
      status: data.newStatus,
      updatedAt: now,
      ...(data.newStatus === 'closed' ? {
        closedByUserId: userId,
        closedByName: user?.name,
        closedAt: now,
      } : {}),
      auditTrail: [...ncr.auditTrail, auditEntry],
    };
    
    updateNcrInStore(updated);
    return { success: true };
  },

  async getNcrCounts(): Promise<Record<NcrStatus, number>> {
    await delay(100);
    const store = getNcrStore();
    
    return {
      raised: store.filter(n => n.status === 'raised').length,
      disposition: store.filter(n => n.status === 'disposition').length,
      rework: store.filter(n => n.status === 'rework').length,
      retest: store.filter(n => n.status === 'retest').length,
      closed: store.filter(n => n.status === 'closed').length,
    };
  },

  // ===== CAPAs =====
  
  async listCAPAs(): Promise<CAPA[]> {
    await delay(200);
    return mockCAPAs;
  },

  // ===== SPC =====
  
  async getSpcCharts(): Promise<SpcChart[]> {
    await delay(200);
    return mockSpcCharts;
  },
};
