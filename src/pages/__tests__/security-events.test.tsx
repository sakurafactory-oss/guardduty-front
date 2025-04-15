import { render, screen, waitFor } from '@testing-library/react';
import SecurityEventsPage from '../security-events';
import { useGetApi } from '../../hooks/useApi';
import { SecurityEvent } from '../../types/SecurityEvent';

// useGetApiをモック化
jest.mock('../../hooks/useApi', () => ({
    useGetApi: jest.fn()
}));

describe('SecurityEventsPage', () => {
    const mockSecurityEvents: SecurityEvent[] = [
        {
            id: 'event-1',
            timestamp: '2025-04-15T10:30:00Z',
            source_ip: '192.168.1.100',
            event_type: 'login_attempt',
            severity: 'high',
            details: {
                username: 'admin',
                success: false,
                attempt_count: 5
            }
        },
        {
            id: 'event-2',
            timestamp: '2025-04-15T10:25:00Z',
            source_ip: '192.168.1.101',
            event_type: 'file_access',
            severity: 'medium',
            details: {
                file_path: '/etc/passwd',
                user: 'user1',
                operation: 'read'
            }
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ローディング中の表示が正しいこと', () => {
        (useGetApi as jest.Mock).mockReturnValue({
            data: null,
            loading: true,
            error: null,
            execute: jest.fn(),
            reset: jest.fn()
        });

        render(<SecurityEventsPage />);

        expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    });

    it('エラー時の表示が正しいこと', () => {
        const errorMessage = 'APIエラーが発生しました';
        (useGetApi as jest.Mock).mockReturnValue({
            data: null,
            loading: false,
            error: new Error(errorMessage),
            execute: jest.fn(),
            reset: jest.fn()
        });

        render(<SecurityEventsPage />);

        expect(screen.getByText(`エラー: ${errorMessage}`)).toBeInTheDocument();
    });

    it('セキュリティイベント一覧が表示されること', async () => {
        (useGetApi as jest.Mock).mockReturnValue({
            data: { data: mockSecurityEvents },
            loading: false,
            error: null,
            execute: jest.fn(),
            reset: jest.fn()
        });

        render(<SecurityEventsPage />);

        // タイトルが表示されること
        expect(screen.getByText('セキュリティイベント一覧')).toBeInTheDocument();

        // イベント一覧が表示されること
        await waitFor(() => {
            expect(screen.getByText('event-1')).toBeInTheDocument();
            expect(screen.getByText('event-2')).toBeInTheDocument();
            expect(screen.getByText('192.168.1.100')).toBeInTheDocument();
            expect(screen.getByText('192.168.1.101')).toBeInTheDocument();
            expect(screen.getByText('login_attempt')).toBeInTheDocument();
            expect(screen.getByText('file_access')).toBeInTheDocument();
        });
    });

    it('APIが正しいパラメータで呼び出されること', () => {
        const mockExecute = jest.fn();
        (useGetApi as jest.Mock).mockReturnValue({
            data: { data: mockSecurityEvents },
            loading: false,
            error: null,
            execute: mockExecute,
            reset: jest.fn()
        });

        render(<SecurityEventsPage />);

        expect(useGetApi).toHaveBeenCalledWith({
            url: '/api/security-events',
            params: expect.any(Object),
            autoExecute: true
        });
    });

    it('ページネーションが正しく動作すること', async () => {
        const mockExecute = jest.fn();
        (useGetApi as jest.Mock).mockReturnValue({
            data: {
                data: mockSecurityEvents,
                pagination: {
                    total: 100,
                    page: 1,
                    per_page: 10,
                    total_pages: 10
                }
            },
            loading: false,
            error: null,
            execute: mockExecute,
            reset: jest.fn()
        });

        render(<SecurityEventsPage />);

        // ページネーションが表示されること
        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('次へ')).toBeInTheDocument();
        });
    });
});