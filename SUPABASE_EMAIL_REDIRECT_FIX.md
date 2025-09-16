# Supabaseメール認証リダイレクトの修正方法

## 問題
メール認証リンクをクリックすると、`/auth/verify-success`ではなくホームページ（`/`）にリダイレクトされる。

## 原因
Supabaseのメールテンプレートまたは認証設定で、リダイレクトURLが正しく設定されていない。

## 解決方法

### 1. Supabaseダッシュボードでの設定確認

1. **Supabaseダッシュボード** → **Authentication** → **Email Templates**を開く
2. **Confirm signup**テンプレートを確認
3. 確認URLが以下のようになっているか確認：
   ```
   {{ .ConfirmationURL }}
   ```

### 2. Redirect URLsの設定

1. **Authentication** → **URL Configuration**を開く
2. **Site URL**が正しく設定されているか確認（例: `https://kakomonn.vercel.app`）
3. **Redirect URLs**に以下を追加：
   - `https://kakomonn.vercel.app/auth/callback`
   - `https://kakomonn.vercel.app/auth/verify-success`
   - `https://kakomonn.vercel.app`（既に追加されているはず）

### 3. 現在の暫定対処

ホームページ（`/src/app/page.tsx`）で認証成功を検出し、適切なメッセージを表示してログインページへ誘導する処理を追加：

```typescript
// URLパラメータで認証成功を検出
const emailConfirmed = urlParams.get('email_confirmed')

if (emailConfirmed === 'true') {
  setAuthMessage('✅ メール認証が完了しました！ログイン画面からサービスをご利用ください。')
  // 5秒後にログイン画面へリダイレクト
  setTimeout(() => {
    window.location.href = '/login'
  }, 5000)
}
```

## 推奨される対応

1. Supabaseの**Site URL**を確認・更新
2. メールテンプレートでリダイレクトURLが正しく設定されているか確認
3. 必要に応じてSupabaseのサポートに問い合わせ