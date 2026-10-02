---
publishDate: 2026-10-01
updateDate: 2026-10-01
draft: false
title: 'OpenClaw vs Hermes Agent：该怎样比较两类 Agent 运行系统？'
excerpt: '不比功能数量，也不先选赢家。本文沿着控制面、执行位置、状态、权限、隔离和运行证据，比较两种不同的 Agent 运行结构。'
category: 前沿 AI 研究
tags:
  - AI 智能体
  - 开源软件
metadata:
  description: '从控制面与运行拓扑、渠道和设备节点、工具后端、记忆、技能、调度、权限、隔离及运行证据比较 OpenClaw 与 Hermes Agent。'
---

比较 Agent 系统，最容易犯的错是数渠道、工具和模型。真正会改变部署结果的，是消息经过哪些常驻进程，动作最终在哪台机器上执行，状态由谁保存，权限在哪里收紧，以及失败后能否看见、停止和恢复。

OpenClaw 与 Hermes Agent 都把模型接到消息渠道、工具和真实执行环境，但公开文档呈现出两种不同的运行结构：OpenClaw 围绕常驻 Gateway 组织渠道、客户端和设备节点；Hermes Agent 让 CLI、消息 Gateway、ACP、批处理和 API 等入口复用同一个 Agent 核心，再由工具注册表和终端后端决定动作去哪里执行。[3][10][14]

这不是一场“谁更强”的评选。本文把两套系统放进同一张边界图，帮助读者决定先问什么、必须测什么。

## 先画边界，不先看功能表

<div class="comparison-table-scroll" role="region" aria-label="OpenClaw 与 Hermes Agent 技术比较" tabindex="0">
  <table class="comparison-table">
    <thead>
      <tr>
        <th>比较轴</th>
        <th>OpenClaw 的文档重心</th>
        <th>Hermes Agent 的文档重心</th>
        <th>选型时要验证</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>控制面</td>
        <td>单个长期运行的 Gateway 连接渠道、客户端、自动化和节点</td>
        <td>多种入口汇入 <code>AIAgent</code> 核心，Gateway 是其中一个入口</td>
        <td>哪个进程持有路由、会话、凭据和停止权</td>
      </tr>
      <tr>
        <td>动作出口</td>
        <td>Gateway 宿主机、已配对设备节点或 sandbox</td>
        <td>本机、容器、SSH 主机或云端 sandbox 等终端后端</td>
        <td>每个工具最终使用哪台主机、哪个 OS 账户、哪些凭据</td>
      </tr>
      <tr>
        <td>状态</td>
        <td>工作区文件、会话、技能和 Gateway 调度状态</td>
        <td>profile 记忆、SQLite 会话、技能和 cron 状态</td>
        <td>哪些状态跨会话，谁能读取、修改、备份和删除</td>
      </tr>
      <tr>
        <td>隔离</td>
        <td>一个 Gateway 是一个信任域；sandbox 只移动部分工具执行</td>
        <td>profile 与工具策略分层；强隔离依赖容器或远端后端</td>
        <td>配置限制能否被 shell 绕过，OS 和网络边界是否真实存在</td>
      </tr>
      <tr>
        <td>运行证据</td>
        <td>Gateway health、安全审计、sandbox 策略解释</td>
        <td>工具调用、会话、cron、后台进程状态与诊断入口</td>
        <td>能否复现一次失败，定位到入口、会话、工具和执行后端</td>
      </tr>
    </tbody>
  </table>
</div>

这张表只概括文档设计，不证明任何实际部署已经正确配置，也不证明同名功能具有相同安全强度。

## 1. 控制面和运行拓扑

### OpenClaw：Gateway 是网络中心

OpenClaw 把一个长期运行的 Gateway 放在中心。消息渠道、CLI、Web UI、自动化与设备节点连接到它；Gateway 维护渠道连接，并通过带 schema 的 WebSocket API 接收请求和推送事件。远程客户端与节点需要认证和配对。[2][3]

可以把它简化为：

`渠道 / 客户端 → Gateway → Agent 会话 → Gateway 工具、sandbox 或设备节点`

这种结构先回答“一个常驻控制面怎样连接多个入口和设备”。但图中至少有三种不同信任关系：发消息的人、运行 Gateway 的主机、执行动作的节点。把它们统称为“Agent 权限”会掩盖风险。

### Hermes Agent：入口复用 Agent 核心

Hermes Agent 的公开架构把提示词组装、模型 provider、工具分发、上下文压缩和会话持久化放在 `AIAgent` 周围。CLI、消息 Gateway、ACP、批处理和 API 等入口最终调用这套核心；Gateway 会先处理发送者授权和会话定位，再创建带历史的 Agent 并回传结果。[9][10]

可以把它简化为：

`CLI / Gateway / ACP / API → AIAgent → 工具注册表 → 本机、容器或远端后端`

这种结构先回答“同一套 Agent 能力怎样出现在不同入口”。风险也随之变化：不能只看某个工具是否存在，还要看某个 profile、某个平台和某次运行实际加载了哪些工具，终端后端又指向哪里。[14]

两张图的共同要求是：控制面、执行面和状态层必须分开画。某个入口完成了用户认证，不代表下游工具已经最小授权；某个工具进入容器，也不代表控制面和凭据同时进入了容器。

## 2. 渠道、工具与设备节点

OpenClaw 的设备节点是独立的一等对象：节点声明能力和命令，通过 Gateway 与会话协作。于是手机、桌面或远端设备不只是“一个工具”，而是需要单独认证、配对和撤销的动作出口。[3]

Hermes Agent 的公开文档更强调统一工具注册表。终端、文件、浏览器、Web、MCP、记忆、子智能体和定时任务等工具可按环境提供；终端执行可以落在本机、Docker、SSH、Singularity、Modal、Daytona 或 Vercel Sandbox。[14]

这两种抽象不能只按数量横比。更有用的检查是：

1. 一个渠道身份如何映射到会话和 profile；
2. 会话拿到的是工具名，还是某台设备上的具体能力；
3. 设备或后端离线时，任务会失败、重试，还是改在别处执行；
4. 撤销一个用户、节点或凭据后，已有会话是否仍能继续动作；
5. 跨渠道发送、文件上传和浏览器操作是否有独立限制。

## 3. 记忆、技能和调度是三种状态

### 记忆：给模型上下文，不负责授权

OpenClaw 的基础记忆以工作区 Markdown 文件为事实来源，并可叠加关键词与向量检索。其文档明确提醒：记忆可以记录审批背景，但不能执行权限策略。[4]

Hermes Agent 把有字符上限的 `MEMORY.md` 和 `USER.md` 在会话开始时注入提示词，把完整会话存入 SQLite/FTS5 供检索；记忆按 profile 隔离，运行中会话读取的是启动时快照。[10][11]

因此，“记住了”不等于“允许了”，也不等于“这是最新事实”。试点要故意写入错误信息，再测试更正、过期、跨 profile 读取和敏感信息清除。

### 技能：可复用流程，也是供应链依赖

两边都把技能做成带说明和配套文件的可加载知识包。OpenClaw 定义了不同技能来源及覆盖顺序；Hermes Agent 采用按需加载和逐级展开，技能也可以由 Agent 创建或更新。[5][12]

技能会同时复用正确步骤和错误假设。团队应记录来源、版本和修改人，检查技能要求的二进制、环境变量、凭据与工具权限，并在升级后重跑验收任务。把一个技能装进系统，不能视为它已通过安全审查。

### 调度：把有人值守变成无人值守

OpenClaw 由 Gateway scheduler 持久化任务、按时唤醒 Agent，并可把结果投递到聊天渠道、Webhook 或不投递；文档区分主会话、当前会话、隔离会话和自定义会话等执行方式。[6]

Hermes Agent 的 cron 支持一次性和重复任务、附加技能、新 Agent 会话，以及不调用 LLM 的脚本任务。文档还列出模型凭据、技能依赖、投递目标和 MCP 工具等运行前检查，并禁止 cron 递归创建新 cron。[10][13]

调度验收不能停在“准时启动”。还要测试时区、重复执行、超时、并发、凭据失效、人工批准、输出投递和停止开关，并确认重启后不会重复产生副作用。

## 4. 执行位置和权限模型

OpenClaw 的工具可以在 Gateway 宿主机、设备节点或配置的 sandbox 中运行。渠道授权、节点配对、工具策略和 OS 权限是不同层，任何一层放宽都会扩大动作范围。[3][7][8]

Hermes Agent 的 `local` 终端后端使用启动 Hermes 的 OS 用户权限。文件写入保护约束 `write_file` 和 `patch`，却不是 shell 的 OS 能力边界；命令 deny 规则也只是命令策略。需要更强隔离时，文档建议使用受限挂载、凭据和网络的容器或远端后端。[14][15]

所以，“每次危险命令都要批准”仍不足以回答安全问题。批准只是决策点，不是隔离层。真正需要记录的是：

- 哪个身份发起动作；
- 哪个会话选择了哪个工具；
- 工具在哪个 OS 用户、容器或远端账户下执行；
- 能访问哪些文件、套接字、网络和密钥；
- 无人值守时遇到批准请求会拒绝、阻塞还是自动放行；
- 谁能修改这些规则，修改后何时生效。

## 5. 隔离和安全边界

OpenClaw 的安全文档把一个 Gateway 定义为一个信任域，不把同一 Gateway 视为互不信任用户之间的强多租户边界。混合信任场景应拆分 Gateway 和凭据，最好再拆分 OS 用户或主机。其 sandbox 默认关闭，而且主要把工具执行移入隔离后端，Gateway 仍留在宿主机；文档也明确说 sandbox 只能缩小影响范围，不是完美安全边界。[7][8]

Hermes Agent 提供发送者 allowlist、DM 配对、危险命令批准、文件写入保护、profile 隔离与容器后端。不过官方文档同样写明：本地终端与 Hermes 进程使用同一 OS 用户，文件工具的写入保护不约束 shell，命令规则不能替代 OS 隔离。[15]

两边的文档都足以说明“可以配置哪些防护”，却不能证明你的部署已形成强边界。最小验证应同时覆盖入口、工具、宿主、网络、凭据和状态，不能只截图一页配置。

## 6. 可观测性、失败处理和运行证据

OpenClaw 提供 Gateway health、安全审计、sandbox 列表和生效策略解释等操作入口。[3][7][8]

Hermes Agent 的公开架构强调工具调用可见、执行可中断，并为会话、Gateway、cron 和后台进程保存状态；README 还提供 `hermes doctor` 诊断入口。[9][10][14]

这些入口是检查工具，不是可靠性证明。一次合格对照试点至少要留下五组证据：

1. **拒绝证据**：未授权用户、越权文件和越权命令确实被阻止；
2. **定位证据**：一项动作能追到入口身份、会话、工具、后端和时间；
3. **故障证据**：杀掉执行后端、断开节点或撤销凭据后，任务进入可解释状态；
4. **恢复证据**：控制面重启后，会话与调度按设计恢复，不重复副作用；
5. **运营证据**：同一批真实任务的完成率、人工接管、错误类型、运行时间和成本可比较。

如果只能证明配置文件里写了什么，就还没有证明系统运行时会怎样做。

## 两种架构分别帮你先回答什么

OpenClaw 的公开架构适合先追问：一个常驻 Gateway 如何连接多种消息渠道、客户端和设备节点？节点怎样配对、撤销和离线？一个信任域应该在哪里拆开？[3][7]

Hermes Agent 的公开架构适合先追问：多个入口如何复用同一个 Agent 核心？profile、工具、记忆、技能和 cron 怎样组合？同一个任务切换本机、容器和远端执行后，权限与证据怎样变化？[10][14][15]

这只是审查起点，不是适用性结论。团队若主要面对设备协同问题，应把节点生命周期和 Gateway 信任域测深；若主要面对多入口、多工具后端和可编排执行，应把 profile、toolset、后端切换与无人值守策略测深。两种场景都必须做越权和失败测试。

## 为什么选这两个项目

两者最初来自一次严格 GitHub 查询：仓库带有 `ai` topic，stars > 240,000，forks > 50,000。2026-10-01 19:18:33 PDT（UTC-07:00）查询 `topic:ai stars:>240000 forks:>50000` 时，结果只有 OpenClaw 与 Hermes Agent。[1]

这条查询只解释样本来源。star 和 fork 不能证明架构合理、代码安全、部署可靠或适合你的任务，因此本文没有按热度排序，也不据此宣布赢家。

## 利益披露与适用范围

LeoOne 当前使用 Hermes Agent。我们因此更熟悉它的实际操作方式，但本文没有把内部使用经验当作独立证据，也不为任一项目的安全性、性能、适配性或商业价值背书。

本文引用 GitHub API，以及两个项目固定 commit 上的 README、架构、功能与安全文档。它们能支持对公开设计和作者声明的比较，但没有提供独立代码审计、渗透测试、漏洞响应统计、生产故障率、性能基准或单位任务成本，也不能证明文档与所有发行版本完全一致。本文没有部署两套系统做对照实验。

读者应在隔离环境中固定版本，用自己的渠道、模型、插件、权限和数据完成上述测试。只有运行证据符合目标任务和威胁模型，才有继续、调整或停止的依据。

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
