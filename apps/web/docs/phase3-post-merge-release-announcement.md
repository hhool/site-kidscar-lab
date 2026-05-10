# Phase 3 Post-Merge Release Announcement Final

Use these messages directly in team channels after PR merge.

## 1) Merge Completed

【合并完成】
Phase 3 Content Admin PR 已合并到 main。

本次交付包含：
1. 内容后台 save/history/rollback 全流程
2. requestId 端到端追踪与复制
3. reviewer allowlist 回滚控制
4. 发布执行与值守文档全套

下一步：按发布执行单进入发布窗口。

## 2) Release Start

【发布开始】
Phase 3 Content Admin 发布已开始，时间：{time_start}

执行中：
1. 部署 main 最新版本
2. 后台保存与 requestId 过滤校验
3. 核心页面烟雾检查

预计完成：{time_eta}

## 3) Release Success

【发布完成】
Phase 3 Content Admin 发布完成，时间：{time_done}

结果：
- 部署：成功
- Save requestId：{save_request_id}
- history requestId 过滤：通过
- 核心页面烟雾：通过
- sitemap：通过

发布后进入观察窗口至：{time_observe_end}

## 4) Incident Alert

【发布异常告警】
当前发现异常：{issue_summary}
发现时间：{time_now}
影响范围：{impact_scope}

已执行：{mitigation_action}
下一步：{next_action_eta}

如达到回退触发条件将立即执行回退并同步。

## 5) Rollback Executed

【已执行回退】
已触发回退，时间：{time_now}

触发原因：{rollback_trigger}
回退结果：
- rollback requestId：{rollback_request_id}
- history 回退记录核验：通过/进行中
- 核心页面复测：通过/进行中

后续将输出事故简报与根因分析。

## 6) Observation Complete

【观察结束】
发布后观察窗口已结束，系统运行稳定。

结论：
- 无持续性错误率抬升
- 内容后台关键链路可用
- 前台核心页面与 sitemap 正常

本次发布闭环完成。

## 7) Placeholders

- {time_start}
- {time_eta}
- {time_done}
- {time_observe_end}
- {time_now}
- {save_request_id}
- {rollback_request_id}
- {issue_summary}
- {impact_scope}
- {mitigation_action}
- {next_action_eta}
- {rollback_trigger}
