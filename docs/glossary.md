# 术语

[返回目录](README.md) · [工程目录](directory.md)

只列本仓真实用到的术语。含义以源码为准，易错点来自实际会踩的坑。

| 术语 | 含义 | 易错点 |
|---|---|---|
| `beaver-oauth` | 本仓目录名 / 仓库名，公开授权页前端 | 不是 `package.json` 的 `name`；版权头 `PROJECT` 也是 `beaver-oauth`，别和包名混 |
| `beaver-open` | `package.json` 里的 `name`，保持原样 | 不要因为目录叫 `beaver-oauth` 就改包名；与服务端 `beaver-server-open` 是不同仓 |
| `oauthId` | 第三方应用标识，由授权页 URL query 传入 | 授权页 `onMounted` 检查它，缺失就显示错误；不是 `appSecret` |
| `redirectUri` | 第三方回调地址，由 URL query 传入并转交 SDK | 本仓不自行拼接回调 URL，也不校验其域名 |
| `sceneId` | 扫码会话标识，扫码页 URL query 必填 | 缺失即「sceneId 缺失」；它是查 scene 的参数，不是二维码图片地址 |
| `oauth_public` | 服务端网关公开端点后缀，出现在两个 API 路径中 | 只有这一后缀的接口属于本仓；不要把内部接口或换 token 接口搬进前端 |
| `qrcode_scene` | `GET /api/open/oauth_public/v1/qrcode_scene`，按 `sceneId` 取会话信息 | 相对路径拼在 `config.baseAPI` 之后，不写死域名 |
| `qrcode_status` | `GET /api/open/oauth_public/v1/qrcode_status`，查扫码状态 | 函数已导出，当前页面没有调用方；不要声称页面在轮询 |
| `BeaverSDK` | `@beaver-im/js-sdk` 默认导出，授权页 `onMounted` 调 `register()` | 不是旧文档里的 `@beaver/js-sdk`；登录 UI 由它提供，本仓不实现账号校验 |
| `beaver-login` | SDK 提供的登录组件，授权页以 `:oauth-id` / `:api-base` / `:redirect-url` 传入 | 不是本仓 `src/components/` 里的组件（本仓没有该目录） |
| `VITE_API_BASE` | 三份 `.env.*` 中的后端基址，唯一必填环境项 | `requireEnv` 缺失即抛 `请配置 VITE_API_BASE`，无默认值 |
| `VITE_API_ENV` / `VITE_APP_ENV` | 前者写在 `.env.*`，后者被 `env.ts` 与 `vite.config.ts` 读取 | 当前两者不一致，`config.env` / `__APP_ENV__` 实际为 `undefined`；见 ADR 0002 |
| `--mode` | Vite 选择 `.env.<mode>` 的方式，`dev` / `test` / `prod` | 不存在 `.env.development` / `.env.production`；新增环境要同时加 env 文件与脚本 |
| `config.baseAPI` | `src/config/env.ts` 导出的唯一 API 基址出口 | 所有请求都应从这里取，不要在页面里硬编码域名 |
| `ajax<T>` | `src/utils/request/index.ts` 导出的统一请求方法 | 返回 `Promise<IResponseSuccessData<T>>`；拦截器不按 `code` 抛错 |
| `IResponseSuccessData<T>` | 统一响应信封 `{ code, msg, result }` | `code !== 0` 由调用方自己判断（扫码页这样做），拦截器不代劳 |
| `status` | DTO 中的联合类型 `waiting / scanned / confirmed / cancelled / expired` | 五个字面量，不要新增前端自造状态；`code` 字段只在状态响应里且可选 |
| `beaver-oauth-header-v1` | 版权头版本标记，脚本用它判断是否跳过 | 不要手删或改版本字符串；`SPDX-License-Identifier: MIT` 与 `LICENSE` 不可删改 |
| `auto-imports.d.ts` | `types/auto/` 下由 unplugin-auto-import 生成的全局声明 | `生成` 文件，不手改；里面有 pinia 声明不代表本仓装了 Pinia |
| `createWebHistory` | 路由器使用的 history 模式 | 配合 `base: "./"`，深层路由刷新需要服务端 SPA 回退；不要擅自改成 hash |
| `appSecret` | 第三方应用密钥，仅用于服务端 code 换 token | 本仓前端**不得出现**；旧 `OAUTH_README.md` 的换 token 示例不是本仓实现 |
