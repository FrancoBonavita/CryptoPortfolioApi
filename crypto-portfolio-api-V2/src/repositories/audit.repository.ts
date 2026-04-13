import crypto from 'node:crypto';
import type { AuditLog, AuditAction } from '../models/audit.model.js';

const auditLogs: AuditLog[] = [];

export const auditRepository = {

  create(assetId: string, action: AuditAction): AuditLog {
    const log: AuditLog = {
      id: crypto.randomUUID(),
      assetId,
      action,
      timestamp: new Date(),
    };

    auditLogs.push(log);
    return log;
  },

  findByAssetId(assetId: string): AuditLog[] {
    return auditLogs
      .filter((log) => log.assetId === assetId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },
};