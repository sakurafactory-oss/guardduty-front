# テストのトラブルシューティングガイド

作成日: 2025-04-15
作成者: 開発チーム

## 概要

このドキュメントでは、さくらセキュリティガードのテスト実行時に発生する可能性のある問題と、その解決方法について説明します。テスト駆動開発（TDD）を効率的に進めるためのガイドラインとして活用してください。

## 一般的なテスト問題と解決策

### 1. モックの問題

#### 症状

- テストが `Cannot find module` エラーを表示する
- モックされたコンポーネントが期待通りに動作しない

#### 解決策

- モジュールのパスが正しいことを確認する
- モックの実装が実際のコンポーネントの動作を正確に反映しているか確認する
- `jest.mock()` の呼び出しがテストファイルの先頭に配置されていることを確認する

```typescript
// 正しいモックの例
jest.mock('../components/SomeComponent', () => {
  return function MockComponent(props) {
    return <div data-testid="mock-component">{props.children}</div>;
  };
});
```

### 2. テストセレクタの問題

#### 症状

- `getByText`, `getByRole` などのクエリが要素を見つけられない
- 複数の要素が見つかるエラーが発生する

#### 解決策

- より具体的なセレクタを使用する（例: `getByRole('heading', { name: /タイトル/i, level: 1 })`）
- `data-testid` 属性を追加して要素を特定する
- 要素の階層構造を確認し、正しいコンテキストで検索する

```typescript
// 具体的なセレクタの例
const heading = screen.getByRole('heading', { name: /アラート/i, level: 1 });
const button = screen.getByRole('button', { name: /送信/i });
const customElement = screen.getByTestId('custom-element');
```

### 3. 非同期テストの問題

#### 症状

- テストが早すぎて、非同期処理の結果を検証できない
- `act` 警告が表示される

#### 解決策

- `waitFor` または `findBy*` クエリを使用して非同期処理の完了を待つ
- `act` で非同期処理をラップする
- テストのセットアップで適切なモックレスポンスを設定する

```typescript
// 非同期テストの例
test('データが読み込まれること', async () => {
  render(<DataComponent />);
  
  // データ読み込み完了を待つ
  await waitFor(() => {
    expect(screen.getByText('データ読み込み完了')).toBeInTheDocument();
  });
  
  // または findBy* を使用
  const loadedElement = await screen.findByText('データ読み込み完了');
  expect(loadedElement).toBeInTheDocument();
});
```

### 4. コンポーネントのレンダリング問題

#### 症状

- コンポーネントが期待通りにレンダリングされない
- スタイルやクラスが適用されない

#### 解決策

- コンポーネントの依存関係が正しくモックされているか確認する
- 必要なプロバイダー（ThemeProvider, ContextProvider など）でコンポーネントをラップする
- スタイルやクラスのテストには `toHaveClass` や `toHaveStyle` マッチャーを使用する

```typescript
// コンポーネントのラッピング例
const renderWithProviders = (ui) => {
  return render(
    <ThemeProvider>
      <UserProvider>
        {ui}
      </UserProvider>
    </ThemeProvider>
  );
};

test('コンポーネントが正しくレンダリングされること', () => {
  renderWithProviders(<MyComponent />);
  // テストコード
});
```

## 特定のコンポーネントのテスト

### Next.js Link コンポーネント

Next.js の Link コンポーネントをテストする際は、以下のようにモックすることで、テストを簡素化できます：

```typescript
jest.mock('next/link', () => {
  return ({ children, className, href }) => {
    return (
      <a href={href} className={className} data-testid="mock-link">
        {children}
      </a>
    );
  };
});
```

### フォームコンポーネント

フォームのテストでは、ユーザー入力をシミュレートするために `userEvent` ライブラリを使用します：

```typescript
import userEvent from '@testing-library/user-event';

test('フォームが正しく送信されること', async () => {
  render(<LoginForm onSubmit={mockSubmit} />);
  
  await userEvent.type(screen.getByLabelText(/ユーザー名/i), 'testuser');
  await userEvent.type(screen.getByLabelText(/パスワード/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /ログイン/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    username: 'testuser',
    password: 'password123'
  });
});
```

## テストのベストプラクティス

1. **テストの独立性を保つ**
   - 各テストは他のテストに依存せず、独立して実行できるようにする
   - `beforeEach` でテスト環境をリセットする

2. **テストの可読性を高める**
   - テスト名は「何をテストするか」を明確に記述する
   - Arrange-Act-Assert パターンに従ってテストを構造化する

3. **テストカバレッジを意識する**
   - 重要なビジネスロジックは優先的にテストする
   - エッジケースや異常系のテストも含める

4. **テストの保守性を考慮する**
   - 実装の詳細ではなく、コンポーネントの動作をテストする
   - テスト用のヘルパー関数やカスタムマッチャーを作成して再利用する

## 結論

テストのトラブルシューティングは、問題の根本原因を特定し、適切な解決策を適用することが重要です。このガイドを参考に、効率的なテスト駆動開発を実践してください。問題が解決しない場合は、チームメンバーに相談するか、公式ドキュメントを参照してください。

## 参考リンク

- [React Testing Library 公式ドキュメント](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest 公式ドキュメント](https://jestjs.io/docs/getting-started)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)

## React 18/19 互換性の問題

### React Hooksのテスト

React 18以降では、`@testing-library/react-hooks`ライブラリが互換性の問題を引き起こす場合があります。具体的には、以下のエラーが発生することがあります：

```
TypeError: ReactDOM.render is not a function
```

#### 解決策

React 18以降では、`@testing-library/react-hooks`の代わりに`@testing-library/react`から直接`renderHook`と`act`をインポートして使用します：

```typescript
// 変更前
import { renderHook, act } from '@testing-library/react-hooks';

// 変更後
import { renderHook, act } from '@testing-library/react';
```

この変更により、React 18/19の新しいレンダリングAPIと互換性のあるテストが可能になります。

### 警告について

テスト実行時に以下のような警告が表示される場合があります：

```
An update to TestComponent inside a test was not wrapped in act(...)
```

これは、React状態の更新が`act()`でラップされていないことを示しています。多くの場合、この警告はテスト結果に影響しないため、無視しても問題ありません。ただし、テストの信頼性を高めるためには、すべての状態更新を`act()`でラップすることが推奨されます。
