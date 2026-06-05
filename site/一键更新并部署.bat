@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   一键更新下载列表并部署
echo ========================================
echo.

echo [1/3] 扫描 downloads 文件夹，更新下载列表...
node update-downloads.js
if errorlevel 1 (
    echo ❌ 更新失败！
    pause
    exit /b 1
)

echo.
echo [2/3] 提交到 Git...
git add .
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "自动更新 %date:~0,4%/%date:~5,2%/%date:~8,2% %time:~0,2%:%time:~3,2%"
    echo ✅ 已提交
) else (
    echo ⏭️  无变化，跳过提交
)

echo.
echo [3/3] 推送到 GitHub（自动触发 Cloudflare 部署）...
git push
if errorlevel 1 (
    echo ❌ 推送失败！请检查网络
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ 全部完成！Cloudflare 将在 1-2 分钟内自动部署
echo   按 Ctrl+Shift+R 刷新网站查看更新
echo ========================================
echo.
pause
