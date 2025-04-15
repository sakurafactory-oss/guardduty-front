import { render, screen } from '@testing-library/react';
import SecurityEventDetailPage from '../security-event-detail/[id]';
import { useRouter } from 'next/router';
import { useGetApi } from '../../hooks/useApi';

// モックの設定
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

jest.mock('../../hooks/useApi', () => ({
    useGetApi: jest.fn()
}));

describe('SecurityEventDetailPage', () => {
    beforeEach(() => {
        // ルーターのモック
        (useRouter as jest.Mock).mockReturnValue({
            query: { id: 'event-001' },
            isReady: true
        });

        // APIレスポンスのモック
        (useGetApi as jest.Mock).mockReturnValue({
            data: {
                data: {
                    id: 'event-001',
                    timestamp: '2025-04-15T10:30:00Z',
                    source_ip: '192.168.1.100',
                    event_type: 'login_attempt',
                    severity: 'high',
                    details: {
                        username: 'admin',
                        success: false,
                        attempt_count: 5
                    },
                    related_events: [
                        'event-002',
                        'event-003'
                    ],
                    status: 'open'
                }
            },
            loading: false,
            error: null,
            execute: jest.fn(),
            reset: jest.fn()
        });
    });

    it('renders the header', () => {
        render(<SecurityEventDetailPage />);
        
        expect(screen.getByText('セキュリティイベント詳細')).toBeInTheDocument();
        expect(screen.getByText('イベント一覧に戻る')).toBeInTheDocument();
    });

    it('renders alert title and description', () => {
        render(<SecurityEventDetailPage />);
        
        expect(screen.getByText('基本情報')).toBeInTheDocument();
        expect(screen.getByText('アクション')).toBeInTheDocument();
    });

    it('renders alert metadata', () => {
        render(<SecurityEventDetailPage />);
        
        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('event-001')).toBeInTheDocument();
        expect(screen.getByText('重要度')).toBeInTheDocument();
        expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('renders alert details', () => {
        render(<SecurityEventDetailPage />);
        
        expect(screen.getByText('詳細情報')).toBeInTheDocument();
        expect(screen.getByText(/username/i)).toBeInTheDocument();
        expect(screen.getByText(/attempt_count/i)).toBeInTheDocument();
    });

    it('renders notification status', () => {
        render(<SecurityEventDetailPage />);
        
        expect(screen.getByText('タイムライン')).toBeInTheDocument();
        expect(screen.getByText('イベント検出')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
        render(<SecurityEventDetailPage />);
        
        expect(screen.getByText('調査を開始')).toBeInTheDocument();
        expect(screen.getByText('解決済みとしてマーク')).toBeInTheDocument();
        expect(screen.getByText('アラートを作成')).toBeInTheDocument();
    });

    it('renders back link', () => {
        render(<SecurityEventDetailPage />);
        
        const backLink = screen.getByText('イベント一覧に戻る');
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', '/security-events');
    });
});