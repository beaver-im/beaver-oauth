# 4.1 HTTP 客户端

[返回本章](README.md) · [全书目录](../README.md)

## 唯一实例

`src/utils/request/index.ts` 创建唯一 axios 实例并导出 `ajax<T>`。
页面不得直接 `fetch`、`axios.create` 或引入第二个实例；API 层也不得绕过 `ajax`。

当前实例配置：

- timeout 为 `600000` ms（10 分钟），注释来自文件上传场景，但本仓只有两个 GET。
- 默认 `Content-Type: application/json;charset=UTF-8`。
- 没有 baseURL、鉴权头、token 注入、重试、取消或幂等处理。
- 请求拦截器只复制 headers；响应拦截器只返回 `response.data`。

## 响应信封

`ajax<T>` 返回 `Promise<IResponseSuccessData<T>>`：

```ts
{ code: number, msg: string, result: T }
```

HTTP 非 2xx 会 reject；HTTP 200 但业务 `code !== 0` 不会自动 reject，调用方必须判断。
`msg` 可能为空，`result` 可能缺失；页面需要同时处理 reject、业务失败和空 result。

## 错误处理边界

拦截器不显示全局消息、不跳登录、不记录敏感响应。
新增全局错误处理前先明确公开页是否应展示服务端 msg、如何避免泄露内部细节，以及 SDK 请求是否应复用该实例。
当前 SDK 的网络行为不属于本实例，不应把 axios 配置当作 SDK 全局配置。

## 修改检查

改 timeout、headers 或响应结构会影响所有 API 与 SDK props 的相关联调。
GET 查询参数由 axios 序列化，`sceneId` 等值必须编码；不要手工拼 query。
公开接口不应加入 Authorization、Cookie 凭证或用户身份头。

事实源：[request/index.ts](../../src/utils/request/index.ts)、[api/oauth.ts](../../src/api/oauth.ts)。
