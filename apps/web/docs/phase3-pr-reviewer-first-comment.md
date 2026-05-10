# Phase 3 PR Reviewer First Comment Template

Use this as the first comment under the PR to help reviewers focus quickly.

## CN Standard

各位 reviewer，建议按以下顺序快速审查：

1. 功能链路
- /admin/content 的 save/history/rollback 流程
- requestId 在状态区与历史区的可见与复制

2. 安全与风控
- rollback 的 reviewer allowlist 校验
- unauthorized 场景（无效 token）行为是否符合预期

3. 回归点
- 顶部登录按钮文案可见性（黑底按钮）
- 语言切换后导航文案正确性

4. 文档与发布可执行性
- 发布执行单、监控清单、群播报模板是否完整可落地

建议验证命令：

```bash
cd apps/web
npm run lint
npm run test
npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts tests/ui/auth-ui.spec.ts
```

关键文档入口：
- docs/phase3-pr-github-final.md
- docs/phase3-release-day-runbook.md
- docs/phase3-release-monitoring-sheet.md

感谢大家，重点关注回滚安全与 requestId 追踪闭环。

## EN Short

Reviewer quick path:

1. Admin flow: save/history/rollback in /admin/content
2. Safety: reviewer allowlist + unauthorized save behavior
3. Regressions: top-nav login label visibility + language toggle nav text
4. Ops readiness: runbook, monitoring, and communication templates

Suggested commands:

```bash
cd apps/web
npm run lint
npm run test
npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts tests/ui/auth-ui.spec.ts
```

Primary docs:
- docs/phase3-pr-github-final.md
- docs/phase3-release-day-runbook.md
- docs/phase3-release-monitoring-sheet.md
