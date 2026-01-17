import { z } from 'zod';

// Inspection checkpoint schema
export const inspectionCheckpointSchema = z.object({
  id: z.string(),
  name: z.string(),
  specification: z.string(),
  measured: z.string().optional(),
  result: z.enum(['pass', 'fail', 'na']).optional(),
  notes: z.string().optional(),
});

// Inspection completion schema
export const inspectionCompleteSchema = z.object({
  inspectionId: z.string().min(1),
  checkpoints: z.array(inspectionCheckpointSchema),
  overallResult: z.enum(['pass', 'fail', 'hold']),
  notes: z.string().optional(),
});

// Final QC e-sign schema (reusing pattern from approvals)
export const finalQcSignOffSchema = z.object({
  inspectionId: z.string().min(1),
  attestation: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the attestation to proceed',
  }),
  typedName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  result: z.enum(['pass', 'fail', 'hold']),
  comments: z
    .string()
    .trim()
    .max(1000, 'Comments must be less than 1000 characters')
    .optional(),
});

// NCR creation schema
export const ncrCreateSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(2000),
  severity: z.enum(['minor', 'major', 'critical']),
  workOrderId: z.string().optional(),
  workOrderNumber: z.string().optional(),
  itemNumber: z.string().trim().min(1, 'Item number is required'),
  itemDescription: z.string().trim().min(1, 'Item description is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  defectType: z.string().trim().min(1, 'Defect type is required'),
});

// NCR disposition schema
export const ncrDispositionSchema = z.object({
  ncrId: z.string().min(1),
  disposition: z.enum(['rework', 'scrap', 'use_as_is', 'return_to_vendor']),
  rootCause: z.string().trim().min(10, 'Root cause must be at least 10 characters'),
  correctiveAction: z.string().trim().min(10, 'Corrective action must be at least 10 characters'),
  assignedToUserId: z.string().optional(),
});

// NCR status update schema
export const ncrStatusUpdateSchema = z.object({
  ncrId: z.string().min(1),
  newStatus: z.enum(['raised', 'disposition', 'rework', 'retest', 'closed']),
  comments: z.string().trim().min(5, 'Comments are required').max(1000),
});

export type InspectionCheckpointData = z.infer<typeof inspectionCheckpointSchema>;
export type InspectionCompleteData = z.infer<typeof inspectionCompleteSchema>;
export type FinalQcSignOffData = z.infer<typeof finalQcSignOffSchema>;
export type NcrCreateData = z.infer<typeof ncrCreateSchema>;
export type NcrDispositionData = z.infer<typeof ncrDispositionSchema>;
export type NcrStatusUpdateData = z.infer<typeof ncrStatusUpdateSchema>;
