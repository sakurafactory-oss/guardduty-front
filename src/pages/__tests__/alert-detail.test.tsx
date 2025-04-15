import { render, screen } from '@testing-library/react'
import AlertDetail from '../alert-detail/[id]'
import '@testing-library/jest-dom'

// モックの設定
jest.mock('../../hooks/useApi', () => ({
    useGetApi: jest.fn().mockReturnValue({
        data: {
            id: 'alert-1',
            rule_id: 'rule-1',
            timestamp: '2025-04-15T10:00:00Z',
            severity: 'high',
            title: 'ブルートフォース攻撃検出',
            description: 'SSH接続への複数回の失敗したログイン試行が検出されました',
            source_event_id: 'event-1',
            details: {
                source_ip: '192.168.1.100',
                target_service: 'SSH',
                failed_attempts: 10,
                time_window: '5分',
                detection_rule: 'ブルートフォース検出ルール'
            },
            status: 'investigating',
            notification_status: [
                {
                    channel_id: 'email-1',
                    status: 'delivered',
                    timestamp: '2025-04-15T10:01:00Z'
                },
                {
                    channel_id: 'slack-1',
                    status: 'delivered',
                    timestamp: '2025-04-15T10:01:00Z'
                }
            ],
            acknowledged_by: 'user-1',
            acknowledged_at: '2025-04-15T10:05:00Z'
        },
        loading: false,
        error: null,
        execute: jest.fn()
    })
}))

// Next.jsのrouterをモック
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        query: { id: 'alert-1' },
        isReady: true
    })
}))

// Next.jsのLinkコンポーネントをモック
jest.mock('next/link', () => {
    return ({ children, className, href }: { children: React.ReactNode, className?: string, href: string }) => {
        return (
            <a href={href} className={className} data-testid="mock-link">
                {children}
            </a>
        );
    };
});

describe('AlertDetail', () => {
    it('renders the header', () => {
        render(<AlertDetail />)

        const heading = screen.getByRole('heading', {
            name: /アラート詳細/i,
        })

        expect(heading).toBeInTheDocument()
    })

    it('renders alert title and description', () => {
        render(<AlertDetail />)

        expect(screen.getByText(/ブルートフォース攻撃検出/i)).toBeInTheDocument()
        expect(screen.getByText(/SSH接続への複数回の失敗したログイン試行が検出されました/i)).toBeInTheDocument()
    })

    it('renders alert metadata', () => {
        render(<AlertDetail />)

        expect(screen.getByText(/重要度/i)).toBeInTheDocument()
        expect(screen.getByText(/high/i)).toBeInTheDocument()
    })

    it('renders alert details', () => {
        render(<AlertDetail />)

        expect(screen.getByText(/詳細情報/i)).toBeInTheDocument()
        expect(screen.getByText(/送信元IP/i)).toBeInTheDocument()
        expect(screen.getByText(/192\.168\.1\.100/i)).toBeInTheDocument()
        expect(screen.getByText(/対象サービス/i)).toBeInTheDocument()
    })

    it('renders notification status', () => {
        render(<AlertDetail />)

        expect(screen.getByText(/通知状況/i)).toBeInTheDocument()
        expect(screen.getAllByText(/delivered/i).length).toBeGreaterThanOrEqual(1)
    })

    it('renders action buttons', () => {
        render(<AlertDetail />)

        expect(screen.getByRole('button', { name: /解決済みにする/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /対応中にする/i })).toBeInTheDocument()
    })

    it('renders back link', () => {
        render(<AlertDetail />)

        const backLink = screen.getByText(/アラート一覧に戻る/i)
        expect(backLink).toBeInTheDocument()
        expect(backLink.closest('a')).toHaveAttribute('href', '/alerts')
    })
})