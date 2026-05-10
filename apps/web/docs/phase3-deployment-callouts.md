# Phase 3 Deployment Callouts

Use these short callouts during release execution.

## T-10

- 环境变量确认完成
- 快照备份路径已记录
- 值守角色全部到位

## T+0

- 开始部署 main 最新版本
- 记录部署开始时间

## T+5

- 后台可逆保存通过
- 已记录 Save requestId

## T+8

- history 按 requestId 命中
- 追踪链路验证通过

## T+10

- products/reviews/rankings 通过
- 错误率趋势无异常

## T+15

- news/guides/brands/deals/community 通过
- sitemap 校验通过

## T+20

- 接口延迟趋势稳定
- 无持续性错误抬升

## T+30

- 发布结论：Go-Live
- 进入观察窗口收尾

## Rollback Trigger

- 保存连续失败超 10 分钟
- 回滚校验链路异常
- 核心页面不可用
- requestId 无法追踪

## Rollback Callouts

- 已触发回退条件
- 已执行 rollback 并记录 requestId
- history 核验与关键页复测完成
