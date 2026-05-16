# 实时告警中心

本文档记录 Issue #1202 P0 的告警中心基线、数据契约、存储评估和兼容边界。P0 只定义后续实现可以复用的契约，不新增 API、Web 页面、数据库表、触发历史写入、冷却执行或规则迁移。

## 当前基线

当前运行时告警由 `src/agent/events.py` 中的 `EventMonitor` 提供，并通过 schedule 模式后台轮询执行。

- 配置入口：`AGENT_EVENT_MONITOR_ENABLED`、`AGENT_EVENT_MONITOR_INTERVAL_MINUTES`、`AGENT_EVENT_ALERT_RULES_JSON`。
- 运行入口：`main.py` 在 schedule 模式中调用 `build_event_monitor_from_config()`，并注册 `agent_event_monitor` 后台任务。
- 通知投递：触发后复用 `NotificationService.send(..., route_type="alert")`，继续遵守通知网关的 alert 路由配置。
- Web/System 配置校验：`src/services/system_config_service.py` 会对 `AGENT_EVENT_ALERT_RULES_JSON` 做 JSON 与规则语义校验。

当前 runtime 支持三类规则：

| `alert_type` | 方向字段 | 阈值字段 | 当前语义 |
| --- | --- | --- | --- |
| `price_cross` | `direction`: `above` / `below` | `price` | 实时价格上破或下破固定价格 |
| `price_change_percent` | `direction`: `up` / `down` | `change_pct` | 实时涨跌幅达到指定百分比 |
| `volume_spike` | - | `multiplier` | 最新成交量超过近 20 日均量的指定倍数 |

`sentiment_shift`、`risk_flag`、`custom` 等类型只作为未来扩展占位；当前运行时不接受这些类型作为可执行规则。

## Legacy 配置兼容

P0 保留 `AGENT_EVENT_ALERT_RULES_JSON` 作为唯一运行时规则来源，不自动迁移、删除、覆盖或改写用户已有 `.env` / Web 配置。

- 空字符串或空数组表示未配置规则；启用 EventMonitor 但没有有效规则时，schedule 模式不会注册后台告警任务。
- Web/System 配置保存时执行严格校验，JSON 无效、字段缺失、方向非法、阈值非法或 unsupported rule type 都应返回配置错误。
- 运行时加载时允许跳过单条无效规则，剩余有效规则继续工作，避免单条配置破坏整个 schedule 进程。
- 当前规则触发后会在进程内标记为 `triggered`，这不是告警中心冷却模型，也不提供跨进程或重启后的触发历史。

## 数据契约

以下契约用于后续 P1+ API、worker、Web 和存储实现对齐。P0 只定义字段和语义边界，不代表当前已经存在这些持久化实体。

### `alert_rule`

可管理的告警规则。

| 字段 | 说明 |
| --- | --- |
| `id` | 规则 ID；legacy JSON 规则在 P0 中没有持久化 ID |
| `name` | 用户可读名称；没有提供时可由规则类型和目标生成 |
| `target_scope` | 目标范围，例如 single symbol、watchlist、portfolio、market |
| `target` | 目标标的或目标引用，例如股票代码、watchlist ID、portfolio ID |
| `alert_type` | 规则类型；P1 初始只允许 `price_cross`、`price_change_percent`、`volume_spike` |
| `parameters` | 规则参数，例如 `direction`、`price`、`change_pct`、`multiplier` |
| `severity` | 告警等级，例如 info、warning、critical |
| `enabled` | 是否启用 |
| `cooldown_policy` | 冷却策略；P0 只定义字段，P4 才实现执行语义 |
| `notification_policy` | 通知策略；默认复用 `NotificationService` 的 alert 路由 |
| `source` | 创建来源，例如 legacy_env、web、api、import |
| `created_at` / `updated_at` | 创建和更新时间 |

### `alert_trigger`

一次真实或可记录的规则触发。

| 字段 | 说明 |
| --- | --- |
| `id` | 触发记录 ID |
| `rule_id` | 对应规则 ID；legacy env 规则可记录临时引用 |
| `target` | 实际触发目标 |
| `observed_value` | 观察值，例如现价、涨跌幅、成交量倍数 |
| `threshold` | 触发阈值 |
| `reason` | 可读触发原因 |
| `data_source` | 数据源或 provider |
| `data_timestamp` | 数据时间；缺失时不得伪造为当前时间 |
| `triggered_at` | 触发时间 |
| `status` | 触发状态，例如 triggered、skipped、degraded、failed |
| `diagnostics` | 脱敏后的诊断信息 |

### `alert_notification`

一次触发对应的通知尝试。

| 字段 | 说明 |
| --- | --- |
| `id` | 通知尝试 ID |
| `trigger_id` | 对应触发记录 ID |
| `channel` | 通知渠道 |
| `attempt` | 第几次尝试 |
| `success` | 是否成功 |
| `error_code` | 结构化错误码 |
| `retryable` | 是否建议重试 |
| `latency_ms` | 耗时 |
| `diagnostics` | 脱敏后的发送诊断，不得包含 token、完整 webhook URL、邮箱密码或 bot secret |
| `created_at` | 尝试时间 |

### `alert_cooldown`

规则或目标维度的冷却状态。

| 字段 | 说明 |
| --- | --- |
| `rule_id` | 对应规则 ID |
| `target` | 冷却目标 |
| `severity` | 可选等级维度 |
| `last_triggered_at` | 最近触发时间 |
| `cooldown_until` | 冷却截止时间 |
| `reason` | 冷却原因 |
| `state` | 当前状态，例如 active、expired |
| `updated_at` | 更新时间 |

## 存储方案评估

当前仓库已有 SQLite 存储层和 repository/service 分层：

- `src/storage.py` 管理 SQLite 连接、SQLAlchemy ORM 模型和 `DatabaseManager`。
- `src/repositories/` 放置数据访问层，例如 `PortfolioRepository`。
- `src/services/` 放置业务服务层，例如 `PortfolioService`、`PortfolioRiskService`。
- 默认数据库路径跟随现有配置，通常落在 `data/stock_analysis.db`。

P1/P2 实现告警持久化时，推荐优先复用以上模式：在 storage 层定义 alert ORM 模型，在 repository 层封装 CRUD 和查询，在 service 层处理规则校验、评估状态、通知结果和冷却语义。P0 不新建表，不改变现有数据库。

如果后续 PR 需要 schema 变更，必须同时给出：

- 幂等初始化：重复启动或重复执行初始化时不得破坏已有数据。
- 向后兼容：未配置告警中心时不影响每日分析、问股、通知、大盘复盘和持仓功能。
- 回滚说明：最小回滚方式至少包括 revert PR；若创建了新表或索引，需要说明是否保留数据、如何手动清理。
- 数据迁移边界：不得自动迁移、删除或覆盖 `AGENT_EVENT_ALERT_RULES_JSON`，除非用户显式执行导入动作。

## Phase 边界

- P0：本文档、契约、存储评估和兼容测试。
- P1：Alert API MVP，首版只覆盖现有三类 runtime 规则。
- P2：告警评估 worker 与 runtime 统一，让持久化 active rules 与 legacy JSON 共存。
- P3：Web 告警中心 MVP。
- P4：触发历史、通知结果与冷却状态。
- P5：技术指标规则。
- P6：持仓与自选股联动。
- P7：大盘红绿灯与市场联动。
- P8：文档、迁移与收口。

## P0 不做

- 不新增 `src/schemas/alerts.py` 或 Alert API。
- 不新增 Web 告警中心页面、路由或侧边栏入口。
- 不新增数据库表、repository 或 migration。
- 不实现触发历史、通知结果或冷却状态写入。
- 不自动迁移、删除或覆盖 `AGENT_EVENT_ALERT_RULES_JSON`。
- 不实现 MACD、KDJ、CCI、RSI、持仓风险或 Market Light 告警规则。
- 不重写 `NotificationService` 或通知路由框架。

## 回滚

P0 是文档和测试收口。若需要回滚，revert 对应 PR 即可；没有数据库、配置或用户数据迁移需要额外处理。
