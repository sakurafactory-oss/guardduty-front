# APIサービス設計

## 概要

さくらGuardDutyのAPIサービスは、フロントエンドとバックエンドの通信を担当する重要なコンポーネントです。このドキュメントでは、APIサービスの設計と実装について説明します。

## アーキテクチャ

APIサービスは以下のコンポーネントで構成されています：

```
src/
├── services/
│   └── api/
│       ├── types.ts           # 型定義
│       ├── apiService.ts      # 実装
│       ├── mockApiService.ts  # モック実装（テスト用）
│       └── __tests__/         # テスト
│           └── apiService.test.ts
└── hooks/
    ├── useApi.ts              # React Hooks
    └── __tests__/
        └── useApi.test.ts
```

## 型定義

APIサービスは以下の主要な型定義を提供します：

```typescript
// APIレスポンスの基本型
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ページネーション情報
export interface PaginationInfo {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ページネーション付きAPIレスポンス
export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination: PaginationInfo;
}

// APIエラーの型定義
export interface ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, any>;
}

// APIサービスインターフェース
export interface ApiService {
  get<T>(url: string, params?: ApiRequestParams, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  delete<T>(url: string, params?: ApiRequestParams, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
}
```

## 実装

APIサービスは`fetch` APIを使用してHTTPリクエストを送信します。主な機能は以下の通りです：

1. **リクエスト送信**: 各HTTPメソッド（GET, POST, PUT, DELETE, PATCH）に対応するメソッドを提供
2. **エラーハンドリング**: HTTPエラーを適切に処理し、APIエラーオブジェクトに変換
3. **リトライ機能**: 一時的なエラーに対するリトライ機能
4. **タイムアウト**: リクエストのタイムアウト設定
5. **キャンセル**: AbortControllerを使用したリクエストのキャンセル

## React Hooks

APIサービスを簡単に使用するためのReact Hooksを提供しています：

1. **useGetApi**: GETリクエスト用のフック
2. **usePostApi**: POSTリクエスト用のフック
3. **usePutApi**: PUTリクエスト用のフック
4. **usePatchApi**: PATCHリクエスト用のフック
5. **useDeleteApi**: DELETEリクエスト用のフック

これらのフックは以下の機能を提供します：

- データの読み込み状態管理（loading, error, data）
- リクエストの実行と再実行
- 成功・エラー時のコールバック
- 状態のリセット

## 使用例

### APIサービスの直接使用

```typescript
import { apiService } from '../services/api/apiService';

// GETリクエスト
const fetchData = async () => {
  try {
    const response = await apiService.get<User[]>('/users', { limit: 10 });
    console.log(response.data); // User[]
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// POSTリクエスト
const createUser = async (userData: UserInput) => {
  try {
    const response = await apiService.post<User>('/users', userData);
    console.log('User created:', response.data);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
```

### React Hooksの使用

```typescript
import { useGetApi, usePostApi } from '../hooks/useApi';

// コンポーネント内
const UserList = () => {
  const { data, loading, error, execute } = useGetApi<User[]>({
    url: '/users',
    params: { limit: 10 },
    autoExecute: true // コンポーネントマウント時に自動実行
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <button onClick={execute}>Reload</button>
      <ul>
        {data?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

// フォームコンポーネント
const UserForm = () => {
  const { executeMutation, loading, error } = usePostApi<User, UserInput>({
    url: '/users',
    onSuccess: (data) => {
      console.log('User created:', data);
      // フォームリセットなど
    }
  });

  const handleSubmit = async (formData: UserInput) => {
    await executeMutation(formData);
  };
  
  // フォーム実装
};
```

## セキュリティ考慮事項

APIサービスは以下のセキュリティ対策を実装しています：

1. **CSRF対策**: 必要に応じてCSRFトークンをヘッダーに含める
2. **タイムアウト**: 長時間のリクエストを防止するためのタイムアウト設定
3. **エラーハンドリング**: センシティブな情報を漏洩しないエラーハンドリング
4. **入力検証**: リクエストパラメータの適切な検証

## 拡張性

APIサービスは将来の拡張を考慮して設計されています：

1. **インターセプター**: リクエスト/レスポンスの前処理・後処理を追加可能
2. **カスタムヘッダー**: 認証トークンなどのカスタムヘッダーを設定可能
3. **モック実装**: テスト用のモック実装を提供
4. **型安全性**: TypeScriptの型システムを活用した型安全なAPI呼び出し

## 今後の改善点

1. **キャッシュ機能**: リクエスト結果のキャッシュ機能の追加
2. **バッチリクエスト**: 複数のリクエストをバッチ処理する機能
3. **オフライン対応**: オフライン時のリクエストキューイング
4. **リアルタイム通信**: WebSocketなどを使用したリアルタイム通信の統合
5. **パフォーマンス最適化**: 大量データ処理時のパフォーマンス最適化

## 参考資料

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
