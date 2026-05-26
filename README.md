# newjd · 金盾卫士

新版金盾 — 基于 Vue 3 + Vite + Element Plus 的多模态金融反欺诈前端平台。

## 功能

- 蓝色主题首页，顶部栏 + 侧边栏布局
- 用户登录 / 验证码登录 / 注册
- 金盾卫士智能助手（全屏对话、历史记录、咨询偏好）
- 交易欺诈检测、文本/链接检测、图片分析、语音克隆检测
- 个人中心、投诉反馈

## 启动

```bash
npm install
cp .env.example .env
npm run dev
```

浏览器访问 http://localhost:5173

## 后端配置

默认 API 地址：`http://8.134.98.200:10010`

在 `.env` / `.env.development` / `.env.production` 中通过 `VITE_API_BASE_URL` 修改。
开发时 Vite 代理也会转发到同一地址（见 `vite.config.ts`）。

请求头自动携带 `token`（登录后保存在 localStorage）。

## 管理后台（内部）

不对客户展示入口，登录后浏览器直接访问（注意使用终端显示的端口，如 5178）：

```
http://localhost:5178/admin/users
```

> 开发时若 `/admin/users` 出现 Spring Boot 白标错误页，说明请求被误代理到后端；已配置 Vite 对 HTML 请求返回 SPA，修改 `vite.config.ts` 后需**重启** `npm run dev`。

## 构建

```bash
npm run build
npm run preview
```
