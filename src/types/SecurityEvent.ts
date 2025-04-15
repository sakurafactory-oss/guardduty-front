/**
 * セキュリティイベントの重要度
 */
export type SecurityEventSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info' | number;

/**
 * セキュリティイベントの型定義
 */
export interface SecurityEvent {
  id: string;
  timestamp: string;
  source_ip: string;
  event_type: string;
  severity: SecurityEventSeverity;
  details?: Record<string, any>;
  related_events?: string[];
  status?: string;
  resolved?: boolean;
  resolution_time?: string | null;
}

/**
 * セキュリティイベント作成用の型定義
 */
export interface SecurityEventCreate {
  source_ip: string;
  event_type: string;
  severity: SecurityEventSeverity;
  details: Record<string, any>;
}
