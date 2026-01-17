import { z } from 'zod';

export const notificationSeveritySchema = z.enum(['info', 'warning', 'error', 'critical']);

export const notificationCategorySchema = z.enum([
  'quality',
  'test',
  'production',
  'resource',
  'exception',
  'packaging',
  'logistics',
  'compliance',
  'audit',
]);

export const notificationStatusSchema = z.enum(['new', 'acknowledged', 'closed']);

export const notificationChannelsSchema = z.object({
  inApp: z.boolean(),
  email: z.boolean(),
  teams: z.boolean(),
});

export const notificationItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  severity: notificationSeveritySchema,
  category: notificationCategorySchema,
  roleTarget: z.array(z.string()),
  module: z.string(),
  workOrderId: z.string().optional(),
  workOrderNumber: z.string().optional(),
  itemNumber: z.string().optional(),
  status: notificationStatusSchema,
  createdAt: z.date(),
  slaDueAt: z.date().optional(),
  acknowledgedAt: z.date().optional(),
  acknowledgedBy: z.string().optional(),
  closedAt: z.date().optional(),
  channels: notificationChannelsSchema,
});

export const approvalRequestSchema = z.object({
  id: z.string(),
  notificationId: z.string(),
  type: z.enum(['quality_hold', 'ncr', 'deviation', 'rework']),
  requestedBy: z.string(),
  requestedAt: z.date(),
  status: z.enum(['pending', 'approved', 'rejected']),
  approvedBy: z.string().optional(),
  approvedAt: z.date().optional(),
  comments: z.string().optional(),
});

export const auditTrailEntrySchema = z.object({
  id: z.string(),
  entityType: z.enum(['notification', 'approval', 'workorder']),
  entityId: z.string(),
  action: z.string(),
  performedBy: z.string(),
  performedAt: z.date(),
  details: z.record(z.unknown()).optional(),
});

// Form schemas
export const acknowledgeFormSchema = z.object({
  notificationId: z.string().min(1),
  comments: z.string().optional(),
});

export const approvalFormSchema = z.object({
  notificationId: z.string().min(1),
  decision: z.enum(['approve', 'reject']),
  comments: z.string().min(1, 'Comments are required for approval decisions'),
});

export const routeToReworkSchema = z.object({
  notificationId: z.string().min(1),
  workOrderId: z.string().min(1),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  targetStep: z.string().optional(),
});

export type AcknowledgeFormData = z.infer<typeof acknowledgeFormSchema>;
export type ApprovalFormData = z.infer<typeof approvalFormSchema>;
export type RouteToReworkFormData = z.infer<typeof routeToReworkSchema>;
