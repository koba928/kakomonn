#!/bin/bash
# MATURA-claude WSL セットアップスクリプト
# このスクリプトはNext.jsプロジェクトをWSL環境に最適化して起動します

# 色付き出力の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# エラーハンドリング
set -e

echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}MATURA-claude WSL セットアップ開始${NC}"
echo -e "${GREEN}===================================${NC}\n"

# 1. プロジェクトをWSLホームディレクトリにコピー
echo -e "${YELLOW}[1/5] プロジェクトをWSLホームディレクトリにコピー中...${NC}"
SOURCE_DIR="/mnt/c/Users/rinta/OneDrive/デスクトップ/MATURA-claude"
TARGET_DIR="$HOME/MATURA-claude"

# ターゲットディレクトリが存在する場合は削除
if [ -d "$TARGET_DIR" ]; then
    echo "既存のディレクトリを削除しています..."
    rm -rf "$TARGET_DIR"
fi

# rsyncでコピー（node_modulesと.nextは除外）
rsync -av --exclude 'node_modules' --exclude '.next' "$SOURCE_DIR/" "$TARGET_DIR/"
echo -e "${GREEN}✓ コピー完了${NC}\n"

# 2. プロジェクトディレクトリに移動
echo -e "${YELLOW}[2/5] プロジェクトディレクトリに移動中...${NC}"
cd "$TARGET_DIR"
echo -e "${GREEN}✓ 移動完了: $(pwd)${NC}\n"

# 3. クリーンアップ（念のため残っている場合）
echo -e "${YELLOW}[3/5] 古いビルドファイルをクリーンアップ中...${NC}"
rm -rf node_modules .next
echo -e "${GREEN}✓ クリーンアップ完了${NC}\n"

# 4. 依存関係のインストール
echo -e "${YELLOW}[4/5] npm パッケージをインストール中...${NC}"
echo "（これには数分かかる場合があります）"
npm install
echo -e "${GREEN}✓ インストール完了${NC}\n"

# 5. Next.js開発サーバーの起動
echo -e "${YELLOW}[5/5] Next.js開発サーバーを起動中...${NC}"
echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}セットアップ完了！${NC}"
echo -e "${GREEN}===================================${NC}\n"
echo -e "ブラウザで以下のURLを開いてください:"
echo -e "${GREEN}http://localhost:3001${NC}\n"
echo "サーバーを停止するには Ctrl+C を押してください\n"

# 開発サーバーを起動（ポート3001、全てのネットワークインターフェースで受信）
npm run dev -- --port 3001 --hostname 0.0.0.0