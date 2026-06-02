/**
 * 全自动监控模式
 * 用法: node auto.js
 *
 * 往 downloads/ 里添加/删除文件后，自动更新下载列表并推送到 GitHub
 * Cloudflare 会自动检测 push 并重新部署
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIR = path.join(__dirname, 'downloads');

console.log('👀 自动监控已启动');
console.log('   往 downloads/ 里添加或删除文件会自动部署');
console.log('   按 Ctrl+C 停止');
console.log('');

let timer = null;

// 扫描当前文件状态
function getFileSnapshot() {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push(full);
    }
  }
  walk(DIR);
  return files.sort().join('\n');
}

// 执行更新和推送
function run() {
  try {
    console.log('🔄 检测到变化，正在更新...');
    execSync('node update-downloads.js', { stdio: 'inherit', cwd: __dirname });

    execSync('git add .', { cwd: __dirname });

    const diff = execSync('git diff --cached --quiet', { cwd: __dirname });
  } catch {
    // diff --quiet 返回1表示有变化
    const time = new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    execSync(`git commit -m "自动更新 ${time}"`, { stdio: 'inherit', cwd: __dirname });
    execSync('git push', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ 已自动推送，Cloudflare 将在1-2分钟内部署');
    console.log('');
    return;
  }

  console.log('⏭️  无实质变化，跳过');
  console.log('');
}

// 初始快照
let last = getFileSnapshot();

// 轮询监控（每3秒）
setInterval(() => {
  const now = getFileSnapshot();
  if (now !== last) {
    last = now;
    // 防抖：等文件写完
    clearTimeout(timer);
    timer = setTimeout(run, 2000);
  }
}, 3000);
