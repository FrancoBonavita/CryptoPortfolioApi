export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface AuditLog {
  readonly id: string;
  readonly assetId: string;
  readonly action: AuditAction;
  readonly timestamp: Date;
}