# 4.2 API 层与 DTO

[返回本章](README.md) · [全书目录](../README.md)

## 两个公开接口

| 函数 | 方法与路径 | 参数 | 当前调用方 |
|---|---|---|---|
| `getQrCodeSceneApi` | GET `/api/open/oauth_public/v1/qrcode_scene` | `{ sceneId }` | 扫码页 |
| `checkQrCodeStatusApi` | GET `/api/open/oauth_public/v1/qrcode_status` | `{ sceneId }` | 无 |

路径都拼在 `config.baseAPI` 后。`oauth_public` 是公开端点分组；
不要在同一文件中加入 `/oauth/v1/*` 或 `/secret_public/v1/*` 的受信任接口。

## Scene DTO

请求只有 `sceneId`。响应包含：

- `sceneId`、`oauthId`、`appName`、`appIcon`；
- `status`：waiting/scanned/confirmed/cancelled/expired；
- `expireIn`：服务端剩余秒数；
- `scopes`：字符串数组。

当前扫码页只使用 `appName`；其余字段保留在 DTO 中，不表示页面已展示或处理。

## Status DTO

响应包含 `status` 与可选 `code`。服务端在 confirmed 且能找到有效授权码时返回 code。
本仓没有调用方，也没有 code 换 token 或自动跳转逻辑。不能把 DTO 的存在写成端到端扫码登录已完成。

## 服务端对照

真实路由与处理位于 `beaver-server-open/app/open/open_api/internal/handler/routes.go`，
响应结构位于同仓 `internal/types/types.go`。联调时以 `.api` 生成类型与 handler 为准，不手改生成物。

新增接口顺序：确认公开边界 → 更新 DTO → 写 API 函数 → 接页面 → 处理业务失败/reject → 更新本章与登记。
字段名保持 JSON camelCase，不把 Go 的 `SceneID` 拼写带到浏览器。

相关决策：[ADR 0001](../10-decisions/0001-公开页与端点边界.md)。
