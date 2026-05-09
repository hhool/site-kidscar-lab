# site-kidscar-lab Prototype

基于 `env/diss/plan-rtingsMindMap.prompt.md` 与 `env/diss/plan-site` 生成的站点原型。

## 页面结构

- `index.html`：首页（导航、一级目录总览、模块入口）
- `reviews.html`：评测
- `rankings.html`：排名/最佳
- `products.html`：产品
- `news.html`：资讯更新
- `about.html`：关于与透明度
- `compare.html`：对比
- `methodology.html`：测试方法
- `test-results.html`：测试结果数据库
- `guides.html`：指南与文章
- `brands.html`：品牌与型号
- `deals.html`：优惠与价格
- `community.html`：社区与反馈
- `auth-login.html`：用户登录
- `auth-register.html`：用户注册
- `account.html`：用户中心（登录态模拟）

## 资源文件

- `styles.css`：全站样式
- `i18n-pages.js`：页面级中英文文案配置（标题与模块文案映射）
- `script.js`：导航高亮、登录态模拟、中文/English 切换与运行时渲染

## 语言支持

- 顶部导航提供 `中 / EN` 切换按钮。
- 语言状态通过 URL 参数 `?lang=en` 与本地存储保持。
- 语言切换为无刷新版本：点击切换后页面即时重渲染，URL 同步更新。
- 已覆盖导航、首页、主要内容页、登录/注册表单、用户中心与开发演示条的英文界面文案。
- 列表项采用更精细的单语显示策略：重复的对照文案会自动折叠，减少视觉冗余。

## 本地预览

可直接在浏览器打开：

- `index.html`

或使用任意静态服务（例如 VS Code Live Server）进行目录预览。

## 与导图映射

原型覆盖导图中的一级目录与关键二级入口，适合作为下一步框架化开发（Next.js）与 CMS 接入前的结构基线。

## 下一步建议

1. 将静态页面迁移到 Next.js 路由。
2. 抽象组件：`TopNav`、`SectionGrid`、`CategoryList`、`PageHero`。
3. 接入内容模型：Review、Ranking、Product、News、Methodology、Brand、Deal、Feedback。
4. 增加筛选参数与详情页路由：`/reviews/[slug]`、`/products/[slug]`。
