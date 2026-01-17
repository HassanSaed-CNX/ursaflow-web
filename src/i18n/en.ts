// Centralized i18n strings - English
// All user-facing text must be defined here

export const en = {
  // App
  app: {
    name: 'Industrial MES',
    tagline: 'Manufacturing Execution System',
  },

  // Common UI
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    submit: 'Submit',
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh',
    retry: 'Retry',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    actions: 'Actions',
    status: 'Status',
    details: 'Details',
    noData: 'No data available',
    noResults: 'No results found',
    selectOption: 'Select an option',
    required: 'Required',
    optional: 'Optional',
  },

  // Status chips - exact labels
  status: {
    pass: 'PASS',
    fail: 'FAIL',
    hold: 'HOLD',
    ready: 'READY',
    pending: 'PENDING',
    inProgress: 'IN PROGRESS',
    complete: 'COMPLETE',
    aging: 'AGING', // Required exact term
    approved: 'APPROVED',
    rejected: 'REJECTED',
    open: 'OPEN',
    closed: 'CLOSED',
  },

  // Form labels - exact terms required
  labels: {
    mpn: 'MPN #', // Required exact term
    serialNumber: 'Serial Number',
    partNumber: 'Part Number',
    quantity: 'Quantity',
    description: 'Description',
    notes: 'Notes',
    date: 'Date',
    assignee: 'Assignee',
    priority: 'Priority',
    workOrder: 'Work Order',
    lotNumber: 'Lot Number',
    batchNumber: 'Batch Number',
    location: 'Location',
    station: 'Station',
  },

  // Error messages
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    notFound: 'The requested resource was not found.',
    unauthorized: 'You are not authorized to perform this action.',
    validation: 'Please check your input and try again.',
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidNumber: 'Please enter a valid number',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be no more than {max} characters',
  },

  // Empty states
  empty: {
    workOrders: 'No work orders found',
    inventory: 'No inventory items',
    testResults: 'No test results available',
    notifications: 'No new notifications',
    searchResults: 'No matching results',
  },

  // Page titles
  pages: {
    dashboard: 'Dashboard',
    controlTower: 'Control Tower',
    workOrders: 'Work Orders',
    kitting: 'Kitting',
    assembly: 'Assembly',
    inProcessQc: 'In-Process QC',
    testBench: 'Test Bench',
    finalQc: 'Final QC',
    serialization: 'Serialization & Labels',
    packingHandover: 'Packing & Handover',
    notifications: 'Notifications & Approvals',
    ncrCapa: 'NCR / CAPA',
    admin: 'Admin',
    themeGuide: 'Theme Guide',
    sparesAging: 'Spares AGING',
    inventory: 'Inventory',
    reports: 'Reports',
    users: 'Users',
    settings: 'Settings',
    maintenance: 'Maintenance',
  },

  // Roles
  roles: {
    operator: 'Operator',
    testBenchOperator: 'Test Bench Operator',
    qaTech: 'QA Tech',
    packaging: 'Packaging',
    supervisor: 'Supervisor/Planner',
    admin: 'Admin',
  },

  // Actions
  actions: {
    createWorkOrder: 'Create Work Order',
    editWorkOrder: 'Edit Work Order',
    viewDetails: 'View Details',
    approve: 'Approve',
    reject: 'Reject',
    startTest: 'Start Test',
    completeTest: 'Complete Test',
    printLabel: 'Print Label',
    scanBarcode: 'Scan Barcode',
  },

  // Confirmations
  confirm: {
    delete: 'Are you sure you want to delete this item?',
    discard: 'Discard unsaved changes?',
    submit: 'Submit this form?',
  },

  // Accessibility
  a11y: {
    closeModal: 'Close modal',
    openMenu: 'Open menu',
    toggleSidebar: 'Toggle sidebar',
    loading: 'Content is loading',
    error: 'An error occurred',
  },
} as const;

export type StringKeys = typeof en;
