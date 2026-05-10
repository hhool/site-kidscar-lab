# Phase 3 Merge-To-Release Timeline Script

Date: 2026-05-10
Scope: Phase 3 Content Admin
Channel Type: Team release group

## Roles

- Release Owner: controls Go/No-Go decisions
- Operator: executes deployment and admin checks
- QA: runs smoke and regression spot checks
- Observer: watches errors/latency trends and escalation

## Timeline (Minute By Minute)

### T-10 (Before Merge)

Owner action:
- Confirm reviewer approvals and merge readiness.

Message by Release Owner:

【发布准备】
Phase 3 Content Admin 即将合并并进入发布窗口，请值守角色就位。

### T-0 (PR Merged)

Owner action:
- Merge PR into main.
- Confirm CI status.

Message by Release Owner:

【PR 合并完成】
Phase 3 Content Admin 已合并到 main，进入发布执行阶段。

### T+2

Operator action:
- Start deployment with latest main.
- Record deployment start time.

Message by Operator:

【发布开始】
已开始部署 main 最新版本，预计完成时间 {ETA}。

### T+5

Operator action:
- Open /admin/content?lang=en
- Perform a small reversible save.
- Record save requestId.

QA action:
- Stand by for page smoke checks.

Message by Operator:

【后台校验进度】
保存成功，Save requestId: {save_request_id}。

### T+8

Operator action:
- Open History and filter by save requestId.
- Confirm the expected entry is returned.

Message by Operator:

【requestId 核验】
history 按 requestId 过滤通过，链路可追踪。

### T+10

QA action:
- Smoke check: /products /reviews /rankings

Observer action:
- Check 5xx and latency trend of key APIs.

Message by QA:

【烟雾检查进度 1】
/products /reviews /rankings 检查通过。

### T+15

QA action:
- Smoke check: /news /guides /brands /deals /community
- Check /sitemap.xml

Observer action:
- Recheck errors and trend movement.

Message by QA:

【烟雾检查进度 2】
/news /guides /brands /deals /community 及 sitemap 检查通过。

### T+20

Observer action:
- Final short trend summary.
- Report if any rollback trigger is met.

Message by Observer:

【监控结论】
当前未发现持续异常，错误率与延迟趋势稳定。

### T+25

Release Owner action:
- Make Go/No-Go pre-decision.

Message by Release Owner:

【发布结论预告】
当前状态可维持 Go-Live，T+30 输出最终结论。

### T+30 (End of First Window)

Release Owner action:
- Announce final release conclusion.

Message by Release Owner:

【发布完成】
Phase 3 Content Admin 发布完成，关键检查全部通过，进入观察收尾阶段。

## Rollback Trigger (At Any Time)

Trigger if one or more below occur:
- Save operation repeatedly fails and not recovered within 10 minutes
- Rollback operation or reviewer validation is broken
- Core pages unavailable or showing severe data errors
- requestId chain cannot be traced

Message by Release Owner:

【触发回退】
已触发回退条件，立即执行回退流程并同步回退 requestId。

## Rollback Script (If Triggered)

Operator:
- Execute rollback in admin with valid reviewer.
- Record rollback requestId.
- Verify history filter by rollback requestId.

QA:
- Recheck core pages and sitemap.

Observer:
- Watch stabilization after rollback.

Message by Operator:

【回退执行结果】
rollback 已执行，Rollback requestId: {rollback_request_id}，history 核验通过。

## End-Of-Day Closure

Message by Release Owner:

【观察结束】
观察窗口已结束，系统稳定。本次发布闭环完成。

## Quick Links

- docs/phase3-release-day-runbook.md
- docs/phase3-channel-announcement-filled.md
- docs/phase3-post-merge-release-announcement.md
- docs/phase3-release-monitoring-sheet.md
