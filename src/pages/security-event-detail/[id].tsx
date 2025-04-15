import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Link from 'next/link';
import { useGetApi } from '../../hooks/useApi';
import { SecurityEvent } from '../../types/SecurityEvent';

/**
 * セキュリティイベント詳細ページ
 */
const SecurityEventDetailPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    // ルーターの準備ができていない場合は何も表示しない
    if (!router.isReady) {
        return null;
    }

    // セキュリティイベント取得
    const { data, loading, error } = useGetApi<{ data: SecurityEvent }>({
        url: `/api/security-events/${id}`,
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

    const event = data?.data;

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-xl">イベントが見つかりません</p>
                    <Link href="/security-events">
                        <a className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            イベント一覧に戻る
                        </a>
                    </Link>
                </div>
            </div>
        );
    }

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

    // JSONを整形して表示
    const formatJSON = (json: Record<string, any>) => {
        return JSON.stringify(json, null, 2);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">セキュリティイベント詳細</h1>
                <Link href="/security-events" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    イベント一覧に戻る
                </Link>
            </div>

            {/* イベント概要 */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">基本情報</h2>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="py-2 font-medium">ID</td>
                                    <td>{event.id}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-medium">タイムスタンプ</td>
                                    <td>{formatDate(event.timestamp)}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-medium">送信元IP</td>
                                    <td>{event.source_ip}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-medium">イベントタイプ</td>
                                    <td>{event.event_type}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-medium">重要度</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(event.severity)}`}>
                                            {event.severity}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-medium">ステータス</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-xs ${event.status === 'resolved' ? 'bg-green-500 text-white' : 'bg-yellow-500'
                                            }`}>
                                            {event.status || 'open'}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">アクション</h2>
                        <div className="space-y-2">
                            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                調査を開始
                            </button>
                            <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                解決済みとしてマーク
                            </button>
                            <button className="w-full px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600">
                                アラートを作成
                            </button>
                            <button className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                ブロックリストに追加
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 詳細情報 */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">詳細情報</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                    {formatJSON(event.details || {})}
                </pre>
            </div>

            {/* 関連イベント */}
            {event.related_events && event.related_events.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">関連イベント</h2>
                    <ul className="divide-y">
                        {event.related_events.map((relatedId) => (
                            <li key={relatedId} className="py-3">
                                <Link href={`/security-event-detail/${relatedId}`} className="text-blue-500 hover:text-blue-700">
                                    {relatedId}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* タイムライン */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">タイムライン</h2>
                <div className="relative border-l-2 border-gray-200 ml-3">
                    <div className="mb-6 ml-6">
                        <div className="absolute -left-3 mt-1.5">
                            <div className="w-6 h-6 bg-blue-500 rounded-full text-white flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm text-gray-500">{formatDate(event.timestamp)}</div>
                            <div className="font-medium">イベント検出</div>
                            <div className="text-sm text-gray-600">システムによって自動検出されました</div>
                        </div>
                    </div>

                    {event.status === 'resolved' && event.resolution_time && (
                        <div className="mb-6 ml-6">
                            <div className="absolute -left-3 mt-1.5">
                                <div className="w-6 h-6 bg-green-500 rounded-full text-white flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm text-gray-500">{formatDate(event.resolution_time)}</div>
                                <div className="font-medium">解決済み</div>
                                <div className="text-sm text-gray-600">イベントは解決されました</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityEventDetailPage;