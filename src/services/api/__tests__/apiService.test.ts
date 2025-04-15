import { ApiService, ApiResponse, ApiError } from '../types';
import { MockApiService } from '../mockApiService';

describe('ApiService', () => {
    let apiService: ApiService;

    beforeEach(() => {
        apiService = new MockApiService();
    });

    describe('get', () => {
        it('正常なGETリクエストを送信できること', async () => {
            const response = await apiService.get<{ id: string; name: string }>('/test');

            expect(response).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
        });

        it('パラメータ付きのGETリクエストを送信できること', async () => {
            const params = { id: '123', filter: 'test' };
            const response = await apiService.get<{ id: string; name: string }>('/test', params);

            expect(response).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
        });

        it('エラー時に適切なApiErrorをスローすること', async () => {
            try {
                await apiService.get<{ id: string; name: string }>('/error');
                fail('エラーがスローされるべき');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                const apiError = error as ApiError;
                expect(apiError.status).toBeDefined();
                expect(apiError.message).toBeDefined();
            }
        });
    });

    describe('post', () => {
        it('正常なPOSTリクエストを送信できること', async () => {
            const data = { name: 'test' };
            const response = await apiService.post<{ id: string; name: string }>('/test', data);

            expect(response).toBeDefined();
            expect(response.status).toBe(201);
            expect(response.data).toBeDefined();
            expect(response.data.name).toBe('test');
        });

        it('エラー時に適切なApiErrorをスローすること', async () => {
            try {
                await apiService.post<{ id: string; name: string }>('/error', {});
                fail('エラーがスローされるべき');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                const apiError = error as ApiError;
                expect(apiError.status).toBeDefined();
                expect(apiError.message).toBeDefined();
            }
        });
    });

    describe('put', () => {
        it('正常なPUTリクエストを送信できること', async () => {
            const data = { id: '123', name: 'updated' };
            const response = await apiService.put<{ id: string; name: string }>('/test/123', data);

            expect(response).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data.name).toBe('updated');
        });

        it('エラー時に適切なApiErrorをスローすること', async () => {
            try {
                await apiService.put<{ id: string; name: string }>('/error', {});
                fail('エラーがスローされるべき');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                const apiError = error as ApiError;
                expect(apiError.status).toBeDefined();
                expect(apiError.message).toBeDefined();
            }
        });
    });

    describe('delete', () => {
        it('正常なDELETEリクエストを送信できること', async () => {
            const response = await apiService.delete<void>('/test/123');

            expect(response).toBeDefined();
            expect(response.status).toBe(204);
        });

        it('エラー時に適切なApiErrorをスローすること', async () => {
            try {
                await apiService.delete<void>('/error');
                fail('エラーがスローされるべき');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                const apiError = error as ApiError;
                expect(apiError.status).toBeDefined();
                expect(apiError.message).toBeDefined();
            }
        });
    });

    describe('patch', () => {
        it('正常なPATCHリクエストを送信できること', async () => {
            const data = { name: 'partially updated' };
            const response = await apiService.patch<{ id: string; name: string }>('/test/123', data);

            expect(response).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data.name).toBe('partially updated');
        });

        it('エラー時に適切なApiErrorをスローすること', async () => {
            try {
                await apiService.patch<{ id: string; name: string }>('/error', {});
                fail('エラーがスローされるべき');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                const apiError = error as ApiError;
                expect(apiError.status).toBeDefined();
                expect(apiError.message).toBeDefined();
            }
        });
    });

    describe('リクエストオプション', () => {
        it('カスタムヘッダーを設定できること', async () => {
            const options = {
                headers: {
                    'X-Custom-Header': 'test-value'
                }
            };

            const response = await apiService.get<{ id: string; name: string }>('/test', {}, options);

            expect(response).toBeDefined();
            expect(response.status).toBe(200);
        });

        it('タイムアウトを設定できること', async () => {
            const options = {
                timeout: 5000
            };

            const response = await apiService.get<{ id: string; name: string }>('/test', {}, options);

            expect(response).toBeDefined();
            expect(response.status).toBe(200);
        });

        it('リトライ回数を設定できること', async () => {
            const options = {
                retry: 3
            };

            const response = await apiService.get<{ id: string; name: string }>('/test', {}, options);

            expect(response).toBeDefined();
            expect(response.status).toBe(200);
        });
    });
});