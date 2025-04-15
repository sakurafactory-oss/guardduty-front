/**
 * アラート関連の型定義
 * さくらセキュリティガードのアラート機能に関する型定義
 */

import { ThreatSeverity, ThreatType } from './ThreatTypes';

/**
 * 通知方法の型定義
 */
export type NotificationMethod = 'email' | 'slack' | 'webhook' | 'sms' | 'push';

/**
 * アラートルールの型定義
 */
export interface AlertRule {
    id: string;
    name: string;
    description: string;
    condition: {
        type: 'threat_detection' | 'log_pattern' | 'metric_threshold' | 'anomaly';
        [key: string]: any; // 条件の詳細はタイプによって異なる
    };
    notification_channels: string[]; // 通知チャンネルのID配列
    throttling?: {
        enabled: boolean;
        max_alerts_per_hour?: number;
        max_alerts_per_day?: number;
        cooldown_period?: number; // 秒単位
    };
    enabled: boolean;
    created_at: string;
    updated_at: string;
    tags?: string[];
}

/**
 * アラートの型定義
 */
export interface Alert {
    id: string;
    rule_id: string;
    timestamp: string;
    severity: ThreatSeverity;
    title: string;
    description: string;
    source_event_id: string;
    details: Record<string, any>;
    status: 'pending' | 'sent' | 'acknowledged' | 'resolved' | 'open' | 'investigating' | 'mitigated';
    notification_status: {
        channel_id: string;
        status: 'pending' | 'delivered' | 'failed';
        timestamp: string;
        error?: string;
    }[];
    acknowledged_by?: string;
    acknowledged_at?: string;
    resolved_by?: string;
    resolved_at?: string;
    resolution_note?: string;
}

/**
 * 通知チャンネルの型定義
 */
export interface NotificationChannel {
    id: string;
    name: string;
    description: string;
    method: NotificationMethod;
    config: Record<string, any>; // 通知方法によって設定が異なる
    enabled: boolean;
    created_at: string;
    updated_at: string;
    tags?: string[];
}

/**
 * メール通知設定の型定義
 */
export interface EmailNotificationConfig {
    recipients: string[];
    subject_template: string;
    body_template: string;
    from_address?: string;
    reply_to?: string;
    include_attachments?: boolean;
}

/**
 * Slack通知設定の型定義
 */
export interface SlackNotificationConfig {
    webhook_url: string;
    channel?: string;
    username?: string;
    icon_emoji?: string;
    icon_url?: string;
    message_template?: string;
}

/**
 * Webhook通知設定の型定義
 */
export interface WebhookNotificationConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT';
    headers?: Record<string, string>;
    body_template?: string;
    timeout?: number; // ミリ秒
    retry_count?: number;
}

/**
 * SMS通知設定の型定義
 */
export interface SmsNotificationConfig {
    phone_numbers: string[];
    message_template: string;
    service_provider: string;
}

/**
 * プッシュ通知設定の型定義
 */
export interface PushNotificationConfig {
    app_ids: string[];
    title_template: string;
    body_template: string;
    icon_url?: string;
    action_url?: string;
    ttl?: number; // 秒単位
}