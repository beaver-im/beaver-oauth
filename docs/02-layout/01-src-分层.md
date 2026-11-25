# 2.1 src 分层

[返回本章](README.md) · [全书目录](../README.md)

## 当前结构

`src/` 当前有 6 个 `.ts` 文件、3 个 `.vue` 文件，共 9 个源码文件：入口与配置各 1，router/api/types/request 各 1，根组件与两个页面共 3 个 `.vue`；另有未引用的 `assets/logo.png`。
没有 store、layouts、components、composables、中间件或测试目录。

| 路径 | 职责 |
|---|---|
| `main.ts` | 创建应用、注册 router、挂载 |
| `App.vue` | router outlet 与全局基础样式 |
| `router/index.ts` | 三条路由与 History 模式 |
| `config/env.ts` | 必填基址校验与环境值 |
| `utils/request/index.ts` | 唯一 axios 实例与响应信封类型 |
| `api/oauth.ts` | 两个公开接口函数 |
| `types/api/oauth.ts` | 请求/响应 DTO |
| `pages/auth/index.vue` | SDK 授权页 |
| `pages/scan/index.vue` | 扫码引导页 |

## 依赖方向

页面 → API → request/config；页面 → SDK；router → 页面；main → App/router。
DTO 只被 API 与页面类型使用，不反向依赖 HTTP 实现。config 不依赖页面，request 不依赖业务 DTO。

不要把请求函数写进页面，不要在 request 中硬编码 `/oauth_public`，也不要在 DTO 中放运行时逻辑。
新增共享工具前先确认是否真的跨页面复用；当前项目刻意保持小结构。

## 生成与静态资源

`types/auto/auto-imports.d.ts` 由 Vite 插件生成，不手改。
`public/favicon.ico` 由 index.html 引用；`static/` 下 manager/sponsor 内容是模板残留，不参与授权页。
`src/assets/logo.png` 当前无引用，不要当作已上线品牌资源。

事实源：[directory.md](../directory.md)、[main.ts](../../src/main.ts)、[api/oauth.ts](../../src/api/oauth.ts)。
