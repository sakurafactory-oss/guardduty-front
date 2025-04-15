import { useState, useEffect } from 'react';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import { SecurityEvent } from '@/types/SecurityEvent';

const Home: NextPage = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.get<SecurityEvent[]>(`${apiUrl}/events`);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('イベントの取得中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleResolveEvent = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await axios.put(`${apiUrl}/events/${id}/resolve`);
      fetchEvents();
    } catch (err) {
      console.error('Error resolving event:', err);
      setError('イベントの解決中にエラーが発生しました。');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await axios.delete(`${apiUrl}/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('イベントの削除中にエラーが発生しました。');
    }
  };

  const handleCreateEvent = async (event: {
    source_ip: string;
    event_type: string;
    severity: number;
    details: Record<string, any>;
  }) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await axios.post(`${apiUrl}/events`, event);
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      setError('イベントの作成中にエラーが発生しました。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>さくらセキュリティガード</title>
        <meta name="description" content="さくらインターネット向けのセキュリティ監視サービス" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">さくらセキュリティガード</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* イベント作成フォーム */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">新規セキュリティイベント</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const sourceIp = formData.get('source_ip') as string;
              const eventType = formData.get('event_type') as string;
              const severity = parseInt(formData.get('severity') as string);
              const details = formData.get('details') as string;

              handleCreateEvent({
                source_ip: sourceIp,
                event_type: eventType,
                severity,
                details: JSON.parse(details || '{}'),
              });

              // フォームをリセット
              e.currentTarget.reset();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="source_ip" className="block text-sm font-medium text-gray-700">
                  送信元IP
                </label>
                <input
                  type="text"
                  name="source_ip"
                  id="source_ip"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="192.168.1.1"
                />
              </div>
              <div>
                <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
                  イベントタイプ
                </label>
                <input
                  type="text"
                  name="event_type"
                  id="event_type"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="login_attempt"
                />
              </div>
              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                  重要度 (1-5)
                </label>
                <input
                  type="number"
                  name="severity"
                  id="severity"
                  min="1"
                  max="5"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  defaultValue="3"
                />
              </div>
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                  詳細 (JSON)
                </label>
                <textarea
                  name="details"
                  id="details"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={3}
                  placeholder='{"username": "admin", "attempt_count": 5}'
                  defaultValue="{}"
                ></textarea>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                イベントを作成
              </button>
            </div>
          </form>
        </div>

        {/* イベントリスト */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">セキュリティイベント一覧</h2>

          {loading ? (
            <p className="text-gray-500">読み込み中...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500">イベントはありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイムスタンプ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      送信元IP
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      イベントタイプ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      重要度
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状態
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.source_ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.event_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.severity >= 4 ? 'bg-red-100 text-red-800' :
                          event.severity >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                          {event.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.resolved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {event.resolved ? '解決済み' : '未解決'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!event.resolved && (
                          <button
                            onClick={() => handleResolveEvent(event.id)}
                            className="text-primary-600 hover:text-primary-900 mr-3"
                          >
                            解決
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
