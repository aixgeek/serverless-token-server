# 使用 Serverless 构建第三方 Token 缓存服务
## 服务拓扑

```text
                                                                            ┌──────────────────────────────────┐
                                                                            │ https://api.foo.com/xxxxx/token  │
                            token-server-frontend(React)           ┌──────► │ https://api.bar.net/......       │
                    ┌─────────────►  /*                            │        │ .........                        │
                    │                                              │        └──────────────────────────────────┘
                    │                                              │ miss
Admin  ─────────────┤                                              │
                    │
Inner Apps ─────────┴─────────────► /api/* ────────────────────► /api/* ────────────────► Database
                          │  token-server-cache(Golang)         (Typescript)   hit        (Mysql)
                          │                                        ▲
                          │                                        │
                          │                                        │
                          └────────────────────────────────────────┘
```