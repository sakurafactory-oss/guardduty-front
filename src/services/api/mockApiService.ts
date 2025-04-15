import { ApiService, ApiResponse, ApiError, ApiRequestParams, ApiRequestOptions } from './types';

/**
 * モックAPIサービス
 * テスト用のモックAPIサービス実装
 */
export class MockApiService implements ApiService {
    /**
     * GETリクエストを送信
     * @param url エンドポイントURL
     * @param params リクエストパラメータ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async get<T>(url: string, params?: ApiRequestParams, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        // エラーパスのテスト
        if (url.includes('/error')) {
            throw this.createApiError(404, 'リソースが見つかりません');
        }

        // 正常パスのテスト
        return {
            data: this.createMockData<T>(url, params),
            status: 200,
            message: '成功'
        };
    }

    /**
     * POSTリクエストを送信
     * @param url エンドポイントURL
     * @param data リクエストボディ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        // エラーパスのテスト
        if (url.includes('/error')) {
            throw this.createApiError(400, 'リクエストが不正です');
        }

        // 正常パスのテスト
        return {
            data: this.createMockData<T>(url, {}, data),
            status: 201,
            message: 'リソースが作成されました'
        };
    }

    /**
     * PUTリクエストを送信
     * @param url エンドポイントURL
     * @param data リクエストボディ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async put<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        // エラーパスのテスト
        if (url.includes('/error')) {
            throw this.createApiError(400, 'リクエストが不正です');
        }

        // 正常パスのテスト
        return {
            data: this.createMockData<T>(url, {}, data),
            status: 200,
            message: 'リソースが更新されました'
        };
    }

    /**
     * DELETEリクエストを送信
     * @param url エンドポイントURL
     * @param params リクエストパラメータ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async delete<T>(url: string, params?: ApiRequestParams, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        // エラーパスのテスト
        if (url.includes('/error')) {
            throw this.createApiError(404, 'リソースが見つかりません');
        }

        // 正常パスのテスト
        return {
            data: {} as T,
            status: 204,
            message: 'リソースが削除されました'
        };
    }

    /**
     * PATCHリクエストを送信
     * @param url エンドポイントURL
     * @param data リクエストボディ
     * @param options リクエストオプション
     * @returns APIレスポンス
     */
    async patch<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
        // エラーパスのテスト
        if (url.includes('/error')) {
            throw this.createApiError(400, 'リクエストが不正です');
        }

        // 正常パスのテスト
        return {
            data: this.createMockData<T>(url, {}, data),
            status: 200,
            message: 'リソースが部分的に更新されました'
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
        class MockApiError extends Error implements ApiError {
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

        return new MockApiError(status, message, code, details);
    }

    /**
     * モックデータを作成
     * @param url エンドポイントURL
     * @param params リクエストパラメータ
     * @param data リクエストボディ
     * @returns モックデータ
     */
    private createMockData<T>(url: string, params?: ApiRequestParams, data?: any): T {
        // URLからIDを抽出
        const idMatch = url.match(/\/([^\/]+)$/);
        const id = idMatch ? idMatch[1] : 'mock-id';

        // データタイプに基づいてモックデータを作成
        if (url.includes('/security_events')) {
            return {
                id,
                timestamp: new Date().toISOString(),
                source_ip: '192.168.1.1',
                event_type: 'login_attempt',
                severity: 3,
                ...data
            } as unknown as T;
        } else if (url.includes('/threats')) {
            return {
                id,
                rule_id: 'rule-123',
                timestamp: new Date().toISOString(),
                source_ip: '192.168.1.1',
                threat_type: 'brute_force',
                severity: 'high',
                ...data
            } as unknown as T;
        } else if (url.includes('/alerts')) {
            return {
                id,
                rule_id: 'rule-123',
                timestamp: new Date().toISOString(),
                severity: 'high',
                title: 'テストアラート',
                description: 'テスト用のアラート',
                ...data
            } as unknown as T;
        } else {
            // デフォルトのモックデータ
            return {
                id,
                name: data?.name || 'テストデータ',
                created_at: new Date().toISOString(),
                ...data
            } as unknown as T;
        }
    }
}