import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface text-text border border-border',
        accent: 'bg-accent/10 text-accent border border-accent/20',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        danger: 'bg-danger/10 text-danger border border-danger/20',
        muted: 'bg-background text-text-muted border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface DemoChipProps extends VariantProps<typeof chipVariants> {
  children: React.ReactNode;
  className?: string;
}

export function DemoChip({ variant, children, className }: DemoChipProps) {
  return (
    <span className={cn(chipVariants({ variant, className }))}>
      {children}
    </span>
  );
}
