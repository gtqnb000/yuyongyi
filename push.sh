#!/bin/bash
# 一键更新并部署
# 用法: bash push.sh "更新说明"（可选）

cd "$(dirname "$0")"

echo "🔍 扫描 downloads/ ..."
node update-downloads.js

echo ""
echo "📦 提交到 Git ..."
git add .
git commit -m "${1:-更新资源}"
git push

echo ""
echo "✅ 已推送，Cloudflare 将自动部署（约1-2分钟）"
