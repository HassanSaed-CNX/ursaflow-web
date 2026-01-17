# Industrial MES - Manufacturing Execution System

A frontend-only Manufacturing Execution System (MES) prototype built with React, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Base shadcn/ui components
│   ├── approvals/       # Approval workflow components
│   ├── gates/           # Gate check components
│   ├── notifications/   # Notification components
│   ├── packaging/       # Packaging & serialization components
│   ├── quality/         # QC components
│   └── workOrders/      # Work order components
├── configs/             # Central configuration
│   ├── roleConfig.ts    # Roles, nav items, permissions
│   └── policyConfig.ts  # Policy definitions
├── contexts/            # React context providers
│   ├── AuthContext.tsx  # Authentication state
│   └── ThemeContext.tsx # Theme management
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization
│   └── en.ts            # English strings (all UI text)
├── layouts/             # Page layouts
├── mocks/               # Mock data for development
├── pages/               # Route pages
├── schemas/             # Zod validation schemas
├── services/            # API service layer (mock stubs)
│   └── gates/           # Gate engine logic
├── styles/              # Global styles
│   └── tokens.css       # CSS design tokens
└── types/               # TypeScript type definitions
```

## Configuration

### Role Configuration (`src/configs/roleConfig.ts`)

Central configuration for all roles, navigation, and permissions:

```typescript
roleConfigs: {
  operator: { navItems: [...], allowedActions: [...] },
  test_bench_operator: { ... },
  qa_tech: { ... },
  packaging: { ... },
  supervisor: { ... },
  admin: { ... },
}
```

**Roles:**
- `operator` - Basic work order operations
- `test_bench_operator` - Test execution
- `qa_tech` - Quality inspection
- `packaging` - Serialization and packing
- `supervisor` - Full operational visibility
- `admin` - All access + admin tools

### Theme Configuration (`src/styles/tokens.css`)

Token-based theming with 3 modes:

| Mode | Description |
|------|-------------|
| `corporate-industrial` | Dark header + light content (default) |
| `dark-compact` | Full dark mode with reduced spacing |
| `high-contrast` | Maximum accessibility contrast |

**Key Tokens:**
```css
--background      /* Page background */
--surface         /* Card/panel background */
--header          /* Header background */
--text            /* Primary text */
--text-muted      /* Secondary text */
--accent          /* Primary accent (engineering blue) */
--success/warning/danger  /* Status colors */
```

### Internationalization (`src/i18n/en.ts`)

All user-facing strings in one place:

**Required Exact Terms:**
- `fields.mpn` → `"MPN #"`
- `spares.aging` → `"AGING"`

### Mock Data (`src/mocks/`)

Sample data for development:
- `workOrders.ts` - Work orders
- `approvals.ts` - Approval requests
- `notifications.ts` - Notifications
- `packaging.ts` - Labels, checklists
- `quality.ts` - QC records
- `gateEntities.ts` - Gate check entities

### Gate Engine (`src/services/gates/gateEngine.ts`)

Centralized hard-gate logic:

| Gate | Blocks |
|------|--------|
| `calibration_expired` | Test start |
| `cleanliness_out_of_spec` | Step advance |
| `serial_scans_missing` | Completion |
| `test_verdict_pending/fail` | Label print |
| `final_qc_not_signed` | Label print |
| `sod_violation` | Approval |

## Adding a New Theme

1. **Define tokens in `src/styles/tokens.css`:**
```css
[data-theme="my-theme"] {
  --background: 220 20% 95%;
  --accent: 180 70% 40%;
  /* ... other tokens */
}
```

2. **Register in `src/contexts/ThemeContext.tsx`:**
```typescript
const themes = [
  // ... existing
  { value: 'my-theme', label: 'My Theme', description: '...' }
];
```

3. Theme automatically available in switcher!

## Key Routes

| Route | Page |
|-------|------|
| `/` | Control Tower (dashboard) |
| `/work-orders` | Work order list |
| `/work-orders/:id` | Work order detail |
| `/kitting` | Kit preparation |
| `/assembly` | Assembly operations |
| `/test-bench` | Test execution |
| `/in-process-qc` | In-process QC |
| `/final-qc` | Final QC sign-off |
| `/serialization` | Label printing |
| `/packing-handover` | Pack & ship |
| `/approvals` | Approval queue |
| `/notifications` | Notification center |
| `/quality` | QA module |
| `/ncr-board` | NCR kanban board |
| `/spares-aging` | Spares aging tracker |
| `/admin` | Admin config editor |
| `/admin/theme-guide` | Theme documentation |

## Quality Standards

- ✅ WCAG AA accessibility
- ✅ Keyboard navigation with focus management
- ✅ Zod validation on all forms
- ✅ Loading, empty, and error states on all routes
- ✅ Tablet-responsive layouts
- ✅ i18n-ready (centralized strings)
- ✅ Config-driven role UI

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component primitives
- **Zod** - Schema validation
- **React Router** - Routing
- **React Query** - Data fetching
- **Lucide** - Icons

## License

Proprietary - Internal use only
