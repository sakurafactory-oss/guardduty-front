import { useState } from 'react';
import { NextPage } from 'next';
import { useGetApi } from '../hooks/useApi';
import { SecurityEvent } from '../types/SecurityEvent';

/**
 * セキュリティイベント一覧ページ
 */
const SecurityEventsPage: NextPage = () => {
    // ページネーション状態
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);

    // APIパラメータ
    const params = {
        page,
        per_page: perPage,
    };

    // セキュリティイベント取得
    const { data, loading, error } = useGetApi<{
        data: SecurityEvent[];
        pagination: {
            total: number;
            page: number;
            per_page: number;
            total_pages: number;
        };
    }>({
        url: '/api/security-events',
        params,
        autoExecute: true,
    });

    // ローディング中
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-lg">読み込み中...</p>
                </div>
            </div>
        );
    }

    // エラー発生時
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center text-red-600">
                    <p className="text-xl">エラー: {error.message}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => window.location.reload()}
                    >
                        再読み込み
                    </button>
                </div>
            </div>
        );
    }

    // セキュリティイベント一覧
    const securityEvents = data?.data || [];

    // ページネーション情報
    const pagination = data?.pagination || {
        total: 0,
        page: 1,
        per_page: 10,
        total_pages: 1,
    };

    // 次のページへ
    const handleNextPage = () => {
        if (page < pagination.total_pages) {
            setPage(page + 1);
        }
    };

    // 前のページへ
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    // 重要度に応じた色を返す
    const getSeverityColor = (severity: SecurityEvent['severity']) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-600 text-white';
            case 'high':
                return 'bg-red-500 text-white';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-blue-500 text-white';
            case 'info':
                return 'bg-gray-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    // 日時のフォーマット
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">セキュリティイベント一覧</h1>

            {/* フィルター */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <div className="flex flex-wrap gap-4">
                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">重要度</label>
                        <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <option value="">すべて</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                            <option value="info">Info</option>
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">イベントタイプ</label>
                        <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <option value="">すべて</option>
                            <option value="login_attempt">ログイン試行</option>
                            <option value="file_access">ファイルアクセス</option>
                            <option value="network_connection">ネットワーク接続</option>
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">期間</label>
                        <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <option value="1d">24時間</option>
                            <option value="7d">7日間</option>
                            <option value="30d">30日間</option>
                            <option value="custom">カスタム</option>
                        </select>
                    </div>
                    <div className="w-full md:w-auto flex items-end">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            フィルター適用
                        </button>
                    </div>
                </div>
            </div>

            {/* イベント一覧テーブル */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left border-b">ID</th>
                            <th className="py-3 px-4 text-left border-b">タイムスタンプ</th>
                            <th className="py-3 px-4 text-left border-b">送信元IP</th>
                            <th className="py-3 px-4 text-left border-b">イベントタイプ</th>
                            <th className="py-3 px-4 text-left border-b">重要度</th>
                            <th className="py-3 px-4 text-left border-b">詳細</th>
                        </tr>
                    </thead>
                    <tbody>
                        {securityEvents.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-4 px-4 text-center border-b">
                                    セキュリティイベントがありません
                                </td>
                            </tr>
                        ) : (
                            securityEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 border-b">{event.id}</td>
                                    <td className="py-3 px-4 border-b">{formatDate(event.timestamp)}</td>
                                    <td className="py-3 px-4 border-b">{event.source_ip}</td>
                                    <td className="py-3 px-4 border-b">{event.event_type}</td>
                                    <td className="py-3 px-4 border-b">
                                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(event.severity)}`}>
                                            {event.severity}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <button className="text-blue-500 hover:text-blue-700">
                                            詳細を表示
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ページネーション */}
            <div className="mt-6 flex justify-between items-center">
                <div>
                    全 {pagination.total} 件中 {(page - 1) * perPage + 1} - {Math.min(page * perPage, pagination.total)} 件を表示
                </div>
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        onClick={handlePrevPage}
                        disabled={page === 1}
                    >
                        前へ
                    </button>
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    className={`w-10 h-10 rounded ${pageNum === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {pagination.total_pages > 5 && <span className="px-2">...</span>}
                    </div>
                    <button
                        className={`px-4 py-2 rounded ${page === pagination.total_pages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        onClick={handleNextPage}
                        disabled={page === pagination.total_pages}
                    >
                        次へ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecurityEventsPage;