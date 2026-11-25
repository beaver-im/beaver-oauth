# 工程目录

[返回目录](README.md) · [1 架构](01-architecture/) · [2 目录与命名](02-layout/)

**这份文件回答三个问题：东西在哪、这个文件是干什么的、我能不能改它。**

它是**现状地图**，不是规范。为什么必须放在这里、新代码该放哪、怎么命名，一律以[第 2 章](02-layout/)为准；本章只描述当前真实存在的目录与文件用途，**出现冲突以源码为准并回来修正本表**。

标注约定（全表通用）：

| 标记 | 含义 | 处理方式 |
|---|---|---|
| `生成` | 工具产物（`types/auto/auto-imports.d.ts`、`dist/` 构建产物） | **不要手改**；改配置后重新生成 |
| `手写` | 业务与接线代码（`src/**`、`scripts/**`、各章文档） | 可以改，改完遵守对应章节 |
| `配置` | `.env.*`、`vite.config.ts`、`tsconfig*.json`、`eslint.config.js`、`index.html`、`VERSION` | 改配置不改代码；不含真实密钥 |
| `遗留` | 存在但不作为模板，或内容已滞后 | 不模仿、不扩散，见第 6 节 |

核对基线：2026-11-25，逐目录 `find` 与入口文件实读。目录会变，**新增/删除一级目录或入口文件时同步改本表**。

## 小节

- 1 仓根
- 2 src 源码
- 3 配置与脚本
- 4 docs 地图
- 5 速查
- 6 遗留项

---

## 1 仓根

| 路径 | 标记 | 类型 | 用途 |
|---|---|---|---|
| `package.json` | `手写` | 配置 | `name` 为 `beaver-open`（不改）、`version` 为 `2.0.2`；7 个脚本是命令唯一来源，见[第 8 章](08-build/) |
| `package-lock.json` / `pnpm-lock.yaml` | `配置` | 锁文件 | 两份锁文件并存；脚本只用 `npm`，不要凭锁文件编造 pnpm 命令 |
| `VERSION` | `配置` | 文本 | 发布版本号 `2.0.2`，与 `package.json` 同步 |
| `README.md` / `README_EN.md` | `遗留` | 对外介绍 | 技术栈与端口 `8045` 正确；「环境配置」段写的 `.env.development` / `.env.production` 与实际文件名不符 |
| `OAUTH_README.md` | `遗留` | 对外接口说明 | OAuth 流程背景可读；但端口 `5173`、路由 `/oauth/authorize`、SDK `@beaver/js-sdk`、地址 `localhost:8888` 均为旧信息，真实路径以 `src/api/oauth.ts` 为准 |
| `CONTRIBUTING.md` / `SECURITY.md` | `遗留` | 模板残留 | 内容来自 Beaver Manager（提到 Pinia、RBAC、dashboard），不是本仓规范 |
| `LEGAL.md` | `手写` | 合规 | 署名、禁止删改 `LICENSE` 与版权头的要求，见[2.3](02-layout/03-命名与版权.md) |
| `LICENSE` | `手写` | 许可 | MIT，根目录唯一许可事实源 |
| `index.html` | `配置` | 入口 HTML | `lang="zh-CN"`、标题「登录授权页面」、`#app` 挂载点、`/src/main.ts` |
| `.env.dev` / `.env.test` / `.env.prod` | `配置` | 环境 | 定义 `VITE_API_ENV` 与 `VITE_API_BASE`，三环境唯一地址来源，见[第 3 章](03-config/) |
| `.editorconfig` | `配置` | 编辑器 | UTF-8、2 空格、LF；`*.md` 不强制末尾换行 |
| `.gitignore` | `配置` | 忽略 | `node_modules`、`dist`、`*.local`、IDE 文件 |
| `.npmrc` | `配置` | npm | 使用 npmmirror 镜像 |
| `.lingma/rules/rules.md` | `遗留` | 外部规则指针 | `always_on`，指向 `../../../beaver-skills/beaver-open/rule.md`；该目标当前不存在，不作为事实源 |
| `public/favicon.ico` | `手写` | 静态资源 | 由 `index.html` 引用 |
| `static/manager/` / `static/sponsor/` | `遗留` | 截图与赞助图 | 从 manager 仓复制，含各自 `README.md`；不参与构建 |
| `types/auto/auto-imports.d.ts` | `生成` | 类型声明 | unplugin-auto-import 生成；含 vue/vue-router/pinia 全局声明，不手改 |
| `AGENTS.md` | `手写` | 协作者入口 | 硬约束 + 任务路由，不复制整书 |
| `docs/` | `手写` | 工程手册 | 本章节体系，见第 4 节 |

---

## 2 src 源码

`src/` 下共 9 个源码文件 + 1 张图片，全部 `手写`，无组件库封装、无 store、无 layouts。

| 路径 | 标记 | 用途 |
|---|---|---|
| `src/main.ts` | `手写` | 应用入口：`createApp(App)` → `app.use(router)` → `mount('#app')`；未安装 Pinia |
| `src/App.vue` | `手写` | 仅 `<router-view />` + 全局基础样式 |
| `src/router/index.ts` | `手写` | `createWebHistory`；`/scan`、`/auth`、`/` 重定向 `/auth`；无守卫 |
| `src/config/env.ts` | `手写` | `requireEnv` 强校验；`config.baseAPI` 是本仓唯一 API 地址出口 |
| `src/api/oauth.ts` | `手写` | 两个 `oauth_public` 请求函数：`getQrCodeSceneApi`、`checkQrCodeStatusApi` |
| `src/types/api/oauth.ts` | `手写` | 四个 DTO：`IGetQrCodeSceneReq/Res`、`ICheckQrCodeStatusReq/Res` |
| `src/utils/request/index.ts` | `手写` | 唯一 axios 实例、`ajax<T>`、`IResponseSuccessData<T>` |
| `src/pages/auth/index.vue` | `手写` | 授权页：读 `oauthId`/`redirectUri`，注册 SDK，渲染 `<beaver-login>` |
| `src/pages/scan/index.vue` | `手写` | 扫码页：读 `sceneId`，拉取 scene，展示 App 扫码确认引导 |
| `src/assets/logo.png` | `手写` | 图片资源；当前页面代码未引用 |

---

## 3 配置与脚本

| 路径 | 标记 | 用途 |
|---|---|---|
| `vite.config.ts` | `配置` | `loadEnv(mode, process.cwd(), "")`；`base: "./"`；`@` → `src`；`server.port = 8045`；`define.__APP_ENV__`；`vue()` + `AutoImport` |
| `tsconfig.json` | `配置` | 仅 `references` 指向 app 与 node 两份配置 |
| `tsconfig.app.json` | `配置` | `src/**/*.ts|tsx|vue`，`@/*` → `src/*`，`strict` 等检查，`types` 含自动导入 d.ts |
| `tsconfig.node.json` | `配置` | 只检查 `vite.config.ts`，`noEmit` |
| `eslint.config.js` | `配置` | @antfu/eslint-config；2 空格、双引号、无分号；`vue/block-order` 为 script/template/style |
| `scripts/check-knowledge.mjs` | `手写` | **只读**文档校验：链接、登记、章序、源码路径、AGENTS 行数；不要改动它 |
| `scripts/add-copyright-header.mjs` | `手写` | **会写文件**：为 `src/` 下 ts/vue/js/mjs/cjs 注入/更新版权头，见[8.2](08-build/02-版权头脚本.md) |

---

## 4 docs 地图

本目录是**工程手册**，不收产品需求 / 功能规格 / 路线图。

| 路径 | 内容 |
|---|---|
| `README.md` | 全书入口 + 固定 7 条结构标准 + 完整目录 |
| `directory.md` | 本文件：工程目录（参考） |
| `glossary.md` | 术语（参考） |
| `01-architecture/` … `10-decisions/` | 一章一目录；入口 `README.md` 首行 `# 第N章 …`；小节 `NN-主题.md` 首行 `# N.M …` |
| `knowledge-checks.json` | 校验登记：`documents`、`requiredPaths`、`chapters`、`commands` |

---

## 5 速查

| 我要…… | 先去 | 再看 |
|---|---|---|
| 换 API 域名 | `.env.dev` / `.env.test` / `.env.prod` 的 `VITE_API_BASE` | [3.1](03-config/01-环境与地址.md) |
| 新增开放平台接口 | `src/api/oauth.ts` + `src/types/api/oauth.ts` | [4.2](04-network/02-API-层与-DTO.md) |
| 改统一响应 / 超时 | `src/utils/request/index.ts` | [4.1](04-network/01-HTTP-客户端.md) |
| 改授权页入参 / SDK | `src/pages/auth/index.vue` | [5.1](05-pages/01-授权页.md) |
| 改扫码引导 / 错误文案 | `src/pages/scan/index.vue` | [5.2](05-pages/02-扫码页.md) |
| 加路由 | `src/router/index.ts` | [5.3](05-pages/03-路由约定.md) |
| 加版权头 | `npm run add-copyright-header` | [8.2](08-build/02-版权头脚本.md) |
| 构建生产 / 测试包 | `npm run build_prod` / `build_test` | [8.1](08-build/01-构建与发布.md) |
| 补文档 / 查规则出处 | `docs/README.md` → 对应章 | [9.3](09-workflow/03-文档维护.md) |

**通用检索路径**：页面 → `src/api/oauth.ts` → `src/types/api/oauth.ts` → `src/utils/request/index.ts` → `src/config/env.ts`；不要默认扫全仓。

---

## 6 遗留项

这些是**现状问题**，不构成模板；在对应代码任务中按需澄清，不扩散。

| 项 | 问题 | 建议 |
|---|---|---|
| `OAUTH_README.md` | 端口 `5173`、路由 `/oauth/authorize`、页面 `pages/oauth/authorize.vue`、SDK `@beaver/js-sdk`、`localhost:8888` 均与源码不符 | 只作流程背景；接口事实以 `src/api/oauth.ts` 为准 |
| `README.md` / `README_EN.md` | 环境段落写 `.env.development` / `.env.production` | 按 [3.1](03-config/01-环境与地址.md) 理解三份 `.env.*` |
| `CONTRIBUTING.md` / `SECURITY.md` | Beaver Manager 模板残留（Pinia、RBAC、dashboard） | 不作本仓规范；协作入口看 `AGENTS.md` |
| `static/manager/` / `static/sponsor/` | manager 截图与赞助图，与授权页无关 | 不参与构建，不模仿 |
| `.lingma/rules/rules.md` | 指向不存在的 `beaver-skills/beaver-open/rule.md` | 不作为事实源 |
| `VITE_API_ENV` vs `VITE_APP_ENV` | `.env.*` 写前者，`env.ts` 与 `vite.config.ts` 读后者 | 见 [ADR 0002](10-decisions/0002-环境配置单一来源.md)；不要凭文档脑补 |
| `checkQrCodeStatusApi` | 已导出但当前页面无调用方 | 轮询需求出现时再接，不删除导出 |
| `unplugin-vue-components` | 在 `devDependencies` 但 `vite.config.ts` 未启用 | 不要声称组件自动注册 |
| pinia | 自动导入声明了 pinia 全局，但依赖与 `main.ts` 均未安装/挂载 | 不要引入 store 写法 |
| `src/assets/logo.png` | 存在但页面未引用 | 不要当作已上线的品牌位 |
