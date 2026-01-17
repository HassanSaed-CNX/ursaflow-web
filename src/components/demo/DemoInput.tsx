import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface DemoInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const DemoInput = forwardRef<HTMLInputElement, DemoInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="space-y-spacing-xs">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-text"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            `w-full h-10 px-3 rounded-radius border bg-surface text-text
             placeholder:text-text-muted transition-all duration-200
             focus:outline-none focus:ring-2 focus:ring-focus focus:border-accent
             disabled:opacity-50 disabled:cursor-not-allowed`,
            error ? 'border-danger' : 'border-border hover:border-border-strong',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-xs text-danger"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

DemoInput.displayName = 'DemoInput';
