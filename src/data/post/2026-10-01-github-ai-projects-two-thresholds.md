---
publishDate: 2026-10-01
updateDate: 2026-10-02
draft: false
title: 'OpenClaw vs Hermes Agent：架构怎么选'
excerpt: 'OpenClaw 以 Gateway 连接渠道和设备；Hermes 让多种入口复用 Agent 核心。先看两张图，再用五项测试验证。'
category: 前沿 AI 研究
tags:
  - AI 智能体
  - 开源软件
metadata:
  description: '用架构图、选型路径和五项运行测试，比较 OpenClaw 与 Hermes Agent 的控制面、执行位置、状态、权限和隔离。'
---

如果你正在两者之间选型，先别数功能。先回答一个问题：**你要解决的是多渠道与设备连接，还是多入口与多种执行后端？**

<section class="article-summary" aria-labelledby="quick-answer-title">
  <p class="article-summary__label">30 秒结论</p>
  <h2 id="quick-answer-title">先按核心问题选择试点起点</h2>
  <ul>
    <li><strong>重点是渠道、客户端和设备节点：</strong>可先试 OpenClaw，重点验证 Gateway 信任域、节点配对与撤销。</li>
    <li><strong>重点是 CLI、消息、API 共用一套 Agent 能力：</strong>可先试 Hermes Agent，重点验证 profile、工具集和执行后端。</li>
    <li><strong>还不能判断：</strong>让两套系统执行同一批任务。比较拒绝、追踪、故障、恢复和运营数据，不凭功能表决定。</li>
  </ul>
</section>

公开文档显示，OpenClaw 围绕常驻 Gateway 组织渠道、客户端和设备节点；Hermes Agent 让 CLI、消息 Gateway、ACP、批处理和 API 等入口复用同一个 Agent 核心，再由工具注册表和终端后端决定动作去哪里执行。[3][10][14]

这是根据公开文档中的架构重心给出的**启发式试点顺序**，不是适配性证明或赢家结论。两套系统的能力有重叠，最终选择必须由同任务试点数据决定。本文没有部署两套系统做对照实验。

## 一张图看懂架构差异

<figure class="architecture-map" aria-labelledby="architecture-map-title architecture-map-caption">
  <h3 id="architecture-map-title">消息如何到达真实执行环境</h3>
  <div class="architecture-map__grid">
    <section class="architecture-lane architecture-lane--openclaw" aria-label="OpenClaw 的 Gateway 中心结构">
      <h4>OpenClaw</h4>
      <p class="architecture-lane__focus">Gateway 是网络中心</p>
      <ol class="architecture-flow">
        <li><span>入口</span><strong>渠道 · CLI · Web UI</strong></li>
        <li><span>控制面</span><strong>常驻 Gateway</strong></li>
        <li><span>会话</span><strong>Agent 会话</strong></li>
        <li><span>执行</span><strong>宿主工具 · sandbox · 设备节点</strong></li>
      </ol>
      <p class="architecture-lane__question">先问：Gateway 管了谁？节点如何配对、撤销和离线？</p>
    </section>
    <section class="architecture-lane architecture-lane--hermes" aria-label="Hermes Agent 的 Agent 核心结构">
      <h4>Hermes Agent</h4>
      <p class="architecture-lane__focus">Agent 核心被多个入口复用</p>
      <ol class="architecture-flow">
        <li><span>入口</span><strong>CLI · Gateway · ACP · API</strong></li>
        <li><span>核心</span><strong>AIAgent</strong></li>
        <li><span>分发</span><strong>工具注册表</strong></li>
        <li><span>执行</span><strong>本机 · 容器 · SSH · 云端 sandbox</strong></li>
      </ol>
      <p class="architecture-lane__question">先问：本次运行加载了什么？终端后端实际指向哪里？</p>
    </section>
  </div>
  <figcaption id="architecture-map-caption">图中只表示公开文档的结构重心。入口认证、工具授权、OS 权限和隔离仍是不同边界。[2][3][9][10][14]</figcaption>
</figure>

OpenClaw 先回答“一个常驻控制面怎样连接多个入口和设备”。Hermes Agent 先回答“同一套 Agent 能力怎样出现在不同入口”。

无论选哪一个，都要把**控制面、执行面和状态层**分开检查。入口完成用户认证，不代表下游工具已经最小授权；工具进入容器，也不代表控制面和凭据同时被隔离。

## 用这张检查图决定下一步

<figure class="decision-map" aria-labelledby="decision-map-title decision-map-caption">
  <h3 id="decision-map-title">从问题到证据，只走三步</h3>
  <ol class="decision-steps">
    <li>
      <span class="decision-steps__number">1</span>
      <div><strong>选试点起点</strong><p>按文档重心初筛：设备协同可先看 OpenClaw；多入口、多后端可先看 Hermes。</p></div>
    </li>
    <li>
      <span class="decision-steps__number">2</span>
      <div><strong>画清动作边界</strong><p>标出身份、会话、工具、OS 账户、主机、网络和凭据。</p></div>
    </li>
    <li>
      <span class="decision-steps__number">3</span>
      <div><strong>收集五类证据</strong><p>拒绝 · 追踪 · 故障 · 恢复 · 运营。</p></div>
    </li>
  </ol>
  <div class="validation-grid" role="list" aria-label="试点必须通过的五项测试">
    <section role="listitem"><strong>拒绝</strong><span>越权动作确实被阻止</span></section>
    <section role="listitem"><strong>追踪</strong><span>动作能追到入口、会话、工具和后端</span></section>
    <section role="listitem"><strong>故障</strong><span>断开节点或撤销凭据后状态可解释</span></section>
    <section role="listitem"><strong>恢复</strong><span>重启后不重复产生副作用</span></section>
    <section role="listitem"><strong>运营</strong><span>完成率、接管、耗时和成本可比较</span></section>
  </div>
  <figcaption id="decision-map-caption">只看到配置，不算通过。每项都要留下实际运行证据。</figcaption>
</figure>

> **利益披露：**LeoOne 当前使用 Hermes Agent，因此更熟悉它的实际操作方式。本文只以固定版本的公开文档支持架构比较，不把内部经验当作独立证据，也不为任一项目背书。完整适用范围见文末。

**只负责初筛的读者可以读到这里；做最终选型前仍应完成同任务试点。**下面是给实施和安全审查人员的细节。

## 实施审查：盯住四个边界

OpenClaw 把设备节点当作一等对象。节点声明能力和命令，通过 Gateway 与会话协作，因此每个手机、桌面或远端设备都要单独认证、配对和撤销。[3]

Hermes Agent 更强调统一工具注册表。终端、文件、浏览器、Web、MCP、记忆、子智能体和定时任务等工具按环境提供；终端可落在本机、容器、SSH 或云端 sandbox。[14]

对每个真实任务，画出四条线：

1. **身份线：**谁从哪个入口发起动作，身份怎样映射到会话和 profile；
2. **工具线：**会话选中了哪个工具、设备能力或执行后端；
3. **权限线：**动作使用哪个 OS 用户、主机、网络和凭据；
4. **撤销线：**撤销用户、节点或凭据后，已有会话能否继续。

## 记忆、技能和调度要分开测

- **记忆：**OpenClaw 以工作区 Markdown 文件作为基础事实来源，也可叠加检索；其文档明确说记忆不能执行权限策略。[4] Hermes Agent 在会话开始时注入 `MEMORY.md` 和 `USER.md`，用 SQLite/FTS5 保存会话，记忆按 profile 隔离。[10][11] 测试错误更正、过期、跨 profile 读取和敏感信息清除。
- **技能：**两边都把技能做成可加载的知识包。OpenClaw 定义来源与覆盖顺序；Hermes Agent 按需加载，也允许 Agent 创建或更新技能。[5][12] 记录来源、版本、修改人、二进制、环境变量和凭据。安装成功不等于安全审查通过。
- **调度：**OpenClaw 由 Gateway scheduler 持久化任务并投递结果。[6] Hermes Agent 的 cron 支持一次性、重复、新 Agent 会话和无 LLM 脚本任务。[10][13] 测试时区、重复执行、超时、并发、批准、投递、停止和重启恢复。

## 权限配置不能代替隔离

OpenClaw 的工具可在 Gateway 宿主机、设备节点或 sandbox 中运行。渠道授权、节点配对、工具策略和 OS 权限是不同层。[3][7][8]

一个 OpenClaw Gateway 是一个信任域，不是互不信任用户之间的强多租户边界。混合信任场景应拆分 Gateway、凭据和 OS 用户或主机。sandbox 默认关闭，且主要隔离工具执行；Gateway 仍在宿主机。[7][8]

Hermes Agent 的 `local` 终端后端使用启动 Hermes 的 OS 用户权限。文件写入保护不约束 shell，命令规则也不能替代 OS 隔离。强边界需要受限挂载、凭据和网络的容器或远端后端。[14][15]

批准提示只是决策点，不是隔离层。无人值守时，还要明确批准请求会拒绝、阻塞还是自动放行。

## 验收只看运行证据

OpenClaw 提供 Gateway health、安全审计和 sandbox 策略解释等入口。[3][7][8] Hermes Agent 让工具调用可见、执行可中断，并保存会话、Gateway、cron 和后台进程状态；README 还提供 `hermes doctor`。[9][10][14]

这些入口不是可靠性证明。对照试点至少保存：

- **拒绝证据：**越权用户、文件和命令被阻止；
- **追踪证据：**动作能追到入口、会话、工具、后端和时间；
- **故障证据：**断开节点或撤销凭据后，任务状态可解释；
- **恢复证据：**控制面重启后按设计恢复，不重复副作用；
- **运营证据：**同批任务的完成率、接管、错误、耗时和成本可比较。

固定版本，在隔离环境中运行同一批任务。再用这五类证据决定继续、调整或停止。

## 为什么比较这两个项目

两者来自一次严格 GitHub 查询：仓库带有 `ai` topic，stars > 240,000，forks > 50,000。2026-10-01 19:18:33 PDT（UTC-07:00）执行 `topic:ai stars:>240000 forks:>50000` 时，结果只有 OpenClaw 与 Hermes Agent。[1]

这只解释样本来源。star 和 fork 不能证明架构合理、代码安全、部署可靠或适合你的任务。

## 利益披露与适用范围

LeoOne 当前使用 Hermes Agent。我们更熟悉它的实际操作方式，但本文没有把内部使用经验当作独立证据，也不为任一项目的安全性、性能、适配性或商业价值背书。

本文引用 GitHub API，以及两个项目固定 commit 上的 README、架构、功能与安全文档。它们能支持对公开设计和作者声明的比较，但没有提供独立代码审计、渗透测试、漏洞响应统计、生产故障率、性能基准或单位任务成本，也不能证明文档与所有发行版本完全一致。

读者应在隔离环境中固定版本，用自己的渠道、模型、插件、权限和数据完成测试。只有运行证据符合目标任务和威胁模型，才有继续、调整或停止的依据。

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
