import { useState, useEffect, useCallback, useMemo } from 'react';

interface SlaTimerResult {
  isOverdue: boolean;
  timeRemaining: string;
  urgencyLevel: 'normal' | 'warning' | 'critical' | 'overdue';
  percentRemaining: number;
}

// Parse time remaining into human readable format
function formatTimeRemaining(ms: number): string {
  const absMs = Math.abs(ms);
  const seconds = Math.floor(absMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  const prefix = ms < 0 ? 'Overdue ' : 'Due in ';
  
  if (days > 0) {
    const remainingHours = hours % 24;
    return `${prefix}${days}d ${remainingHours}h`;
  }
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${prefix}${hours}h ${remainingMinutes}m`;
  }
  if (minutes > 0) {
    return `${prefix}${minutes}m`;
  }
  return `${prefix}${seconds}s`;
}

// Calculate urgency level based on time remaining
function getUrgencyLevel(ms: number): SlaTimerResult['urgencyLevel'] {
  if (ms < 0) return 'overdue';
  
  const hours = ms / (1000 * 60 * 60);
  if (hours <= 1) return 'critical';
  if (hours <= 4) return 'warning';
  return 'normal';
}

/**
 * Hook for efficient SLA countdown timer
 * Updates every 5 seconds to avoid excessive re-renders
 */
export function useSlaTimer(slaDueAt?: Date | null): SlaTimerResult | null {
  const [now, setNow] = useState(() => Date.now());
  
  useEffect(() => {
    if (!slaDueAt) return;
    
    // Update every 5 seconds for efficiency
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slaDueAt]);
  
  return useMemo(() => {
    if (!slaDueAt) return null;
    
    const dueTime = new Date(slaDueAt).getTime();
    const remaining = dueTime - now;
    
    return {
      isOverdue: remaining < 0,
      timeRemaining: formatTimeRemaining(remaining),
      urgencyLevel: getUrgencyLevel(remaining),
      percentRemaining: Math.max(0, Math.min(100, (remaining / (24 * 60 * 60 * 1000)) * 100)),
    };
  }, [slaDueAt, now]);
}

/**
 * Hook to manage multiple SLA timers efficiently
 * Uses a single interval for all timers
 */
export function useSlaTimers<T extends { id: string; slaDueAt?: Date | null }>(
  items: T[]
): Map<string, SlaTimerResult> {
  const [now, setNow] = useState(() => Date.now());
  
  // Only run interval if there are items with SLA
  const hasSlaDates = items.some(item => item.slaDueAt);
  
  useEffect(() => {
    if (!hasSlaDates) return;
    
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [hasSlaDates]);
  
  return useMemo(() => {
    const results = new Map<string, SlaTimerResult>();
    
    for (const item of items) {
      if (!item.slaDueAt) continue;
      
      const dueTime = new Date(item.slaDueAt).getTime();
      const remaining = dueTime - now;
      
      results.set(item.id, {
        isOverdue: remaining < 0,
        timeRemaining: formatTimeRemaining(remaining),
        urgencyLevel: getUrgencyLevel(remaining),
        percentRemaining: Math.max(0, Math.min(100, (remaining / (24 * 60 * 60 * 1000)) * 100)),
      });
    }
    
    return results;
  }, [items, now]);
}

/**
 * Format a date relative to now
 */
export function useRelativeTime(date?: Date | null): string {
  const [, setTick] = useState(0);
  
  useEffect(() => {
    if (!date) return;
    
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [date]);
  
  return useMemo(() => {
    if (!date) return '';
    
    const now = Date.now();
    const then = new Date(date).getTime();
    const diff = now - then;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }, [date]);
}
