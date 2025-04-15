# Yarnの使用について

作成日: 2025-04-14

## 概要

さくらセキュリティガードプロジェクトでは、パッケージ管理にYarnを使用します。npmではなくYarnを使用する理由と、基本的な使用方法について説明します。

## Yarnを使用する理由

1. **高速なインストール**: Yarnはパッケージのインストールを並列で行うため、npmよりも高速です。
2. **確定的なインストール**: 同じ依存関係は、どのマシンでも同じ方法でインストールされます。
3. **セキュリティ**: Yarnはインストールプロセス中にコードを実行する前にパッケージの整合性を検証します。
4. **オフラインモード**: 一度ダウンロードしたパッケージはキャッシュされ、オフラインでも利用可能です。

## 基本的な使用方法

### インストール

```bash
# グローバルにYarnをインストール
npm install -g yarn

# バージョン確認
yarn --version
```

### 依存関係の管理

```bash
# 依存関係のインストール
yarn install

# 新しいパッケージの追加
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]

# 開発依存関係の追加
yarn add [package] --dev

# グローバルパッケージのインストール
yarn global add [package]

# 依存関係の削除
yarn remove [package]

# 依存関係の更新
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
```

### スクリプトの実行

```bash
# package.jsonのscriptsセクションに定義されたスクリプトを実行
yarn [script]

# 例: 開発サーバーの起動
yarn dev

# 例: テストの実行
yarn test
```

## モノレポでのYarnの使用

さくらセキュリティガードプロジェクトはモノレポ構成を採用しており、Yarnのワークスペース機能を活用しています。

```bash
# ルートディレクトリで依存関係をインストール
yarn install

# 特定のワークスペースでコマンドを実行
yarn workspace [workspace-name] [command]

# 例: frontendワークスペースでdevを実行
yarn workspace frontend dev

# すべてのワークスペースでコマンドを実行
yarn workspaces run [command]

# 例: すべてのワークスペースでテストを実行
yarn workspaces run test
```

## huskyとの連携

コミット時にテストを自動実行するためのhusky設定は、Yarnを使用するように構成されています。

```bash
# huskyのインストール
yarn prepare

# pre-commitフックの内容
# フロントエンドのテスト実行
cd frontend && yarn test

# バックエンドのテスト実行
cd backend && pytest
```

## 注意事項

1. プロジェクト内では一貫してYarnを使用し、npmコマンドと混在させないでください。
2. package-lock.jsonではなく、yarn.lockファイルをバージョン管理に含めてください。
3. 依存関係の追加・削除は必ずYarnコマンドを使用してください。

## 参考リンク

- [Yarn公式ドキュメント](https://yarnpkg.com/getting-started)
- [Yarnワークスペース](https://yarnpkg.com/features/workspaces)
