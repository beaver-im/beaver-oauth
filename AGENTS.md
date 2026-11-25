# AGENTS.md · 协作者入口

本文件是给本仓 **AI 协作者** 的护栏，不是全书摘要。技术事实以 `src/`、`.env.*`、`vite.config.ts`、`package.json`、`scripts/` 为事实源；
本手册只描述去哪查、怎么判，冲突时以源码为准并在同任务内回来修正 `docs/`。

受众：在本仓做开发/维护的 AI 协作者。人类贡献流程见仓根 `README.md`（仓内 `CONTRIBUTING.md` 内容来自 manager 模板，已滞后，不作规范）。

## 不可漏

1. **名字不要顺手改**：`package.json` 的 `name` 是 `beaver-open`（保持原样），仓库目录叫 `beaver-oauth`；`version` 为 `2.0.2`，与仓根 `VERSION` 一致。版权头里的 `PROJECT` 又是 `beaver-oauth`，三者不是同一个东西。
2. **环境文件只有三份**：`.env.dev` / `.env.test` / `.env.prod`，靠 `--mode` 切换；不存在 `.env.development`、`.env.production`、`.env.example`。`VITE_API_BASE` 由 `src/config/env.ts` 的 `requireEnv` 强制校验，缺失/空白直接抛错，不要加默认域名兜底。
3. **env 键名现状不一致（如实对待）**：三个 `.env.*` 写的是 `VITE_API_ENV`，但 `src/config/env.ts` 与 `vite.config.ts` 读的是 `VITE_APP_ENV`。当前 `config.env` / `__APP_ENV__` 实际为 `undefined`，`baseAPI` 不受影响。不要照仓根文档想象一个不存在的键。
4. **公开页端边界**：本仓是浏览器可直接访问的公开授权页。只调用 `/api/open/oauth_public/v1/` 下的两个 GET；前端不得出现 `appSecret`、内部 S2S 票据、code 换 token 逻辑。扫码的「确认」动作在海狸 IM App 内完成，浏览器页只展示引导，不代做确认。
5. **网络三层不越界**：HTTP 实例只在 `src/utils/request/index.ts`；请求函数只在 `src/api/oauth.ts`；请求/响应 DTO 只在 `src/types/api/oauth.ts`。页面不得直接 `fetch`/`axios.create`/硬编码域名，也不得绕过 `config.baseAPI` 自行拼 URL。
6. **页面与路由极简**：`src/App.vue` 只有 `<router-view />`；`src/main.ts` 只 `app.use(router)`（**没有** `createPinia`，尽管自动导入声明了 pinia）；路由为 `/scan`、`/auth`、`/` → `/auth`，`createWebHistory`，无守卫。不要引入 store、layouts、第二个入口。
7. **版权头不可删改**：`src/` 下 `.ts/.vue/.js/.mjs/.cjs` 文件头为 `beaver-oauth-header-v1`，含 `SPDX-License-Identifier: MIT` 与中英声明。新增/更新用 `npm run add-copyright-header`，不要手删头、不要改 `LICENSE`；依据见 `LEGAL.md`。
8. **会写文件的命令要谨慎**：`npm run lint` 实为 `eslint . --fix`，`npm run add-copyright-header` 会重写 `src/` 文件头，两者都修改工作树；跑之前确认 diff。仓内**没有** `test` 脚本，也没有 `build_dev` 脚本，不要编造。
9. **生成物与滞后文档**：`types/auto/auto-imports.d.ts` 由 unplugin-auto-import 生成，不手改；仓根 `OAUTH_README.md`（旧端口 5173、`/oauth/authorize`、`@beaver/js-sdk`）、`README.md` 的 env 文件名段落、`CONTRIBUTING.md`/`SECURITY.md` 均为滞后资料，冲突一律以源码为准。
10. **登记制与验证边界**：`docs/` 新增/删除/改名手册文档必须同步 `docs/knowledge-checks.json` 与 `docs/README.md` 目录，并跑 `node scripts/check-knowledge.mjs`；该脚本只读校验链接/登记/章序，**不编译、不测试、不联网**。通过不等于业务正确；无单元测试，不宣称覆盖率。

## 任务入口

| 要做什么 | 先读 |
|---|---|
| 改架构 / 启动链路 / 端边界 | [第 1 章](docs/01-architecture/README.md)、[ADR 0001](docs/10-decisions/0001-公开页与端点边界.md) |
| 找文件 / 判断能不能改 / 命名 | [第 2 章](docs/02-layout/README.md)、[工程目录](docs/directory.md) |
| 改地址 / 加环境 / 切换 mode | [第 3 章](docs/03-config/README.md)、[ADR 0002](docs/10-decisions/0002-环境配置单一来源.md) |
| 加接口 / 改 DTO / 改 axios 实例 | [第 4 章](docs/04-network/README.md) |
| 改授权页 / 扫码页 / 路由 | [第 5 章](docs/05-pages/README.md) |
| 本地状态 / 缓存 | [第 6 章](docs/06-storage/README.md) |
| 错误文案 / console / 诊断 | [第 7 章](docs/07-diagnostics/README.md) |
| 构建 / 发布 / 版权头脚本 | [第 8 章](docs/08-build/README.md) |
| 任务顺序 / 验证矩阵 / 文档维护 | [第 9 章](docs/09-workflow/README.md) |
| 术语速查 | [术语表](docs/glossary.md) |
| 对外接口旧说明（仅参考） | [OAUTH_README.md](OAUTH_README.md) |
