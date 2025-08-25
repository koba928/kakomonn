# MATURA – リクエストキャンセル問題デバッグ記録

## 問題の経緯
2025-06-19: 前回は「APIが正しく呼び出せた」と報告されたが、実際にはFreeTalkで自然文を送信すると「リクエストがキャンセルされました」が再発。

## 根本原因の分析

### 1. タイムアウト設定の不整合
- **問題**: FreeTalk.tsxで明示的に30秒タイムアウトを設定
- **影響**: OpenAI APIの応答時間（通常2-10秒）に対して短すぎる場合がある
- **修正**: デフォルトの90秒タイムアウトを使用するように変更

### 2. エラーハンドリングの不備
- **問題**: AbortErrorを「タイムアウト」として表示していた
- **影響**: ユーザーが実際の原因を理解できない
- **修正**: より具体的なエラーメッセージに変更（「OpenAIに接続できませんでした」）

### 3. デバッグ情報の不足
- **問題**: リクエストの詳細な状況が追跡できない
- **影響**: 問題の特定と解決が困難
- **修正**: 詳細なコンソールログを追加

## 実施した修正

### API Route (/api/chat/route.ts)
```typescript
// 追加したログ
console.log('[/api/chat] Request started at:', new Date().toISOString())
console.log('[/api/chat] Calling OpenAI API with phase:', phase)
console.log('[/api/chat] OpenAI API response received, length:', aiResponse?.length || 0)
console.log('[/api/chat] status:', response.status)

// 改善したエラーハンドリング
if (error.name === 'AbortError' || error.message.includes('aborted')) {
  console.error('[chat-api] Request was aborted/cancelled. Reason:', error.message)
  console.error('[chat-api] Request was running for:', Date.now() - startTime, 'ms')
  return NextResponse.json(
    { error: 'リクエストがタイムアウトまたはキャンセルされました。もう一度お試しください。' },
    { status: 499 }
  )
}

// CORS対応
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### Frontend Hook (useChatOptimized.ts)
```typescript
// 詳細なログ追加
console.log('[useChatOptimized] Starting fetch to /api/chat, phase:', phase)
console.log('[useChatOptimized] Fetch completed, status:', response.status)
console.log('[useChatOptimized] Response data received:', {
  hasMessage: !!data.message,
  messageLength: data.message?.length || 0,
  hasError: !!data.error
})

// 改善したエラーメッセージ
if (err.name === 'AbortError') {
  const errorMessage = 'OpenAIに接続できませんでした。もう一度お試しください。'
  // ...
}
```

### Frontend Component (FreeTalk.tsx)
```typescript
// タイムアウト設定を削除（デフォルトの90秒を使用）
await chatOptimized.sendMessage(
  sanitizedInput,
  state.conversations,
  'FreeTalk',
  {
    onNewMessage: (response) => {
      actions.addMessage(response, 'assistant', 'FreeTalk')
      console.log('[FreeTalk] Received AI response, length:', response.length)
    },
    onError: (error) => {
      console.error('[FreeTalk] Chat error:', error)
      // より詳細なエラー分類
    }
    // timeout: 30000 を削除
  }
)
```

## テスト結果の確認方法

1. **ブラウザの開発者ツール**でConsoleタブを開く
2. FreeTalkで日本語のプロンプトを送信
3. 以下のログが正常に出力されることを確認：
   ```
   [useChatOptimized] Starting fetch to /api/chat, phase: FreeTalk
   [/api/chat] Request started at: 2025-06-19T06:xx:xx.xxxZ
   [/api/chat] Calling OpenAI API with phase: FreeTalk
   [/api/chat] OpenAI API response received, length: xxx
   [useChatOptimized] Fetch completed, status: 200
   [FreeTalk] Received AI response, length: xxx
   ```

## 予防策

1. **タイムアウト設定の統一**: 全てのフェーズで統一したタイムアウト設定を使用
2. **詳細なログ**: 本番環境でも適切なログレベルでエラー追跡が可能
3. **ユーザーフレンドリーなエラーメッセージ**: 技術的な詳細ではなく、ユーザーが取るべき行動を明示

## 残タスク

- [ ] 他のフェーズ（InsightRefine, UXBuild等）でも同様の修正を適用
- [ ] プロダクション環境でのログレベル設定
- [ ] エラー率の監視とアラート設定

---
最終更新: 2025-06-19
修正者: Claude Code (Autonomous Mode)