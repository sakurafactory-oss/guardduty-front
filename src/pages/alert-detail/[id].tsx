import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGetApi } from '../../hooks/useApi';
import { Alert } from '../../types/AlertTypes';

/**
 * アラート詳細ページ
 * 特定のアラートの詳細情報を表示するページ
 */
const AlertDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<boolean>(false);

  // APIからアラートデータを取得
  const { data: alert, loading, error, execute: refetchAlert } = useGetApi<Alert>({
    url: `/api/alerts/${id}`,
    autoExecute: router.isReady,
  });

  // アラートステータスの更新
  const updateAlertStatus = async (newStatus: string) => {
    setStatusUpdateLoading(true);
    try {
      // 実際のAPIでは、PUTリクエストを送信してステータスを更新
      console.log(`アラートステータスを更新: ${id} -> ${newStatus}`);
      // 更新後にデータを再取得
      await new Promise(resolve => setTimeout(resolve, 500)); // 擬似的な遅延
      await refetchAlert();
    } catch (error) {
      console.error('ステータス更新エラー:', error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // 日時のフォーマット
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  // 重要度に応じたバッジスタイルを返す
  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ステータスに応じたバッジスタイルを返す
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'acknowledged':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'mitigated':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 通知ステータスに応じたバッジスタイルを返す
  const getNotificationStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>アラート詳細 - さくらセキュリティガード</title>
        <meta name="description" content="セキュリティアラートの詳細情報" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">アラート詳細</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/alerts" className="text-indigo-600 hover:text-indigo-900">
            ← アラート一覧に戻る
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-red-500">
              エラーが発生しました: {error.message}
            </div>
          </div>
        ) : alert ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* アラートヘッダー */}
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {alert.title || alert.description.substring(0, 50)}
              </h2>
              <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
            </div>

            {/* アラートメタデータ */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">重要度</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityBadgeClass(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">ステータス</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">タイムスタンプ</span>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(alert.timestamp)}
                  </div>
                </div>
              </div>
            </div>

            {/* アラート詳細情報 */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">詳細情報</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {alert.details && (
                    <>
                      {alert.details.source_ip && (
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            送信元IP
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {alert.details.source_ip}
                          </dd>
                        </div>
                      )}
                      {alert.details.target_service && (
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            対象サービス
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            SSH
                          </dd>
                        </div>
                      )}
                      {alert.details.failed_attempts && (
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            失敗試行回数
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {alert.details.failed_attempts}
                          </dd>
                        </div>
                      )}
                      {alert.details.time_window && (
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            時間枠
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {alert.details.time_window}
                          </dd>
                        </div>
                      )}
                      {alert.details.detection_rule && (
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            検出ルール
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {alert.details.detection_rule}
                          </dd>
                        </div>
                      )}
                      {/* その他の詳細情報があれば表示 */}
                      {Object.entries(alert.details)
                        .filter(([key]) => !['source_ip', 'target_service', 'failed_attempts', 'time_window', 'detection_rule'].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </dd>
                          </div>
                        ))}
                    </>
                  )}
                </dl>
              </div>
            </div>

            {/* 通知状況 */}
            {alert.notification_status && alert.notification_status.length > 0 && (
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">通知状況</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          チャンネル
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          タイムスタンプ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {alert.notification_status.map((notification, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {notification.channel_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getNotificationStatusBadgeClass(notification.status)}`}>
                              {notification.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(notification.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-2">
              {alert.status !== 'resolved' && (
                <button
                  type="button"
                  onClick={() => updateAlertStatus('resolved')}
                  disabled={statusUpdateLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {statusUpdateLoading ? '更新中...' : '解決済みにする'}
                </button>
              )}
              {alert.status !== 'investigating' && (
                <button
                  type="button"
                  onClick={() => updateAlertStatus('investigating')}
                  disabled={statusUpdateLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {statusUpdateLoading ? '更新中...' : '調査中にする'}
                </button>
              )}
              {alert.status !== 'mitigated' && (
                <button
                  type="button"
                  onClick={() => updateAlertStatus('mitigated')}
                  disabled={statusUpdateLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                >
                  {statusUpdateLoading ? '更新中...' : '対応中にする'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center text-gray-500">
              アラートが見つかりません
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AlertDetail;