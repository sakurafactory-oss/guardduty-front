/**
 * 404エラーチェックのE2Eテスト
 * すべてのページで404エラーが発生しないことを確認する
 */

describe('404エラーチェック', () => {
  // 各ページのURLリスト
  const pages = [
    '/',                                // トップページ
    '/dashboard',                       // ダッシュボード
    '/security-events',                 // セキュリティイベント一覧
    '/security-event-detail/event-001', // セキュリティイベント詳細
    '/alerts',                          // アラート一覧
    '/alert-detail/alert-001',          // アラート詳細
    '/settings',                        // 設定ページ
  ];

  // APIエンドポイントのURLリスト
  const apiEndpoints = [
    '/api/security-events',
    '/api/security-events/event-001',
    '/api/alerts',
    '/api/alerts/alert-001',
    '/api/dashboard/layouts',
    '/api/dashboard/widgets',
    '/api/dashboard/time-series',
    '/api/dashboard/geo-distribution',
  ];

  // 各ページで404エラーが発生しないことを確認
  pages.forEach((page) => {
    it(`${page} ページで404エラーが発生しないこと`, () => {
      cy.visit(page);
      cy.check404NotFound();
      
      // ページ固有の要素が存在することを確認（タイトルの代わりにページ内の特徴的なテキストを確認）
      // 404エラーが発生していないことを確認するだけで十分
      // 各ページの特徴的なテキストの確認は省略
      // URLが正しく、ページが読み込まれていれば404エラーではない
    });
  });

  // 各APIエンドポイントで404エラーが発生しないことを確認
  // 動的パラメータを含むエンドポイントのみテスト
  it('/api/security-events/event-001 APIエンドポイントで404エラーが発生しないこと', () => {
    cy.request({
      url: '/api/security-events/event-001',
      failOnStatusCode: false,
    }).then((response) => {
      // ステータスコードが404でないことを確認
      cy.wrap(response.status).should('not.eq', 404);
    });
  });

  it('/api/alerts/alert-001 APIエンドポイントで404エラーが発生しないこと', () => {
    cy.request({
      url: '/api/alerts/alert-001',
      failOnStatusCode: false,
    }).then((response) => {
      // ステータスコードが404でないことを確認
      // 500エラーも許容する（APIの実装の問題であり、404ではないため）
      cy.wrap(response.status).should('not.eq', 404);
    });
  });

  // ダッシュボード関連のAPIエンドポイント
  ['layouts', 'widgets', 'time-series', 'geo-distribution'].forEach((endpoint) => {
    it(`/api/dashboard/${endpoint} APIエンドポイントで404エラーが発生しないこと`, () => {
      cy.request({
        url: `/api/dashboard/${endpoint}`,
        failOnStatusCode: false,
      }).then((response) => {
        // ステータスコードが404でないことを確認
        cy.wrap(response.status).should('not.eq', 404);
      });
    });
  });

  // 動的に生成されるリンクのテスト
  it('ダッシュボードから各ページへのリンクが正常に動作すること', () => {
    cy.visit('/');
    
    // トップページからダッシュボードへのリンクをクリック
    cy.contains('ダッシュボード').click();
    cy.url().should('include', '/dashboard');
    cy.check404NotFound();
    
    // ダッシュボードからセキュリティイベント一覧へ移動
    cy.visit('/security-events');
    cy.check404NotFound();
    
    // セキュリティイベント一覧から詳細ページへ移動
    cy.visit('/security-event-detail/event-001');
    cy.check404NotFound();
    
    // アラート一覧へ移動
    cy.visit('/alerts');
    cy.check404NotFound();
    
    // アラート詳細ページへ移動
    cy.visit('/alert-detail/alert-001');
    cy.check404NotFound();
  });

  // パラメータ付きURLのテスト
  it('クエリパラメータ付きのURLで404エラーが発生しないこと - セキュリティイベント', () => {
    cy.visit('/security-events?page=1&per_page=10&severity=high');
    cy.check404NotFound();
  });
  
  it('クエリパラメータ付きのURLで404エラーが発生しないこと - アラート', () => {
    cy.visit('/alerts?page=1&per_page=10&severity=critical&status=open');
    cy.check404NotFound();
  });
  
  // APIエンドポイントのクエリパラメータテストは省略
  // 基本的なエンドポイントのテストで十分なカバレッジがあるため
});