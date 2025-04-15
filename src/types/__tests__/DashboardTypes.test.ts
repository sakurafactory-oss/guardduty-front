import '@testing-library/jest-dom';
import {
    TimeSeriesData,
    GeoDistribution,
    DashboardWidget,
    DashboardLayout,
    WidgetType,
    ChartType
} from '../DashboardTypes';

describe('TimeSeriesData型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const data: TimeSeriesData = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'セキュリティイベント発生数',
            description: '時間帯別のセキュリティイベント発生数',
            time_range: {
                start: '2025-04-14T00:00:00Z',
                end: '2025-04-15T00:00:00Z'
            },
            interval: '1h',
            series: [
                {
                    name: '全イベント',
                    data: [
                        { timestamp: '2025-04-14T00:00:00Z', value: 12 },
                        { timestamp: '2025-04-14T01:00:00Z', value: 8 },
                        { timestamp: '2025-04-14T02:00:00Z', value: 5 }
                    ]
                },
                {
                    name: '重要度:高',
                    data: [
                        { timestamp: '2025-04-14T00:00:00Z', value: 3 },
                        { timestamp: '2025-04-14T01:00:00Z', value: 2 },
                        { timestamp: '2025-04-14T02:00:00Z', value: 1 }
                    ]
                }
            ]
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(data.title).toBe('セキュリティイベント発生数');
        expect(data.interval).toBe('1h');
        expect(data.series.length).toBe(2);
        expect(data.series[0].name).toBe('全イベント');
        expect(data.series[0].data.length).toBe(3);
    });
});

describe('GeoDistribution型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const data: GeoDistribution = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'アクセス元地域分布',
            description: '国・地域別のアクセス元IPアドレス分布',
            time_range: {
                start: '2025-04-14T00:00:00Z',
                end: '2025-04-15T00:00:00Z'
            },
            regions: [
                {
                    country_code: 'JP',
                    country_name: '日本',
                    count: 1250,
                    percentage: 45.2,
                    details: [
                        { region: '東京', count: 850 },
                        { region: '大阪', count: 400 }
                    ]
                },
                {
                    country_code: 'US',
                    country_name: 'アメリカ合衆国',
                    count: 820,
                    percentage: 29.7,
                    details: [
                        { region: 'カリフォルニア', count: 450 },
                        { region: 'ニューヨーク', count: 370 }
                    ]
                }
            ]
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(data.title).toBe('アクセス元地域分布');
        expect(data.regions.length).toBe(2);
        expect(data.regions[0].country_code).toBe('JP');
        expect(data.regions[0].count).toBe(1250);
        expect(data.regions[0].details?.length).toBe(2);
    });
});

describe('DashboardWidget型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const widget: DashboardWidget = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'セキュリティイベント概要',
            type: 'chart',
            chart_type: 'line',
            data_source: 'security_events',
            query: {
                time_range: {
                    start: '2025-04-14T00:00:00Z',
                    end: '2025-04-15T00:00:00Z'
                },
                filters: [
                    { field: 'severity', operator: '>=', value: 3 }
                ],
                group_by: 'event_type',
                interval: '1h'
            },
            options: {
                show_legend: true,
                colors: ['#ff0000', '#00ff00', '#0000ff']
            },
            refresh_interval: 300 // 5分
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(widget.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(widget.title).toBe('セキュリティイベント概要');
        expect(widget.type).toBe('chart');
        expect(widget.chart_type).toBe('line');
        expect(widget.data_source).toBe('security_events');
        expect(widget.refresh_interval).toBe(300);
    });
});

describe('DashboardLayout型', () => {
    it('必要なプロパティを持つオブジェクトが型チェックを通過する', () => {
        const layout: DashboardLayout = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'セキュリティ監視ダッシュボード',
            description: '主要なセキュリティ指標を表示するダッシュボード',
            widgets: [
                {
                    widget_id: 'widget-1',
                    position: { x: 0, y: 0 },
                    size: { width: 6, height: 4 }
                },
                {
                    widget_id: 'widget-2',
                    position: { x: 6, y: 0 },
                    size: { width: 6, height: 4 }
                },
                {
                    widget_id: 'widget-3',
                    position: { x: 0, y: 4 },
                    size: { width: 12, height: 4 }
                }
            ],
            created_at: '2025-04-15T12:00:00Z',
            updated_at: '2025-04-15T12:00:00Z',
            created_by: 'user-1',
            is_default: true
        };

        // TypeScriptの型チェックが通過すればテストは成功
        expect(layout.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(layout.name).toBe('セキュリティ監視ダッシュボード');
        expect(layout.widgets.length).toBe(3);
        expect(layout.widgets[0].widget_id).toBe('widget-1');
        expect(layout.widgets[0].position).toEqual({ x: 0, y: 0 });
        expect(layout.widgets[0].size).toEqual({ width: 6, height: 4 });
        expect(layout.is_default).toBe(true);
    });
});

describe('WidgetType型', () => {
    it('定義された値のみを受け入れる', () => {
        const types: WidgetType[] = ['chart', 'table', 'metric', 'map', 'list', 'text'];

        // 各値が型として有効であることを確認
        types.forEach(type => {
            expect(type).toBeDefined();
        });
    });
});

describe('ChartType型', () => {
    it('定義された値のみを受け入れる', () => {
        const types: ChartType[] = ['line', 'bar', 'pie', 'area', 'scatter', 'heatmap'];

        // 各値が型として有効であることを確認
        types.forEach(type => {
            expect(type).toBeDefined();
        });
    });
});