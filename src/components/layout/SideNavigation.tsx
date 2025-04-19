import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  HomeIcon,
  ShieldExclamationIcon,
  BellAlertIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// ナビゲーション項目の型定義
type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

// サイドナビゲーションのプロパティ
interface SideNavigationProps {
  className?: string;
}

/**
 * サイドナビゲーションコンポーネント
 * モダンなSaaSデザインのサイドナビゲーションを提供
 */
const SideNavigation: React.FC<SideNavigationProps> = ({ className = '' }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 画面サイズの変更を監視
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    // 初期化
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ナビゲーション項目
  const navItems: NavItem[] = [
    {
      name: 'ダッシュボード',
      path: '/',
      icon: <HomeIcon className="w-6 h-6" />
    },
    {
      name: 'セキュリティイベント',
      path: '/security-events',
      icon: <ShieldExclamationIcon className="w-6 h-6" />
    },
    {
      name: 'アラート',
      path: '/alerts',
      icon: <BellAlertIcon className="w-6 h-6" />
    },
    {
      name: '設定',
      path: '/settings',
      icon: <Cog6ToothIcon className="w-6 h-6" />
    }
  ];

  // 現在のパスがナビゲーション項目のパスと一致するか確認
  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  // モバイルメニューの切り替え
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* モバイルメニューボタン */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label={isMobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* サイドナビゲーション */}
      <nav
        className={`
          ${className}
          ${isMobile ? 'fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out' : 'fixed top-0 left-0 h-screen'}
          ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
          bg-white dark:bg-gray-900 w-64 h-screen shadow-lg flex flex-col overflow-y-auto
        `}
      >
        {/* ロゴ */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              さくらGuardDuty
            </span>
          </Link>
        </div>

        {/* ナビゲーション項目 */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }
                  `}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                >
                  <span className={`${isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                  {isActive(item.path) && (
                    <span className="ml-auto w-1.5 h-6 rounded-full bg-indigo-500"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 さくらインターネット
          </div>
        </div>
      </nav>

      {/* モバイルメニューのオーバーレイ */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideNavigation;