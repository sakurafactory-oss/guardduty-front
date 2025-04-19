import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

/**
 * 設定ページ
 * ユーザー設定、通知設定、セキュリティ設定などを管理するページ
 */
const Settings: NextPage = () => {
  // 設定タブの状態
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'api'>('general');

  // 通知設定の状態
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    slack: false,
    lineNotify: false,
    pushNotifications: true,
  });

  // セキュリティ設定の状態
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    ipRestriction: false,
  });

  // API設定の状態
  const [apiSettings, setApiSettings] = useState({
    enableApiAccess: true,
    rateLimiting: true,
    logApiCalls: true,
  });

  // 通知設定の変更ハンドラ
  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  // セキュリティ設定の変更ハンドラ
  const handleSecurityChange = (setting: keyof typeof securitySettings) => {
    if (setting === 'sessionTimeout') return;
    setSecuritySettings({
      ...securitySettings,
      [setting]: !securitySettings[setting],
    });
  };

  // セッションタイムアウトの変更ハンドラ
  const handleSessionTimeoutChange = (value: number) => {
    setSecuritySettings({
      ...securitySettings,
      sessionTimeout: value,
    });
  };

  // API設定の変更ハンドラ
  const handleApiSettingChange = (setting: keyof typeof apiSettings) => {
    setApiSettings({
      ...apiSettings,
      [setting]: !apiSettings[setting],
    });
  };

  // 設定の保存ハンドラ
  const handleSaveSettings = () => {
    // 実際のアプリケーションでは、ここでAPIリクエストを送信して設定を保存
    console.log('設定を保存:', {
      notificationSettings,
      securitySettings,
      apiSettings,
    });
    
    // 保存成功メッセージを表示
    alert('設定が保存されました');
  };

  return (
    <div>
      <Head>
        <title>設定 - さくらセキュリティガード</title>
        <meta name="description" content="アプリケーション設定の管理" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-2xl font-bold mb-6">設定</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* タブナビゲーション */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('general')}
            >
              一般設定
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              通知設定
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('security')}
            >
              セキュリティ設定
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'api'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('api')}
            >
              API設定
            </button>
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="p-6">
          {/* 一般設定 */}
          {activeTab === 'general' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">一般設定</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    ユーザー名
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue="admin"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue="admin@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    言語
                  </label>
                  <select
                    id="language"
                    name="language"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    defaultValue="ja"
                  >
                    <option value="ja">日本語</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 通知設定 */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">通知設定</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email-notifications"
                      name="email-notifications"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={notificationSettings.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email-notifications" className="font-medium text-gray-700">
                      メール通知
                    </label>
                    <p className="text-gray-500">重要なセキュリティイベントが発生した際にメールで通知します。</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="slack-notifications"
                      name="slack-notifications"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={notificationSettings.slack}
                      onChange={() => handleNotificationChange('slack')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="slack-notifications" className="font-medium text-gray-700">
                      Slack通知
                    </label>
                    <p className="text-gray-500">Slackチャンネルにセキュリティイベントを通知します。</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* セキュリティ設定 */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">セキュリティ設定</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="two-factor-auth"
                      name="two-factor-auth"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={securitySettings.twoFactorAuth}
                      onChange={() => handleSecurityChange('twoFactorAuth')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="two-factor-auth" className="font-medium text-gray-700">
                      二要素認証
                    </label>
                    <p className="text-gray-500">ログイン時に追加の認証を要求します。</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700">
                    セッションタイムアウト（分）
                  </label>
                  <select
                    id="session-timeout"
                    name="session-timeout"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSessionTimeoutChange(Number(e.target.value))}
                  >
                    <option value={15}>15分</option>
                    <option value={30}>30分</option>
                    <option value={60}>1時間</option>
                    <option value={120}>2時間</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* API設定 */}
          {activeTab === 'api' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">API設定</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enable-api"
                      name="enable-api"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={apiSettings.enableApiAccess}
                      onChange={() => handleApiSettingChange('enableApiAccess')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enable-api" className="font-medium text-gray-700">
                      APIアクセスを有効化
                    </label>
                    <p className="text-gray-500">外部アプリケーションからのAPIアクセスを許可します。</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="rate-limiting"
                      name="rate-limiting"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={apiSettings.rateLimiting}
                      onChange={() => handleApiSettingChange('rateLimiting')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="rate-limiting" className="font-medium text-gray-700">
                      レート制限
                    </label>
                    <p className="text-gray-500">APIリクエストの頻度を制限します。</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-2">APIキー</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value="sk_live_51HxTmJLxTmJLxTmJLxTmJLxTmJLxTmJLxTmJLxTmJLxTmJLxTmJL"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 保存ボタン */}
          <div className="mt-8 pt-5 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                type="button"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSaveSettings}
              >
                設定を保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
