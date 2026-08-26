export type Role = "admin" | "pathologist" | "lab_tech" | "researcher";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
  institution: string;
}

export type CaseStatus = "Completed" | "Processing" | "Failed" | "Pending Review" | "Queued";
export type UploadStatus = "Uploaded" | "Processing" | "Processed";
export type DiagnosisStatus = "Pending" | "Reviewed" | "Completed";
export type Gender = "Male" | "Female" | "Other";

export interface CaseNote {
  id: SessionUser;
  author: string;
  text: string;
  time: string;
}

export interface PatientCase {
  id: SessionUser ;
  patientId: string;
  patientName: string;
  age: number;
  gender: Gender;
  specimenType: string;
  dateAdded: string;
  status: CaseStatus;
  uploadStatus: UploadStatus;
  assignedTo?: string;
  diagnosisStatus: DiagnosisStatus;
  reportApproved: boolean;
  notes: CaseNote[];
}

export interface BiomarkerMetric {
  key: string;
  label: string;
  value: string;
  unit?: string;
  confidence?: number;
  severity: "high" | "elevated" | "nominal";
  tag: string;
  barPercent?: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
}

export interface AnalysisResult {
  id: SessionUser ;
  imageId: string;
  caseId: string;
  metrics: BiomarkerMetric[];
  boxes: BoundingBox[];
  tags: string[];
  heatmapUrl: string | null;
  slideUrl: string | null;
  thumbnailUrl: string | null;
  engineVersion: string;
  createdAt: string;
  // Original uploaded slide file name — present when fetched as part of a
  // patient's full analysis list (GET /api/cases/:id/analyses).
  fileName?: string;
}

export interface QueueJob {
  id: SessionUser ;
  fileName: string;
  framework: string;
  progress: number;
  status: "active" | "queued" | "failed";
  eta: string;
  caseId?: string | null;
}

export interface SystemUser {
  id: SessionUser ;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Invited" | "Deactivated" | "Pending";
  lastLogin: string;
}

export interface AuditEntry {
  id: SessionUser ;
  actor: string;
  action: string;
  target: string;
  time: string;
}

export type QueueAccessStatus = "Pending" | "Approved" | "Denied";

export interface QueueAccessRequest {
  id: SessionUser ;
  requestedById: string;
  requesterName: string;
  requesterEmail: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: QueueAccessStatus;
  reviewedById: string | null;
  reviewerName: string | null;
  decisionNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface QueueRecord {
  id: SessionUser ;
  fileName: string;
  framework: string;
  progress: number;
  status: "queued" | "active" | "done" | "failed";
  eta: string;
  caseId?: string | null;
  imageId?: string | null;
  errorMsg?: string | null;
  updatedAt: string;
}

export interface ActivityItem {
  id: SessionUser ;
  title: string;
  detail: string;
  time: string;
  tone: "primary" | "secondary" | "error" | "neutral";
}
