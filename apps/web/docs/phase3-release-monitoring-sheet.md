# Phase 3 值班监控执行表（一页勾选版）

日期：2026-05-10
发布版本：{commit_sha}
发布窗口：20:00-20:30
观察窗口：20:30-21:00

负责人：
- Release Owner：
- Operator：
- QA：
- Observer：

## A. 基线信息（发布前填写）

- [ ] 已确认环境变量：CONTENT_ADMIN_TOKEN / CONTENT_ROLLBACK_REVIEWERS / DATABASE_URL / NEXT_PUBLIC_SITE_URL
- [ ] 已导出备份：data/release-backup-{timestamp}.json
- [ ] 已确认最终验收命令全绿

## B. 时间点检查（发布后执行）

### T+0

- [ ] 记录发布时间
- [ ] 后台保存成功
- [ ] Save requestId 已记录：____________
- [ ] history requestId 过滤命中

### T+5

- [ ] 关键 API 无连续失败
- [ ] /admin/content 可正常操作
- [ ] /products 与 /reviews 抽检通过

### T+10

- [ ] /rankings /news /guides 抽检通过
- [ ] guides 详情页可正常访问
- [ ] requestId 链路日志可追踪

### T+15

- [ ] /brands /deals /community 抽检通过
- [ ] /sitemap.xml 可访问且内容有效
- [ ] reviewer allowlist 机制正常

### T+20

- [ ] 错误率趋势稳定
- [ ] 延迟趋势稳定
- [ ] 已发现问题已收敛或已明确处置

### T+25

- [ ] Go/No-Go 预判完成
- [ ] 已准备完成通知或回退通知模板

### T+30

- [ ] Release Owner 宣布最终结论
- [ ] 观察窗口结论已同步到群

## C. 回退触发（任一满足立即执行）

- [ ] 后台保存连续失败且 10 分钟内未恢复
- [ ] 回滚操作不可用或审核人机制异常
- [ ] 核心页面不可用或关键数据错误
- [ ] requestId 链路不可追踪

## D. 回退执行记录（如触发）

- [ ] rollback 已执行
- [ ] Rollback requestId：____________
- [ ] history 过滤确认回退落库
- [ ] 关键页面复测通过
- [ ] 事故简报负责人与时间已确定

## E. 最终发布记录

- 是否 Go-Live：是 / 否
- 主要结论：
- 遗留风险：
- 后续动作：
- 记录人：
- 记录时间：
