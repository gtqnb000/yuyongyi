/**
 * 更新下载列表脚本
 * 用法：node update-downloads.js
 *
 * 扫描 downloads/ 文件夹，自动生成下载数据并写入 index.html
 */

const fs = require('fs');
const path = require('path');

const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
const INDEX_FILE = path.join(__dirname, 'index.html');

// 文件扩展名 → 类型
const EXT_MAP = {
  '.sh': 'sh',
  '.apk': 'apk',
  '.txt': 'txt',
  '.mp4': 'mp4',
  '.zip': 'zip',
  '.kpm': 'kpm',
  '.ko': 'kpm',
};

function getExt(filename) {
  const ext = path.extname(filename).toLowerCase();
  return EXT_MAP[ext] || 'file';
}

// 递归扫描文件夹，返回扁平数组（带 indent）
function scanDir(dirPath, basePath, indent) {
  const items = [];
  let entries;

  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (e) {
    return items;
  }

  // 排序：文件夹优先，然后按名称
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name, 'zh-CN');
  });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = basePath ? basePath + '/' + entry.name : entry.name;

    if (entry.isDirectory()) {
      // 文件夹标题
      items.push({
        name: entry.name,
        ext: 'folder',
        indent: indent,
      });
      // 递归子文件夹
      items.push(...scanDir(fullPath, relPath, indent + 1));
    } else {
      // 文件
      items.push({
        name: entry.name,
        ext: getExt(entry.name),
        path: relPath,
        indent: indent,
      });
    }
  }

  return items;
}

// 把数据格式化为 JS 对象字符串
function formatEntry(entry) {
  const parts = [
    `name: '${entry.name.replace(/'/g, "\\'")}'`,
    `ext: '${entry.ext}'`,
  ];
  if (entry.path) parts.push(`path: '${entry.path.replace(/'/g, "\\'")}'`);
  if (entry.indent) parts.push(`indent: ${entry.indent}`);
  return `{ ${parts.join(', ')} }`;
}

function generateJS() {
  const gameFolders = fs.readdirSync(DOWNLOADS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

  let js = '    const downloadFiles = {\n';

  for (const game of gameFolders) {
    const gamePath = path.join(DOWNLOADS_DIR, game.name);
    const files = scanDir(gamePath, game.name, 0);

    if (files.length === 0) continue;

    js += `      '${game.name.replace(/'/g, "\\'")}': [\n`;
    for (const f of files) {
      js += `        ${formatEntry(f)},\n`;
    }
    js += '      ],\n';
  }

  js += '    };';
  return js;
}

// 主流程
function main() {
  if (!fs.existsSync(DOWNLOADS_DIR)) {
    console.error('❌ downloads/ 文件夹不存在');
    process.exit(1);
  }

  if (!fs.existsSync(INDEX_FILE)) {
    console.error('❌ index.html 不存在');
    process.exit(1);
  }

  const newJS = generateJS();

  // 读取 index.html，替换 downloadFiles 部分
  let html = fs.readFileSync(INDEX_FILE, 'utf-8');

  const startMarker = '    const downloadFiles = {';
  const endMarker = '    };';

  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker, startIdx);

  if (startIdx === -1 || endIdx === -1) {
    console.error('❌ 在 index.html 中找不到 downloadFiles 数据块');
    console.error('   请确保代码中有 "    const downloadFiles = {" 和 "    };"');
    process.exit(1);
  }

  // 替换数据块
  html = html.slice(0, startIdx) + newJS + html.slice(endMarker.length + endIdx);

  fs.writeFileSync(INDEX_FILE, html, 'utf-8');

  // 统计
  const gameFolders = fs.readdirSync(DOWNLOADS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());
  let totalFiles = 0;
  let totalFolders = 0;

  for (const game of gameFolders) {
    const gamePath = path.join(DOWNLOADS_DIR, game.name);
    const files = scanDir(gamePath, game.name, 0);
    totalFiles += files.filter(f => f.ext !== 'folder').length;
    totalFolders += files.filter(f => f.ext === 'folder').length;
  }

  console.log('✅ 下载列表已更新！');
  console.log(`   📁 ${gameFolders.length} 个游戏分类`);
  console.log(`   📂 ${totalFolders} 个子文件夹`);
  console.log(`   📄 ${totalFiles} 个文件`);
  console.log('');
  console.log('   现在可以部署到 GitHub 了。');
}

main();
