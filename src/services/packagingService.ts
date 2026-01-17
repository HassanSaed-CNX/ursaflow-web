// Packaging Service - API stubs for serialization and packing
import {
  LabelTemplate,
  SerialRecord,
  PackChecklist,
  DocumentBundle,
  PrintGateStatus,
  LabelPrintRequest,
  LabelPrintResponse,
  SparesAgingItem,
} from '@/types/packaging';
import {
  mockLabelTemplates,
  mockSerialRecords,
  mockPackChecklists,
  mockDocumentBundles,
  mockPrintGateStatuses,
  mockSparesAgingItems,
} from '@/mocks/packaging';

// Simulated delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const packagingService = {
  // Label Templates
  async listLabelTemplates(): Promise<LabelTemplate[]> {
    await delay(300);
    return mockLabelTemplates;
  },

  async getLabelTemplate(id: string): Promise<LabelTemplate | null> {
    await delay(200);
    return mockLabelTemplates.find((t) => t.id === id) || null;
  },

  // Serial Records
  async listSerialRecords(workOrderId?: string): Promise<SerialRecord[]> {
    await delay(400);
    if (workOrderId) {
      return mockSerialRecords.filter((r) => r.workOrderId === workOrderId);
    }
    return mockSerialRecords;
  },

  async getSerialRecord(id: string): Promise<SerialRecord | null> {
    await delay(200);
    return mockSerialRecords.find((r) => r.id === id) || null;
  },

  async createSerialRecord(data: Omit<SerialRecord, 'id' | 'createdAt' | 'status'>): Promise<SerialRecord> {
    await delay(300);
    const newRecord: SerialRecord = {
      ...data,
      id: `sr-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockSerialRecords.push(newRecord);
    return newRecord;
  },

  // Print Gate
  async getPrintGateStatus(workOrderId: string): Promise<PrintGateStatus> {
    await delay(300);
    return (
      mockPrintGateStatuses[workOrderId] || {
        canPrint: false,
        testVerdict: 'pending',
        finalQcSigned: false,
        blockedReasons: ['Work order not found'],
      }
    );
  },

  // Print Label (stub)
  async printLabel(request: LabelPrintRequest): Promise<LabelPrintResponse> {
    await delay(500);
    // Simulate API call: POST /api/labels/print
    console.log('[STUB] POST /api/labels/print', request);

    // In real implementation, this would call the actual endpoint
    // For now, simulate success
    return {
      success: true,
      printJobId: `pj-${Date.now()}`,
    };
  },

  // Pack Checklists
  async getPackChecklist(workOrderId: string): Promise<PackChecklist | null> {
    await delay(300);
    return mockPackChecklists.find((c) => c.workOrderId === workOrderId) || null;
  },

  async updateChecklistItem(
    checklistId: string,
    itemId: string,
    checked: boolean,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    await delay(200);
    const checklist = mockPackChecklists.find((c) => c.id === checklistId);
    if (!checklist) {
      return { success: false, error: 'Checklist not found' };
    }

    const item = checklist.items.find((i) => i.id === itemId);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    item.checked = checked;
    if (checked) {
      item.checkedAt = new Date().toISOString();
      item.checkedBy = userId;
    } else {
      item.checkedAt = undefined;
      item.checkedBy = undefined;
    }

    // Update checklist status
    const allRequiredChecked = checklist.items
      .filter((i) => i.required)
      .every((i) => i.checked);
    
    if (allRequiredChecked) {
      checklist.status = 'completed';
      checklist.completedAt = new Date().toISOString();
      checklist.completedBy = userId;
    } else if (checklist.items.some((i) => i.checked)) {
      checklist.status = 'in_progress';
    } else {
      checklist.status = 'pending';
    }

    return { success: true };
  },

  // Document Bundles
  async getDocumentBundle(workOrderId: string): Promise<DocumentBundle | null> {
    await delay(300);
    return mockDocumentBundles.find((b) => b.workOrderId === workOrderId) || null;
  },

  async generateDocument(
    bundleId: string,
    documentId: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    await delay(800);
    console.log('[STUB] Generating document', { bundleId, documentId });
    return {
      success: true,
      url: `/docs/generated-${documentId}.pdf`,
    };
  },

  // Spares Aging
  async listSparesAging(): Promise<SparesAgingItem[]> {
    await delay(400);
    return mockSparesAgingItems;
  },

  async getSparesAgingCounts(): Promise<Record<SparesAgingItem['status'], number>> {
    await delay(200);
    const counts = { active: 0, warning: 0, critical: 0, expired: 0 };
    mockSparesAgingItems.forEach((item) => {
      counts[item.status]++;
    });
    return counts;
  },
};
