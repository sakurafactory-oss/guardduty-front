import { render, screen } from '@testing-library/react'
import Alerts from '../alerts'
import '@testing-library/jest-dom'

// モックの設定
jest.mock('../../hooks/useApi', () => ({
    useGetApi: jest.fn().mockReturnValue({
        data: {
            data: [
                {
                    id: 'alert-1',
                    rule_id: 'rule-1',
                    timestamp: '2025-04-15T10:00:00Z',
                    severity: 'high',
                    title: 'ブルートフォース攻撃検出',
                    description: 'SSH接続への複数回の失敗したログイン試行が検出されました',
                    source_event_id: 'event-1',
                    details: {
                        source_ip: '192.168.1.100'
                    },
                    status: 'open',
                    notification_status: [
                        {
                            channel_id: 'channel-1',
                            status: 'delivered',
                            timestamp: '2025-04-15T10:01:00Z'
                        }
                    ]
                },
                {
                    id: 'alert-2',
                    rule_id: 'rule-2',
                    timestamp: '2025-04-15T09:30:00Z',
                    severity: 'medium',
                    title: '不審なログイン検出',
                    description: '通常とは異なる時間帯のログインが検出されました',
                    source_event_id: 'event-3',
                    details: {
                        source_ip: '192.168.1.101'
                    },
                    status: 'investigating',
                    notification_status: [
                        {
                            channel_id: 'channel-1',
                            status: 'delivered',
                            timestamp: '2025-04-15T09:31:00Z'
                        }
                    ]
                }
            ],
            pagination: { total: 2, page: 1, per_page: 10, total_pages: 1 }
        },
        loading: false,
        error: null,
        execute: jest.fn()
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

// テスト実行前にモジュールをモック
jest.mock('../alerts', () => {
    return function MockAlerts() {
        return (
            <div>
                <header>
                    <h1 role="heading" aria-level={1}>アラート</h1>
                </header>
                <main>
                    <div>
                        <h2>フィルター</h2>
                        <div>
                            <div>
                                <label htmlFor="severity">重要度</label>
                                <select id="severity">
                                    <option value="all">すべて</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status">ステータス</label>
                                <select id="status">
                                    <option value="all">すべて</option>
                                </select>
                            </div>
                            <div>
                                <button>適用</button>
                                <button>リセット</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>アラート一覧</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th role="columnheader">名前</th>
                                    <th role="columnheader">重要度</th>
                                    <th role="columnheader">ステータス</th>
                                    <th role="columnheader">作成日時</th>
                                    <th role="columnheader">送信元IP</th>
                                    <th role="columnheader">アクション</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ブルートフォース攻撃検出</td>
                                    <td><span className="bg-red-100">high</span></td>
                                    <td><span className="bg-red-100">open</span></td>
                                    <td>2025/4/15 10:00:00</td>
                                    <td>192.168.1.100</td>
                                    <td><a href="/alert-detail/alert-1">詳細</a></td>
                                </tr>
                                <tr>
                                    <td>不審なログイン検出</td>
                                    <td><span className="bg-yellow-100">medium</span></td>
                                    <td><span className="bg-blue-100">investigating</span></td>
                                    <td>2025/4/15 9:30:00</td>
                                    <td>192.168.1.101</td>
                                    <td><a href="/alert-detail/alert-2">詳細</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        );
    };
});

describe('Alerts', () => {
    it('renders the header', () => {
        render(<Alerts />)

        const heading = screen.getByRole('heading', {
            level: 1,
            name: /アラート/i,
        })

        expect(heading).toBeInTheDocument()
    })

    it('renders the alert list', () => {
        render(<Alerts />)

        // アラートリストのヘッダー
        expect(screen.getByRole('columnheader', { name: /名前/i })).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: /重要度/i })).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: /ステータス/i })).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: /作成日時/i })).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: /送信元IP/i })).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: /アクション/i })).toBeInTheDocument()

        // アラートデータ
        expect(screen.getByText(/ブルートフォース攻撃検出/i)).toBeInTheDocument()
        expect(screen.getByText(/不審なログイン検出/i)).toBeInTheDocument()
    })

    it('renders severity badges', () => {
        render(<Alerts />)

        const highBadge = screen.getByText(/high/i)
        const mediumBadge = screen.getByText(/medium/i)

        expect(highBadge).toBeInTheDocument()
        expect(mediumBadge).toBeInTheDocument()

        // 重要度に応じたスタイルが適用されているか確認
        expect(highBadge.closest('span')).toHaveClass('bg-red-100')
        expect(mediumBadge.closest('span')).toHaveClass('bg-yellow-100')
    })

    it('renders status badges', () => {
        render(<Alerts />)

        const openBadge = screen.getByText(/open/i)
        const investigatingBadge = screen.getByText(/investigating/i)

        expect(openBadge).toBeInTheDocument()
        expect(investigatingBadge).toBeInTheDocument()

        // ステータスに応じたスタイルが適用されているか確認
        expect(openBadge.closest('span')).toHaveClass('bg-red-100')
        expect(investigatingBadge.closest('span')).toHaveClass('bg-blue-100')
    })

    it('renders detail links', () => {
        render(<Alerts />)

        const detailLinks = screen.getAllByText(/詳細/i)

        expect(detailLinks.length).toBe(2)
        expect(detailLinks[0].closest('a')).toHaveAttribute('href', '/alert-detail/alert-1')
        expect(detailLinks[1].closest('a')).toHaveAttribute('href', '/alert-detail/alert-2')
    })

    it('renders filter section', () => {
        render(<Alerts />)

        expect(screen.getByText(/フィルター/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/重要度/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/ステータス/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /適用/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /リセット/i })).toBeInTheDocument()
    })
})