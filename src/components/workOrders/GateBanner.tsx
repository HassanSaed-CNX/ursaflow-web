import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, ShieldAlert, ScanLine, CheckCircle, XCircle } from 'lucide-react';
import { GateFlags } from '@/types/workOrder';
import { useStrings } from '@/i18n/useStrings';

interface GateBannerProps {
  flags: GateFlags;
  className?: string;
}

interface GateItem {
  key: keyof GateFlags;
  icon: typeof AlertTriangle;
  label: string;
  severity: 'warning' | 'error';
}

const gateItems: GateItem[] = [
  { 
    key: 'calibrationExpired', 
    icon: Clock, 
    label: 'Calibration expired - equipment requires recalibration',
    severity: 'error',
  },
  { 
    key: 'cleanlinessOutOfSpec', 
    icon: ShieldAlert, 
    label: 'Cleanliness out of spec - area requires cleaning',
    severity: 'warning',
  },
  { 
    key: 'missingSerialScans', 
    icon: ScanLine, 
    label: 'Missing serial scans - all items require scanning',
    severity: 'warning',
  },
  { 
    key: 'approvalsPending', 
    icon: CheckCircle, 
    label: 'Approvals pending - awaiting supervisor sign-off',
    severity: 'warning',
  },
  { 
    key: 'ncrOpen', 
    icon: XCircle, 
    label: 'NCR open - non-conformance must be resolved',
    severity: 'error',
  },
];

export function GateBanner({ flags, className }: GateBannerProps) {
  const { t } = useStrings();
  
  const activeGates = gateItems.filter(gate => flags[gate.key]);
  
  if (activeGates.length === 0) return null;
  
  return (
    <div className={cn('space-y-spacing-sm', className)}>
      {activeGates.map((gate) => {
        const Icon = gate.icon;
        const isError = gate.severity === 'error';
        
        return (
          <div
            key={gate.key}
            className={cn(
              'flex items-center gap-spacing-md px-spacing-md py-spacing-sm rounded-radius border',
              isError 
                ? 'bg-danger/10 border-danger/25 text-danger' 
                : 'bg-warning/10 border-warning/25 text-warning'
            )}
            role="alert"
          >
            <Icon className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <span className="text-sm font-medium">{gate.label}</span>
            </div>
            <span className={cn(
              'px-2 py-0.5 text-xs font-semibold uppercase rounded',
              isError ? 'bg-danger/20' : 'bg-warning/20'
            )}>
              {isError ? 'Blocked' : 'Warning'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Compact version for list rows
export function GateBadges({ flags }: { flags: GateFlags }) {
  const activeFlags = Object.entries(flags).filter(([_, value]) => value);
  
  if (activeFlags.length === 0) return null;
  
  return (
    <div className="flex gap-1">
      {activeFlags.map(([key]) => {
        const gate = gateItems.find(g => g.key === key);
        if (!gate) return null;
        
        const Icon = gate.icon;
        const isError = gate.severity === 'error';
        
        return (
          <div
            key={key}
            className={cn(
              'p-1 rounded',
              isError ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning'
            )}
            title={gate.label}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        );
      })}
    </div>
  );
}
