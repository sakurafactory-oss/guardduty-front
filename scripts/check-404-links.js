const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 設定
const PAGES_DIR = path.join(__dirname, '../src/pages');
const API_DIR = path.join(__dirname, '../src/pages/api');
const IGNORE_PATTERNS = [
  '/_app.tsx',
  '/_document.tsx',
  '/api/',
  '/__tests__/'
];

// 結果保存用
const results = {
  allLinks: new Set(),
  existingPages: new Set(),
  missingPages: new Set(),
  dynamicRoutes: new Set(),
  apiRoutes: new Set()
};

/**
 * ファイル内のリンクを検出する
 * @param {string} filePath ファイルパス
 * @returns {string[]} 検出されたリンク
 */
function extractLinksFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const links = new Set();

  // Next.jsのLinkコンポーネントからhrefを抽出
  const linkRegex = /Link\s+href=["']([^"']+)["']/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    if (!match[1].startsWith('http') && !match[1].startsWith('#')) {
      links.add(match[1]);
    }
  }

  // router.pushからパスを抽出
  const routerPushRegex = /router\.push\(["']([^"']+)["']\)/g;
  while ((match = routerPushRegex.exec(content)) !== null) {
    if (!match[1].startsWith('http') && !match[1].startsWith('#')) {
      links.add(match[1]);
    }
  }

  // router.pushからオブジェクト形式のパスを抽出
  const routerPushObjectRegex = /router\.push\(\{\s*pathname:\s*["']([^"']+)["']/g;
  while ((match = routerPushObjectRegex.exec(content)) !== null) {
    if (!match[1].startsWith('http') && !match[1].startsWith('#')) {
      links.add(match[1]);
    }
  }

  // window.locationからパスを抽出
  const windowLocationRegex = /window\.location(?:\.href)?\s*=\s*["']([^"']+)["']/g;
  while ((match = windowLocationRegex.exec(content)) !== null) {
    if (!match[1].startsWith('http') && !match[1].startsWith('#') && match[1].startsWith('/')) {
      links.add(match[1]);
    }
  }

  // APIエンドポイントの抽出
  const apiRegex = /url:\s*["']([^"']+)["']/g;
  while ((match = apiRegex.exec(content)) !== null) {
    if (match[1].startsWith('/api/')) {
      links.add(match[1]);
    }
  }

  return Array.from(links);
}

/**
 * ページファイルを走査してリンクを収集
 */
function collectLinks() {
  console.log('🔍 ページファイルからリンクを収集中...');
  
  // すべてのページファイルを取得
  const pageFiles = glob.sync(`${PAGES_DIR}/**/*.{js,jsx,ts,tsx}`);
  
  // 既存のページパスを収集
  pageFiles.forEach(file => {
    // ファイルパスからルートパスを生成
    let routePath = file
      .replace(PAGES_DIR, '')
      .replace(/\.(js|jsx|ts|tsx)$/, '')
      .replace(/\/index$/, '/');
    
    // 無視するパターンをチェック
    if (IGNORE_PATTERNS.some(pattern => routePath.includes(pattern))) {
      return;
    }
    
    // APIルートは別途処理
    if (routePath.startsWith('/api/')) {
      results.apiRoutes.add(routePath);
      return;
    }
    
    // 動的ルートの処理
    if (routePath.includes('[') && routePath.includes(']')) {
      results.dynamicRoutes.add(routePath);
    } else {
      results.existingPages.add(routePath);
    }
    
    // ファイル内のリンクを抽出
    const links = extractLinksFromFile(file);
    links.forEach(link => {
      // クエリパラメータを除去
      const cleanLink = link.split('?')[0];
      results.allLinks.add(cleanLink);
    });
  });
  
  // APIディレクトリを走査してAPIルートを収集
  const apiFiles = glob.sync(`${API_DIR}/**/*.{js,jsx,ts,tsx}`);
  apiFiles.forEach(file => {
    let apiPath = '/api' + file
      .replace(API_DIR, '')
      .replace(/\.(js|jsx|ts|tsx)$/, '')
      .replace(/\/index$/, '/');
    
    results.apiRoutes.add(apiPath);
  });
}

/**
 * 存在しないリンクを特定
 */
function identifyMissingLinks() {
  console.log('🔍 存在しないリンクを特定中...');
  
  results.allLinks.forEach(link => {
    // 動的ルートの処理
    if (link.includes('/[') && link.includes(']')) {
      // 動的パラメータを正規表現に変換して一致するルートを探す
      const dynamicPathRegex = link.replace(/\/\[[^\]]+\]/g, '/[^/]+');
      const dynamicPathPattern = new RegExp(`^${dynamicPathRegex}$`);
      
      // 動的ルートと一致するかチェック
      const matchesDynamicRoute = Array.from(results.dynamicRoutes).some(route => {
        const routePattern = route.replace(/\/\[[^\]]+\]/g, '/[^/]+');
        return new RegExp(`^${routePattern}$`).test(link);
      });
      
      if (!matchesDynamicRoute) {
        results.missingPages.add(link);
      }
    } 
    // APIルートの処理
    else if (link.startsWith('/api/')) {
      // APIパスが存在するかチェック
      const apiPathExists = Array.from(results.apiRoutes).some(apiRoute => {
        // 完全一致または動的パラメータを含むルートと一致するか
        if (apiRoute === link) return true;
        
        // 動的パラメータを含むAPIルートの処理
        if (apiRoute.includes('[') && apiRoute.includes(']')) {
          const apiRoutePattern = apiRoute.replace(/\/\[[^\]]+\]/g, '/[^/]+');
          return new RegExp(`^${apiRoutePattern}$`).test(link);
        }
        
        return false;
      });
      
      if (!apiPathExists) {
        results.missingPages.add(link);
      }
    }
    // 通常のページの処理
    else {
      // 末尾のスラッシュを正規化
      const normalizedLink = link.endsWith('/') && link !== '/' ? link.slice(0, -1) : link;
      const normalizedExistingPages = Array.from(results.existingPages).map(p => 
        p.endsWith('/') && p !== '/' ? p.slice(0, -1) : p
      );
      
      if (!normalizedExistingPages.includes(normalizedLink)) {
        // 動的ルートと一致するかチェック
        const matchesDynamicRoute = Array.from(results.dynamicRoutes).some(route => {
          const routePattern = route.replace(/\/\[[^\]]+\]/g, '/[^/]+');
          return new RegExp(`^${routePattern}$`).test(normalizedLink);
        });
        
        if (!matchesDynamicRoute) {
          results.missingPages.add(link);
        }
      }
    }
  });
}

/**
 * 結果を出力
 */
function printResults() {
  console.log('\n📊 結果:');
  console.log(`検出されたリンク数: ${results.allLinks.size}`);
  console.log(`既存のページ数: ${results.existingPages.size}`);
  console.log(`動的ルート数: ${results.dynamicRoutes.size}`);
  console.log(`APIルート数: ${results.apiRoutes.size}`);
  console.log(`存在しないリンク数: ${results.missingPages.size}`);
  
  if (results.missingPages.size > 0) {
    console.log('\n❌ 存在しないリンク:');
    Array.from(results.missingPages).sort().forEach(link => {
      console.log(`  - ${link}`);
    });
  } else {
    console.log('\n✅ すべてのリンクは有効です！');
  }
  
  // 詳細情報をJSONファイルに保存
  const detailedResults = {
    allLinks: Array.from(results.allLinks),
    existingPages: Array.from(results.existingPages),
    dynamicRoutes: Array.from(results.dynamicRoutes),
    apiRoutes: Array.from(results.apiRoutes),
    missingPages: Array.from(results.missingPages)
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../404-check-results.json'),
    JSON.stringify(detailedResults, null, 2)
  );
  console.log('\n📝 詳細な結果は 404-check-results.json に保存されました');
}

/**
 * メイン実行関数
 */
function main() {
  console.log('🚀 404エラーチェックを開始します...');
  collectLinks();
  identifyMissingLinks();
  printResults();
}

main();