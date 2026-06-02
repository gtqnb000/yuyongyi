# 光头强内核 - 官方网站

## 更新下载资源

往 `downloads/` 文件夹里添加或删除文件后，运行：

```bash
node update-downloads.js
```

脚本会自动扫描 `downloads/` 文件夹，更新 `index.html` 里的下载列表。

## 部署到 Cloudflare Pages

### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "初始提交"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. 连接 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选择你的 GitHub 仓库
4. 设置：
   - **Project name**: 随意（如 `gtqgai`）
   - **Production branch**: `main`
   - **Build command**: 留空（纯静态站无需构建）
   - **Build output directory**: `/`（根目录）
5. 点 **Save and Deploy**

### 3. 后续更新流程

```bash
# 1. 添加/删除 downloads/ 里的文件
# 2. 更新下载列表
node update-downloads.js
# 3. 提交推送
git add .
git commit -m "更新资源"
git push
```

Cloudflare Pages 会自动检测 push 并重新部署（约 1-2 分钟）。

## 文件结构

```
├── index.html          # 主页面
├── update-downloads.js # 下载列表更新脚本
├── downloads/          # 下载资源（按游戏分类）
│   ├── 和平精英/
│   ├── 王者荣耀/
│   ├── 无畏契约/
│   ├── 香肠派对/
│   ├── PUBGM/
│   └── 其他工具/
├── images/             # 图片资源
└── music/              # 音乐文件
```
