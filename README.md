# 题域 QuestSphere 官网

题域（QuestSphere）官方站点 — Astro + Tailwind，部署到 Vercel 或 Cloudflare Pages。

## 功能（Phase 2.8 v1）

- `/` — 落地页（一条龙生态 + 功能概览）
- `/docs` — 导入说明与 FAQ
- `/download` — APK 下载引导
- `/pack/[packId]` — 公开包只读预览（Supabase anon REST）

## 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 启动开发服务器
npm run dev
```

在 `.env` 中配置：

- `PUBLIC_SUPABASE_URL` — Supabase 项目 URL
- `PUBLIC_SUPABASE_ANON_KEY` — 只读 anon key（**禁止** service_role）

## 构建与部署

```bash
npm run build
npm run preview
```

Vercel / Cloudflare Pages 连接本仓库，Root Directory 为仓库根目录，构建命令 `npm run build`，输出目录 `dist/`。

## 仓库边界

| 内容 | 位置 |
| --- | --- |
| Android App | [workbench](https://github.com/JamesJen627/QuestSphere) |
| Supabase schema / Edge Functions | workbench 仓库 `supabase/` |
| 官网前端 | **本仓库** |

## 相关文档

- 产品规划：`PRDs/1_plan.md`
