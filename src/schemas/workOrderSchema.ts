import { z } from 'zod';

// Work Order status schema
export const workOrderStatusSchema = z.enum([
  'pending',
  'in_progress',
  'on_hold',
  'complete',
  'failed',
]);

// Priority schema
export const prioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

// Product line schema
export const productLineSchema = z.enum([
  'Cylinders',
  'Pumps',
  'Motors',
  'Valves',
  'Manifolds',
  'HPUs',
  'Hose & Fittings',
]);

// Routing step status schema
export const routingStepStatusSchema = z.enum([
  'pending',
  'in_progress',
  'complete',
  'skipped',
  'failed',
  'on_hold',
]);

// BOM Item schema
export const bomItemSchema = z.object({
  id: z.string(),
  partNumber: z.string().min(1, 'Part number is required'),
  description: z.string(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.string(),
  isKitted: z.boolean().optional(),
});

// Item Revision schema
export const itemRevisionSchema = z.object({
  id: z.string(),
  itemNumber: z.string().min(1, 'Item number is required'),
  revision: z.string(),
  description: z.string(),
  mpn: z.string().min(1, 'MPN # is required'),
});

// Routing Step schema
export const routingStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  order: z.number(),
  status: routingStepStatusSchema,
  assignedRole: z.string().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  notes: z.string().optional(),
});

// Gate Flags schema
export const gateFlagsSchema = z.object({
  calibrationExpired: z.boolean().optional(),
  cleanlinessOutOfSpec: z.boolean().optional(),
  missingSerialScans: z.boolean().optional(),
  approvalsPending: z.boolean().optional(),
  ncrOpen: z.boolean().optional(),
});

// Work Order Event schema
export const workOrderEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(['status_change', 'step_complete', 'note', 'ncr_raised', 'hold', 'resume']),
  description: z.string(),
  userId: z.string().optional(),
  userName: z.string().optional(),
  data: z.record(z.unknown()).optional(),
});

// Full Work Order schema
export const workOrderSchema = z.object({
  id: z.string(),
  woNumber: z.string().min(1, 'Work Order number is required'),
  line: productLineSchema,
  item: itemRevisionSchema,
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  status: workOrderStatusSchema,
  priority: prioritySchema,
  dueDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  assignedRole: z.string().optional(),
  assignedUser: z.string().optional(),
  currentStepId: z.string(),
  routing: z.array(routingStepSchema),
  bom: z.array(bomItemSchema),
  events: z.array(workOrderEventSchema),
  gateFlags: gateFlagsSchema,
  notes: z.string().optional(),
});

// Form schemas for creating/editing
export const createWorkOrderSchema = z.object({
  line: productLineSchema,
  itemNumber: z.string().min(1, 'Item number is required').max(50),
  mpn: z.string().min(1, 'MPN # is required').max(50),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10000),
  priority: prioritySchema,
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().max(500).optional(),
});

// Event append schema
export const appendEventSchema = z.object({
  type: z.enum(['status_change', 'step_complete', 'note', 'ncr_raised', 'hold', 'resume']),
  description: z.string().min(1, 'Description is required').max(500),
});

// Scan input schema
export const scanInputSchema = z.object({
  barcode: z.string()
    .min(1, 'Please scan or enter a work order number')
    .max(50, 'Barcode too long')
    .regex(/^[A-Z0-9-]+$/i, 'Invalid barcode format'),
});

export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
export type AppendEventInput = z.infer<typeof appendEventSchema>;
export type ScanInput = z.infer<typeof scanInputSchema>;
