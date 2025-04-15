import '@testing-library/jest-dom';
import { ThreatRule, ThreatDetection, ThreatSeverity, ThreatType } from '../ThreatTypes';

describe('ThreatRule型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const rule: ThreatRule = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'ブルートフォース検出ルール',
            description: 'ログイン試行の失敗回数が閾値を超えた場合に検出',
            threat_type: 'brute_force',
            severity: 'high',
            detection_logic: {
                type: 'threshold',
                field: 'attempt_count',
                operator: '>',
                value: 5,
                time_window: 300 // 5分間
            },
            enabled: true,
            created_at: '2025-04-15T12:00:00Z',
            updated_at: '2025-04-15T12:00:00Z',
            tags: ['authentication', 'login']
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(rule.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(rule.name).toBe('ブルートフォース検出ルール');
        expect(rule.threat_type).toBe('brute_force');
        expect(rule.severity).toBe('high');
        expect(rule.enabled).toBe(true);
    });
});

describe('ThreatDetection型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const detection: ThreatDetection = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            rule_id: '123e4567-e89b-12d3-a456-426614174000',
            timestamp: '2025-04-15T12:00:00Z',
            source_ip: '192.168.1.1',
            threat_type: 'brute_force',
            severity: 'high',
            details: {
                username: 'admin',
                attempt_count: 10,
                time_window: 300
            },
            related_events: ['event-1', 'event-2'],
            status: 'open',
            assigned_to: null,
            resolution: null,
            resolution_time: null
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(detection.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(detection.rule_id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(detection.timestamp).toBe('2025-04-15T12:00:00Z');
        expect(detection.source_ip).toBe('192.168.1.1');
        expect(detection.threat_type).toBe('brute_force');
        expect(detection.severity).toBe('high');
        expect(detection.status).toBe('open');
    });
});

describe('ThreatSeverity型', () => {
    it('定義された値のみを受け入れる', () => {
        const severities: ThreatSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];

        // 各値が型として有効であることを確認
        severities.forEach(severity => {
            expect(severity).toBeDefined();
        });
    });
});

describe('ThreatType型', () => {
    it('定義された値のみを受け入れる', () => {
        const types: ThreatType[] = [
            'brute_force',
            'suspicious_login',
            'malicious_ip',
            'anomaly',
            'data_exfiltration',
            'malware',
            'ddos',
            'port_scan'
        ];

        // 各値が型として有効であることを確認
        types.forEach(type => {
            expect(type).toBeDefined();
        });
    });
});