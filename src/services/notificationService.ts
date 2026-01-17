import { 
  NotificationItem, 
  NotificationFilters, 
  AuditTrailEntry 
} from '@/types/notification';
import { 
  getNotificationStore, 
  updateNotificationStore, 
  addAuditEntry,
  getAuditStore
} from '@/mocks/notifications';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Apply filters to notifications
function applyFilters(
  notifications: NotificationItem[], 
  filters: NotificationFilters
): NotificationItem[] {
  return notifications.filter(n => {
    // Severity filter
    if (filters.severity?.length && !filters.severity.includes(n.severity)) {
      return false;
    }
    
    // Category filter
    if (filters.category?.length && !filters.category.includes(n.category)) {
      return false;
    }
    
    // Status filter
    if (filters.status?.length && !filters.status.includes(n.status)) {
      return false;
    }
    
    // Role target filter
    if (filters.roleTarget && !n.roleTarget.includes(filters.roleTarget)) {
      return false;
    }
    
    // Module filter
    if (filters.module && n.module !== filters.module) {
      return false;
    }
    
    // Work order filter
    if (filters.workOrderId && n.workOrderId !== filters.workOrderId) {
      return false;
    }
    
    // SLA due filter
    if (filters.slaDue && n.slaDueAt) {
      const now = new Date();
      const dueAt = new Date(n.slaDueAt);
      const hoursUntilDue = (dueAt.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      switch (filters.slaDue) {
        case 'overdue':
          if (hoursUntilDue >= 0) return false;
          break;
        case 'today':
          if (hoursUntilDue < 0 || hoursUntilDue > 24) return false;
          break;
        case 'thisWeek':
          if (hoursUntilDue < 0 || hoursUntilDue > 168) return false;
          break;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = n.title.toLowerCase().includes(searchLower);
      const matchesDesc = n.description.toLowerCase().includes(searchLower);
      const matchesWO = n.workOrderNumber?.toLowerCase().includes(searchLower);
      const matchesItem = n.itemNumber?.toLowerCase().includes(searchLower);
      
      if (!matchesTitle && !matchesDesc && !matchesWO && !matchesItem) {
        return false;
      }
    }
    
    return true;
  });
}

// Notification service
export const notificationService = {
  // GET /api/notifications
  async list(filters?: NotificationFilters): Promise<NotificationItem[]> {
    await delay(300);
    const all = getNotificationStore();
    const filtered = filters ? applyFilters(all, filters) : all;
    
    // Sort by severity (critical first) then by createdAt (newest first)
    const severityOrder = { critical: 0, error: 1, warning: 2, info: 3 };
    return filtered.sort((a, b) => {
      const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (sevDiff !== 0) return sevDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  // GET /api/notifications/:id
  async getById(id: string): Promise<NotificationItem | null> {
    await delay(150);
    const store = getNotificationStore();
    return store.find(n => n.id === id) || null;
  },

  // POST /api/notifications/:id/ack
  async acknowledge(
    id: string, 
    userId: string, 
    comments?: string
  ): Promise<NotificationItem | null> {
    await delay(200);
    const store = getNotificationStore();
    const index = store.findIndex(n => n.id === id);
    
    if (index === -1) return null;
    
    const updated: NotificationItem = {
      ...store[index],
      status: 'acknowledged',
      acknowledgedAt: new Date(),
      acknowledgedBy: userId,
    };
    
    const newStore = [...store];
    newStore[index] = updated;
    updateNotificationStore(newStore);
    
    // Add audit entry
    const auditEntry: AuditTrailEntry = {
      id: `AUD-${Date.now()}`,
      entityType: 'notification',
      entityId: id,
      action: 'acknowledged',
      performedBy: userId,
      performedAt: new Date(),
      details: comments ? { comments } : undefined,
    };
    addAuditEntry(auditEntry);
    
    return updated;
  },

  // POST /api/notifications/:id/close
  async close(id: string, userId: string): Promise<NotificationItem | null> {
    await delay(200);
    const store = getNotificationStore();
    const index = store.findIndex(n => n.id === id);
    
    if (index === -1) return null;
    
    const updated: NotificationItem = {
      ...store[index],
      status: 'closed',
      closedAt: new Date(),
    };
    
    const newStore = [...store];
    newStore[index] = updated;
    updateNotificationStore(newStore);
    
    return updated;
  },

  // Bulk acknowledge
  async bulkAcknowledge(
    ids: string[], 
    userId: string
  ): Promise<{ success: string[]; failed: string[] }> {
    await delay(400);
    const store = getNotificationStore();
    const newStore = [...store];
    const success: string[] = [];
    const failed: string[] = [];
    
    for (const id of ids) {
      const index = newStore.findIndex(n => n.id === id);
      if (index !== -1 && newStore[index].status === 'new') {
        newStore[index] = {
          ...newStore[index],
          status: 'acknowledged',
          acknowledgedAt: new Date(),
          acknowledgedBy: userId,
        };
        success.push(id);
        
        addAuditEntry({
          id: `AUD-${Date.now()}-${id}`,
          entityType: 'notification',
          entityId: id,
          action: 'acknowledged',
          performedBy: userId,
          performedAt: new Date(),
          details: { bulkAction: true },
        });
      } else {
        failed.push(id);
      }
    }
    
    updateNotificationStore(newStore);
    return { success, failed };
  },

  // Get counts for badges
  async getCounts(): Promise<{ new: number; critical: number; overdue: number }> {
    await delay(100);
    const store = getNotificationStore();
    const now = new Date();
    
    return {
      new: store.filter(n => n.status === 'new').length,
      critical: store.filter(n => n.status === 'new' && n.severity === 'critical').length,
      overdue: store.filter(n => {
        if (n.status !== 'new' || !n.slaDueAt) return false;
        return new Date(n.slaDueAt) < now;
      }).length,
    };
  },

  // Get audit trail for entity
  async getAuditTrail(entityId: string): Promise<AuditTrailEntry[]> {
    await delay(150);
    return getAuditStore().filter(a => a.entityId === entityId);
  },

  // Export to CSV
  exportToCSV(notifications: NotificationItem[]): string {
    const headers = [
      'ID',
      'Title',
      'Description',
      'Severity',
      'Category',
      'Module',
      'Work Order',
      'Status',
      'Created At',
      'SLA Due At',
      'Acknowledged By',
      'Acknowledged At',
    ];
    
    const rows = notifications.map(n => [
      n.id,
      `"${n.title.replace(/"/g, '""')}"`,
      `"${n.description.replace(/"/g, '""')}"`,
      n.severity,
      n.category,
      n.module,
      n.workOrderNumber || '',
      n.status,
      n.createdAt.toISOString(),
      n.slaDueAt?.toISOString() || '',
      n.acknowledgedBy || '',
      n.acknowledgedAt?.toISOString() || '',
    ]);
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },
};
