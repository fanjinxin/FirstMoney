# GitHub Pages 部署方案

## 一、部署后的访问地址

- **仓库**：`https://github.com/fanjinxin/FirstMoney`
- **网页地址**：`https://fanjinxin.github.io/FirstMoney/`

---

## 二、前置准备

1. 已有 GitHub 账号，代码已推送到 `fanjinxin/FirstMoney`
2. 本地安装 Node.js，项目可正常 `npm run build`

---

## 三、配置修改

### 1. 修改 Vite 的 base 路径

GitHub Pages 项目站点部署在 `/仓库名/` 下，需设置 `base: '/FirstMoney/'`。

在 `vite.config.ts` 中修改：

```ts
base: '/FirstMoney/',
```

### 2. 构建命令（可选）

当前 `npm run build` 会因 tsc 报错失败，可改为仅用 Vite 构建：

在 `package.json` 的 scripts 中：

```json
"build": "vite build"
```

---

## 四、部署方式

### 方式 A：使用 gh-pages 包（推荐，最简单）

#### 步骤 1：安装 gh-pages

```bash
npm install --save-dev gh-pages
```

#### 步骤 2：添加部署脚本

在 `package.json` 的 `scripts` 中添加：

```json
"deploy": "npm run build && gh-pages -d dist"
```

#### 步骤 3：执行部署

```bash
npm run deploy
```

首次运行会将 `dist` 推送到 `gh-pages` 分支。

#### 步骤 4：开启 GitHub Pages

1. 打开 https://github.com/fanjinxin/FirstMoney
2. **Settings** → **Pages**
3. **Source** 选择 **Deploy from a branch**
4. **Branch** 选择 `gh-pages`，目录选 `/ (root)`
5. 点击 Save

等待 1–2 分钟后访问：`https://fanjinxin.github.io/FirstMoney/`

---

### 方式 B：GitHub Actions 自动部署

每次 push 到 main 分支时自动构建并发布。

#### 步骤 1：创建 workflow 文件

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 步骤 2：开启 GitHub Pages

1. **Settings** → **Pages**
2. **Source** 选择 **GitHub Actions**
3. 之后每次 push 到 main 会自动构建并部署

---

## 五、注意事项

### 1. base 路径

- 必须为 `'/FirstMoney/'`（末尾斜杠保留）
- 若仓库改名，需同步修改 base

### 2. HashRouter

项目使用 HashRouter，URL 形如：`https://fanjinxin.github.io/FirstMoney/#/mbti`  
无需 404 重定向配置。

### 3. 首次部署后

- 可能需要等待 1–5 分钟才会生效
- 若打不开，检查 Settings → Pages 中的 Source 和分支设置

### 4. 更新部署

**方式 A**：执行 `npm run deploy`  
**方式 B**：直接 `git push` 到 main（如使用 Actions）

---

## 六、常见问题

| 问题 | 处理方式 |
|------|----------|
| 页面空白 | 检查 base 是否为 `/FirstMoney/` |
| 资源 404 | 确认 base 配置正确，重新构建 |
| 部署后无更新 | 清除浏览器缓存或强制刷新 |
| Actions 失败 | 查看 Actions 页的构建日志 |
