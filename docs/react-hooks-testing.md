# React Hooksテストの互換性ガイド

作成日: 2025-04-15
作成者: 開発チーム

## 概要

このドキュメントでは、React 18/19環境でのカスタムHooksのテスト方法と、互換性の問題を解決するためのアプローチについて説明します。

## 背景

React 18では、レンダリングAPIが大幅に変更され、従来の`ReactDOM.render`が非推奨となり、代わりに`ReactDOM.createRoot`が導入されました。この変更により、一部のテストライブラリ（特に`@testing-library/react-hooks`）との互換性の問題が発生しています。

## 問題

React 18/19環境で`@testing-library/react-hooks`を使用すると、以下のようなエラーが発生します：

```
TypeError: ReactDOM.render is not a function
```

これは、`@testing-library/react-hooks`が内部で非推奨となった`ReactDOM.render`を使用しているためです。

## 解決策

### 1. `@testing-library/react`の使用

React 18以降では、`@testing-library/react-hooks`の代わりに`@testing-library/react`から直接`renderHook`と`act`をインポートして使用することが推奨されています。

```typescript
// 変更前
import { renderHook, act } from '@testing-library/react-hooks';

// 変更後
import { renderHook, act } from '@testing-library/react';
```

### 2. テストコードの例

```typescript
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// テスト対象のカスタムフック
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}

// テスト
describe('useCounter', () => {
  it('初期値が正しく設定されること', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('incrementを呼び出すとカウントが増加すること', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });
});
```

### 3. 注意点

- `act`の使用: React状態の更新を含むテストでは、必ず`act`でラップしてください。
- 非同期テスト: 非同期操作を含むテストでは、`async/await`と組み合わせて`act`を使用してください。
- コンテキスト: コンテキストを使用するカスタムフックをテストする場合は、`wrapper`オプションを使用してプロバイダーを提供してください。

```typescript
const wrapper = ({ children }) => (
  <ThemeProvider theme="light">{children}</ThemeProvider>
);

const { result } = renderHook(() => useTheme(), { wrapper });
```

## 警告について

テスト実行時に以下のような警告が表示される場合があります：

```
An update to TestComponent inside a test was not wrapped in act(...)
```

これは、React状態の更新が`act()`でラップされていないことを示しています。多くの場合、この警告はテスト結果に影響しないため、無視しても問題ありません。ただし、テストの信頼性を高めるためには、すべての状態更新を`act()`でラップすることが推奨されます。

## 結論

React 18/19環境でカスタムHooksをテストする場合は、`@testing-library/react-hooks`の代わりに`@testing-library/react`から`renderHook`と`act`をインポートして使用することで、互換性の問題を解決できます。これにより、最新のReactバージョンでもカスタムHooksのテストを効率的に行うことができます。

## 参考リンク

- [React Testing Library公式ドキュメント](https://testing-library.com/docs/react-testing-library/intro/)
- [React 18の変更点](https://reactjs.org/blog/2022/03/29/react-v18.html)
- [Testing Library Hooks API](https://testing-library.com/docs/react-testing-library/api/#renderhook)
