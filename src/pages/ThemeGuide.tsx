import { useState } from 'react';
import { Palette, Code, Copy, Check, Moon, Sun, Eye } from 'lucide-react';
import { PageHeader, PageCard } from '@/components/ui/PageCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BaseButton } from '@/components/BaseButton';
import { StatusChip } from '@/components/ui/StatusChip';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { SkeletonCard, SkeletonTable, Skeleton } from '@/components/ui/CustomSkeleton';
import { DataTable } from '@/components/ui/DataTable';
import { useStrings } from '@/i18n/useStrings';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

// Token documentation
const TOKEN_DOCS = {
  colors: [
    { name: '--background', description: 'Page background color', tailwind: 'bg-background' },
    { name: '--surface', description: 'Card/panel background', tailwind: 'bg-surface' },
    { name: '--header', description: 'Header/navbar background', tailwind: 'bg-header' },
    { name: '--text', description: 'Primary text color', tailwind: 'text-text' },
    { name: '--text-muted', description: 'Secondary/muted text', tailwind: 'text-text-muted' },
    { name: '--border', description: 'Standard border color', tailwind: 'border-border' },
    { name: '--accent', description: 'Primary accent (engineering blue)', tailwind: 'bg-accent' },
    { name: '--success', description: 'Success states', tailwind: 'bg-success' },
    { name: '--warning', description: 'Warning states', tailwind: 'bg-warning' },
    { name: '--danger', description: 'Error/danger states', tailwind: 'bg-danger' },
    { name: '--focus', description: 'Focus ring color', tailwind: 'ring-focus' },
  ],
  spacing: [
    { name: '--spacing-xs', value: '0.25rem', tailwind: 'spacing-xs' },
    { name: '--spacing-sm', value: '0.5rem', tailwind: 'spacing-sm' },
    { name: '--spacing-md', value: '1rem', tailwind: 'spacing-md' },
    { name: '--spacing-lg', value: '1.5rem', tailwind: 'spacing-lg' },
    { name: '--spacing-xl', value: '2rem', tailwind: 'spacing-xl' },
  ],
  radius: [
    { name: '--radius-sm', value: '0.25rem', tailwind: 'rounded-radius-sm' },
    { name: '--radius', value: '0.375rem', tailwind: 'rounded-radius' },
    { name: '--radius-lg', value: '0.5rem', tailwind: 'rounded-radius-lg' },
  ],
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded-radius-sm hover:bg-background text-text-muted hover:text-text transition-colors"
      aria-label={`Copy ${text}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function CodeBlock({ code, language = 'css' }: { code: string; language?: string }) {
  return (
    <div className="relative bg-header rounded-radius overflow-hidden">
      <div className="flex items-center justify-between px-spacing-md py-spacing-sm border-b border-border-strong">
        <span className="text-xs text-header-foreground/70 font-mono">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-spacing-md overflow-x-auto">
        <code className="text-xs text-header-foreground font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

export function ThemeGuide() {
  const { t } = useStrings();
  const { theme, setTheme, themes } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleData = [
    { id: '1', mpn: 'MPN-001', status: 'pass', quantity: 150 },
    { id: '2', mpn: 'MPN-002', status: 'fail', quantity: 23 },
    { id: '3', mpn: 'MPN-003', status: 'hold', quantity: 87 },
    { id: '4', mpn: 'MPN-004', status: 'aging', quantity: 42 },
  ];

  const addNewThemeExample = `/* Add to src/styles/tokens.css */
[data-theme="my-custom-theme"] {
  --background: 220 20% 95%;
  --surface: 0 0% 100%;
  --header: 240 30% 20%;
  --header-foreground: 0 0% 100%;
  --text: 220 25% 10%;
  --text-muted: 220 10% 46%;
  --border: 220 15% 80%;
  --accent: 180 70% 40%; /* Custom teal accent */
  --success: 142 71% 35%;
  --warning: 38 92% 50%;
  --danger: 0 72% 51%;
  --focus: 180 70% 50%;
  --ring: 180 70% 40%;
  
  /* Keep spacing/radius or customize */
  --spacing-xs: 0.25rem;
  /* ... */
}`;

  const tailwindMappingExample = `// tailwind.config.ts
colors: {
  background: 'hsl(var(--background))',
  surface: 'hsl(var(--surface))',
  header: 'hsl(var(--header))',
  text: 'hsl(var(--text))',
  'text-muted': 'hsl(var(--text-muted))',
  border: 'hsl(var(--border))',
  accent: 'hsl(var(--accent))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  danger: 'hsl(var(--danger))',
}`;

  const themeContextExample = `// Add to ThemeContext.tsx themes array
{
  value: 'my-custom-theme',
  label: 'My Custom Theme',
  description: 'A custom teal-accented theme'
}`;

  return (
    <div className="space-y-spacing-lg">
      <Breadcrumbs items={[{ label: 'Admin', path: '/admin' }, { label: 'Theme Guide' }]} />

      <PageHeader
        icon={Palette}
        title={t('pages.themeGuide')}
        description="Token-based theming system documentation and component showcase"
        actions={
          <div className="flex items-center gap-spacing-sm">
            {themes.map((t) => (
              <BaseButton
                key={t.value}
                variant={theme === t.value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme(t.value)}
              >
                {t.label}
              </BaseButton>
            ))}
          </div>
        }
      />

      {/* Theme Architecture Overview */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md flex items-center gap-spacing-sm">
          <Code className="h-5 w-5 text-accent" />
          Theme Architecture
        </h3>
        <div className="grid gap-spacing-lg lg:grid-cols-3">
          <div className="p-spacing-md bg-background rounded-radius border border-border">
            <h4 className="font-medium text-text mb-spacing-sm">1. CSS Variables</h4>
            <p className="text-sm text-text-muted mb-spacing-sm">
              Define all design tokens in <code className="text-accent">src/styles/tokens.css</code>
            </p>
            <p className="text-xs text-text-muted">
              HSL format for easy manipulation. Theme modes use data-theme attribute.
            </p>
          </div>
          <div className="p-spacing-md bg-background rounded-radius border border-border">
            <h4 className="font-medium text-text mb-spacing-sm">2. Tailwind Mapping</h4>
            <p className="text-sm text-text-muted mb-spacing-sm">
              Map tokens to Tailwind in <code className="text-accent">tailwind.config.ts</code>
            </p>
            <p className="text-xs text-text-muted">
              Use hsl(var(--token-name)) for dynamic theming.
            </p>
          </div>
          <div className="p-spacing-md bg-background rounded-radius border border-border">
            <h4 className="font-medium text-text mb-spacing-sm">3. Theme Context</h4>
            <p className="text-sm text-text-muted mb-spacing-sm">
              React context in <code className="text-accent">src/contexts/ThemeContext.tsx</code>
            </p>
            <p className="text-xs text-text-muted">
              Manages theme state, localStorage persistence, and data-theme attribute.
            </p>
          </div>
        </div>
      </PageCard>

      {/* Color Tokens */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Color Tokens</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-spacing-sm px-spacing-md text-text-muted font-medium">Preview</th>
                <th className="text-left py-spacing-sm px-spacing-md text-text-muted font-medium">CSS Variable</th>
                <th className="text-left py-spacing-sm px-spacing-md text-text-muted font-medium">Tailwind Class</th>
                <th className="text-left py-spacing-sm px-spacing-md text-text-muted font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_DOCS.colors.map((token) => (
                <tr key={token.name} className="border-b border-border">
                  <td className="py-spacing-sm px-spacing-md">
                    <div className={cn('w-10 h-10 rounded-radius border border-border', token.tailwind)} />
                  </td>
                  <td className="py-spacing-sm px-spacing-md">
                    <div className="flex items-center gap-spacing-xs">
                      <code className="text-xs text-accent font-mono">{token.name}</code>
                      <CopyButton text={`var(${token.name})`} />
                    </div>
                  </td>
                  <td className="py-spacing-sm px-spacing-md">
                    <div className="flex items-center gap-spacing-xs">
                      <code className="text-xs text-text-muted font-mono">{token.tailwind}</code>
                      <CopyButton text={token.tailwind} />
                    </div>
                  </td>
                  <td className="py-spacing-sm px-spacing-md text-text-muted">{token.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>

      {/* Spacing & Radius Tokens */}
      <div className="grid gap-spacing-lg lg:grid-cols-2">
        <PageCard>
          <h3 className="text-lg font-semibold text-text mb-spacing-md">Spacing Tokens</h3>
          <div className="space-y-spacing-sm">
            {TOKEN_DOCS.spacing.map((token) => (
              <div key={token.name} className="flex items-center gap-spacing-md">
                <div 
                  className="bg-accent rounded-radius-sm h-6" 
                  style={{ width: token.value }}
                />
                <code className="text-xs text-accent font-mono flex-1">{token.name}</code>
                <span className="text-xs text-text-muted">{token.value}</span>
              </div>
            ))}
          </div>
        </PageCard>
        
        <PageCard>
          <h3 className="text-lg font-semibold text-text mb-spacing-md">Border Radius Tokens</h3>
          <div className="flex items-end gap-spacing-lg">
            {TOKEN_DOCS.radius.map((token) => (
              <div key={token.name} className="text-center">
                <div 
                  className="w-16 h-16 bg-accent mb-spacing-sm"
                  style={{ borderRadius: token.value }}
                />
                <code className="text-xs text-accent font-mono block">{token.name}</code>
                <span className="text-xs text-text-muted">{token.value}</span>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      {/* How to Add New Theme */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md flex items-center gap-spacing-sm">
          <Eye className="h-5 w-5 text-accent" />
          Adding a New Theme Mode
        </h3>
        
        <div className="space-y-spacing-lg">
          <div>
            <h4 className="font-medium text-text mb-spacing-sm">Step 1: Define CSS Variables</h4>
            <CodeBlock code={addNewThemeExample} language="css" />
          </div>
          
          <div>
            <h4 className="font-medium text-text mb-spacing-sm">Step 2: Tailwind Already Mapped</h4>
            <p className="text-sm text-text-muted mb-spacing-sm">
              Tailwind classes automatically use CSS variables, so no changes needed:
            </p>
            <CodeBlock code={tailwindMappingExample} language="typescript" />
          </div>
          
          <div>
            <h4 className="font-medium text-text mb-spacing-sm">Step 3: Register Theme in Context</h4>
            <CodeBlock code={themeContextExample} language="typescript" />
          </div>
        </div>
      </PageCard>

      {/* Buttons */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Buttons</h3>
        <div className="flex flex-wrap gap-spacing-sm">
          <BaseButton variant="primary">Primary</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="success">Success</BaseButton>
          <BaseButton variant="warning">Warning</BaseButton>
          <BaseButton variant="danger">Danger</BaseButton>
          <BaseButton variant="ghost">Ghost</BaseButton>
          <BaseButton variant="link">Link</BaseButton>
        </div>
        <div className="flex flex-wrap gap-spacing-sm mt-spacing-md">
          <BaseButton size="xs">XS</BaseButton>
          <BaseButton size="sm">Small</BaseButton>
          <BaseButton size="md">Medium</BaseButton>
          <BaseButton size="lg">Large</BaseButton>
          <BaseButton isLoading>Loading</BaseButton>
          <BaseButton disabled>Disabled</BaseButton>
        </div>
      </PageCard>

      {/* Status Chips */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Status Chips</h3>
        <div className="flex flex-wrap gap-spacing-sm">
          <StatusChip status="pass" />
          <StatusChip status="fail" />
          <StatusChip status="hold" />
          <StatusChip status="ready" />
          <StatusChip status="pending" />
          <StatusChip status="inProgress" />
          <StatusChip status="aging" />
          <StatusChip status="approved" />
          <StatusChip status="rejected" />
          <StatusChip status="open" />
          <StatusChip status="closed" />
        </div>
      </PageCard>

      {/* Data Table */}
      <PageCard padding="none">
        <div className="p-spacing-lg pb-0">
          <h3 className="text-lg font-semibold text-text mb-spacing-md">Data Table</h3>
        </div>
        <DataTable
          columns={[
            { key: 'mpn', header: t('labels.mpn') },
            { 
              key: 'status', 
              header: t('common.status'),
              render: (row) => <StatusChip status={row.status as 'pass' | 'fail' | 'hold' | 'aging'} />
            },
            { key: 'quantity', header: t('labels.quantity'), align: 'right' },
          ]}
          data={sampleData}
          keyExtractor={(row) => row.id}
        />
      </PageCard>

      {/* Skeletons */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Skeletons</h3>
        <div className="grid gap-spacing-lg sm:grid-cols-2">
          <div>
            <p className="text-sm text-text-muted mb-spacing-sm">Card Skeleton</p>
            <SkeletonCard />
          </div>
          <div>
            <p className="text-sm text-text-muted mb-spacing-sm">Text Skeleton</p>
            <Skeleton variant="text" lines={4} />
          </div>
        </div>
        <div className="mt-spacing-lg">
          <p className="text-sm text-text-muted mb-spacing-sm">Table Skeleton</p>
          <SkeletonTable rows={3} columns={4} />
        </div>
      </PageCard>

      {/* Empty & Error States */}
      <div className="grid gap-spacing-lg sm:grid-cols-2">
        <PageCard>
          <h3 className="text-lg font-semibold text-text mb-spacing-md">Empty State</h3>
          <EmptyState
            title="No items found"
            description="Get started by creating your first item."
            action={{ label: 'Create Item', onClick: () => {} }}
          />
        </PageCard>
        <PageCard>
          <h3 className="text-lg font-semibold text-text mb-spacing-md">Error States</h3>
          <div className="space-y-spacing-md">
            <ErrorBanner
              title="Error loading data"
              message="Unable to fetch records from the server."
              onRetry={() => {}}
            />
            <ErrorBanner
              variant="warning"
              title="Warning"
              message="Some data may be outdated."
            />
          </div>
        </PageCard>
      </div>

      {/* Modal Demo */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Modal with Focus Trap</h3>
        <BaseButton onClick={() => setIsModalOpen(true)}>Open Modal</BaseButton>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Sample Modal"
          description="This modal demonstrates focus trap and ESC to close."
          footer={
            <>
              <BaseButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </BaseButton>
              <BaseButton onClick={() => setIsModalOpen(false)}>
                Confirm
              </BaseButton>
            </>
          }
        >
          <p className="text-text">
            Press <kbd className="px-1.5 py-0.5 rounded bg-background border text-xs">Tab</kbd> to 
            navigate, <kbd className="px-1.5 py-0.5 rounded bg-background border text-xs">Esc</kbd> to close.
          </p>
          <div className="mt-spacing-md">
            <label className="block text-sm font-medium text-text mb-spacing-xs">
              {t('labels.mpn')}
            </label>
            <input
              type="text"
              className="w-full h-10 px-3 rounded-radius border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-focus"
              placeholder="Enter value..."
            />
          </div>
        </Modal>
      </PageCard>

      {/* Current Theme Info */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Current Theme Info</h3>
        <div className="grid gap-spacing-md sm:grid-cols-3">
          {themes.map((t) => (
            <div 
              key={t.value}
              className={cn(
                'p-spacing-md rounded-radius border',
                theme === t.value 
                  ? 'border-accent bg-accent/5' 
                  : 'border-border bg-background'
              )}
            >
              <div className="flex items-center gap-spacing-sm mb-spacing-sm">
                {t.value === 'corporate-industrial' && <Sun className="h-4 w-4 text-accent" />}
                {t.value === 'dark-compact' && <Moon className="h-4 w-4 text-accent" />}
                {t.value === 'high-contrast' && <Eye className="h-4 w-4 text-accent" />}
                <span className="font-medium text-text">{t.label}</span>
                {theme === t.value && (
                  <span className="ml-auto text-xs text-accent font-medium">Active</span>
                )}
              </div>
              <p className="text-xs text-text-muted">{t.description}</p>
            </div>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
