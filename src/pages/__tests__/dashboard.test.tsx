import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../dashboard';
import { useGetApi } from '../../hooks/useApi';
import { TimeSeriesData, GeoDistribution, DashboardLayout, DashboardWidget } from '../../types/DashboardTypes';

// モック
jest.mock('../../hooks/useApi', () => ({
    useGetApi: jest.fn()
}));

// Chart.jsのモック
jest.mock('react-chartjs-2', () => ({
    Line: () => <div data-testid="line-chart">Line Chart</div>,
    Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
    Pie: () => <div data-testid="pie-chart">Pie Chart</div>,
    Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>
}));

describe('DashboardPage', () => {
    // モックデータ
    const mockTimeSeriesData: TimeSeriesData = {
        id: 'time-series-1',
        title: 'セキュリティイベント時系列',
        time_range: {
            start: '2025-04-08T00:00:00Z',
            end: '2025-04-15T00:00:00Z',
            preset: 'last_7d'
        },
        interval: '1d',
        series: [
            {
                name: '重大',
                data: [
                    { timestamp: '2025-04-09T00:00:00Z', value: 2 },
                    { timestamp: '2025-04-10T00:00:00Z', value: 1 },
                    { timestamp: '2025-04-11T00:00:00Z', value: 0 },
                    { timestamp: '2025-04-12T00:00:00Z', value: 3 },
                    { timestamp: '2025-04-13T00:00:00Z', value: 1 },
                    { timestamp: '2025-04-14T00:00:00Z', value: 2 },
                    { timestamp: '2025-04-15T00:00:00Z', value: 1 }
                ],
                metadata: { color: '#dc2626' }
            },
            {
                name: '高',
                data: [
                    { timestamp: '2025-04-09T00:00:00Z', value: 5 },
                    { timestamp: '2025-04-10T00:00:00Z', value: 3 },
                    { timestamp: '2025-04-11T00:00:00Z', value: 4 },
                    { timestamp: '2025-04-12T00:00:00Z', value: 2 },
                    { timestamp: '2025-04-13T00:00:00Z', value: 6 },
                    { timestamp: '2025-04-14T00:00:00Z', value: 4 },
                    { timestamp: '2025-04-15T00:00:00Z', value: 5 }
                ],
                metadata: { color: '#f87171' }
            }
        ]
    };

    const mockGeoDistributionData: GeoDistribution = {
        id: 'geo-distribution-1',
        title: '地理的分布',
        time_range: {
            start: '2025-04-08T00:00:00Z',
            end: '2025-04-15T00:00:00Z',
            preset: 'last_7d'
        },
        regions: [
            { country_code: 'JP', country_name: '日本', count: 120, percentage: 50 },
            { country_code: 'US', country_name: '米国', count: 45, percentage: 18.75 },
            { country_code: 'CN', country_name: '中国', count: 30, percentage: 12.5 },
            { country_code: 'RU', country_name: 'ロシア', count: 25, percentage: 10.42 },
            { country_code: 'DE', country_name: 'ドイツ', count: 15, percentage: 6.25 }
        ]
    };

    const mockLayouts: DashboardLayout[] = [
        {
            id: 'default',
            name: 'デフォルト',
            description: 'デフォルトのダッシュボードレイアウト',
            widgets: [
                {
                    widget_id: 'time-series',
                    position: { x: 0, y: 0 },
                    size: { width: 12, height: 6 }
                },
                {
                    widget_id: 'severity-distribution',
                    position: { x: 0, y: 6 },
                    size: { width: 6, height: 6 }
                }
            ],
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
            created_by: 'system',
            is_default: true
        }
    ];

    const mockWidgets: DashboardWidget[] = [
        {
            id: 'time-series',
            title: 'セキュリティイベント時系列',
            type: 'chart',
            chart_type: 'line',
            data_source: '/api/dashboard/time-series',
            query: {
                time_range: {
                    start: '2025-04-08T00:00:00Z',
                    end: '2025-04-15T00:00:00Z',
                    preset: 'last_7d'
                }
            }
        },
        {
            id: 'severity-distribution',
            title: '重要度分布',
            type: 'chart',
            chart_type: 'pie',
            data_source: '/api/dashboard/severity-distribution',
            query: {
                time_range: {
                    start: '2025-04-08T00:00:00Z',
                    end: '2025-04-15T00:00:00Z',
                    preset: 'last_7d'
                }
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

        render(<DashboardPage />);

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

        render(<DashboardPage />);

        expect(screen.getByText(`エラー: ${errorMessage}`)).toBeInTheDocument();
    });

    it('データなしの表示が正しいこと', () => {
        (useGetApi as jest.Mock).mockReturnValue({
            data: null,
            loading: false,
            error: null,
            execute: jest.fn(),
            reset: jest.fn()
        });

        render(<DashboardPage />);

        expect(screen.getByText('セキュリティダッシュボード')).toBeInTheDocument();
        expect(screen.getByText('データが見つかりませんでした。')).toBeInTheDocument();
    });

    it('ダッシュボードが表示されること', async () => {
        // 複数のAPIコールのモック
        (useGetApi as jest.Mock).mockImplementation(({ url }) => {
            if (url === '/api/dashboard/layouts') {
                return {
                    data: { data: mockLayouts },
                    loading: false,
                    error: null,
                    execute: jest.fn(),
                    reset: jest.fn()
                };
            } else if (url === '/api/dashboard/widgets') {
                return {
                    data: { data: mockWidgets },
                    loading: false,
                    error: null,
                    execute: jest.fn(),
                    reset: jest.fn()
                };
            } else if (url === '/api/dashboard/time-series') {
                return {
                    data: { data: mockTimeSeriesData },
                    loading: false,
                    error: null,
                    execute: jest.fn(),
                    reset: jest.fn()
                };
            } else if (url === '/api/dashboard/geo-distribution') {
                return {
                    data: { data: mockGeoDistributionData },
                    loading: false,
                    error: null,
                    execute: jest.fn(),
                    reset: jest.fn()
                };
            }

            return {
                data: null,
                loading: false,
                error: null,
                execute: jest.fn(),
                reset: jest.fn()
            };
        });

        render(<DashboardPage />);

        // タイトルが表示されること
        expect(screen.getByText('セキュリティダッシュボード')).toBeInTheDocument();

        // 期間フィルターが表示されること
        expect(screen.getByText('期間:')).toBeInTheDocument();
        expect(screen.getByText('24時間')).toBeInTheDocument();
        expect(screen.getByText('7日間')).toBeInTheDocument();
        expect(screen.getByText('30日間')).toBeInTheDocument();

        // ウィジェットが表示されること
        expect(screen.getByText('セキュリティイベント時系列')).toBeInTheDocument();
        expect(screen.getByText('重要度分布')).toBeInTheDocument();
        expect(screen.getByText('イベントタイプ分布')).toBeInTheDocument();
        expect(screen.getByText('地理的分布')).toBeInTheDocument();

        // チャートが表示されること
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('期間フィルターが機能すること', async () => {
        const mockExecute = jest.fn();
        (useGetApi as jest.Mock).mockImplementation(({ url }) => {
            if (url === '/api/dashboard/layouts') {
                return {
                    data: { data: mockLayouts },
                    loading: false,
                    error: null,
                    execute: mockExecute,
                    reset: jest.fn()
                };
            } else if (url === '/api/dashboard/widgets') {
                return {
                    data: { data: mockWidgets },
                    loading: false,
                    error: null,
                    execute: mockExecute,
                    reset: jest.fn()
                };
            } else if (url === '/api/dashboard/time-series') {
                return {
                    data: { data: mockTimeSeriesData },
                    loading: false,
                    error: null,
                    execute: mockExecute,
                    reset: jest.fn()
                };
            } else if (url === '/api/dashboard/geo-distribution') {
                return {
                    data: { data: mockGeoDistributionData },
                    loading: false,
                    error: null,
                    execute: mockExecute,
                    reset: jest.fn()
                };
            }

            return {
                data: null,
                loading: false,
                error: null,
                execute: mockExecute,
                reset: jest.fn()
            };
        });

        render(<DashboardPage />);

        // 期間フィルターが表示されること
        expect(screen.getByText('期間:')).toBeInTheDocument();
        expect(screen.getByText('24時間')).toBeInTheDocument();
        expect(screen.getByText('7日間')).toBeInTheDocument();
        expect(screen.getByText('30日間')).toBeInTheDocument();
    });
});