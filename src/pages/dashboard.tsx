import React, { useState, useEffect } from 'react';
import Head from 'next/head';
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
 * ダッシュボードページコンポーネント
 * セキュリティイベントの概要を視覚的に表示する
 */
const DashboardPage: React.FC = () => {
  // 状態
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [selectedLayout, setSelectedLayout] = useState<string>('default');

  // APIデータ取得
  const layoutsApi = useGetApi<{ data: DashboardLayout[] }>({ url: '/api/dashboard/layouts' });
  const widgetsApi = useGetApi<{ data: DashboardWidget[] }>({ url: '/api/dashboard/widgets' });
  const timeSeriesApi = useGetApi<{ data: TimeSeriesData }>({ url: '/api/dashboard/time-series' });
  const geoDistributionApi = useGetApi<{ data: GeoDistribution }>({ url: '/api/dashboard/geo-distribution' });

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

  // 時間範囲の変更ハンドラ
  const handleTimeRangeChange = (range: '24h' | '7d' | '30d') => {
    setTimeRange(range);
  };

  // ローディング中の表示
  if (layoutsApi.loading || widgetsApi.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (layoutsApi.error || widgetsApi.error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p>エラー: {layoutsApi.error?.message || widgetsApi.error?.message}</p>
        </div>
      </div>
    );
  }

  // 時系列データのチャート設定
  const getTimeSeriesChartData = () => {
    if (!timeSeriesApi.data) return null;

    const data = timeSeriesApi.data.data;
    const labels = data.series[0].data.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    });

    return {
      labels,
      datasets: data.series.map(series => ({
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

    const data = timeSeriesApi.data.data;
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

  // データがない場合の表示
  if (!layoutsApi.data || !widgetsApi.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">セキュリティダッシュボード</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">データが見つかりませんでした。</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>セキュリティダッシュボード | さくらGuardDuty</title>
        <meta name="description" content="セキュリティイベントの概要を視覚的に表示するダッシュボード" />
      </Head>

      <div className="container mx-auto px-4 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

          {/* 地理的分布 */}
          <div className="lg:col-span-12 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">地理的分布</h2>
            <div className="h-96">
              {geoDistributionApi.loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : geoDistributionApi.error ? (
                <div className="text-red-500 text-center">データの取得に失敗しました</div>
              ) : geoDistributionApi.data ? (
                <div className="overflow-auto h-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">国</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">イベント数</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">割合</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {geoDistributionApi.data.data.regions.map((region, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.country_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.percentage.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 text-center">データがありません</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;