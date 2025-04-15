import '@testing-library/jest-dom';
import { WebServerLog, AuthLog, SystemLog, FirewallLog } from '../LogTypes';

describe('WebServerLog型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const log: WebServerLog = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            timestamp: '2025-04-15T12:00:00Z',
            source_ip: '192.168.1.1',
            method: 'GET',
            path: '/api/users',
            status_code: 200,
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            response_time: 120,
            request_size: 1024,
            response_size: 2048,
            server_name: 'web-server-1',
            additional_info: { referer: 'https://example.com' }
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(log.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(log.timestamp).toBe('2025-04-15T12:00:00Z');
        expect(log.source_ip).toBe('192.168.1.1');
        expect(log.method).toBe('GET');
        expect(log.path).toBe('/api/users');
        expect(log.status_code).toBe(200);
    });
});

describe('AuthLog型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const log: AuthLog = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            timestamp: '2025-04-15T12:00:00Z',
            source_ip: '192.168.1.1',
            username: 'admin',
            success: true,
            auth_method: 'password',
            service: 'ssh',
            server_name: 'auth-server-1',
            additional_info: { attempt_count: 1 }
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(log.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(log.timestamp).toBe('2025-04-15T12:00:00Z');
        expect(log.source_ip).toBe('192.168.1.1');
        expect(log.username).toBe('admin');
        expect(log.success).toBe(true);
        expect(log.auth_method).toBe('password');
    });
});

describe('SystemLog型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const log: SystemLog = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            timestamp: '2025-04-15T12:00:00Z',
            hostname: 'server-1',
            facility: 'kernel',
            severity: 'warning',
            message: 'CPU usage exceeded 90%',
            process_id: 1234,
            process_name: 'system',
            additional_info: { cpu_usage: 95 }
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(log.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(log.timestamp).toBe('2025-04-15T12:00:00Z');
        expect(log.hostname).toBe('server-1');
        expect(log.facility).toBe('kernel');
        expect(log.severity).toBe('warning');
        expect(log.message).toBe('CPU usage exceeded 90%');
    });
});

describe('FirewallLog型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const log: FirewallLog = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            timestamp: '2025-04-15T12:00:00Z',
            source_ip: '192.168.1.1',
            destination_ip: '10.0.0.1',
            source_port: 12345,
            destination_port: 80,
            protocol: 'TCP',
            action: 'BLOCK',
            rule_id: 'rule-123',
            firewall_name: 'main-firewall',
            additional_info: { reason: 'IP blacklisted' }
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(log.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(log.timestamp).toBe('2025-04-15T12:00:00Z');
        expect(log.source_ip).toBe('192.168.1.1');
        expect(log.destination_ip).toBe('10.0.0.1');
        expect(log.source_port).toBe(12345);
        expect(log.destination_port).toBe(80);
        expect(log.protocol).toBe('TCP');
        expect(log.action).toBe('BLOCK');
    });
});