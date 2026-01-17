// Quality module types

import { AuditTrailEntry } from '@/types/approval';

export type InspectionType = 'incoming' | 'in_process' | 'final';
export type InspectionStatus = 'pending' | 'in_progress' | 'pass' | 'fail' | 'hold';

export interface InspectionCheckpoint {
  id: string;
  name: string;
  specification: string;
  measured?: string;
  result?: 'pass' | 'fail' | 'na';
  notes?: string;
}

export interface Inspection {
  id: string;
  type: InspectionType;
  workOrderId: string;
  workOrderNumber: string;
  itemNumber: string;
  itemDescription: string;
  quantity: number;
  lotNumber?: string;
  status: InspectionStatus;
  checkpoints: InspectionCheckpoint[];
  inspectorId?: string;
  inspectorName?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  ncrId?: string; // Link to NCR if failed
  signedOff: boolean;
  signedOffBy?: string;
  signedOffAt?: Date;
  signature?: string;
}

// NCR Types
export type NcrStatus = 'raised' | 'disposition' | 'rework' | 'retest' | 'closed';
export type NcrDisposition = 'rework' | 'scrap' | 'use_as_is' | 'return_to_vendor';
export type NcrSeverity = 'minor' | 'major' | 'critical';

export interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: NcrSeverity;
  status: NcrStatus;
  disposition?: NcrDisposition;
  workOrderId?: string;
  workOrderNumber?: string;
  itemNumber: string;
  itemDescription: string;
  quantity: number;
  defectType: string;
  rootCause?: string;
  correctiveAction?: string;
  raisedByUserId: string;
  raisedByName: string;
  raisedAt: Date;
  assignedToUserId?: string;
  assignedToName?: string;
  closedByUserId?: string;
  closedByName?: string;
  closedAt?: Date;
  capaId?: string; // Link to CAPA if created
  auditTrail: AuditTrailEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// CAPA Types
export type CapaType = 'corrective' | 'preventive';
export type CapaStatus = 'open' | 'in_progress' | 'verification' | 'closed';

export interface CAPA {
  id: string;
  capaNumber: string;
  type: CapaType;
  title: string;
  description: string;
  status: CapaStatus;
  ncrId?: string;
  rootCauseAnalysis: string;
  proposedActions: string;
  implementedActions?: string;
  verificationResults?: string;
  ownerId: string;
  ownerName: string;
  dueDate: Date;
  completedDate?: Date;
  auditTrail: AuditTrailEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// SPC Data
export interface SpcDataPoint {
  timestamp: Date;
  value: number;
  inSpec: boolean;
}

export interface SpcChart {
  id: string;
  name: string;
  parameter: string;
  unit: string;
  ucl: number; // Upper control limit
  lcl: number; // Lower control limit
  target: number;
  data: SpcDataPoint[];
}

// Filters
export interface InspectionFilters {
  type?: InspectionType;
  status?: InspectionStatus[];
  workOrderId?: string;
  search?: string;
}

export interface NcrFilters {
  status?: NcrStatus[];
  severity?: NcrSeverity[];
  disposition?: NcrDisposition[];
  search?: string;
}
