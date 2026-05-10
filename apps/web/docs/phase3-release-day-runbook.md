# Phase 3 发布当日执行单（Content Admin）

日期：2026-05-10
范围：apps/web
目标：在低风险窗口完成发布，并具备可验证、可回退、可追踪的执行路径。

## 角色分工

- Release Owner（发布负责人）：统筹节奏、做 Go/No-Go 决策。
- Operator（执行人）：执行命令、操作后台、记录 requestId。
- QA（验证人）：执行烟雾与回归抽检，签署通过结论。
- Observer（值守）：监控错误日志与接口异常，触发告警升级。

## T-60 到 T-30（发布前准备）

1. 锁定变更窗口与低峰时段。
2. 确认目标环境变量：
   - CONTENT_ADMIN_TOKEN
   - CONTENT_ROLLBACK_REVIEWERS
   - DATABASE_URL
   - NEXT_PUBLIC_SITE_URL
3. 导出当前快照备份：

```bash
npm run content:snapshot:export -- data/release-backup-$(date +%Y%m%d-%H%M).json
```

4. 记录备份文件路径到发布记录。

通过标准：
- 备份文件可读且路径可追溯。
- 四个关键环境变量已确认。

## T-30 到 T-10（预检与候选确认）

1. 在 apps/web 路径执行最终验收命令：

```bash
npm run lint && npm run test && npm run build && npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts
```

2. 确认所有结果为通过。
3. Release Owner 宣布候选版本可进入发布。

通过标准：
- lint/test/build/playwright 全绿。
- 无 P0 阻塞问题。

## T-10 到 T+0（发布执行）

1. 执行部署流程（按你当前环境既定方式）。
2. 部署完成后立即打开后台：/admin/content?lang=en。
3. 执行一次小范围可逆编辑并保存，记录 save requestId。
4. 打开 History，使用 requestId 过滤，确认记录可查。

通过标准：
- 保存成功且 requestId 可见可复制。
- history 按 requestId 过滤命中本次保存。

## T+0 到 T+30（发布后 30 分钟值守）

1. QA 执行内容页烟雾检查：
   - /products
   - /reviews
   - /rankings
   - /news
   - /guides
   - /brands
   - /deals
   - /community
2. 验证 sitemap：/sitemap.xml。
3. Observer 监控错误与异常趋势。
4. 如无异常，Release Owner 宣布发布成功。

通过标准：
- 关键页面可访问且内容正常。
- 无持续性 5xx 或显著错误率抬升。

## 回退触发条件（任一满足即触发）

1. 内容后台保存连续失败，且无法在 10 分钟内恢复。
2. 回滚操作无法执行或审核人机制异常。
3. 核心页面出现大面积不可用或关键数据错误。
4. requestId 链路不可追踪，影响问题定位。

## 回退执行步骤

1. 在后台使用有效 reviewer 执行回滚。
2. 记录 rollback requestId。
3. 在 History 中按 rollback requestId 过滤确认回滚落库。
4. QA 复测关键页面与 sitemap。
5. 若后台回滚不可用，使用发布前导出快照走应急恢复路径。

## 发布记录模板（可复制）

- 发布时间窗：
- Release Owner：
- Operator：
- QA：
- Observer：
- 备份文件路径：
- Save requestId：
- Rollback requestId（如有）：
- 烟雾检查结论：
- 是否 Go-Live：
- 遗留风险：

## 关联文档

- docs/content-admin.md
- docs/content-admin-staging-checklist.md
- docs/final-acceptance-checklist.md
- docs/final-acceptance-report-2026-05-10.md
- docs/phase3-release-handoff.md
- docs/pr-description-phase3-content-admin.md
