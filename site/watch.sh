#!/bin/bash
# 自动监控模式：往 downloads/ 里添加文件后自动更新并推送
# 用法: bash watch.sh
# 按 Ctrl+C 停止

cd "$(dirname "$0")"

echo "👀 正在监控 downloads/ 文件夹..."
echo "   往里面添加或删除文件会自动更新并部署"
echo "   按 Ctrl+C 停止"
echo ""

# 检测系统选择监控工具
if command -v inotifywait &> /dev/null; then
  # Linux
  WATCH_CMD="inotifywait -r -e create -e delete -e modify --format '%w%f' downloads/"
elif [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS - 用 fswatch
  WATCH_CMD="fswatch -r downloads/"
elif command -v chokidar &> /dev/null; then
  # Node.js 方案
  WATCH_CMD="chokidar 'downloads/**/*' --debounce 2000"
else
  # 通用方案：用 Node.js 轮询
  echo "⚠️  未找到文件监控工具，使用 Node.js 轮询模式（每5秒检查一次）"
  echo ""
  WATCH_CMD=""
fi

LAST_HASH=""

run_update() {
  echo ""
  echo "🔄 检测到文件变化，正在更新..."
  node update-downloads.js
  git add .
  if ! git diff --cached --quiet; then
    git commit -m "自动更新资源 $(date '+%m-%d %H:%M')"
    git push
    echo "✅ 已自动推送部署"
  else
    echo "⏭️  无变化，跳过"
  fi
  echo ""
  echo "👀 继续监控中..."
}

if [ -n "$WATCH_CMD" ]; then
  # 有监控工具：实时触发
  eval "$WATCH_CMD" | while read -r file; do
    # 防抖：等2秒让文件写完
    sleep 2
    run_update
  done
else
  # 轮询模式
  while true; do
    CURRENT_HASH=$(find downloads/ -type f | sort | md5sum 2>/dev/null || find downloads/ -type f | sort | md5)
    if [ "$CURRENT_HASH" != "$LAST_HASH" ] && [ -n "$LAST_HASH" ]; then
      run_update
    fi
    LAST_HASH="$CURRENT_HASH"
    sleep 5
  done
fi
