# LLM 服务商配置速查

本文面向首次配置用户，说明 Web 设置页「AI 模型配置」预设与 `.env` 多渠道变量的对应关系。实际可用模型、额度、区域限制和价格以各服务商控制台为准；如果模型列表拉取失败，可在 Web 中手动填写模型名。

Web 设置页展示的 provider 能力标签、官方来源链接和配置注意事项来自静态 provider template，仅用于配置参考，不代表运行时能力已验证通过。

## 配置方式

推荐优先使用 Web 设置页：

1. 打开设置页的「AI 模型配置」。
2. 在「快速添加渠道」选择服务商预设。
3. 填入 API Key，必要时点击「获取模型」。
4. 选择主模型、Agent 主模型、备选模型和 Vision 模型后保存。
5. 点击「测试连接」确认鉴权、模型名、额度和响应格式正常。

也可以直接在 `.env` 使用多渠道格式：

```env
LLM_CHANNELS=deepseek
LLM_DEEPSEEK_PROTOCOL=deepseek
LLM_DEEPSEEK_BASE_URL=https://api.deepseek.com
LLM_DEEPSEEK_API_KEY=sk-xxx
LLM_DEEPSEEK_MODELS=deepseek-v4-flash,deepseek-v4-pro
LITELLM_MODEL=deepseek/deepseek-v4-flash
```

## 常用服务商预设

| 服务商 | 渠道名 | 协议 | Base URL | 模型示例 |
| --- | --- | --- | --- | --- |
| AIHubmix | `aihubmix` | `openai` | `https://aihubmix.com/v1` | `gpt-5.5,claude-sonnet-4-6,gemini-3.1-pro-preview` |
| Anspire Open | `anspire` | `openai` | `https://open-gateway.anspire.cn/v6`（示例） | `Doubao-Seed-2.0-lite,Doubao-Seed-2.0-pro,qwen3.5-flash,MiniMax-M2.7`（示例） |
| OpenAI | `openai` | `openai` | `https://api.openai.com/v1` | `gpt-5.5,gpt-5.4-mini` |
| DeepSeek | `deepseek` | `deepseek` | `https://api.deepseek.com` | `deepseek-v4-flash,deepseek-v4-pro` |
| Gemini | `gemini` | `gemini` | 留空 | `gemini-3.1-pro-preview,gemini-3-flash-preview` |
| Anthropic Claude | `anthropic` | `anthropic` | 留空 | `claude-sonnet-4-6,claude-opus-4-7` |
| Kimi / Moonshot | `moonshot` | `openai` | `https://api.moonshot.cn/v1` | `kimi-k2.6,kimi-k2.5` |
| 通义千问 / DashScope | `dashscope` | `openai` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen3.6-plus,qwen3.6-flash` |
| 智谱 GLM | `zhipu` | `openai` | `https://open.bigmodel.cn/api/paas/v4` | `glm-5.1,glm-4.7-flash` |
| MiniMax | `minimax` | `openai` | `https://api.minimax.io/v1` | `MiniMax-M2.7,MiniMax-M2.7-highspeed` |
| 火山方舟 / 豆包 | `volcengine` | `openai` | `https://ark.cn-beijing.volces.com/api/v3` | `doubao-seed-1-6-251015,doubao-seed-1-6-thinking-251015` |
| 硅基流动 / SiliconFlow | `siliconflow` | `openai` | `https://api.siliconflow.cn/v1` | `deepseek-ai/DeepSeek-V3.2,Qwen/Qwen3-235B-A22B-Thinking-2507` |
| OpenRouter | `openrouter` | `openai` | `https://openrouter.ai/api/v1` | `~anthropic/claude-sonnet-latest,~openai/gpt-latest` |
| Ollama | `ollama` | `ollama` | `http://127.0.0.1:11434` | `llama3.2,qwen2.5` |

## 官方来源与兼容性

| 服务商 | 官方来源 | 兼容说明 |
| --- | --- | --- |
| Anspire Open | [Anspire Open](https://open.anspire.cn/?share_code=QFBC0FYC) | `ANSPIRE_API_KEYS` 在未配置更高优先级 OpenAI-compatible 来源时可用于大模型网关与搜索；页面与 `.env` 默认示例为 `openai/Doubao-Seed-2.0-lite` + `https://open-gateway.anspire.cn/v6`，是否可用以控制台与模型权限为准。 |
| OpenAI | [模型列表](https://platform.openai.com/docs/models) | 官方模型页建议从 `gpt-5.5` 开始，低延迟/低成本场景使用 `gpt-5.4-mini` 或 `gpt-5.4-nano`。 |
| DeepSeek | [快速开始](https://api-docs.deepseek.com/) | 官方 OpenAI Base URL 为 `https://api.deepseek.com`；`deepseek-chat` / `deepseek-reasoner` 将于 2026-07-24 弃用，当前模板直接使用 `deepseek-v4-flash` / `deepseek-v4-pro`。 |
| Gemini | [模型列表](https://ai.google.dev/gemini-api/docs/models) | Gemini 3.1 Pro / Gemini 3 Flash 仍为 preview；如需生产稳定性，可在控制台改回 2.5 稳定模型。 |
| Anthropic Claude | [模型概览](https://docs.anthropic.com/en/docs/about-claude/models/all-models) | Claude 当前 API ID 包含 `claude-sonnet-4-6`、`claude-opus-4-7`；Sonnet 更适合作为默认性价比入口。 |
| Kimi / Moonshot | [Kimi K2.6 快速开始](https://platform.kimi.com/docs/guide/kimi-k2-6-quickstart)、[模型列表](https://platform.kimi.com/docs/models) | 官方推荐 `kimi-k2.6`；`kimi-k2` 系列将在 2026-05-25 下线，旧 `moonshot-v1-*` 仅保留为稳定旧工作负载选择。 |
| 通义千问 / DashScope | [文本生成](https://help.aliyun.com/zh/model-studio/text-generation-model/) | 百炼推荐 `qwen3.6-plus`，确认效果后可用 `qwen3.6-flash` 降低成本。 |
| 智谱 GLM | [模型概览](https://docs.bigmodel.cn/cn/guide/start/model-overview)、[GLM-5.1](https://docs.bigmodel.cn/cn/guide/models/text/glm-5.1) | `glm-5.1` 是当前旗舰；`glm-4.7-flash` 作为轻量/免费模型示例。 |
| MiniMax | [OpenAI API 兼容](https://platform.minimax.io/docs/api-reference/text-chat)、[获取模型列表](https://platform.minimax.io/docs/api-reference/models/openai/list-models) | 官方 OpenAI-compatible Base URL 为 `https://api.minimax.io/v1`，并列出 `MiniMax-M2.7`、`MiniMax-M2.7-highspeed`。中国区 Coding 工具场景可能使用 `.com`/Anthropic 专用入口，以控制台为准。 |
| 火山方舟 / 豆包 | [在线推理（常规）](https://www.volcengine.com/docs/82379/2121998)、[模型列表](https://www.volcengine.com/docs/82379/1949118) | 官方示例使用 `https://ark.cn-beijing.volces.com/api/v3` 与 `doubao-seed-1-6-251015`；如使用 Coding Plan，请改用其专用 Base URL 和模型名，不要套用本表的在线推理模板。 |
| SiliconFlow | [模型列表](https://docs.siliconflow.cn/quickstart/models)、[获取模型列表 API](https://docs.siliconflow.cn/cn/api-reference/models/get-model-list) | 平台模型实时更新且 `/models` 需要 API Key；模板只给常见新模型示例，保存前建议在 Web 设置页点击「获取模型」确认账号可见性。 |
| OpenRouter | [Models API](https://openrouter.ai/docs/api/api-reference/models/get-models) | OpenRouter 支持 `~anthropic/claude-sonnet-latest`、`~openai/gpt-latest` 等 latest router alias；2026-05-03 的一次手动 live smoke 以 Claude Sonnet latest 作为默认示例通过，GPT latest 保留为可按账号权限切换的备选。 |
| LiteLLM | [OpenAI-Compatible Endpoints](https://docs.litellm.ai/docs/providers/openai_compatible) | OpenAI 兼容端点需要把运行时模型写成 `openai/<model>`，Base URL 只填到服务商兼容入口，不额外拼接 `/chat/completions`。 |

当前仓库锁定 `litellm>=1.80.10,<1.82.7`（见 `requirements.txt`）。本页预设只保证配置形状与当前依赖的 OpenAI-compatible 路由规则一致；实际连通性仍取决于服务商账号权限、地域、额度和模型开通状态。回退方式：在 Web 设置页删除对应渠道，或从 `.env` 移除 `ANSPIRE_LLM_*`、`LLM_ANSPIRE_*`、`LLM_MINIMAX_*` / `LLM_VOLCENGINE_*` 并恢复原 `LITELLM_MODEL`、`LITELLM_FALLBACK_MODELS`。

## GitHub Actions 配置

仓库自带 `.github/workflows/daily_analysis.yml` 只会透传 workflow 中显式列出的环境变量。使用渠道模式时，先在 Repository Variables 或 Secrets 中设置 `LLM_CHANNELS`，再按渠道名补齐对应 `LLM_<CHANNEL>_*`。

| 字段 | 建议位置 | 说明 |
| --- | --- | --- |
| `LLM_CHANNELS` | Variables 或 Secrets | 逗号分隔渠道名，例如 `deepseek,minimax,volcengine`。 |
| `LLM_<CHANNEL>_PROTOCOL` | Variables 或 Secrets | 非敏感，通常为 `openai`、`deepseek`、`gemini`、`anthropic` 或 `ollama`。 |
| `LLM_<CHANNEL>_BASE_URL` | Variables 或 Secrets | 非敏感时优先放 Variables；私有网关地址可放 Secrets。 |
| `LLM_<CHANNEL>_MODELS` | Variables 或 Secrets | 非敏感模型列表，逗号分隔。 |
| `LLM_<CHANNEL>_ENABLED` | Variables 或 Secrets | 可选，未配置时默认启用；设为 `false` 可跳过该渠道。 |
| `LLM_<CHANNEL>_API_KEY` / `LLM_<CHANNEL>_API_KEYS` | Secrets | 密钥字段必须放 Repository Secrets；同名 Variables 不会被 workflow 读取。 |
| `LLM_<CHANNEL>_EXTRA_HEADERS` | Secrets 或 Variables | JSON 字符串；只要包含鉴权、租户、组织或私有网关信息，就应放 Secrets。 |

默认 workflow 已显式映射 `primary`、`secondary`、`aihubmix`、`anspire`、`deepseek`、`dashscope`、`zhipu`、`moonshot`、`minimax`、`volcengine`、`siliconflow`、`openrouter`、`gemini`、`anthropic`、`openai`、`ollama`。如果使用自定义渠道名（如 `my_proxy`），仅在 Repository Secrets / Variables 中新增 `LLM_MY_PROXY_*` 不会自动生效，需要同步扩展 workflow 的 `env:` 映射；本地 `.env`、Docker 和自托管脚本不受这个限制。

Ollama 默认 Base URL `http://127.0.0.1:11434` 主要面向本地、Docker 或能访问该服务的 self-hosted runner。GitHub-hosted runner 通常没有本地 Ollama 服务，直接配置 `LLM_CHANNELS=ollama` 大概率会连接失败。

## 排障要点

- 鉴权失败：检查 API Key 是否填错、复制了空格，或服务商是否要求额外项目权限。
- 空 Key / 逗号空 Key：`API_KEY` 或 `API_KEYS` 逗号分隔后必须至少有一个非空片段；本地 Ollama 或 localhost 兼容服务除外。
- 额度或账单失败：`rate_limit` 通常代表 RPM/TPM/并发限制，`insufficient_balance` 通常代表余额、账单或套餐额度不足。
- 网络失败：`dns_error`、`tls_error`、`connection_refused` 会分别指向域名解析、证书/代理和目标服务端口/进程问题。
- 模型不存在：先在 Web 中点击「获取模型」，若服务商不支持 `/models`，改为手动填写控制台里的模型 ID。
- 模型未授权或前缀不匹配：确认账号是否开通该模型；OpenAI-compatible 渠道中的 HuggingFace-style 模型 ID（如 `Qwen/...`、`deepseek-ai/...`）不等同于 LiteLLM provider 前缀。
- 请求超时：检查 Base URL、代理、防火墙和本地 Ollama 服务是否可达。
- 空响应或格式异常：尝试换用兼容 Chat Completions 的模型，或切换到该服务商推荐的 OpenAI Compatible 入口。
- 运行时能力检测：JSON / tools / stream / vision smoke 必须在 Web 中显式触发，会产生真实 LLM 请求，可能带来 token / 图像输入费用、RPM/TPM 限流、余额不足或超时；检测结果只代表当前账号、模型和 endpoint 的一次 best-effort 运行时结果，不会写回 `.env`，也不会阻止保存配置。
- 能力检测失败不等于 provider 全局不支持：失败可能来自账号权限、模型未开通、endpoint 区域、余额、服务商兼容层或 LiteLLM 转换路径。当前实现未对所有真实 provider 做在线 smoke，兼容依据是 `litellm>=1.80.10,<1.82.7`（见 `requirements.txt`）、[LiteLLM Python SDK / OpenAI I/O format](https://docs.litellm.ai/)、[LiteLLM OpenAI-compatible 路由](https://docs.litellm.ai/docs/providers/openai_compatible)，以及 OpenAI Chat Completions 的 [JSON mode](https://platform.openai.com/docs/guides/structured-outputs?api-mode=chat)、[tool calling](https://platform.openai.com/docs/guides/function-calling?api-mode=chat)、[streaming](https://platform.openai.com/docs/guides/streaming-responses?api-mode=chat) 和 [vision input](https://platform.openai.com/docs/guides/images-vision?api-mode=chat) 请求形状。
- 多渠道 fallback：把备用渠道模型写入 `LITELLM_FALLBACK_MODELS`，单个模型失败时主流程会继续尝试备用模型。
