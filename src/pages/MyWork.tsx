import { useState, useEffect } from 'react';
import { Briefcase, RefreshCw } from 'lucide-react';
import { PageHeader, PageCard } from '@/components/ui/PageCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BaseButton } from '@/components/BaseButton';
import { ScanToStart } from '@/components/workOrders/ScanToStart';
import { MyTasks } from '@/components/workOrders/MyTasks';
import { workOrderService } from '@/services/workOrderService';
import { WorkOrder } from '@/types/workOrder';
import { useAuth } from '@/contexts/AuthContext';
import { useStrings } from '@/i18n/useStrings';

export function MyWork() {
  const { t } = useStrings();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await workOrderService.getTasksByRole(user.role);
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user?.role]);

  return (
    <div className="space-y-spacing-lg">
      <Breadcrumbs items={[{ label: 'My Work' }]} />

      <PageHeader
        icon={Briefcase}
        title="My Work"
        description={`Tasks assigned to ${user?.name || 'you'}`}
        actions={
          <BaseButton
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={fetchTasks}
            isLoading={isLoading}
          >
            {t('common.refresh')}
          </BaseButton>
        }
      />

      {/* Scan to Start */}
      <ScanToStart />

      {/* My Tasks */}
      <PageCard>
        <h2 className="text-lg font-semibold text-text mb-spacing-md">
          Active Tasks ({tasks.length})
        </h2>
        <MyTasks tasks={tasks} isLoading={isLoading} />
      </PageCard>
    </div>
  );
}
