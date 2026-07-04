# 题域 QuestSphere 官网

题域（QuestSphere）官方站点 — Astro + Tailwind，部署到 Vercel 或 Cloudflare Pages。

**主转化**：用精选公开包让人「刷几道题就懂题域」；完整刷题与订阅在 Android App 内完成。战略与 IA 见 [`docs/website-decisions.md`](docs/website-decisions.md)。

## 功能（Phase 2.8 v1）

| 路径 | 说明 |
| --- | --- |
| `/` | 落地页：生态叙事（`#ecosystem`）+ 主 CTA「体验官方精选题库」 |
| `/packs` | 官方精选公开包 + 次级全量/搜索 |
| `/pack/[packId]` | 只读预览（前 3 题含选项与解析）+ onboarding |
| `/docs` | 导入说明、发现/订阅 FAQ |
| `/download` | App 下载引导（次级入口，内测期说明） |

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

- **官网决策单（优先）**：[`docs/website-decisions.md`](docs/website-decisions.md)
- 产品背景与 API：[`docs/PRDs/1_plan.md`](docs/PRDs/1_plan.md)
