import { useState, useEffect, useCallback } from 'react';
import { GateCheckResult, BlockedAction } from '@/types/gates';
import { getWorkOrderGateStatus } from '@/services/gates/gateEngine';

interface UseGatesOptions {
  workOrderId: string;
  currentUserId: string;
  currentStep?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseGatesResult {
  gateStatus: GateCheckResult | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  canPerformAction: (action: BlockedAction) => boolean;
  getBlockingReasons: (action: BlockedAction) => string[];
}

export function useGates({
  workOrderId,
  currentUserId,
  currentStep,
  autoRefresh = false,
  refreshInterval = 30000,
}: UseGatesOptions): UseGatesResult {
  const [gateStatus, setGateStatus] = useState<GateCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!workOrderId || !currentUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const status = await getWorkOrderGateStatus(
        workOrderId,
        currentUserId,
        currentStep
      );
      setGateStatus(status);
    } catch (err) {
      setError('Failed to check gate status');
      console.error('Gate check error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workOrderId, currentUserId, currentStep]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  // Helper to check if action is allowed
  const canPerformAction = useCallback(
    (action: BlockedAction): boolean => {
      if (!gateStatus) return false;
      return gateStatus.canPerformAction(action);
    },
    [gateStatus]
  );

  // Helper to get blocking reasons for an action
  const getBlockingReasons = useCallback(
    (action: BlockedAction): string[] => {
      if (!gateStatus) return [];
      const gates = gateStatus.getBlockingGates(action);
      return gates.map((g) => g.details || g.description);
    },
    [gateStatus]
  );

  return {
    gateStatus,
    isLoading,
    error,
    refresh,
    canPerformAction,
    getBlockingReasons,
  };
}
