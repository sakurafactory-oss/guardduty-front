import React from 'react';
import SideNavigation from './SideNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * レイアウトコンポーネント
 * サイドナビゲーションとメインコンテンツを組み合わせたレイアウトを提供
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* サイドナビゲーション */}
      <SideNavigation />
      
      {/* メインコンテンツ */}
      <main className="flex-1 transition-all duration-300 ease-in-out ml-0 md:ml-64">
        <div className="px-4 py-6 md:px-4 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;