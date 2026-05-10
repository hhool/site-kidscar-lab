# PR Description - Phase 3 Content Admin (CN + EN)

## 中文主版

### 变更摘要
本 PR 完成 Phase 3 内容管理链路的端到端闭环，覆盖内容快照读取、后台保存、历史查询、回滚、审核人白名单，以及 requestId 全链路可追踪能力。

### 主要改动
- 新增内容后台页面与交互流程：保存、历史过滤（operation/requestId）、回滚。
- requestId 在关键 UI 状态中可见，并支持复制，便于排障与审计追踪。
- 新增/完善内容管理相关 API 集成测试，补齐跨接口 requestId 合同验证。
- 新增 UI 回归测试，覆盖保存 -> 历史过滤 -> 回滚的状态化工作流。
- 新增发布运维文档：后台操作手册、预发检查单、最终验收清单、最终验收报告、阶段交付摘要。
- README 增加文档入口与本地启动排障说明。

### 验收结果
执行命令：

```bash
npm run lint && npm run test && npm run build && npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts
```

结果：
- lint: 通过
- vitest: 32/32 通过
- next build: 通过
- playwright: 11/11 通过

### 风险与回滚
- 风险点：生产环境配置差异（token、白名单来源、DB 连通性）可能影响后台写入与回滚。
- 防护：
  - 接口已做 token 与审核人校验。
  - 审核人优先级为 DB allowlist 优先，env 兜底。
  - requestId 可用于跨接口追踪与问题定位。
- 回滚策略：
  - 使用后台回滚流程，按 requestId 在历史中核验。
  - 保留快照导出文件用于紧急恢复路径。

### 上线前检查
- 核对环境变量：CONTENT_ADMIN_TOKEN、CONTENT_ROLLBACK_REVIEWERS、DATABASE_URL。
- 按预发检查单完成全流程并记录签字。
- 在低峰窗口发布，发布后执行 30 分钟烟雾与 requestId 抽样追踪。

### 相关文档
- docs/content-admin.md
- docs/content-admin-staging-checklist.md
- docs/final-acceptance-checklist.md
- docs/final-acceptance-report-2026-05-10.md
- docs/phase3-release-handoff.md
- docs/phase3-snapshot.md

---

## English Short Version

### Summary
This PR completes the end-to-end Phase 3 content admin workflow, including snapshot-driven content reads, admin save/history/rollback operations, reviewer allowlist control, and requestId traceability across UI and APIs.

### Key Changes
- Added admin content workflow: save, history filters (operation/requestId), rollback.
- Exposed and copy-enabled requestId in critical UI states for audit/debug traceability.
- Expanded content API integration tests, including requestId linkage across endpoints.
- Added UI regression coverage for stateful save -> history filter -> rollback flow.
- Added operational docs: admin guide, staging checklist, final acceptance checklist/report, phase handoff summary.

### Validation
Command executed:

```bash
npm run lint && npm run test && npm run build && npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts
```

Result:
- lint: pass
- vitest: 32/32 passed
- next build: pass
- playwright: 11/11 passed

### Risks and Rollback
- Main risk: environment/config mismatch (token, allowlist source, DB connectivity).
- Controls: token/reviewer checks, DB-first allowlist with env fallback, requestId-based tracing.
- Rollback: execute admin rollback and verify by requestId in history; keep snapshot export for emergency restore.
