import { renderHook, act } from '@testing-library/react';
import { useGetApi, usePostApi, usePutApi, usePatchApi, useDeleteApi } from '../useApi';
import { apiService } from '../../services/api/apiService';

// apiServiceをモック化
jest.mock('../../services/api/apiService', () => ({
    apiService: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn()
    }
}));

describe('useApi hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useGetApi', () => {
        it('初期状態が正しいこと', () => {
            const { result } = renderHook(() => useGetApi({ url: '/test' }));

            expect(result.current.data).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.error).toBeNull();
        });

        it('autoExecuteがtrueの場合、初期状態でloadingがtrueになること', () => {
            const { result } = renderHook(() => useGetApi({ url: '/test', autoExecute: true }));

            expect(result.current.loading).toBeTruthy();
        });

        it('executeを呼び出すとloadingがtrueになること', async () => {
            const { result } = renderHook(() => useGetApi({ url: '/test' }));

            (apiService.get as jest.Mock).mockResolvedValueOnce({
                data: { id: '1', name: 'test' },
                status: 200,
                message: 'Success'
            });

            await act(async () => {
                await result.current.execute();
            });

            expect(apiService.get).toHaveBeenCalledWith('/test', undefined, undefined);
        });

        it('APIが成功した場合、dataが更新されること', async () => {
            const mockData = { id: '1', name: 'test' };
            const { result } = renderHook(() => useGetApi({ url: '/test' }));

            (apiService.get as jest.Mock).mockResolvedValueOnce({
                data: mockData,
                status: 200,
                message: 'Success'
            });

            await act(async () => {
                await result.current.execute();
            });

            expect(result.current.data).toEqual(mockData);
            expect(result.current.loading).toBeFalsy();
            expect(result.current.error).toBeNull();
        });

        it('APIが失敗した場合、errorが更新されること', async () => {
            const mockError = new Error('API Error');
            const { result } = renderHook(() => useGetApi({ url: '/test' }));

            (apiService.get as jest.Mock).mockRejectedValueOnce(mockError);

            await act(async () => {
                await result.current.execute();
            });

            expect(result.current.data).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.error).toEqual(mockError);
        });

        it('onSuccessコールバックが呼び出されること', async () => {
            const mockData = { id: '1', name: 'test' };
            const onSuccess = jest.fn();
            const { result } = renderHook(() => useGetApi({ url: '/test', onSuccess }));

            (apiService.get as jest.Mock).mockResolvedValueOnce({
                data: mockData,
                status: 200,
                message: 'Success'
            });

            await act(async () => {
                await result.current.execute();
            });

            expect(onSuccess).toHaveBeenCalledWith(mockData);
        });

        it('onErrorコールバックが呼び出されること', async () => {
            const mockError = new Error('API Error');
            const onError = jest.fn();
            const { result } = renderHook(() => useGetApi({ url: '/test', onError }));

            (apiService.get as jest.Mock).mockRejectedValueOnce(mockError);

            await act(async () => {
                await result.current.execute();
            });

            expect(onError).toHaveBeenCalledWith(mockError);
        });

        it('resetを呼び出すと状態がリセットされること', async () => {
            const mockData = { id: '1', name: 'test' };
            const { result } = renderHook(() => useGetApi({ url: '/test' }));

            (apiService.get as jest.Mock).mockResolvedValueOnce({
                data: mockData,
                status: 200,
                message: 'Success'
            });

            await act(async () => {
                await result.current.execute();
            });

            expect(result.current.data).toEqual(mockData);

            act(() => {
                result.current.reset();
            });

            expect(result.current.data).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.error).toBeNull();
        });
    });

    describe('usePostApi', () => {
        it('初期状態が正しいこと', () => {
            const { result } = renderHook(() => usePostApi({ url: '/test' }));

            expect(result.current.data).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.error).toBeNull();
        });

        it('executeMutationを呼び出すとloadingがtrueになること', async () => {
            const { result } = renderHook(() => usePostApi({ url: '/test' }));
            const mockData = { name: 'test' };

            (apiService.post as jest.Mock).mockResolvedValueOnce({
                data: { id: '1', name: 'test' },
                status: 201,
                message: 'Created'
            });

            await act(async () => {
                await result.current.executeMutation(mockData);
            });

            expect(apiService.post).toHaveBeenCalledWith('/test', mockData, undefined);
        });

        it('APIが成功した場合、dataが更新されること', async () => {
            const mockRequestData = { name: 'test' };
            const mockResponseData = { id: '1', name: 'test' };
            const { result } = renderHook(() => usePostApi({ url: '/test' }));

            (apiService.post as jest.Mock).mockResolvedValueOnce({
                data: mockResponseData,
                status: 201,
                message: 'Created'
            });

            await act(async () => {
                await result.current.executeMutation(mockRequestData);
            });

            expect(result.current.data).toEqual(mockResponseData);
            expect(result.current.loading).toBeFalsy();
            expect(result.current.error).toBeNull();
        });
    });

    describe('usePutApi', () => {
        it('初期状態が正しいこと', () => {
            const { result } = renderHook(() => usePutApi({ url: '/test/1' }));

            expect(result.current.data).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.error).toBeNull();
        });

        it('executeMutationを呼び出すとloadingがtrueになること', async () => {
            const { result } = renderHook(() => usePutApi({ url: '/test/1' }));
            const mockData = { id: '1', name: 'updated' };

            (apiService.put as jest.Mock).mockResolvedValueOnce({
                data: mockData,
                status: 200,
                message: 'Updated'
            });

            await act(async () => {
                await result.current.executeMutation(mockData);
            });

            expect(apiService.put).toHaveBeenCalledWith('/test/1', mockData, undefined);
        });
    });

    describe('usePatchApi', () => {
        it('初期状態が正しいこと', () => {
            const { result } = renderHook(() => usePatchApi({ url: '/test/1' }));

            expect(result.current.data).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.error).toBeNull();
        });

        it('executeMutationを呼び出すとloadingがtrueになること', async () => {
            const { result } = renderHook(() => usePatchApi({ url: '/test/1' }));
            const mockData = { name: 'partially updated' };

            (apiService.patch as jest.Mock).mockResolvedValueOnce({
                data: { id: '1', name: 'partially updated' },
                status: 200,
                message: 'Updated'
            });

            await act(async () => {
                await result.current.executeMutation(mockData);
            });

            expect(apiService.patch).toHaveBeenCalledWith('/test/1', mockData, undefined);
        });
    });

    describe('useDeleteApi', () => {
        it('初期状態が正しいこと', () => {
            const { result } = renderHook(() => useDeleteApi({ url: '/test/1' }));

            expect(result.current.data).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.error).toBeNull();
        });

        it('executeを呼び出すとloadingがtrueになること', async () => {
            const { result } = renderHook(() => useDeleteApi({ url: '/test/1' }));

            (apiService.delete as jest.Mock).mockResolvedValueOnce({
                data: {},
                status: 204,
                message: 'Deleted'
            });

            await act(async () => {
                await result.current.execute();
            });

            expect(apiService.delete).toHaveBeenCalledWith('/test/1', undefined, undefined);
        });
    });
});