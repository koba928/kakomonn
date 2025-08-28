# Supabase セットアップ手順

## 1. データベーススキーマの適用

Supabase管理画面（https://app.supabase.com）にアクセスし、以下の手順でスキーマを適用してください：

1. プロジェクトを開く
2. 左メニューの「SQL Editor」をクリック
3. 「New query」をクリック
4. `supabase-schema.sql` の内容をコピー&ペースト
5. 「Run」ボタンをクリックして実行

## 2. ストレージバケットの作成

同じくSQL Editorで、以下の手順でストレージを設定：

1. 「New query」をクリック
2. `setup-storage.sql` の内容をコピー&ペースト
3. 「Run」ボタンをクリックして実行

## 3. 設定確認

以下のコマンドで設定が正しく適用されたかを確認：

```bash
node test-supabase-connection.js
```

## 必要なファイル

- `supabase-schema.sql` - データベーステーブル作成
- `setup-storage.sql` - ストレージバケット作成
- `test-supabase-connection.js` - 接続・設定確認

## トラブルシューティング

- テーブルが作成されない場合は、UUIDエクステンションの有効化を確認
- ストレージバケットが作成されない場合は、RLSポリシーの設定を確認
- 権限エラーの場合は、service_role_keyが正しく設定されているか確認