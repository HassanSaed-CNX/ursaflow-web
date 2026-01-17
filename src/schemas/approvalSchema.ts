import { z } from 'zod';

// E-Sign form schema with strict validation
export const eSignFormSchema = z.object({
  approvalId: z.string().min(1, 'Approval ID is required'),
  decision: z.enum(['approve', 'reject'], {
    required_error: 'Decision is required',
  }),
  attestation: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the attestation to proceed',
  }),
  typedName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  comments: z
    .string()
    .trim()
    .min(10, 'Comments must be at least 10 characters')
    .max(1000, 'Comments must be less than 1000 characters'),
});

export type ESignFormData = z.infer<typeof eSignFormSchema>;

// Approval filter schema
export const approvalFilterSchema = z.object({
  status: z.array(z.enum(['pending', 'approved', 'rejected'])).optional(),
  type: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  search: z.string().optional(),
});

export type ApprovalFilterData = z.infer<typeof approvalFilterSchema>;
