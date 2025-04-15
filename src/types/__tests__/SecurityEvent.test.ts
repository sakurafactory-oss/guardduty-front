import '@testing-library/jest-dom';
import { SecurityEvent, SecurityEventCreate } from '../SecurityEvent';

describe('SecurityEvent型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const event: SecurityEvent = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            timestamp: '2025-04-15T12:00:00Z',
            source_ip: '192.168.1.1',
            event_type: 'login_attempt',
            severity: 3,
            details: { username: 'admin', attempt_count: 5 },
            resolved: false,
            resolution_time: null
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(event.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(event.timestamp).toBe('2025-04-15T12:00:00Z');
        expect(event.source_ip).toBe('192.168.1.1');
        expect(event.event_type).toBe('login_attempt');
        expect(event.severity).toBe(3);
        expect(event.details).toEqual({ username: 'admin', attempt_count: 5 });
        expect(event.resolved).toBe(false);
        expect(event.resolution_time).toBeNull();
    });
});

describe('SecurityEventCreate型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const eventCreate: SecurityEventCreate = {
            source_ip: '192.168.1.1',
            event_type: 'login_attempt',
            severity: 3,
            details: { username: 'admin', attempt_count: 5 }
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(eventCreate.source_ip).toBe('192.168.1.1');
        expect(eventCreate.event_type).toBe('login_attempt');
        expect(eventCreate.severity).toBe(3);
        expect(eventCreate.details).toEqual({ username: 'admin', attempt_count: 5 });
    });
});