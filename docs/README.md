# beaver-oauth 工程手册

给人顺着读、给 AI 按任务查；不是每次全部读入的提示词。

**定位**：Vue 3 + Vite + TypeScript 公开授权页前端；`src/`、`.env.*`、`vite.config.ts`、`package.json`、`scripts/` 是事实源，手册只写工程规范与架构。注意 `package.json` 的 `name` 为 `beaver-open`，仓库名为 `beaver-oauth`。

## 文档结构标准（固定）

1. **一个目录 = 一章**，目录名带序号：`01-architecture/`、`02-layout/` …
2. **章入口固定为 `README.md`（章首）**：只写编号、一句话说明、小节目录；不要把小节正文堆进 README。
3. **小节 = 章目录下的正文文件**：`01-主题.md` 对应 `1.1`，文件内标题写 `# 1.1 主题`。
4. **再往下拆 = 再开子目录**：对应 `1.1.1`；子目录同样有入口 `README.md`。
5. **编号规则**：章 `1` → 小节 `1.1` → 子节 `1.1.1`。标题与目录名序号一致，便于查找。
6. **不要提前拆**：只有写长了或确有独立主题，才把小节升级成子目录。
7. **全书目录**：本页「目录」必须列出全部章与小节链接；增删小节时同步改本页与章首。

参考页（不算章）：[directory.md](directory.md) 工程目录、[glossary.md](glossary.md) 术语。

变更策略见 [AGENTS.md](../AGENTS.md)。仓根 [OAUTH_README.md](../OAUTH_README.md) 是对外接口旧说明，部分内容已滞后；产品需求 / 流水账不进 `docs/`。

## 怎么读

- 找文件 → [工程目录](directory.md)
- 第一次 → [术语](glossary.md) → `1`–`4`、`8` → 负责模块
- 改环境 / 域名 → `3`；加接口 / DTO → `4`；改页面 / 路由 → `5`；补版权头 / 构建 → `8`
- 要动手前 → `9`（任务顺序与验证矩阵）；重大取舍 → `10`

## 目录

### 参考
- [工程目录](directory.md)
- [术语](glossary.md)

### 章与小节

1. [架构与工具链](01-architecture/)
   - [1.1 项目与工具链](01-architecture/01-项目与工具链.md)
   - [1.2 启动链路](01-architecture/02-启动链路.md)
   - [1.3 端边界](01-architecture/03-端边界.md)

2. [目录与命名](02-layout/)
   - [2.1 src 分层](02-layout/01-src-分层.md)
   - [2.2 改动落点](02-layout/02-改动落点.md)
   - [2.3 命名与版权](02-layout/03-命名与版权.md)

3. [配置与环境](03-config/)
   - [3.1 环境与地址](03-config/01-环境与地址.md)
   - [3.2 多环境切换](03-config/02-多环境切换.md)

4. [网络与契约](04-network/)
   - [4.1 HTTP 客户端](04-network/01-HTTP-客户端.md)
   - [4.2 API 层与 DTO](04-network/02-API-层与-DTO.md)

5. [页面与路由](05-pages/)
   - [5.1 授权页](05-pages/01-授权页.md)
   - [5.2 扫码页](05-pages/02-扫码页.md)
   - [5.3 路由约定](05-pages/03-路由约定.md)

6. [本地存储](06-storage/)
   - [6.1 本地存储与缓存](06-storage/01-本地存储与缓存.md)

7. [日志与诊断](07-diagnostics/)
   - [7.1 错误与上报](07-diagnostics/01-错误与上报.md)

8. [构建与发布](08-build/)
   - [8.1 构建与发布](08-build/01-构建与发布.md)
   - [8.2 版权头脚本](08-build/02-版权头脚本.md)

9. [实施与验证](09-workflow/)
   - [9.1 任务顺序](09-workflow/01-任务顺序.md)
   - [9.2 验证矩阵](09-workflow/02-验证矩阵.md)
   - [9.3 文档维护](09-workflow/03-文档维护.md)

10. [决策记录](10-decisions/)
    - [0001　公开页与端点边界](10-decisions/0001-公开页与端点边界.md)
    - [0002　环境配置单一来源](10-decisions/0002-环境配置单一来源.md)
    - [模板](10-decisions/template.md)

## 仓库布局

```text
docs/
  README.md                 全书入口：结构标准 + 完整目录（章与小节）
  directory.md / glossary.md  参考（无序号）
  knowledge-checks.json     校验登记
  01-architecture/
    README.md               章首（# 第1章 …）
    01-….md                 小节正文（1.1）
  …
```

源码布局：

```text
beaver-oauth/
  src/
    main.ts  App.vue  router/index.ts
    config/env.ts  api/oauth.ts  types/api/oauth.ts  utils/request/index.ts
    pages/auth/index.vue  pages/scan/index.vue  assets/logo.png
  .env.dev  .env.test  .env.prod
  vite.config.ts  tsconfig*.json  eslint.config.js  index.html
  scripts/check-knowledge.mjs  scripts/add-copyright-header.mjs
  package.json  VERSION  OAUTH_README.md  README.md  LEGAL.md  LICENSE
  types/auto/auto-imports.d.ts  public/favicon.ico  static/
  docs/  AGENTS.md
```

校验：`node scripts/check-knowledge.mjs`（纯只读：只校验链接、登记、章序与源码路径存在；不编译、不测试、不联网）。
