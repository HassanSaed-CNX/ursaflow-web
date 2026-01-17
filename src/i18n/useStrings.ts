import { useCallback } from 'react';
import { en } from './en';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type StringPath = NestedKeyOf<typeof en> | string;

// Get nested value from object using dot notation
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return path as fallback
    }
  }
  
  return typeof current === 'string' ? current : path;
}

// Replace template variables like {min}, {max}
function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return vars[key]?.toString() ?? match;
  });
}

/**
 * Translation helper hook
 * Usage: const { t } = useStrings();
 *        t('common.loading')
 *        t('errors.minLength', { min: 3 })
 */
export function useStrings() {
  const t = useCallback((key: StringPath, vars?: Record<string, string | number>): string => {
    const value = getNestedValue(en as Record<string, unknown>, key);
    return interpolate(value, vars);
  }, []);

  return { t, strings: en };
}

/**
 * Direct translation function (for use outside components)
 */
export function t(key: StringPath, vars?: Record<string, string | number>): string {
  const value = getNestedValue(en as Record<string, unknown>, key);
  return interpolate(value, vars);
}
