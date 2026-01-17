import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-radius font-medium
   transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm',
        secondary: 'bg-surface text-text border border-border hover:bg-background hover:border-border-strong',
        success: 'bg-success text-success-foreground hover:opacity-90 shadow-sm',
        warning: 'bg-warning text-warning-foreground hover:opacity-90 shadow-sm',
        danger: 'bg-danger text-danger-foreground hover:opacity-90 shadow-sm',
        ghost: 'text-text hover:bg-surface hover:text-accent',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface DemoButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const DemoButton = forwardRef<HTMLButtonElement, DemoButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

DemoButton.displayName = 'DemoButton';
