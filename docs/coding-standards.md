# コーディング標準

作成日: 2025-04-14

## 概要

さくらセキュリティガードプロジェクトでは、コードの品質と一貫性を確保するために、以下のコーディング標準を採用しています。これらの標準は、コードの可読性、保守性、およびセキュリティを向上させるために設計されています。

## 共通ガイドライン

### 1. 命名規則

- **変数名**: キャメルケース（camelCase）または スネークケース（snake_case）を一貫して使用
- **関数名**: 動詞で始まる記述的な名前（例: `get_user_data`, `validateInput`）
- **クラス名**: パスカルケース（PascalCase）（例: `SecurityEvent`, `UserAuthentication`）
- **定数**: 大文字のスネークケース（例: `MAX_RETRY_COUNT`, `API_ENDPOINT`）
- **ファイル名**: スネークケース（例: `user_authentication.py`, `event_handler.ts`）

### 2. コメント

- **コードの「なぜ」を説明**: 複雑なロジックや非直感的な実装の理由を説明
- **TODO/FIXME**: 将来の改善点や既知の問題点を明記
- **セキュリティ上の考慮事項**: セキュリティに関連する決定や注意点を記録

### 3. エラー処理

- 例外は具体的に捕捉し、一般的な例外の捕捉は避ける
- エラーメッセージは具体的かつ有用な情報を提供
- ユーザーに表示するエラーメッセージはセキュリティ情報を漏らさない

### 4. セキュリティプラクティス

- 入力値の検証と無害化を徹底
- 認証と認可のチェックを適切に実装
- 機密情報（パスワード、APIキーなど）をハードコードしない
- SQLインジェクションやXSSなどの一般的な脆弱性を防止

## Python コーディング標準

### 1. 型ヒントの徹底

Pythonコードでは、型ヒント（Type Hints）を徹底的に活用し、コードの明確さと堅牢性を向上させます。

```python
# 良い例
def calculate_risk_score(ip_address: str, event_count: int) -> float:
    """リスクスコアを計算する関数"""
    # 実装
    return score

# 避けるべき例
def calculate_risk_score(ip_address, event_count):
    """リスクスコアを計算する関数"""
    # 実装
    return score
```

詳細な型ヒントのガイドラインは [Python型定義ガイドライン](python-typing.md) を参照してください。

### 2. PEP 8 スタイルガイド

- インデントは4スペース
- 行の長さは最大79文字
- インポートは適切にグループ化（標準ライブラリ、サードパーティ、ローカル）
- 関数間は2行空ける、クラス間は3行空ける

### 3. ドキュメンテーション文字列（docstring）

すべての関数、クラス、モジュールにdocstringを記述します。

```python
def validate_ip_address(ip: str) -> bool:
    """
    IPアドレスの形式を検証する

    Args:
        ip: 検証するIPアドレス文字列

    Returns:
        検証結果（有効なIPアドレスの場合はTrue）

    Raises:
        ValueError: 入力が文字列でない場合
    """
    # 実装
    return is_valid
```

### 4. テスト駆動開発（TDD）

- テストファイルは `test_` プレフィックスを付ける
- 各テストは独立して実行可能であること
- モックとスタブを適切に使用
- テストカバレッジは80%以上を目標

## TypeScript/JavaScript コーディング標準

### 1. 厳格な型付け

TypeScriptでは、`any`型の使用を最小限に抑え、具体的な型定義を使用します。

```typescript
// 良い例
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function getUserById(id: string): Promise<User | null> {
  // 実装
}

// 避けるべき例
function getUserById(id): any {
  // 実装
}
```

### 2. コンポーネント設計

- Atomic Designパターンに従う
- 単一責任の原則を守る
- 再利用可能なコンポーネントを優先
- Propsの型定義を明確に行う

### 3. スタイリング

- Tailwind CSSのユーティリティクラスを優先
- カスタムCSSは最小限に
- 命名規則はBEM（Block Element Modifier）に従う

### 4. 状態管理

- React Hooksを基本とする
- 複雑な状態管理にはContextAPIを使用
- グローバル状態は必要最小限に

## コード品質の自動チェック

### 1. リンター

- Python: flake8, pylint
- TypeScript/JavaScript: ESLint
- コミット前に自動実行（huskyにより設定）

### 2. フォーマッター

- Python: black, isort
- TypeScript/JavaScript: Prettier
- エディタ設定で保存時に自動フォーマット

### 3. 型チェッカー

- Python: mypy
- TypeScript: tsc（TypeScriptコンパイラ）
- CIパイプラインに組み込む

## セキュリティレビュー

### 1. 自動セキュリティスキャン

- 依存関係の脆弱性チェック（npm audit, safety）
- コード内のセキュリティ問題の検出（bandit, SonarQube）

### 2. コードレビュー時のセキュリティチェックリスト

- 入力検証の確認
- 認証・認可の適切な実装
- 機密情報の適切な取り扱い
- エラー処理とログ記録の確認

## まとめ

これらのコーディング標準を遵守することで、さくらセキュリティガードプロジェクトのコード品質、保守性、およびセキュリティを高い水準で維持します。すべての開発者はこれらの標準に従い、コードレビューでもこれらの点を確認してください。
