# Supabase メール認証設定ガイド

## 404エラーの解決方法

メール認証リンクをクリックすると404エラーになる場合、以下を確認してください。

### 1. Supabase Dashboard での設定

1. [Supabase Dashboard](https://app.supabase.com) にログイン
2. プロジェクトを選択
3. **Authentication** → **URL Configuration** に移動
4. 以下の設定を確認・更新：

#### Site URL
```
https://kakomonn.vercel.app
```

#### Redirect URLs（許可リスト）
以下のURLを追加してください：
```
https://kakomonn.vercel.app/**
https://kakomonn.vercel.app/auth/callback
https://kakomonn.vercel.app/auth/email-verify
https://kakomonn.vercel.app/auth/email-verify?email=*
```

### 2. メールテンプレートの確認

1. **Authentication** → **Email Templates** に移動
2. **Confirm signup** テンプレートを確認
3. リンクが以下のようになっているか確認：
   ```
   {{ .ConfirmationURL }}
   ```

### 3. 環境変数の確認

Vercelの環境変数で以下が正しく設定されているか確認：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. デバッグ方法

1. メール内のリンクをコピー
2. URLの構造を確認：
   - 正しい形式: `https://your-project.supabase.co/auth/v1/verify?token=xxx&type=signup&redirect_to=https://kakomonn.vercel.app/auth/email-verify?email=xxx`
   - `redirect_to`パラメータが正しいか確認

### 5. 一時的な回避策

もし上記で解決しない場合、`/auth/callback`ルートを使用する従来の方法に戻すことも可能です：

```typescript
emailRedirectTo: 'https://kakomonn.vercel.app/auth/callback'
```

ただし、この場合は新しいフロー（メール固定表示の登録画面）は使用できません。