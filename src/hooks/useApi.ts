import { useState, useCallback } from 'react';
import { ApiResponse, ApiRequestParams, ApiRequestOptions } from '../services/api/types';
import { apiService } from '../services/api/apiService';

/**
 * API呼び出しの状態
 */
export interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

/**
 * API呼び出しの結果
 */
export interface ApiResult<T> extends ApiState<T> {
    execute: () => Promise<ApiResponse<T> | null>;
    reset: () => void;
}

/**
 * GET APIフックのオプション
 */
export interface UseGetApiOptions<T> {
    url: string;
    params?: ApiRequestParams;
    options?: ApiRequestOptions;
    initialData?: T | null;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    autoExecute?: boolean;
}

/**
 * POST/PUT/PATCH APIフックのオプション
 */
export interface UseMutationApiOptions<T, D> {
    url: string;
    options?: ApiRequestOptions;
    initialData?: T | null;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

/**
 * GET APIフック
 * @param options APIフックオプション
 * @returns API呼び出し結果
 */
export function useGetApi<T>(options: UseGetApiOptions<T>): ApiResult<T> {
    const {
        url,
        params,
        options: requestOptions,
        initialData = null,
        onSuccess,
        onError,
        autoExecute = false
    } = options;

    const [state, setState] = useState<ApiState<T>>({
        data: initialData,
        loading: autoExecute,
        error: null
    });

    const execute = useCallback(async (): Promise<ApiResponse<T> | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiService.get<T>(url, params, requestOptions);
            setState({ data: response.data, loading: false, error: null });
            onSuccess?.(response.data);
            return response;
        } catch (error) {
            const apiError = error as Error;
            setState({ data: null, loading: false, error: apiError });
            onError?.(apiError);
            return null;
        }
    }, [url, params, requestOptions, onSuccess, onError]);

    const reset = useCallback(() => {
        setState({ data: initialData, loading: false, error: null });
    }, [initialData]);

    // 自動実行
    useState(() => {
        if (autoExecute) {
            execute();
        }
    });

    return {
        ...state,
        execute,
        reset
    };
}

/**
 * POST APIフック
 * @param options APIフックオプション
 * @returns API呼び出し結果
 */
export function usePostApi<T, D = any>(options: UseMutationApiOptions<T, D>): ApiResult<T> & {
    executeMutation: (data: D) => Promise<ApiResponse<T> | null>;
} {
    const {
        url,
        options: requestOptions,
        initialData = null,
        onSuccess,
        onError
    } = options;

    const [state, setState] = useState<ApiState<T>>({
        data: initialData,
        loading: false,
        error: null
    });

    const executeMutation = useCallback(async (data: D): Promise<ApiResponse<T> | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiService.post<T>(url, data, requestOptions);
            setState({ data: response.data, loading: false, error: null });
            onSuccess?.(response.data);
            return response;
        } catch (error) {
            const apiError = error as Error;
            setState({ data: null, loading: false, error: apiError });
            onError?.(apiError);
            return null;
        }
    }, [url, requestOptions, onSuccess, onError]);

    const execute = useCallback(async (): Promise<ApiResponse<T> | null> => {
        return executeMutation({} as D);
    }, [executeMutation]);

    const reset = useCallback(() => {
        setState({ data: initialData, loading: false, error: null });
    }, [initialData]);

    return {
        ...state,
        execute,
        executeMutation,
        reset
    };
}

/**
 * PUT APIフック
 * @param options APIフックオプション
 * @returns API呼び出し結果
 */
export function usePutApi<T, D = any>(options: UseMutationApiOptions<T, D>): ApiResult<T> & {
    executeMutation: (data: D) => Promise<ApiResponse<T> | null>;
} {
    const {
        url,
        options: requestOptions,
        initialData = null,
        onSuccess,
        onError
    } = options;

    const [state, setState] = useState<ApiState<T>>({
        data: initialData,
        loading: false,
        error: null
    });

    const executeMutation = useCallback(async (data: D): Promise<ApiResponse<T> | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiService.put<T>(url, data, requestOptions);
            setState({ data: response.data, loading: false, error: null });
            onSuccess?.(response.data);
            return response;
        } catch (error) {
            const apiError = error as Error;
            setState({ data: null, loading: false, error: apiError });
            onError?.(apiError);
            return null;
        }
    }, [url, requestOptions, onSuccess, onError]);

    const execute = useCallback(async (): Promise<ApiResponse<T> | null> => {
        return executeMutation({} as D);
    }, [executeMutation]);

    const reset = useCallback(() => {
        setState({ data: initialData, loading: false, error: null });
    }, [initialData]);

    return {
        ...state,
        execute,
        executeMutation,
        reset
    };
}

/**
 * PATCH APIフック
 * @param options APIフックオプション
 * @returns API呼び出し結果
 */
export function usePatchApi<T, D = any>(options: UseMutationApiOptions<T, D>): ApiResult<T> & {
    executeMutation: (data: D) => Promise<ApiResponse<T> | null>;
} {
    const {
        url,
        options: requestOptions,
        initialData = null,
        onSuccess,
        onError
    } = options;

    const [state, setState] = useState<ApiState<T>>({
        data: initialData,
        loading: false,
        error: null
    });

    const executeMutation = useCallback(async (data: D): Promise<ApiResponse<T> | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiService.patch<T>(url, data, requestOptions);
            setState({ data: response.data, loading: false, error: null });
            onSuccess?.(response.data);
            return response;
        } catch (error) {
            const apiError = error as Error;
            setState({ data: null, loading: false, error: apiError });
            onError?.(apiError);
            return null;
        }
    }, [url, requestOptions, onSuccess, onError]);

    const execute = useCallback(async (): Promise<ApiResponse<T> | null> => {
        return executeMutation({} as D);
    }, [executeMutation]);

    const reset = useCallback(() => {
        setState({ data: initialData, loading: false, error: null });
    }, [initialData]);

    return {
        ...state,
        execute,
        executeMutation,
        reset
    };
}

/**
 * DELETE APIフック
 * @param options APIフックオプション
 * @returns API呼び出し結果
 */
export function useDeleteApi<T>(options: UseGetApiOptions<T>): ApiResult<T> {
    const {
        url,
        params,
        options: requestOptions,
        initialData = null,
        onSuccess,
        onError
    } = options;

    const [state, setState] = useState<ApiState<T>>({
        data: initialData,
        loading: false,
        error: null
    });

    const execute = useCallback(async (): Promise<ApiResponse<T> | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiService.delete<T>(url, params, requestOptions);
            setState({ data: response.data, loading: false, error: null });
            onSuccess?.(response.data);
            return response;
        } catch (error) {
            const apiError = error as Error;
            setState({ data: null, loading: false, error: apiError });
            onError?.(apiError);
            return null;
        }
    }, [url, params, requestOptions, onSuccess, onError]);

    const reset = useCallback(() => {
        setState({ data: initialData, loading: false, error: null });
    }, [initialData]);

    return {
        ...state,
        execute,
        reset
    };
}