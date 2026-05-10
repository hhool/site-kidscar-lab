# Phase 3 发布值班监控清单（5 分钟粒度）

目标：发布后 30 分钟内，按固定节奏监控关键链路，快速定位并决策 Go/No-Go。

## 角色

- Observer：主监控与异常上报
- Operator：执行修复/回退操作
- QA：页面与业务行为复验
- Release Owner：最终决策

## 监控对象

- API：
  - PUT /api/content/site
  - GET /api/content/site?history=1
  - POST /api/content/site?rollback=1
  - /api/content/reviewer-allowlist
- 页面：
  - /admin/content
  - /products /reviews /rankings /news /guides /brands /deals /community
  - /sitemap.xml
- 指标：
  - 5xx 数量与趋势
  - 接口 p95 延迟
  - requestId 追踪完整性
  - 前端白屏/崩溃/关键交互失败

## 0-30 分钟时间轴

### T+0（发布刚完成）

1. 记录版本号与发布时间。
2. 在后台执行一次小改动保存并记录 Save requestId。
3. 立刻在 history 用 requestId 过滤确认可追踪。

通过标准：
- Save 成功
- requestId 可复制
- history 过滤命中

### T+5

1. 检查 API 错误趋势（重点 401/409/5xx）。
2. 检查 /admin/content 打开与基础操作是否正常。
3. QA 抽检 /products、/reviews。

告警阈值（建议）：
- 任一关键 API 连续 3 次失败
- 5xx 在 5 分钟窗口内持续增长

### T+10

1. QA 抽检 /rankings、/news、/guides。
2. 检查 guide 详情路由是否可达。
3. Observer 复查 requestId 链路日志可追踪。

告警阈值（建议）：
- requestId 链路断裂（无法关联请求与记录）
- 核心页面出现不可用

### T+15

1. QA 抽检 /brands、/deals、/community。
2. 检查 /sitemap.xml 是否返回有效内容。
3. Operator 复核 reviewer allowlist 状态可用。

告警阈值（建议）：
- rollback reviewer 机制异常
- sitemap 不可访问或明显异常

### T+20

1. 复查 API 延迟与错误率趋势。
2. 对已发现问题做二次确认：已恢复 or 持续存在。
3. 若持续异常，准备回退动作并预告。

回退预警条件（建议）：
- 异常持续超过 10 分钟无明显收敛
- 影响面扩大到多个核心页面

### T+25

1. 做最终 Go/No-Go 预判。
2. 若稳定，准备“发布完成”通知文本。
3. 若不稳定，执行回退并准备“回退通知文本”。

### T+30

1. Release Owner 宣布结论：
   - Go-Live 继续
   - 或执行回退
2. 输出监控窗口总结与后续动作。

## 异常分级与动作

- P1（阻断）：核心页面不可用、后台保存不可用、回滚不可用
  - 立即升级给 Release Owner
  - 5 分钟内给出处置方向（修复或回退）
- P2（高风险）：错误率持续抬升、requestId 链路不完整
  - 立即限制变更操作
  - 10 分钟内完成修复验证，否则回退
- P3（一般）：局部非核心异常
  - 记录并安排后续修复
  - 不影响发布结论时可带病观察

## 观察记录模板

- 时间点：
- 当前版本：
- Save requestId：
- Rollback requestId（如有）：
- API 错误率/5xx：
- 延迟趋势：
- 页面抽检结果：
- 当前判定：稳定 / 风险 / 需回退
- 责任人签名：

## 关联文档

- docs/phase3-release-day-runbook.md
- docs/phase3-release-chat-templates.md
- docs/final-acceptance-checklist.md
- docs/final-acceptance-report-2026-05-10.md
