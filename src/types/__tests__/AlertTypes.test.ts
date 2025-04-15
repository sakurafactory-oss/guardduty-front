import '@testing-library/jest-dom';
import { AlertRule, Alert, NotificationChannel, NotificationMethod } from '../AlertTypes';

describe('AlertRule型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const rule: AlertRule = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: '重要度の高い脅威検出アラート',
            description: '重要度が高い脅威が検出された場合にアラートを発生',
            condition: {
                type: 'threat_detection',
                severity: ['critical', 'high'],
                threat_types: ['brute_force', 'malicious_ip']
            },
            notification_channels: ['channel-1', 'channel-2'],
            throttling: {
                enabled: true,
                max_alerts_per_hour: 5
            },
            enabled: true,
            created_at: '2025-04-15T12:00:00Z',
            updated_at: '2025-04-15T12:00:00Z'
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(rule.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(rule.name).toBe('重要度の高い脅威検出アラート');
        expect(rule.condition.type).toBe('threat_detection');
        expect(rule.notification_channels).toEqual(['channel-1', 'channel-2']);
        expect(rule.enabled).toBe(true);
    });
});

describe('Alert型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const alert: Alert = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            rule_id: '123e4567-e89b-12d3-a456-426614174000',
            timestamp: '2025-04-15T12:00:00Z',
            severity: 'high',
            title: 'ブルートフォース攻撃を検出',
            description: 'IPアドレス192.168.1.1からのブルートフォース攻撃を検出しました',
            source_event_id: 'event-123',
            details: {
                source_ip: '192.168.1.1',
                attempt_count: 10
            },
            status: 'sent',
            notification_status: [
                {
                    channel_id: 'channel-1',
                    status: 'delivered',
                    timestamp: '2025-04-15T12:00:01Z'
                },
                {
                    channel_id: 'channel-2',
                    status: 'failed',
                    timestamp: '2025-04-15T12:00:02Z',
                    error: 'Connection timeout'
                }
            ]
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(alert.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(alert.rule_id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(alert.timestamp).toBe('2025-04-15T12:00:00Z');
        expect(alert.severity).toBe('high');
        expect(alert.title).toBe('ブルートフォース攻撃を検出');
        expect(alert.status).toBe('sent');
    });
});

describe('NotificationChannel型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const channel: NotificationChannel = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'セキュリティチームSlack',
            description: 'セキュリティチームのSlackチャンネル',
            method: 'slack',
            config: {
                webhook_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
                channel: '#security-alerts'
            },
            enabled: true,
            created_at: '2025-04-15T12:00:00Z',
            updated_at: '2025-04-15T12:00:00Z'
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(channel.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(channel.name).toBe('セキュリティチームSlack');
        expect(channel.method).toBe('slack');
        expect(channel.enabled).toBe(true);
    });
});

describe('NotificationMethod型', () => {
    it('定義された値のみを受け入れる', () => {
        const methods: NotificationMethod[] = ['email', 'slack', 'webhook', 'sms', 'push'];

        // 各値が型として有効であることを確認
        methods.forEach(method => {
            expect(method).toBeDefined();
        });
    });
});