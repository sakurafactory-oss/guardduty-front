import { ApiService, ApiResponse, ApiError, ApiRequestParams, ApiRequestOptions, PaginatedApiResponse } from './types';

/**
 * APIサービス実装
 * さくらGuardDutyのAPIサービス実装
 */
export class GuardDutyApiService implements ApiService {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;
    private defaultTimeout: number;
    private defaultRetry: number;

    /**
     * コンストラクタ
     * @param baseUrl APIのベースURL
     * @param defaultHeaders デフォルトのヘッダー
     * @param defaultTimeout デフォルトのタイムアウト（ミリ秒）
     * @param defaultRetry デフォルトのリトライ回数
     */
    constructor(
        baseUrl: string = '/api',
        defaultHeaders: Record<string, string> = {},
        defaultTimeout: number = 30000,
        defaultRetry: number = 1
    ) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...defaultHeaders
        };
        this.defaultTimeout = defaultTimeout;
        this.defaultRetry = defaultRetry;
    }

    /**
     * GETリクエストを送信
     * @param url エンドポイントURL
     * @param params リクエストパラメータ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async get<T>(url: string, params?: ApiRequestParams, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        const fullUrl = this.buildUrl(url, params);
        const requestOptions = this.buildRequestOptions('GET', undefined, options);

        return this.sendRequest<T>(fullUrl, requestOptions);
    }

    /**
     * POSTリクエストを送信
     * @param url エンドポイントURL
     * @param data リクエストボディ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        const fullUrl = this.buildUrl(url);
        const requestOptions = this.buildRequestOptions('POST', data, options);

        return this.sendRequest<T>(fullUrl, requestOptions);
    }

    /**
     * PUTリクエストを送信
     * @param url エンドポイントURL
     * @param data リクエストボディ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async put<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        const fullUrl = this.buildUrl(url);
        const requestOptions = this.buildRequestOptions('PUT', data, options);

        return this.sendRequest<T>(fullUrl, requestOptions);
    }

    /**
     * DELETEリクエストを送信
     * @param url エンドポイントURL
     * @param params リクエストパラメータ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async delete<T>(url: string, params?: ApiRequestParams, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        const fullUrl = this.buildUrl(url, params);
        const requestOptions = this.buildRequestOptions('DELETE', undefined, options);

        return this.sendRequest<T>(fullUrl, requestOptions);
    }

    /**
     * PATCHリクエストを送信
     * @param url エンドポイントURL
     * @param data リクエストボディ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async patch<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        const fullUrl = this.buildUrl(url);
        const requestOptions = this.buildRequestOptions('PATCH', data, options);

        return this.sendRequest<T>(fullUrl, requestOptions);
    }

    /**
     * URLを構築
     * @param url エンドポイントURL
     * @param params リクエストパラメータ
     * @returns 完全なURL
     */
    private buildUrl(url: string, params?: ApiRequestParams): string {
        // ベースURLとエンドポイントURLを結合
        const fullUrl = `${this.baseUrl}${url.startsWith('/') ? url : `/${url}`}`;

        // パラメータがない場合はURLをそのまま返す
        if (!params) {
            return fullUrl;
        }

        // URLSearchParamsを使用してクエリパラメータを構築
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(`${key}[]`, String(v)));
                } else {
                    searchParams.append(key, String(value));
                }
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `${fullUrl}?${queryString}` : fullUrl;
    }

    /**
     * リクエストオプションを構築
     * @param method HTTPメソッド
     * @param data リクエストボディ
     * @param options リクエストオプション
     * @returns 完全なリクエストオプション
     */
    private buildRequestOptions(
        method: string,
        data?: any,
        options?: ApiRequestOptions
    ): RequestInit {
        const headers = {
            ...this.defaultHeaders,
            ...options?.headers
        };

        const requestOptions: RequestInit = {
            method,
            headers,
            signal: options?.signal
        };

        if (data !== undefined) {
            requestOptions.body = JSON.stringify(data);
        }

        return requestOptions;
    }

    /**
     * リクエストを送信
     * @param url リクエストURL
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    private async sendRequest<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
        const timeout = this.createTimeout();
        const maxRetries = options.signal ? 0 : (options as any)?.retry || this.defaultRetry;
        let retries = 0;
        let lastError: Error | null = null;

        while (retries <= maxRetries) {
            try {
                const response = await this.fetchWithTimeout(url, options, timeout);
                return await this.handleResponse<T>(response);
            } catch (error) {
                lastError = error as Error;

                // AbortErrorの場合はリトライしない
                if (error instanceof DOMException && error.name === 'AbortError') {
                    break;
                }

                retries++;

                if (retries <= maxRetries) {
                    // 指数バックオフでリトライ
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
                }
            }
        }

        throw lastError || new Error('リクエストに失敗しました');
    }

    /**
     * タイムアウト付きのfetch
     * @param url リクエストURL
     * @param options リクエストオプション
     * @param timeout タイムアウト時間（ミリ秒）
     * @returns レスポンス
     */
    private async fetchWithTimeout(
        url: string,
        options: RequestInit,
        timeout: number
    ): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            // ユーザー指定のAbortSignalがある場合は、それも監視
            if (options.signal) {
                options.signal.addEventListener('abort', () => controller.abort());
            }

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            return response;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * レスポンスを処理
     * @param response fetchレスポンス
     * @returns APIレスポンス
     */
    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');

        // JSONレスポンスの場合
        if (isJson) {
            const data = await response.json();

            // エラーレスポンスの場合
            if (!response.ok) {
                throw this.createApiError(
                    response.status,
                    data.message || response.statusText,
                    data.code,
                    data.details
                );
            }

            // ページネーション情報がある場合
            if (data.pagination) {
                return data as PaginatedApiResponse<T>;
            }

            // 通常のレスポンスの場合
            return {
                data: data.data || data,
                status: response.status,
                message: data.message || 'Success'
            };
        }

        // JSON以外のレスポンスの場合
        if (!response.ok) {
            throw this.createApiError(
                response.status,
                response.statusText,
                undefined,
                { body: await response.text() }
            );
        }

        // 空のレスポンスの場合（例：204 No Content）
        return {
            data: {} as T,
            status: response.status,
            message: response.statusText || 'Success'
        };
    }

    /**
     * APIエラーを作成
     * @param status HTTPステータスコード
     * @param message エラーメッセージ
     * @param code エラーコード
     * @param details エラー詳細
     * @returns APIエラー
     */
    private createApiError(
        status: number,
        message: string,
        code?: string,
        details?: Record<string, any>
    ): ApiError {
        // ApiErrorクラスを作成
        class GuardDutyApiError extends Error implements ApiError {
            status: number;
            code?: string;
            details?: Record<string, any>;

            constructor(status: number, message: string, code?: string, details?: Record<string, any>) {
                super(message);
                this.name = 'ApiError';
                this.status = status;
                this.code = code;
                this.details = details;
            }
        }

        return new GuardDutyApiError(status, message, code, details);
    }

    /**
     * タイムアウト時間を取得
     * @returns タイムアウト時間（ミリ秒）
     */
    private createTimeout(): number {
        return this.defaultTimeout;
    }
}

// シングルトンインスタンスを作成
export const apiService = new GuardDutyApiService();