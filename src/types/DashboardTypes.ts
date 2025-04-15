/**
 * ダッシュボード関連の型定義
 * さくらセキュリティガードのダッシュボード機能に関する型定義
 */

/**
 * ウィジェットの種類を表す型
 */
export type WidgetType = 'chart' | 'table' | 'metric' | 'map' | 'list' | 'text';

/**
 * チャートの種類を表す型
 */
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';

/**
 * 時間範囲の型定義
 */
export interface TimeRange {
    start: string; // ISO 8601形式
    end: string;   // ISO 8601形式
    preset?: 'last_24h' | 'last_7d' | 'last_30d' | 'last_90d' | 'custom';
}

/**
 * 時系列データの型定義
 */
export interface TimeSeriesData {
    id: string;
    title: string;
    description?: string;
    time_range: TimeRange;
    interval: '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '12h' | '1d' | '1w';
    series: {
        name: string;
        data: {
            timestamp: string; // ISO 8601形式
            value: number;
        }[];
        metadata?: Record<string, any>;
    }[];
    annotations?: {
        timestamp: string; // ISO 8601形式
        title: string;
        description?: string;
        type?: 'info' | 'warning' | 'error';
    }[];
}

/**
 * 地理的分布データの型定義
 */
export interface GeoDistribution {
    id: string;
    title: string;
    description?: string;
    time_range: TimeRange;
    regions: {
        country_code: string;
        country_name: string;
        count: number;
        percentage: number;
        details?: {
            region: string;
            count: number;
        }[];
    }[];
}

/**
 * ダッシュボードウィジェットの型定義
 */
export interface DashboardWidget {
    id: string;
    title: string;
    description?: string;
    type: WidgetType;
    chart_type?: ChartType; // typeが'chart'の場合に必要
    data_source: string;
    query: {
        time_range: TimeRange;
        filters?: {
            field: string;
            operator: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'not_in' | 'contains' | 'not_contains';
            value: any;
        }[];
        group_by?: string;
        sort_by?: string;
        limit?: number;
        interval?: string;
    };
    options?: Record<string, any>; // ウィジェットタイプによって異なるオプション
    refresh_interval?: number; // 秒単位
}

/**
 * ダッシュボードレイアウトの型定義
 */
export interface DashboardLayout {
    id: string;
    name: string;
    description?: string;
    widgets: {
        widget_id: string;
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
    }[];
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by?: string;
    is_default?: boolean;
    tags?: string[];
}

/**
 * ダッシュボードフィルターの型定義
 */
export interface DashboardFilter {
    id: string;
    name: string;
    field: string;
    type: 'text' | 'number' | 'date' | 'select' | 'multi-select';
    default_value?: any;
    options?: {
        value: any;
        label: string;
    }[];
    is_required?: boolean;
}

/**
 * ダッシュボード設定の型定義
 */
export interface DashboardSettings {
    id: string;
    user_id: string;
    default_dashboard_id?: string;
    auto_refresh_interval?: number; // 秒単位
    theme?: 'light' | 'dark' | 'system';
    timezone?: string;
    date_format?: string;
    notifications_enabled?: boolean;
}