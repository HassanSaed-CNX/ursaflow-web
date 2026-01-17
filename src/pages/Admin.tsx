import { useState, useCallback, useMemo } from 'react';
import { Settings, Save, RotateCcw, Eye, AlertCircle, Check, ChevronRight } from 'lucide-react';
import { PageHeader, PageCard } from '@/components/ui/PageCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BaseButton } from '@/components/BaseButton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useStrings } from '@/i18n/useStrings';
import { roleConfigs, ROLES, ROLE_LABELS, type Role, type RoleConfig, type NavItem } from '@/configs/roleConfig';
import { cn } from '@/lib/utils';

// Default config for restore
const DEFAULT_ROLE_CONFIGS = JSON.parse(JSON.stringify(roleConfigs));

interface ValidationError {
  path: string;
  message: string;
}

function validateRoleConfig(config: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!config || typeof config !== 'object') {
    errors.push({ path: 'root', message: 'Config must be an object' });
    return errors;
  }
  
  const configObj = config as Record<string, unknown>;
  
  for (const role of ROLES) {
    if (!configObj[role]) {
      errors.push({ path: role, message: `Missing config for role: ${role}` });
      continue;
    }
    
    const roleConfig = configObj[role] as Record<string, unknown>;
    
    if (!roleConfig.navItems || !Array.isArray(roleConfig.navItems)) {
      errors.push({ path: `${role}.navItems`, message: 'navItems must be an array' });
    }
    
    if (!roleConfig.allowedActions || !Array.isArray(roleConfig.allowedActions)) {
      errors.push({ path: `${role}.allowedActions`, message: 'allowedActions must be an array' });
    }
    
    if (!roleConfig.layoutMode || !['sidebar', 'singleScreen'].includes(roleConfig.layoutMode as string)) {
      errors.push({ path: `${role}.layoutMode`, message: 'layoutMode must be "sidebar" or "singleScreen"' });
    }
  }
  
  return errors;
}

// Nav Preview Component
function NavPreview({ navItems, roleName }: { navItems: NavItem[]; roleName: string }) {
  return (
    <div className="border border-border rounded-radius bg-background">
      <div className="px-spacing-md py-spacing-sm bg-header text-header-foreground text-sm font-medium rounded-t-radius">
        {roleName} Navigation
      </div>
      <div className="p-spacing-sm space-y-spacing-xs max-h-64 overflow-y-auto">
        {navItems.length === 0 ? (
          <p className="text-text-muted text-sm italic px-spacing-sm">No nav items</p>
        ) : (
          navItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-spacing-sm px-spacing-sm py-spacing-xs rounded-radius-sm hover:bg-surface text-sm"
            >
              <ChevronRight className="h-3 w-3 text-text-muted" />
              <span className="text-text">{item.label}</span>
              <span className="text-text-muted text-xs ml-auto">{item.path}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Terms Preview Component
function TermsPreview() {
  const { t } = useStrings();
  
  return (
    <PageCard>
      <h3 className="text-lg font-semibold text-text mb-spacing-md">Required UI Terms Preview</h3>
      <p className="text-sm text-text-muted mb-spacing-lg">
        These exact labels must appear in the UI as specified:
      </p>
      
      <div className="grid gap-spacing-lg sm:grid-cols-2">
        <div className="p-spacing-md bg-background rounded-radius border border-border">
          <div className="flex items-center gap-spacing-sm mb-spacing-sm">
            <Check className="h-5 w-5 text-success" />
            <span className="font-mono text-sm text-text-muted">fields.mpn</span>
          </div>
          <div className="text-2xl font-bold text-text">{t('fields.mpn')}</div>
          <p className="text-xs text-text-muted mt-spacing-xs">
            Part identification field label
          </p>
        </div>
        
        <div className="p-spacing-md bg-background rounded-radius border border-border">
          <div className="flex items-center gap-spacing-sm mb-spacing-sm">
            <Check className="h-5 w-5 text-success" />
            <span className="font-mono text-sm text-text-muted">spares.aging</span>
          </div>
          <div className="text-2xl font-bold text-text">{t('spares.aging')}</div>
          <p className="text-xs text-text-muted mt-spacing-xs">
            Spares aging panel label
          </p>
        </div>
      </div>
      
      <div className="mt-spacing-lg p-spacing-md bg-accent/5 rounded-radius border border-accent/20">
        <h4 className="text-sm font-medium text-text mb-spacing-sm">i18n Key Locations</h4>
        <div className="text-xs text-text-muted font-mono space-y-spacing-xs">
          <div>• MPN # → src/i18n/en.ts → fields.mpn</div>
          <div>• AGING → src/i18n/en.ts → spares.aging</div>
          <div>• Status labels → src/i18n/en.ts → status.*</div>
        </div>
      </div>
    </PageCard>
  );
}

export function Admin() {
  const { t } = useStrings();
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [configJson, setConfigJson] = useState(() => 
    JSON.stringify(roleConfigs, null, 2)
  );
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [savedConfig, setSavedConfig] = useState<Record<Role, RoleConfig>>(roleConfigs);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const parsedConfig = useMemo(() => {
    try {
      return JSON.parse(configJson) as Record<Role, RoleConfig>;
    } catch {
      return null;
    }
  }, [configJson]);
  
  const handleJsonChange = useCallback((value: string) => {
    setConfigJson(value);
    setHasChanges(true);
    setSaveSuccess(false);
    
    try {
      const parsed = JSON.parse(value);
      const errors = validateRoleConfig(parsed);
      setValidationErrors(errors);
    } catch (e) {
      setValidationErrors([{ path: 'json', message: 'Invalid JSON syntax' }]);
    }
  }, []);
  
  const handleSave = useCallback(() => {
    if (validationErrors.length > 0 || !parsedConfig) return;
    
    setSavedConfig(parsedConfig);
    setHasChanges(false);
    setSaveSuccess(true);
    
    // In a real app, this would persist to backend
    console.log('Config saved:', parsedConfig);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  }, [validationErrors, parsedConfig]);
  
  const handleRestoreDefaults = useCallback(() => {
    const defaultJson = JSON.stringify(DEFAULT_ROLE_CONFIGS, null, 2);
    setConfigJson(defaultJson);
    setValidationErrors([]);
    setHasChanges(true);
    setSaveSuccess(false);
  }, []);

  return (
    <div className="space-y-spacing-lg">
      <Breadcrumbs items={[{ label: t('pages.admin') }]} />

      <PageHeader
        icon={Settings}
        title={t('pages.admin')}
        description="Manage role permissions, navigation, and system configuration"
      />
      
      {/* Terms Preview */}
      <TermsPreview />

      {/* Role Config Editor */}
      <PageCard>
        <div className="flex flex-col lg:flex-row gap-spacing-lg">
          {/* Left: JSON Editor */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-spacing-md">
              <h3 className="text-lg font-semibold text-text">Role Configuration Editor</h3>
              <div className="flex items-center gap-spacing-sm">
                <BaseButton
                  variant="secondary"
                  size="sm"
                  onClick={handleRestoreDefaults}
                  leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                >
                  Restore Defaults
                </BaseButton>
                <BaseButton
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={validationErrors.length > 0 || !hasChanges}
                  leftIcon={saveSuccess ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                >
                  {saveSuccess ? 'Saved!' : 'Save Changes'}
                </BaseButton>
              </div>
            </div>
            
            {validationErrors.length > 0 && (
              <ErrorBanner
                title="Validation Errors"
                message={validationErrors.map(e => `${e.path}: ${e.message}`).join('; ')}
              />
            )}
            
            <div className="relative mt-spacing-md">
              <textarea
                value={configJson}
                onChange={(e) => handleJsonChange(e.target.value)}
                className={cn(
                  'w-full h-[500px] p-spacing-md font-mono text-xs',
                  'bg-background border rounded-radius',
                  'text-text focus:outline-none focus:ring-2 focus:ring-focus',
                  'resize-none',
                  validationErrors.length > 0 ? 'border-danger' : 'border-border'
                )}
                spellCheck={false}
                aria-label="Role configuration JSON editor"
              />
              {hasChanges && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-warning text-warning-foreground text-xs rounded-radius-sm">
                  Unsaved changes
                </div>
              )}
            </div>
            
            <p className="text-xs text-text-muted mt-spacing-sm">
              Edit the JSON above to modify role permissions and navigation. 
              Changes will take effect immediately on save (in demo mode, persists to console only).
            </p>
          </div>
          
          {/* Right: Live Nav Preview */}
          <div className="lg:w-80">
            <div className="flex items-center gap-spacing-sm mb-spacing-md">
              <Eye className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold text-text">Navigation Preview</h3>
            </div>
            
            {/* Role Selector */}
            <div className="mb-spacing-md">
              <label className="block text-sm font-medium text-text mb-spacing-xs">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="w-full h-10 px-3 rounded-radius border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-focus"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Preview from saved config */}
            <div className="space-y-spacing-md">
              <NavPreview 
                navItems={savedConfig[selectedRole]?.navItems || []} 
                roleName={ROLE_LABELS[selectedRole]}
              />
              
              <div className="p-spacing-md bg-background rounded-radius border border-border">
                <h4 className="text-sm font-medium text-text mb-spacing-sm">Layout Mode</h4>
                <span className={cn(
                  'inline-block px-2 py-1 text-xs font-medium rounded-radius-sm',
                  savedConfig[selectedRole]?.layoutMode === 'sidebar' 
                    ? 'bg-accent/10 text-accent' 
                    : 'bg-success/10 text-success'
                )}>
                  {savedConfig[selectedRole]?.layoutMode === 'sidebar' ? 'Sidebar Layout' : 'Single Screen Layout'}
                </span>
              </div>
              
              <div className="p-spacing-md bg-background rounded-radius border border-border">
                <h4 className="text-sm font-medium text-text mb-spacing-sm">Allowed Actions</h4>
                <div className="flex flex-wrap gap-spacing-xs">
                  {(savedConfig[selectedRole]?.allowedActions || []).slice(0, 6).map((action) => (
                    <span 
                      key={action}
                      className="px-2 py-0.5 bg-surface text-text-muted text-xs rounded-radius-sm border border-border"
                    >
                      {action}
                    </span>
                  ))}
                  {(savedConfig[selectedRole]?.allowedActions?.length || 0) > 6 && (
                    <span className="px-2 py-0.5 text-text-muted text-xs">
                      +{(savedConfig[selectedRole]?.allowedActions?.length || 0) - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageCard>
      
      {/* Config Location Info */}
      <PageCard>
        <h3 className="text-lg font-semibold text-text mb-spacing-md">Configuration Files</h3>
        <div className="grid gap-spacing-md sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-spacing-md bg-background rounded-radius border border-border">
            <h4 className="font-medium text-text mb-spacing-xs">Role Config</h4>
            <code className="text-xs text-accent">src/configs/roleConfig.ts</code>
            <p className="text-xs text-text-muted mt-spacing-sm">
              Roles, nav items, permissions
            </p>
          </div>
          <div className="p-spacing-md bg-background rounded-radius border border-border">
            <h4 className="font-medium text-text mb-spacing-xs">Theme Tokens</h4>
            <code className="text-xs text-accent">src/styles/tokens.css</code>
            <p className="text-xs text-text-muted mt-spacing-sm">
              CSS variables for colors, spacing
            </p>
          </div>
          <div className="p-spacing-md bg-background rounded-radius border border-border">
            <h4 className="font-medium text-text mb-spacing-xs">i18n Strings</h4>
            <code className="text-xs text-accent">src/i18n/en.ts</code>
            <p className="text-xs text-text-muted mt-spacing-sm">
              All UI text including MPN # and AGING
            </p>
          </div>
          <div className="p-spacing-md bg-background rounded-radius border border-border">
            <h4 className="font-medium text-text mb-spacing-xs">Mock Data</h4>
            <code className="text-xs text-accent">src/mocks/*.ts</code>
            <p className="text-xs text-text-muted mt-spacing-sm">
              Sample data for development
            </p>
          </div>
          <div className="p-spacing-md bg-background rounded-radius border border-border">
            <h4 className="font-medium text-text mb-spacing-xs">Gate Logic</h4>
            <code className="text-xs text-accent">src/services/gates/gateEngine.ts</code>
            <p className="text-xs text-text-muted mt-spacing-sm">
              Hard-gate business rules
            </p>
          </div>
          <div className="p-spacing-md bg-background rounded-radius border border-border">
            <h4 className="font-medium text-text mb-spacing-xs">Tailwind Config</h4>
            <code className="text-xs text-accent">tailwind.config.ts</code>
            <p className="text-xs text-text-muted mt-spacing-sm">
              Token mapping to Tailwind classes
            </p>
          </div>
        </div>
      </PageCard>
    </div>
  );
}
