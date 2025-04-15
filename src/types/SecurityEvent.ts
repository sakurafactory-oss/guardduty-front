export interface SecurityEvent {
  id: string;
  timestamp: string;
  source_ip: string;
  event_type: string;
  severity: number;
  details: Record<string, any>;
  resolved: boolean;
  resolution_time: string | null;
}

export interface SecurityEventCreate {
  source_ip: string;
  event_type: string;
  severity: number;
  details: Record<string, any>;
}
