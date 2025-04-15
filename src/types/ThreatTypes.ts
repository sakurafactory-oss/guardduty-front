/**
 * 脅威検出関連の型定義
 * さくらセキュリティガードで検出する脅威の型定義
 */

/**
 * 脅威の重要度を表す型
 */
export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/**
 * 脅威の種類を表す型
 */
export type ThreatType =
    | 'brute_force'       // ブルートフォース攻撃
    | 'suspicious_login'  // 不審なログイン
    | 'malicious_ip'      // 悪意のあるIPからのアクセス
    | 'anomaly'           // 異常パターン
    | 'data_exfiltration' // データ流出
    | 'malware'           // マルウェア
    | 'ddos'              // DDoS攻撃
    | 'port_scan';        // ポートスキャン

/**
 * 脅威検出ルールの型定義
 */
export interface ThreatRule {
    id: string;
    name: string;
    description: string;
    threat_type: ThreatType;
    severity: ThreatSeverity;
    detection_logic: {
        type: 'threshold' | 'pattern' | 'anomaly' | 'correlation';
        [key: string]: any; // 検出ロジックの詳細はルールタイプによって異なる
    };
    enabled: boolean;
    created_at: string;
    updated_at: string;
    tags?: string[];
}

/**
 * 脅威検出結果の型定義
 */
export interface ThreatDetection {
    id: string;
    rule_id: string;
    timestamp: string;
    source_ip: string;
    threat_type: ThreatType;
    severity: ThreatSeverity;
    details: Record<string, any>;
    related_events: string[];
    status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
    assigned_to: string | null;
    resolution: string | null;
    resolution_time: string | null;
}

/**
 * 脅威インテリジェンスフィードの型定義
 */
export interface ThreatIntelligenceFeed {
    id: string;
    name: string;
    description: string;
    source: string;
    feed_type: 'ip' | 'domain' | 'url' | 'hash' | 'mixed';
    update_frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    last_updated: string;
    enabled: boolean;
    confidence_threshold: number; // 0-100
}

/**
 * 脅威インジケータ（IOC）の型定義
 */
export interface ThreatIndicator {
    id: string;
    feed_id: string;
    type: 'ip' | 'domain' | 'url' | 'hash' | 'email';
    value: string;
    threat_type: ThreatType;
    confidence: number; // 0-100
    first_seen: string;
    last_seen: string;
    expiration: string | null;
    metadata: Record<string, any>;
}

/**
 * 脅威検出統計情報の型定義
 */
export interface ThreatStats {
    total_detections: number;
    by_severity: Record<ThreatSeverity, number>;
    by_type: Record<ThreatType, number>;
    by_status: Record<string, number>;
    time_series: {
        timestamp: string;
        count: number;
    }[];
    top_source_ips: {
        source_ip: string;
        count: number;
    }[];
}