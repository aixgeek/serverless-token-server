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
Inner Apps ─────────┴─────────────► /api/* ────────────────────► /api/* ────────► Database
                          │  token-server-cache(Golang)         (Python)   hit
                          │                                        ▲
                          │                                        │
                          │                                        │
                          └────────────────────────────────────────┘
```