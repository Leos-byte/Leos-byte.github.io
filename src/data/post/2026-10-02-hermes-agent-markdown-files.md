---
publishDate: 2026-10-02
updateDate: 2026-10-02
draft: false
title: 'Hermes Agent 规则没生效？先认清这 5 个 Markdown 文件'
excerpt: 'SOUL.md、USER.md、MEMORY.md、AGENTS.md 和 SKILL.md 各管什么？先找对文件，再判断是否需要新会话。'
category: 前沿 AI 研究
tags:
  - AI 智能体
  - Hermes Agent
  - 工程实践
metadata:
  description: '一份面向 Hermes Agent 用户的 Markdown 文件决策指南：区分身份、用户资料、长期事实、项目规则和可复用技能，并解释规则何时加载。'
---

Hermes Agent 的行为不对，最常见的修复不是继续加提示词，而是先回答两个问题：**这条规则属于谁？当前会话是否已经错过了它的加载时机？**

<section class="article-summary" aria-labelledby="quick-answer-title">
  <p class="article-summary__label">30 秒判断</p>
  <h2 id="quick-answer-title">先按问题选文件</h2>
  <ul>
    <li><strong>说话方式不对：</strong>改 <code>SOUL.md</code>。</li>
    <li><strong>不记得你是谁：</strong>把用户事实写入 <code>USER.md</code>。</li>
    <li><strong>忘了长期环境事实：</strong>写入 <code>MEMORY.md</code>。</li>
    <li><strong>没遵守仓库规范：</strong>检查 <code>AGENTS.md</code>，再排查是否被更高优先级的项目文件遮住。</li>
    <li><strong>不会稳定复用一套做法：</strong>使用或编写 <code>SKILL.md</code>。</li>
  </ul>
</section>

官方文档把这几类文件分得很清楚：`SOUL.md` 定义 Agent 的身份，`USER.md` 保存用户资料，`MEMORY.md` 保存 Agent 学到的长期事实，`AGENTS.md` 写项目要求，`SKILL.md` 则承载按需调用的可复用流程。[1][4]

## 一张表找对文件

<figure class="file-map" aria-labelledby="file-map-title file-map-caption">
  <h3 id="file-map-title">五类文件解决五个不同问题</h3>
  <div class="file-map__scroll" tabindex="0" aria-label="Hermes Agent Markdown 文件对照表，可横向滚动">
    <table>
      <thead>
        <tr>
          <th>文件</th>
          <th>回答的问题</th>
          <th>作用范围</th>
          <th>通常由谁写</th>
          <th>何时加载</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"><code>SOUL.md</code></th>
          <td data-label="回答的问题">Agent 应该是谁，怎样表达？</td>
          <td data-label="作用范围">当前 Hermes 实例</td>
          <td data-label="通常由谁写">使用者或维护者</td>
          <td data-label="何时加载">会话开始时，作为身份</td>
        </tr>
        <tr>
          <th scope="row"><code>USER.md</code></th>
          <td data-label="回答的问题">正在服务的用户是谁？</td>
          <td data-label="作用范围">当前 profile 的用户资料</td>
          <td data-label="通常由谁写">Agent 通过 memory 工具维护；用户可审核</td>
          <td data-label="何时加载">会话开始时的冻结快照</td>
        </tr>
        <tr>
          <th scope="row"><code>MEMORY.md</code></th>
          <td data-label="回答的问题">哪些长期事实值得一直带着？</td>
          <td data-label="作用范围">当前 profile 的长期笔记</td>
          <td data-label="通常由谁写">Agent 通过 memory 工具维护</td>
          <td data-label="何时加载">会话开始时的冻结快照</td>
        </tr>
        <tr>
          <th scope="row"><code>AGENTS.md</code></th>
          <td data-label="回答的问题">这个项目怎样工作？</td>
          <td data-label="作用范围">仓库及对应目录</td>
          <td data-label="通常由谁写">项目维护者</td>
          <td data-label="何时加载">启动时加载目录链；进入子目录时继续发现</td>
        </tr>
        <tr>
          <th scope="row"><code>SKILL.md</code></th>
          <td data-label="回答的问题">一类任务怎样稳定完成？</td>
          <td data-label="作用范围">安装了该技能的 Hermes 环境</td>
          <td data-label="通常由谁写">技能作者、使用者或 Agent</td>
          <td data-label="何时加载">会话先拿索引；需要时再载入全文</td>
        </tr>
      </tbody>
    </table>
  </div>
  <figcaption id="file-map-caption">“写入磁盘”和“进入当前提示词”是两件事。下文解释何时必须新开会话。</figcaption>
</figure>

## 1. SOUL.md：改 Agent 的身份，不要塞项目说明

`SOUL.md` 管人格、语气、表达习惯和应避免的风格。它来自当前 Hermes 实例的 `HERMES_HOME`，不会从项目工作目录寻找；有内容时，它进入系统提示词的第一个身份位置。[5]

适合写：

```md
# Communication

- 回答直接，先给结论
- 不确定时明确说“不确定”
- 不使用夸张口号
```

不适合写“本仓库使用 pnpm”“发布前运行某条测试命令”。这些规则只属于项目，应放进 `AGENTS.md`。官方给出的判断也很直接：需要跟随 Agent 到处生效的身份要求放 `SOUL.md`；属于某个项目的要求放 `AGENTS.md`。[5]

## 2. USER.md：记录用户是谁

`USER.md` 是用户资料，不是 Agent 人格。姓名、角色、沟通偏好和长期期待属于这里。内置记忆启用时，Agent 通过 `memory` 工具维护它；部署也可以配置写入审批，或关闭某个内置记忆目标。[1][3]

适合写：

```md
用户负责后端平台，偏好简短答复。
代码建议需要给出可复现的验证命令。
```

不要把密码、API key、临时验证码或完整客户资料写进任何这类 Markdown 文件。它们会进入提示词，不是凭据保险箱。

## 3. MEMORY.md：保存长期事实，不保存任务流水账

`MEMORY.md` 保存 Agent 值得跨会话带走的环境事实、稳定约定和工具注意事项。它不是聊天记录，也不适合堆日志、临时路径和一次性进度。[3]

适合写：

```md
项目统一使用 UTC 保存服务端时间。
测试环境不允许访问生产数据库。
```

一个简单区别：**“用户偏好简短回答”属于 `USER.md`；“这个环境使用哪套稳定约定”属于 `MEMORY.md`。** 两者都按 profile 隔离，也都在会话开始时注入冻结快照。[3]

## 4. AGENTS.md：写项目规则，还要看 Agent 走到了哪里

`AGENTS.md` 是项目说明。可写架构、目录、命令、端口、编码约定、测试方法和发布注意事项。它不定义 Agent 的通用人格。[2]

```md
# Project rules

- 前端使用 pnpm，不要混用 npm
- 修改 API 后运行 pnpm test
- 组件放在 src/components/
```

### 启动时：从仓库根目录合并到当前工作目录

当工作目录位于 Git 仓库内，Hermes 会在会话开始时读取从仓库根目录到当前工作目录沿途的 `AGENTS.md`。更深目录的内容排在后面，因此更具体的规则可以覆盖上层规则；相同副本会去重。[2]

例如会话从 `project/frontend/` 启动：

```text
project/
├── AGENTS.md           ← 先加载：全仓规则
└── frontend/
    ├── AGENTS.md       ← 后加载：前端规则
    └── src/
        └── AGENTS.md   ← 尚未加载
```

### 运行中：进入子目录时渐进发现

如果 Agent 之后读取 `frontend/src/Button.tsx`，Hermes 会检查相关目录，并在此时把 `frontend/src/AGENTS.md` 注入对话。每个子目录在一个会话中最多检查一次；读取更深文件时，也会向上寻找尚未访问的相关目录。[2]

这不等于“`AGENTS.md` 会实时热更新”。启动时已经加载的项目上下文是当前会话的快照；某个子目录文件被发现并注入后，也不应假设后续编辑会自动刷新。修改规则后，新开会话是最可靠的验证方式。[1][2]

### 一个容易漏掉的优先级例外

如果项目中存在 `.hermes.md` 或 `HERMES.md`，它们是 Hermes 专用、最高优先级的项目上下文。当前文档给出的完整优先顺序是 `.hermes.md` / `HERMES.md` → `AGENTS.override.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`，每个会话只选择第一个匹配的项目上下文类型；`SOUL.md` 独立加载，不参与这条竞争。[2]

所以，“我改了 `AGENTS.md` 但没生效”时，先查两件事：会话是不是早已启动，以及更高优先级的项目文件是否已经遮住它。

## 5. SKILL.md：保存一类任务的做法，不是常驻项目规则

`SKILL.md` 是按需加载的工作方法。适合写一个可复用任务的步骤、命令、工具调用、输出格式和常见坑，例如“怎样做依赖升级”“怎样发布 Python 包”。Hermes 把它当作程序性知识，而不是每轮都常驻的项目说明。[4]

技能采用渐进加载：会话开始时只提供技能名称、描述和分类等紧凑索引；Agent 判断需要某个技能时，才加载对应 `SKILL.md`；更大的参考文件再按需单独读取。[4][7]

因此，不要把“本仓库每次提交前必须运行测试”只写进某个技能。技能如果没有被触发，这条规则就不会进入上下文。项目的常驻要求仍应写在 `AGENTS.md`。

新安装的技能默认对新会话生效。官方文档也提供 `--now` 立即让当前会话的技能索引失效并重建，但这会让下一轮多花一些 token；最容易理解和验证的做法仍是开启新会话。[7]

## 关键时机：文件已经改了，不等于当前会话已经变了

`SOUL.md`、`USER.md`、`MEMORY.md` 和启动时项目上下文都会在会话开始时进入提示词。会话运行后再编辑，写入本身可以已经成功，但系统提示词不会因此原地刷新。[1][3]

尤其是 `USER.md` 和 `MEMORY.md`：记忆工具在当前会话中写入后，内容会立即持久化；工具结果也会显示最新状态。但系统提示词里仍是会话开始时的冻结快照，直到下一个会话才重新读取。[3]

| 发生的变化                          | 当前会话               | 最稳妥的动作             |
| ----------------------------------- | ---------------------- | ------------------------ |
| 修改 `SOUL.md`                      | 身份快照不刷新         | `/new` 或新的 CLI 会话   |
| 写入 `USER.md` / `MEMORY.md`        | 文件已保存，旧快照仍在 | `/new`                   |
| 修改启动时已加载的 `AGENTS.md`      | 项目快照不刷新         | 从正确目录新开会话       |
| 首次进入含嵌套 `AGENTS.md` 的子目录 | 可在运行中渐进注入     | 检查它是否已被发现       |
| 新安装 `SKILL.md`                   | 默认不进入现有技能索引 | 新会话；必要时用 `--now` |

注意：重启机器或 Gateway 不一定产生新会话。Gateway 对话会跨重启继续，只有 `/new` 或 `/reset` 才建立明确的新会话边界。[6] `/compress` 也不是这里的替代方案；它压缩对话上下文，不等于重新读取所有启动文件。

## 一套安全的排查顺序

当规则没有生效，按下面顺序检查：

1. **先分类。** 身份、用户资料、长期事实、项目规则还是任务方法？
2. **再查范围。** 当前 profile、`HERMES_HOME`、工作目录和技能安装位置是否正确？不同部署和 profile 的实际路径可以不同，不要照抄别人的私有目录。
3. **查项目优先级。** 是否有 `.hermes.md`、`HERMES.md` 或 `AGENTS.override.md` 抢先匹配？
4. **查加载时机。** 当前会话启动前，这个文件是否已经存在？嵌套 `AGENTS.md` 所在目录是否真的被访问？
5. **建立新边界。** 用 `/new` 或新的 CLI 会话重新加载，再用一个小任务验证。
6. **仍有问题时看上下文。** 当前版本的 `/context` 可帮助检查哪些上下文文件已加载、被截断、被遮住或被安全扫描阻断；不要只凭 Agent 的口头回答猜测。[2]

## 最后只记住一句话

**身份放 `SOUL.md`，用户资料放 `USER.md`，长期事实放 `MEMORY.md`，项目规则放 `AGENTS.md`，可复用流程放 `SKILL.md`。**

然后再问：这份内容是在会话开始时加载，还是在需要时才发现？前者改完通常要新开会话；后者也要确认它是否真的被触发。

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what — Which File Does What? | Hermes Agent
[2] https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files — Context Files | Hermes Agent
[3] https://hermes-agent.nousresearch.com/docs/user-guide/features/memory — Persistent Memory | Hermes Agent
[4] https://hermes-agent.nousresearch.com/docs/user-guide/features/skills — Skills System | Hermes Agent
[5] https://hermes-agent.nousresearch.com/docs/user-guide/features/personality — Personality & SOUL.md | Hermes Agent
[6] https://hermes-agent.nousresearch.com/docs/user-guide/sessions — Sessions | Hermes Agent
[7] https://hermes-agent.nousresearch.com/docs/guides/work-with-skills — Working with Skills | Hermes Agent
