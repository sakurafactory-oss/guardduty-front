/**
 * APIサービスの型定義
 * さくらGuardDutyのAPIサービスに関する型定義
 */

/**
 * APIレスポンスの基本型
 */
export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

/**
 * ページネーション情報
 */
export interface PaginationInfo {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

/**
 * ページネーション付きAPIレスポンス
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T> {
    pagination: PaginationInfo;
}

/**
 * APIエラーの型定義
 */
export interface ApiError extends Error {
    status: number;
    code?: string;
    details?: Record<string, any>;
}

/**
 * APIリクエストパラメータの基本型
 */
export interface ApiRequestParams {
    [key: string]: any;
}

/**
 * ページネーションリクエストパラメータ
 */
export interface PaginationParams {
    page?: number;
    per_page?: number;
}

/**
 * 時間範囲フィルタパラメータ
 */
export interface TimeRangeParams {
    start_time?: string;
    end_time?: string;
    preset?: 'last_24h' | 'last_7d' | 'last_30d' | 'last_90d' | 'custom';
}

/**
 * ソートパラメータ
 */
export interface SortParams {
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

/**
 * フィルタパラメータ
 */
export interface FilterParams {
    [key: string]: string | number | boolean | string[] | number[] | null;
}

/**
 * 検索パラメータ
 */
export interface SearchParams {
    query?: string;
    fields?: string[];
}

/**
 * APIリクエストオプション
 */
export interface ApiRequestOptions {
    headers?: Record<string, string>;
    timeout?: number;
    retry?: number;
    cache?: boolean;
    signal?: AbortSignal;
}

/**
 * APIサービスインターフェース
 */
export interface ApiService {
    /**
     * GETリクエストを送信
     * @param url エンドポイントURL
     * @param params リクエストパラメータ
     * @param options リクエストオプション
     */
    get<T>(url: string, params?: ApiRequestParams, options?: ApiRequestOptions): Promise<ApiResponse<T>>;

    /**
     * POSTリクエストを送信
     * @param url エンドポイントURL
     * @param data リクエストボディ
     * @param options リクエストオプション
     */
    post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;

    /**
     * PUTリクエストを送信
     * @param url エンドポイントURL
     * @param data リクエストボディ
     * @param options リクエストオプション
     */
    put<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;

    /**
     * DELETEリクエストを送信
     * @param url エンドポイントURL
     * @param params リクエストパラメータ
     * @param options リクエストオプション
     */
    delete<T>(url: string, params?: ApiRequestParams, options?: ApiRequestOptions): Promise<ApiResponse<T>>;

    /**
     * PATCHリクエストを送信
     * @param url エンドポイントURL
     * @param data リクエストボディ
     * @param options リクエストオプション
     */
    patch<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
}