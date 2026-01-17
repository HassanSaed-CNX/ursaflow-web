import { z } from 'zod';

// Label print form schema
export const labelPrintFormSchema = z.object({
  serialNumber: z.string().min(1, 'Serial number is required').max(50, 'Serial number too long'),
  mpn: z.string().min(1, 'MPN # is required').max(100, 'MPN # too long'),
  templateId: z.string().min(1, 'Label template is required'),
  copies: z.number().min(1, 'At least 1 copy required').max(100, 'Maximum 100 copies'),
});

export type LabelPrintFormData = z.infer<typeof labelPrintFormSchema>;

// Pack checklist item schema
export const packChecklistItemSchema = z.object({
  itemId: z.string(),
  checked: z.boolean(),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export const completePackingSchema = z.object({
  workOrderId: z.string().min(1, 'Work order ID is required'),
  checklistItems: z.array(packChecklistItemSchema),
  handoverNotes: z.string().max(1000, 'Notes too long').optional(),
});

export type CompletePackingFormData = z.infer<typeof completePackingSchema>;

// Serial record schema
export const serialRecordSchema = z.object({
  workOrderId: z.string().min(1, 'Work order is required'),
  serialNumber: z.string().min(1, 'Serial number is required').max(50, 'Serial number too long'),
  mpn: z.string().min(1, 'MPN # is required').max(100, 'MPN # too long'),
  itemDescription: z.string().min(1, 'Description is required').max(255, 'Description too long'),
});

export type SerialRecordFormData = z.infer<typeof serialRecordSchema>;
