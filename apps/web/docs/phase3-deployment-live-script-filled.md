# Phase 3 Deployment Live Script (Filled)

Date: 2026-05-10
Branch: main
Repo: hhool/site-kidscar-lab
Scope: Phase 3 Content Admin

## T-10

口令：
- 环境变量确认完成
- 快照备份路径已记录
- 值守角色到位

群消息：
【发布准备】
Phase 3 Content Admin 即将进入发布窗口，请值守角色就位。

## T+0

口令：
- 开始部署 main 最新版本
- 记录部署开始时间

群消息：
【发布开始】
已开始部署 main 最新版本，进入发布执行阶段。

## T+5

口令：
- 打开 /admin/content?lang=en
- 执行一次可逆保存
- 记录 Save requestId

群消息：
【后台校验】
保存成功，Save requestId 已记录。

## T+8

口令：
- 打开 History
- 按 Save requestId 过滤
- 确认命中记录

群消息：
【requestId 核验】
history 按 requestId 过滤通过，链路可追踪。

## T+10

口令：
- QA 检查 /products /reviews /rankings
- Observer 关注 5xx 趋势

群消息：
【烟雾检查进度 1】
/products /reviews /rankings 检查通过。

## T+15

口令：
- QA 检查 /news /guides /brands /deals /community
- 检查 /sitemap.xml

群消息：
【烟雾检查进度 2】
/news /guides /brands /deals /community 与 sitemap 检查通过。

## T+20

口令：
- Observer 汇总错误率与延迟趋势
- 评估是否触发回退条件

群消息：
【监控结论】
当前未发现持续异常，趋势稳定。

## T+30

口令：
- Release Owner 宣布发布结论
- 进入观察收尾

群消息：
【发布完成】
Phase 3 Content Admin 发布完成，关键检查全部通过。

## 回退触发（任一满足）

- 保存连续失败超过 10 分钟
- 回滚路径或 reviewer 校验异常
- 核心页面不可用
- requestId 链路不可追踪

触发消息：
【触发回退】
已触发回退条件，立即执行回退并同步 rollback requestId。

## 回退后口令

- 执行 rollback
- 记录 rollback requestId
- History 按 rollback requestId 核验
- QA 复测关键页面与 sitemap

回退结果消息：
【回退执行结果】
rollback 已执行，requestId 已记录，关键页复测通过。
