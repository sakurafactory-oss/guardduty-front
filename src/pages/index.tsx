import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetApi } from '../hooks/useApi';
import { SecurityEvent } from '../types/SecurityEvent';
import { DashboardLayout, DashboardWidget, TimeSeriesData, GeoDistribution } from '../types/DashboardTypes';

// Chart.jsの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * セキュリティダッシュボード（ホームページ）
 */
const Dashboard: NextPage = () => {
  // 時間範囲の状態
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [selectedLayout, setSelectedLayout] = useState<string>('default');

  // 最新のセキュリティイベント
  const { data: eventsData, loading: eventsLoading } = useGetApi<{ data: SecurityEvent[], pagination: any }>({
    url: '/api/security-events',
    params: { page: 1, per_page: 5 },
    autoExecute: true,
  });

  // ダッシュボードデータ
  const layoutsApi = useGetApi<{ data: DashboardLayout[] }>({ url: '/api/dashboard/layouts' });
  const widgetsApi = useGetApi<{ data: DashboardWidget[] }>({ url: '/api/dashboard/widgets' });
  const timeSeriesApi = useGetApi<{ data: TimeSeriesData }>({ url: '/api/dashboard/time-series' });
  const geoDistributionApi = useGetApi<{ data: GeoDistribution }>({ url: '/api/dashboard/geo-distribution' });

  // 重要度別のイベント数
  const [severityCounts, setSeverityCounts] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  });

  // 未解決のイベント数
  const [openCount, setOpenCount] = useState(0);

  // レイアウトとウィジェットの取得
  useEffect(() => {
    layoutsApi.execute();
    widgetsApi.execute();
  }, []);

  // 時系列データとジオデータの取得
  useEffect(() => {
    if (widgetsApi.data) {
      timeSeriesApi.execute();
      geoDistributionApi.execute();
    }
  }, [widgetsApi.data, timeRange]);

  useEffect(() => {
    if (eventsData?.data) {
      // 重要度別のカウント
      const counts = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
      };
      
      // 未解決のカウント
      let open = 0;
      
      eventsData.data.forEach(event => {
        // 重要度別のカウント
        if (counts[event.severity as keyof typeof counts] !== undefined) {
          counts[event.severity as keyof typeof counts]++;
        }
        
        // 未解決のカウント
        if (event.status !== 'resolved') {
          open++;
        }
      });
      
      setSeverityCounts(counts);
      setOpenCount(open);
    }
  }, [eventsData?.data]);

  // 時間範囲の変更ハンドラ
  const handleTimeRangeChange = (range: '24h' | '7d' | '30d') => {
    setTimeRange(range);
  };

  // 時系列データのチャート設定
  const getTimeSeriesChartData = () => {
    if (!timeSeriesApi.data) return null;

    const data = timeSeriesApi.data?.data;
    const labels = data?.series?.[0]?.data?.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    });

    if (!labels) return null;

    return {
      labels,
      datasets: data?.series?.map(series => ({
        label: series.name,
        data: series.data.map(item => item.value),
        borderColor: series.metadata?.color || '#3b82f6',
        backgroundColor: `${series.metadata?.color}33` || 'rgba(59, 130, 246, 0.2)',
        tension: 0.1,
      })),
    };
  };

  // 重要度分布のチャート設定
  const getSeverityChartData = () => {
    if (!timeSeriesApi.data) return null;

    const data = timeSeriesApi.data?.data;
    if (!data?.series) return null;
    
    const severityData = data.series.map(series => {
      return {
        name: series.name,
        value: series.data.reduce((sum, item) => sum + item.value, 0),
        color: series.metadata?.color,
      };
    });

    return {
      labels: severityData.map(item => item.name),
      datasets: [
        {
          data: severityData.map(item => item.value),
          backgroundColor: severityData.map(item => item.color),
          borderWidth: 1,
        },
      ],
    };
  };

  // イベントタイプ分布のチャート設定
  const getEventTypeChartData = () => {
    // サンプルデータ（実際にはAPIから取得）
    return {
      labels: ['不正アクセス', 'マルウェア', 'フィッシング', 'DoS攻撃', 'データ漏洩'],
      datasets: [
        {
          label: 'イベント数',
          data: [65, 42, 30, 25, 18],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
      <Head>
        <title>セキュリティダッシュボード | さくらGuardDuty</title>
        <meta name="description" content="セキュリティイベントの概要を視覚的に表示するダッシュボード" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">セキュリティダッシュボード</h1>
        
        <div className="flex space-x-2">
          <span className="text-gray-700 mr-2">期間:</span>
          <button
            className={`px-3 py-1 rounded text-sm ${
              timeRange === '24h' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleTimeRangeChange('24h')}
          >
            24時間
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleTimeRangeChange('7d')}
          >
            7日間
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleTimeRangeChange('30d')}
          >
            30日間
          </button>
        </div>
      </div>

      <div>
        {/* メインカード */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">セキュリティ監視ダッシュボード</h2>
            <p className="text-gray-600 mb-6">
              さくらセキュリティガードへようこそ。このダッシュボードでは、セキュリティイベントの監視と管理を行うことができます。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 主要機能カード */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">主要機能</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    セキュリティイベント監視
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    リアルタイムアラート
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    脅威インテリジェンス
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    セキュリティレポート
                  </li>
                </ul>
                {/* ダッシュボードへのリンクは不要（既にダッシュボードページにいるため） */}
              </div>

              {/* 統計カード */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">イベント統計</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">重大</span>
                      <span className="text-sm font-medium text-gray-700">{severityCounts.critical}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: `${(severityCounts.critical / 10) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">高</span>
                      <span className="text-sm font-medium text-gray-700">{severityCounts.high}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(severityCounts.high / 10) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">中</span>
                      <span className="text-sm font-medium text-gray-700">{severityCounts.medium}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(severityCounts.medium / 10) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">低</span>
                      <span className="text-sm font-medium text-gray-700">{severityCounts.low}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(severityCounts.low / 10) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/security-events" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    すべてのイベントを表示
                    <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* クイックアクセスカード */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">クイックアクセス</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/security-events" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <svg className="h-8 w-8 text-indigo-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">イベント一覧</span>
                  </Link>
                  {/* ダッシュボードへのリンクは不要（既にダッシュボードページにいるため） */}
                  <Link href="/alerts" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <svg className="h-8 w-8 text-indigo-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">アラート</span>
                  </Link>
                  <Link href="/settings" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <svg className="h-8 w-8 text-indigo-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">設定</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最新イベント */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">最新のセキュリティイベント</h3>
          </div>
          <div className="px-6 py-5">
            {eventsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" role="status">
                  <span className="sr-only">読み込み中...</span>
                </div>
              </div>
            ) : eventsData?.data && eventsData.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タイムスタンプ
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        イベントタイプ
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        重要度
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アクション
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eventsData.data.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.event_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            event.severity === 'low' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            event.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'mitigated' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status || 'open'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/security-event-detail/${event.id}`} className="text-indigo-600 hover:text-indigo-900">
                            詳細
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">イベントはありません</p>
            )}
            <div className="mt-6 text-center">
              <Link href="/security-events" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                すべてのイベントを表示
                <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
    
          {/* ダッシュボードチャート */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            {/* 時系列チャート */}
            <div className="lg:col-span-12 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">セキュリティイベント時系列</h2>
              <div className="h-64">
                {timeSeriesApi.loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : timeSeriesApi.error ? (
                  <div className="text-red-500 text-center">データの取得に失敗しました</div>
                ) : timeSeriesApi.data ? (
                  <Line
                    data={getTimeSeriesChartData() || { labels: [], datasets: [] }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="text-gray-500 text-center">データがありません</div>
                )}
              </div>
            </div>
    
            {/* 重要度分布 */}
            <div className="lg:col-span-6 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">重要度分布</h2>
              <div className="h-64">
                {timeSeriesApi.loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : timeSeriesApi.error ? (
                  <div className="text-red-500 text-center">データの取得に失敗しました</div>
                ) : timeSeriesApi.data ? (
                  <Pie
                    data={getSeverityChartData() || { labels: [], datasets: [] }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="text-gray-500 text-center">データがありません</div>
                )}
              </div>
            </div>
    
            {/* イベントタイプ分布 */}
            <div className="lg:col-span-6 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">イベントタイプ分布</h2>
              <div className="h-64">
                <Bar
                  data={getEventTypeChartData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
