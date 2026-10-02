---
publishDate: 2026-10-01
updateDate: 2026-10-01
draft: false
title: '跨过两道 GitHub 门槛的 AI 项目'
excerpt: '严格筛选后只有 OpenClaw 与 Hermes Agent。本文不按热度排座次，而是拆开它们的控制面、执行面、状态、权限和隔离边界。'
category: 前沿 AI 研究
tags:
  - AI 智能体
  - 开源软件
metadata:
  description: '按 GitHub 的 ai 主题、星标超过 24 万、fork 超过 5 万严格筛选，从控制面、宿主执行、记忆、技能、调度、权限和隔离分析 OpenClaw 与 Hermes Agent。'
---

先给结论：这次筛选找到的不是两套“最强 AI”，而是两个把模型接入真实渠道、工具和执行环境的智能体运行系统。真正决定能否部署的，不是 star 或 fork，而是控制面怎么组织、动作在哪里执行、状态如何保存、权限在哪里收口，以及出错后能否停下和复盘。

本文采用严格交集：仓库带有 `ai` topic，stars > 240,000，并且 forks > 50,000。2026-10-01 19:18:33 PDT（UTC-07:00）调用 GitHub REST API 查询 `topic:ai stars:>240000 forks:>50000`，返回总数为 2。[1]

## 筛选快照：只有两个项目

| 仓库                                                                      | `ai` topic |   stars |  forks | 纳入 |
| ------------------------------------------------------------------------- | ---------- | ------: | -----: | ---- |
| [openclaw/openclaw](https://github.com/openclaw/openclaw)                 | 有         | 391,168 | 82,236 | 是   |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | 有         | 250,620 | 53,649 | 是   |

两行都同时满足三项条件；本文也只分析这两个项目。这个快照只能复现当时的 GitHub 索引结果，数字会继续变化。[1]

star 表示有人点过收藏，fork 表示仓库被复制到另一个命名空间。它们可以提示项目受到大量关注，但不能证明架构合理、代码安全、部署可靠、维护活跃，也不能证明某个 fork 真正在生产中运行。下面的技术判断只依据项目在对应 commit 上的公开文档，不把热度换算成质量分。

## 利益披露

LeoOne 当前使用 Hermes Agent。本文因此可能更熟悉 Hermes Agent 的操作方式，但不会把内部使用关系当作独立证据。对两边的功能和安全描述都引用公开的一手文档；本文不为任一项目的安全性、性能、适配性或商业价值背书。

## 先看运行时：谁接消息，谁调工具

### OpenClaw：Gateway 是常驻控制面

OpenClaw 把单个长期运行的 Gateway 放在中心。消息渠道、CLI、Web UI、自动化和设备节点都连接到它；Gateway 维护渠道连接，通过带 schema 的 WebSocket API 接收请求和推送事件。设备节点声明自己的能力和命令，远程客户端与节点需要认证和配对。[2][3]

这个形状很清楚：Gateway 是控制面，负责会话、路由、身份、事件和调度；工具可能在 Gateway 宿主机、设备节点或已配置的 sandbox 中执行。工程上要单独画出三条链：

1. 消息从哪个渠道进入，如何映射到会话；
2. 模型能看到哪些上下文和工具；
3. 每个工具最终在哪台主机、哪个账户、哪个隔离环境里执行。

只看“支持 WhatsApp、Telegram、Slack、Discord 等渠道”不够。渠道数量描述的是入口，不是权限边界。真正要核验的是陌生发送者策略、群聊触发条件、节点配对、Gateway 暴露地址，以及跨会话或跨渠道发送是否受限。[2][7]

### Hermes Agent：多个入口汇入同一个 Agent 核心

Hermes Agent 的 CLI、消息 Gateway、ACP、批处理和 API 入口最终汇入同一个 `AIAgent` 执行核心。公开架构把提示词组装、模型 provider 解析、工具分发、上下文压缩和会话持久化放在这一核心周围；Gateway 收到平台事件后先做用户授权和会话定位，再创建带历史的 Agent，运行后通过适配器回传结果。[9][10]

它的工具注册表覆盖终端、文件、浏览器、Web、MCP、记忆、子智能体和定时任务等类别，并允许按平台启用不同 toolset。终端后端可以是本机、Docker、SSH、Singularity、Modal、Daytona 或 Vercel Sandbox。[14]

因此，Hermes Agent 的关键问题不是“工具多不多”，而是某个 profile、某个渠道、某次运行实际拿到了哪些工具，以及终端后端指向哪里。`local` 后端意味着命令使用启动 Hermes 的 OS 用户权限在宿主机执行；切到容器或远端后端，才改变执行边界。[14][15]

## 状态层：记忆、技能和定时任务不是一回事

### 记忆

OpenClaw 的基础记忆以工作区 Markdown 文件为事实来源，长期记忆、用户信息和每日记录分层保存；检索可以再叠加关键词与向量搜索。文档明确提醒：记忆可以保存审批背景，但不能执行权限策略。[4]

Hermes Agent 把有字符上限的 `MEMORY.md` 和 `USER.md` 在会话开始时注入提示词，并把完整会话放进 SQLite/FTS5 供按需检索。记忆按 profile 隔离；正在运行的会话读取的是启动时快照，新写入内容要到新会话才进入系统提示词。[10][11]

两者都说明一个容易被忽略的事实：记忆首先是上下文管理，不是授权系统，也不是可靠数据库。团队需要测试错误记忆如何更正、敏感信息是否会被写入、不同用户或 profile 是否串线，以及长时间运行后检索能否找到正确版本。

### 技能

两边都把技能做成带说明和配套文件的可加载知识包。OpenClaw 按 workspace、项目、个人、托管目录等来源加载并定义覆盖顺序；Hermes Agent 采用按需加载和逐级展开，技能也可以由 Agent 创建或更新。[5][12]

技能能复用流程，也会把流程中的错误、过期命令和不安全假设一起复用。要把技能当成可执行依赖管理：记录来源与版本，限制谁能安装或修改，检查它要求的二进制、环境变量和工具权限，并在升级后重新跑验收任务。

### 调度

OpenClaw 的自动化由 Gateway scheduler 持久化任务、按时唤醒 Agent，并把结果投递到聊天渠道、Webhook 或不投递；其文档还区分主会话、当前会话、隔离会话和自定义会话等执行方式。[6]

Hermes Agent 的 cron 可以创建一次性或重复任务、附加技能、在新 Agent 会话中运行，也支持不调用 LLM 的脚本任务。文档列出了运行前对模型凭据、技能依赖、投递目标和 MCP 工具的检查，并禁止 cron 运行递归创建新 cron。[10][13]

调度把“用户正在看着”变成“无人值守”。上线前至少要验证时区、重复执行、超时、失败重试、并发上限、凭据失效、输出投递和停止开关。能按时启动不等于任务正确完成；必须保留 run 状态、错误和实际投递结果。

## 威胁边界：默认执行位置比功能列表重要

OpenClaw 的安全文档把一个 Gateway 定义为一个信任域，不把同一 Gateway 当作互不信任用户之间的强多租户边界；混合信任场景应拆分 Gateway、凭据，最好再拆分 OS 用户或主机。[7] 它的 sandbox 默认关闭，而且只把工具执行移入隔离后端，Gateway 本身仍留在宿主机。文档同时说明 sandbox 只能缩小影响范围，不是完美安全边界。[8]

Hermes Agent 提供发送者 allowlist/DM 配对、危险命令审批、文件写入保护、容器后端和 profile 隔离。但官方文档也明确写明：本地终端与 Hermes 进程使用同一 OS 用户；文件写入保护不约束 shell；命令 deny 规则不是 OS 能力隔离。需要强隔离时，应使用受限挂载、凭据和网络的容器或远端后端。[14][15]

这意味着两边都不能靠“有审批”或“有 sandbox 选项”直接得出安全结论。工程审查应逐项确认：

- 入口：谁能发消息，群聊和 Webhook 如何认证；
- 工具：每个会话实际允许哪些读、写、执行和外发动作；
- 宿主：Agent 进程的 OS 用户能访问哪些文件、套接字和凭据；
- 隔离：隔离是否默认开启，挂载和网络是否过宽，是否存在绕回宿主的逃生路径；
- 批准：哪些动作必须人工批准，无人值守任务遇到批准时是拒绝、阻塞还是自动放行；
- 状态：记忆、会话、日志和密钥分别落在哪里，备份和删除如何完成。

## 运行验证：不要停在配置文件

OpenClaw 暴露 Gateway health、`security audit`、sandbox 列表和生效策略解释等操作入口。[3][7][8]

Hermes Agent 的架构强调工具调用可见、执行可中断，并为 Gateway、cron、后台进程和会话提供状态记录；README 也提供 `hermes doctor` 作为诊断入口。[9][10][14]

这些入口只能帮助检查，不会自动证明部署正确。一次合格试点应留下可复查证据：

1. 用未授权账户触发消息，确认被拒绝或进入预期配对流程；
2. 请求一个越权文件或命令，确认工具层和 OS 层都阻止；
3. 中断工具、杀掉执行后端或撤销凭据，确认任务进入可解释的失败状态；
4. 重启 Gateway，确认会话、任务和调度按设计恢复，而不是重复执行副作用；
5. 对一次真实任务记录完成率、人工接管、错误类型、运行时间和成本。

如果这些测试没有跑过，“配置了权限”“支持隔离”“具备长期记忆”都只是配置意图，不是运行证据。

## 两个项目分别适合回答什么问题

OpenClaw 的公开架构更适合从“一个 Gateway 如何连接多种消息渠道、客户端和设备节点”开始审查。Hermes Agent 的公开架构更适合从“多个入口如何共用 Agent 核心、工具注册表、profile、记忆、技能、cron 和多种终端后端”开始审查。[3][10]

这不是二选一结论。两者都跨越了模型 API 与真实系统之间的边界，也都可能在宿主机上执行高权限动作。选型应从目标任务和威胁模型倒推控制面、执行面与状态层，而不是从 GitHub 排名正推技术结论。

## 这些来源没有证明什么

本文使用的是 GitHub API 返回值和项目自己的 README、架构及安全文档。它们没有提供独立代码审计、渗透测试结果、漏洞响应统计、生产故障率、延迟与吞吐基准、单位任务成本，也没有证明文档与所有发行版本完全一致。本文也没有部署两套系统做对照实验。

所以，可确认的是公开设计和作者声明；仍未知的是特定版本在你的主机、渠道、模型、插件、权限和数据条件下是否安全可靠。下一步不是看更多 star，而是在隔离环境中固定版本、收紧权限、运行失败注入和越权测试，再决定继续、调整或停止。

## Sources

[1] https://api.github.com/search/repositories?q=topic%3Aai%20stars%3A%3E240000%20forks%3A%3E50000&sort=stars&order=desc&per_page=100
[2] https://github.com/openclaw/openclaw/blob/97a691943636a55b19c5d669fefd44f457673ce3/README.md
[3] https://github.com/openclaw/openclaw/blob/97a691943636a55b19c5d669fefd44f457673ce3/docs/concepts/architecture.md
[4] https://github.com/openclaw/openclaw/blob/97a691943636a55b19c5d669fefd44f457673ce3/docs/concepts/memory.md
[5] https://github.com/openclaw/openclaw/blob/97a691943636a55b19c5d669fefd44f457673ce3/docs/tools/skills.md
[6] https://github.com/openclaw/openclaw/blob/97a691943636a55b19c5d669fefd44f457673ce3/docs/automation/cron-jobs.md
[7] https://github.com/openclaw/openclaw/blob/97a691943636a55b19c5d669fefd44f457673ce3/docs/gateway/security/index.md
[8] https://github.com/openclaw/openclaw/blob/97a691943636a55b19c5d669fefd44f457673ce3/docs/gateway/sandboxing.md
[9] https://github.com/NousResearch/hermes-agent/blob/be5e9f72c6681af9dfb75bf480f08844f1499949/README.md
[10] https://github.com/NousResearch/hermes-agent/blob/be5e9f72c6681af9dfb75bf480f08844f1499949/website/docs/developer-guide/architecture.md
[11] https://github.com/NousResearch/hermes-agent/blob/be5e9f72c6681af9dfb75bf480f08844f1499949/website/docs/user-guide/features/memory.md
[12] https://github.com/NousResearch/hermes-agent/blob/be5e9f72c6681af9dfb75bf480f08844f1499949/website/docs/user-guide/features/skills.md
[13] https://github.com/NousResearch/hermes-agent/blob/be5e9f72c6681af9dfb75bf480f08844f1499949/website/docs/user-guide/features/cron.md
[14] https://github.com/NousResearch/hermes-agent/blob/be5e9f72c6681af9dfb75bf480f08844f1499949/website/docs/user-guide/features/tools.md
[15] https://github.com/NousResearch/hermes-agent/blob/be5e9f72c6681af9dfb75bf480f08844f1499949/website/docs/user-guide/security.md
