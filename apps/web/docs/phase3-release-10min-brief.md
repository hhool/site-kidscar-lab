# Phase 3 发版前 10 分钟口播清单

用途：发布前 10 分钟在群里快速同步，1 分钟可读完。

## 口播模板

各位好，Phase 3 Content Admin 将在 {开始时间}-{结束时间} 发布。

本次范围：
1. 内容后台 save/history/rollback 全流程
2. requestId 链路追踪与复制
3. 预发与发布值守文档已就位

发布分工：
- Release Owner：{姓名}
- Operator：{姓名}
- QA：{姓名}
- Observer：{姓名}

上线前确认（已完成）：
1. lint/test/build/playwright 全绿
2. 快照备份路径已记录：{备份路径}
3. 环境变量已确认：CONTENT_ADMIN_TOKEN / CONTENT_ROLLBACK_REVIEWERS / DATABASE_URL / NEXT_PUBLIC_SITE_URL

风险与回退：
1. 若后台保存连续失败且 10 分钟内未恢复，立即回退
2. 回退后按 rollback requestId 在 history 核验

发布后安排：
1. 30 分钟烟雾与监控观察
2. 结束后统一发“发布完成/观察结束”通知

## 极简打勾版（口播前 30 秒）

- [ ] 人员分工已确认
- [ ] 验收命令全绿
- [ ] 快照备份已导出
- [ ] 回退触发条件已对齐
- [ ] 通知模板已就绪

## 关联文档

- docs/phase3-release-day-runbook.md
- docs/phase3-release-chat-templates-prefilled.md
- docs/phase3-release-monitoring-sheet.md
- docs/phase3-pr-ready-pack.md
