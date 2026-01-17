import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { DemoCard } from '@/components/demo/DemoCard';
import { DemoButton } from '@/components/demo/DemoButton';
import { DemoChip } from '@/components/demo/DemoChip';
import { DemoInput } from '@/components/demo/DemoInput';
import { Package, Wrench, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Dark Header */}
      <header className="sticky top-0 z-50 bg-header border-b border-border-strong shadow-md">
        <div className="container mx-auto px-spacing-lg py-spacing-md flex items-center justify-between">
          <div className="flex items-center gap-spacing-md">
            <Package className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-xl font-bold text-header-foreground">Industrial MES</h1>
              <p className="text-xs text-header-foreground/70">Manufacturing Execution System</p>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Light Content Canvas */}
      <main className="container mx-auto px-spacing-lg py-spacing-xl">
        <div className="mb-spacing-xl">
          <h2 className="text-2xl font-bold text-text mb-spacing-xs">Theme System Demo</h2>
          <p className="text-text-muted">
            Switch between themes using the controls in the header. Changes persist across page refreshes.
          </p>
        </div>

        <div className="grid gap-spacing-lg md:grid-cols-2 lg:grid-cols-3">
          {/* Buttons Card */}
          <DemoCard 
            title="Buttons" 
            description="Primary actions and variants"
            variant="surface"
          >
            <div className="flex flex-wrap gap-spacing-sm">
              <DemoButton variant="primary">Primary</DemoButton>
              <DemoButton variant="secondary">Secondary</DemoButton>
              <DemoButton variant="ghost">Ghost</DemoButton>
            </div>
            <div className="flex flex-wrap gap-spacing-sm">
              <DemoButton variant="success" size="sm">
                <CheckCircle className="h-4 w-4" /> Approve
              </DemoButton>
              <DemoButton variant="warning" size="sm">
                <AlertTriangle className="h-4 w-4" /> Review
              </DemoButton>
              <DemoButton variant="danger" size="sm">
                <XCircle className="h-4 w-4" /> Reject
              </DemoButton>
            </div>
          </DemoCard>

          {/* Chips/Status Card */}
          <DemoCard 
            title="Status Chips" 
            description="Status indicators and labels"
            variant="surface"
          >
            <div className="flex flex-wrap gap-spacing-sm">
              <DemoChip variant="default">Default</DemoChip>
              <DemoChip variant="accent">Active</DemoChip>
              <DemoChip variant="muted">Inactive</DemoChip>
            </div>
            <div className="flex flex-wrap gap-spacing-sm">
              <DemoChip variant="success">Passed</DemoChip>
              <DemoChip variant="warning">AGING</DemoChip>
              <DemoChip variant="danger">Failed</DemoChip>
            </div>
          </DemoCard>

          {/* Form Inputs Card */}
          <DemoCard 
            title="Form Inputs" 
            description="Text inputs with validation"
            variant="surface"
          >
            <DemoInput 
              label="MPN #" 
              placeholder="Enter part number" 
            />
            <DemoInput 
              label="Serial Number" 
              placeholder="SN-000000" 
              error="This field is required"
            />
          </DemoCard>

          {/* Typography Card */}
          <DemoCard 
            title="Typography" 
            description="Text hierarchy and colors"
            variant="surface"
          >
            <p className="text-xl font-bold text-text">Heading Text</p>
            <p className="text-base text-text">Body text in primary color</p>
            <p className="text-sm text-text-muted">Muted secondary text</p>
            <p className="text-xs text-accent font-medium">Accent link text</p>
          </DemoCard>

          {/* Borders & Surfaces Card */}
          <DemoCard 
            title="Surfaces & Borders" 
            description="Container styles"
            variant="surface"
          >
            <div className="p-spacing-md bg-background border border-border rounded-radius">
              <p className="text-sm text-text">Background surface</p>
            </div>
            <div className="p-spacing-md bg-surface border border-border-strong rounded-radius">
              <p className="text-sm text-text">Elevated surface</p>
            </div>
          </DemoCard>

          {/* Focus States Card */}
          <DemoCard 
            title="Focus States" 
            description="Keyboard navigation indicators"
            variant="surface"
          >
            <p className="text-sm text-text-muted mb-spacing-sm">
              Tab through elements to see focus rings
            </p>
            <div className="flex gap-spacing-sm">
              <DemoButton variant="primary" size="sm">
                <Wrench className="h-4 w-4" /> Action 1
              </DemoButton>
              <DemoButton variant="secondary" size="sm">Action 2</DemoButton>
            </div>
          </DemoCard>
        </div>

        {/* Spacing Demo */}
        <div className="mt-spacing-xl">
          <DemoCard 
            title="Spacing Tokens" 
            description="Spacing adjusts in Dark Compact mode"
            variant="surface"
          >
            <div className="flex items-end gap-spacing-md">
              <div className="flex flex-col items-center">
                <div className="w-16 h-4 bg-accent rounded-radius-sm mb-spacing-xs" />
                <span className="text-xs text-text-muted">xs</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-6 bg-accent rounded-radius-sm mb-spacing-xs" />
                <span className="text-xs text-text-muted">sm</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-10 bg-accent rounded-radius mb-spacing-xs" />
                <span className="text-xs text-text-muted">md</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-14 bg-accent rounded-radius mb-spacing-xs" />
                <span className="text-xs text-text-muted">lg</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-20 bg-accent rounded-radius-lg mb-spacing-xs" />
                <span className="text-xs text-text-muted">xl</span>
              </div>
            </div>
          </DemoCard>
        </div>
      </main>
    </div>
  );
};

export default Index;
