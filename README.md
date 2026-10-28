# ResetRadar

[![Live demo](https://img.shields.io/badge/Live%20demo-igame.lat-58715B)](https://igame.lat)

**Live demo:** [https://igame.lat](https://igame.lat)

ResetRadar 是一个中文优先的 AI 编程工具额度事件看板与提醒 MVP。管理员手动录入并核验事件；用户可设置个人到点邮件提醒；Pro 用户可接收管理员核验事件的邮件 / Telegram / Bark 通知。

> **免责声明（非官方）**：不隶属于或获 OpenAI、Anthropic、xAI 认可；不读取账号、密码、Cookie 或 API Key；不承诺预测、重置或绕过任何平台额度。用户个人额度始终以平台账户页面为准。本仓库以开源形式提供，便于自建与二次开发。

## 开源自建（推荐）

```bash
git clone https://github.com/<your-user>/ResetRadar.git
cd ResetRadar
npm install
cp .env.example .env   # Windows: copy .env.example .env
# 编辑 .env：至少填 DATABASE_URL、ADMIN_PASSWORD、SESSION_SECRET、RESEND_*、CRON_SECRET
npm run db:push
npm run dev
```

打开 `http://localhost:3000`。

根目录历史上的静态演示页已归档到 `docs/legacy-static/`，**不要**把它当正式入口。

### 线上准点提醒（自建 QStash）

Vercel Hobby 的每日 Cron **不能**替代准点到点。请用 **Upstash QStash**（或其它调度）每 **5 分钟** `POST`（或 `GET`）你的站点：

```text
https://your-domain.example/api/cron/reminders
```

鉴权二选一：

1. Header：`Authorization: Bearer <CRON_SECRET>`
2. 配置 `QSTASH_CURRENT_SIGNING_KEY` / `QSTASH_NEXT_SIGNING_KEY`，由 QStash 自动带 `Upstash-Signature`

本地 `npm run dev` 会每分钟扫一次待发提醒，方便自测。

## 已实现

- Next.js 14 App Router + TypeScript + Tailwind + Prisma/PostgreSQL
- 首页三平台倒计时、置信度与事件状态；没有 `expectedAt` 时显示「等待确认」
- **个人到点邮件提醒**（首页表单）：到点自动发信；`remindAt` 必须晚于现在；失败有限次重试；`PROCESSING` 超时回退
- **通知通道登记**（`/account` + `POST /api/subscribe`）：邮箱 + 可选 Telegram Chat ID / Bark Key / 企微 Webhook
- **账户页管理链接**：签名 token 查看 / 取消提醒（MVP；计划中可改为只发邮件的 magic link）
- 管理员后台录入核验事件；生产 cookie 使用 `__Host-` 前缀；核验后通知 Pro / Team
- Resend 邮件、Telegram Bot、Bark；企微域名白名单（仅 `qyapi.weixin.qq.com`）
- Stripe Checkout + webhook；定价页结账按钮（站内文案 ¥19.9 / 30 天）
- Cron：Bearer `CRON_SECRET` 或 QStash 签名；`/api/health` 含 `lastCronAt` / `pendingReminders` / 配置布尔
- 页面：`/codex` `/claude` `/grok` `/history` `/pricing` `/login` `/admin` `/account` `/rules` + ICS

## 计划中 / 未做

- 终端用户 magic link 登录（管理通道目前为签名管理链接 MVP）
- Web Push（VAPID 环境变量预留）
- 微信支付 / 支付宝
- 生产级分布式限流（当前为进程内内存限流）

## 环境变量

复制 `.env.example` 后填写。**切勿把真实密钥提交到 Git。**

| 变量 | 必需 | 用途 |
| --- | --- | --- |
| `DATABASE_URL` | 是 | PostgreSQL（可用 Supabase pooler） |
| `NEXT_PUBLIC_APP_URL` | 是 | 站点公开 URL |
| `ADMIN_PASSWORD` | 是 | 管理后台登录 |
| `SESSION_SECRET` | 生产强烈建议 | 会话 cookie / 管理链接签名；未设时回退 `ADMIN_PASSWORD` |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | 个人提醒必需 | 发信 |
| `CRON_SECRET` | 生产建议 | `Authorization: Bearer …` 触发 cron |
| `QSTASH_CURRENT_SIGNING_KEY` / `QSTASH_NEXT_SIGNING_KEY` | 与 CRON 二选一 | QStash 签名校验 |
| `QSTASH_TOKEN` / `QSTASH_URL` | QStash 创建时 | 在 QStash 控制台创建调度 |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_PRICE_ID` | 收费时 | 结账 |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_WEBHOOK_SECRET` | 可选 | 生产未配 secret 则 webhook 返回 503 |
| `NEXT_PUBLIC_VAPID_*` / `VAPID_PRIVATE_KEY` | 否 | Web Push（计划中） |
| `UPSTASH_REDIS_REST_*` | 否 | 限流扩展预留 |

本地调试管理员时设置 `ADMIN_PASSWORD`，然后 `npm run dev`（每分钟自扫 cron）。生产务必配齐密钥。

## 个人提醒与自动发信

1. 用户在首页填写预计恢复时间（表单时间按 Asia/Shanghai 展示）
2. 本地：`npm run dev` 内置每分钟检查（看终端日志）
3. 生产：推荐 QStash 每 5 分钟打 `/api/cron/reminders`（见上文）
4. `vercel.json` 里每日一次的 Vercel Cron 仅兜底，**不能**替代准点
5. 管理员后台也可点「检查到点提醒」做手动测试

状态机：抢占 `PENDING → PROCESSING`；成功 `SENT`；失败累加 `attempts`，未满 3 次回 `PENDING`，否则 `FAILED`；`PROCESSING` 卡住约 10 分钟会回退或失败。

## Stripe

1. 在 Stripe 创建与站内文案一致的 recurring Price（文案 **¥19.9 / 30 天**；以你的 `STRIPE_PRICE_ID` 为准）
2. 本地：`stripe listen --forward-to localhost:3000/api/webhook/stripe`，写入 `STRIPE_WEBHOOK_SECRET`
3. 先在 `/account` 登记邮箱，再在 `/pricing` 用同一邮箱结账
4. webhook 至少处理：`checkout.session.completed`、`customer.subscription.updated`、`customer.subscription.deleted`

## Telegram / Bark / 企微

- Telegram：用户向 Bot 发 `/start` 取得 Chat ID，在 `/account` 登记；部署后 `setWebhook` 到 `/api/webhook/telegram`，并配置相同 `TELEGRAM_WEBHOOK_SECRET`
- Bark：登记 Key；管理员通知时走 Bark 官方地址
- 企微：仅允许 `https://qyapi.weixin.qq.com/...`
- 管理员事件通知只投递 `PRO` / `TEAM` 已登记通道

## Vercel 部署

1. 连接本 Git 仓库到 Vercel（选 Next.js）
2. 配置上表环境变量（至少：`DATABASE_URL`、`NEXT_PUBLIC_APP_URL`、`ADMIN_PASSWORD`、`SESSION_SECRET`、`RESEND_*`、`CRON_SECRET` 或 QStash 签名密钥）
3. `npm run db:push`（或 CI 同等命令）同步表结构
4. 用 QStash 建每 5 分钟调度，不要指望 Hobby 的每日 Cron 准点
5. 再把 Stripe / Telegram webhook 指到生产域名

## 健康检查

`GET /api/health` 会返回：`ok`、`database`、`lastCronAt`、`pendingReminders`、`resendConfigured`、`cronSecretConfigured`、`qstashConfigured`、`stripeConfigured`（布尔，不含密钥）。

## 邮件进垃圾箱 / Gmail 进更新页

新发信域名即使 Resend 显示 Delivered，Gmail 仍可能进更新页。请完成域名验证与 DMARC；观察模式后再把 Gmail 分类调为「主要」或重要邮件。

## MVP 运营边界

`confidence=OFFICIAL` 只用于有官方状态页或明确信息源的 `MEDIUM/LOW` 之外情况；管理员应优先核验来源再通知。

## License

源码按仓库根目录约定开源；使用前请自行评估合规与运营风险。第三方商标归各自权利人所有。
