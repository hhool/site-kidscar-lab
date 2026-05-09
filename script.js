const AUTH_STATE_KEY = "kidscar_auth_state";
const AUTH_NAME_KEY = "kidscar_auth_name";
const LANG_KEY = "kidscar_lang";
let ORIGINAL_BODY_HTML = "";

const current = window.location.pathname.split("/").pop() || "index.html";

const NAV_LABELS = {
  "products.html": { zh: "产品", en: "Products" },
  "reviews.html": { zh: "评测", en: "Reviews" },
  "rankings.html": { zh: "排名/最佳", en: "Rankings" },
  "news.html": { zh: "资讯更新", en: "News" },
  "about.html": { zh: "关于与透明度", en: "About & Transparency" },
  "auth-register.html": { zh: "注册", en: "Sign up" },
  "auth-login.html": { zh: "登录", en: "Log in" },
};

const TEXTS = {
  zh: {
    userDefault: "用户",
    guest: "访客",
    accountSuffix: "中心",
    logout: "退出",
    loginErrorIdentifier: "请输入邮箱或手机号。",
    loginErrorPassword: "密码至少 6 位。",
    registerErrorContact: "请至少填写邮箱或手机号。",
    registerErrorEmail: "邮箱格式不正确。",
    registerErrorPhone: "手机号格式不正确。",
    registerErrorPassword: "密码至少 6 位。",
    registerErrorConfirm: "两次输入的密码不一致。",
    registerErrorAgree: "请先同意用户协议与隐私政策。",
    accountCardTitle: "{name} 的资料卡",
    accountCardGuest: "访客资料卡",
    accountStateLoggedIn: "已登录",
    accountStateGuest: "未登录",
    accountTypeText: "普通用户（模拟）",
    devBarLabel: "开发模式登录态演示",
    devNamePlaceholder: "输入用户名",
    devSetLoggedIn: "设为已登录",
    devSetLoggedOut: "设为未登录",
    langZh: "中",
    langEn: "EN",
  },
  en: {
    userDefault: "User",
    guest: "Guest",
    accountSuffix: " Center",
    logout: "Sign out",
    loginErrorIdentifier: "Enter your email or phone number.",
    loginErrorPassword: "Password must be at least 6 characters.",
    registerErrorContact: "Provide at least an email or phone number.",
    registerErrorEmail: "Email format is invalid.",
    registerErrorPhone: "Phone format is invalid.",
    registerErrorPassword: "Password must be at least 6 characters.",
    registerErrorConfirm: "Passwords do not match.",
    registerErrorAgree: "Please agree to the Terms and Privacy Policy.",
    accountCardTitle: "{name} Profile",
    accountCardGuest: "Guest Profile",
    accountStateLoggedIn: "Logged in",
    accountStateGuest: "Not logged in",
    accountTypeText: "Regular user (demo)",
    devBarLabel: "Dev auth state demo",
    devNamePlaceholder: "Enter username",
    devSetLoggedIn: "Set logged in",
    devSetLoggedOut: "Set logged out",
    langZh: "中",
    langEn: "EN",
  },
};

function getCurrentLang() {
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  if (urlLang === "en" || urlLang === "zh") {
    localStorage.setItem(LANG_KEY, urlLang);
    return urlLang;
  }

  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "en" || saved === "zh") {
    return saved;
  }

  return "zh";
}

function t(key, vars = {}) {
  const lang = getCurrentLang();
  const dict = TEXTS[lang] || TEXTS.zh;
  let value = dict[key] || TEXTS.zh[key] || "";
  for (const [k, v] of Object.entries(vars)) {
    value = value.replace(`{${k}}`, v);
  }
  return value;
}

function withLang(path) {
  if (getCurrentLang() !== "en") return path;
  return path.includes("?") ? `${path}&lang=en` : `${path}?lang=en`;
}

function updateHrefLang(href, lang) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  const [pathAndQuery, hash = ""] = href.split("#");
  const [path, query = ""] = pathAndQuery.split("?");
  if (!path.endsWith(".html")) return href;

  const params = new URLSearchParams(query);
  if (lang === "en") {
    params.set("lang", "en");
  } else {
    params.delete("lang");
  }

  const queryString = params.toString();
  const hashString = hash ? `#${hash}` : "";
  return queryString ? `${path}?${queryString}${hashString}` : `${path}${hashString}`;
}

function getLinkFileName(href) {
  if (!href) return "";
  const [pathPart] = href.split("?");
  return pathPart.split("/").pop() || "";
}

function setLanguage(lang) {
  if (lang !== "en" && lang !== "zh") return;
  localStorage.setItem(LANG_KEY, lang);

  const url = new URL(window.location.href);
  if (lang === "en") {
    url.searchParams.set("lang", "en");
  } else {
    url.searchParams.delete("lang");
  }

  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  rerenderPage();
}

function isLoggedIn() {
  return localStorage.getItem(AUTH_STATE_KEY) === "logged_in";
}

function setLoggedIn(name) {
  localStorage.setItem(AUTH_STATE_KEY, "logged_in");
  localStorage.setItem(AUTH_NAME_KEY, name || t("userDefault"));
}

function clearAuth() {
  localStorage.removeItem(AUTH_STATE_KEY);
  localStorage.removeItem(AUTH_NAME_KEY);
}

function getDisplayName() {
  return localStorage.getItem(AUTH_NAME_KEY) || t("userDefault");
}

function isDevMode() {
  return window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

function highlightCurrentNav() {
  for (const link of document.querySelectorAll(".nav-links a")) {
    const href = link.getAttribute("href") || "";
    const file = getLinkFileName(href);
    link.classList.toggle("active", file === current);
  }
}

function applyLanguageToLinks() {
  const lang = getCurrentLang();
  for (const link of document.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href");
    const nextHref = updateHrefLang(href, lang);
    if (nextHref && nextHref !== href) {
      link.setAttribute("href", nextHref);
    }
  }
}

function localizeNavText(nav) {
  const lang = getCurrentLang();
  for (const link of nav.querySelectorAll("a")) {
    const authType = link.getAttribute("data-auth");
    if (authType === "account") {
      link.textContent = `${getDisplayName()}${t("accountSuffix")}`;
      continue;
    }
    if (authType === "logout") {
      link.textContent = t("logout");
      continue;
    }

    const file = getLinkFileName(link.getAttribute("href") || "");
    const navText = NAV_LABELS[file];
    if (navText) {
      link.textContent = navText[lang];
    }
  }
}

function renderLanguageSwitch(nav) {
  let wrap = nav.querySelector(".lang-switch");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.innerHTML = `
      <button type="button" data-lang="zh"></button>
      <button type="button" data-lang="en"></button>
    `;
    nav.appendChild(wrap);
  }

  const lang = getCurrentLang();
  const zhBtn = wrap.querySelector('button[data-lang="zh"]');
  const enBtn = wrap.querySelector('button[data-lang="en"]');

  if (zhBtn) {
    zhBtn.textContent = t("langZh");
    zhBtn.classList.toggle("active", lang === "zh");
    zhBtn.onclick = () => setLanguage("zh");
  }
  if (enBtn) {
    enBtn.textContent = t("langEn");
    enBtn.classList.toggle("active", lang === "en");
    enBtn.onclick = () => setLanguage("en");
  }
}

function setText(selector, text) {
  const node = document.querySelector(selector);
  if (node) node.textContent = text;
}

function setTextAt(selector, index, text) {
  const nodes = document.querySelectorAll(selector);
  if (nodes[index]) nodes[index].textContent = text;
}

function applyZhPageLanguage() {
  const titleMap = {
    "index.html": "KidsCarLab 原型 - 首页",
    "products.html": "产品 - 原型",
    "reviews.html": "评测 - 原型",
    "rankings.html": "排名/最佳 - 原型",
    "news.html": "资讯更新 - 原型",
    "about.html": "关于与透明度 - 原型",
    "compare.html": "对比 - 原型",
    "methodology.html": "测试方法 - 原型",
    "test-results.html": "测试结果数据库 - 原型",
    "guides.html": "指南与文章 - 原型",
    "brands.html": "品牌与型号 - 原型",
    "deals.html": "优惠与价格 - 原型",
    "community.html": "社区与反馈 - 原型",
    "auth-login.html": "登录 - 原型",
    "auth-register.html": "注册 - 原型",
    "account.html": "用户中心 - 原型",
  };

  if (titleMap[current]) {
    document.title = titleMap[current];
  }

  if (current === "products.html") {
    setText(".hero h1", "产品");
  }

  if (current === "reviews.html") {
    setText(".hero h1", "评测");
  }

  if (current === "rankings.html") {
    setText(".hero h1", "排名/最佳");
  }

  if (current === "news.html") {
    setText(".hero h1", "资讯更新");
  }

  if (current === "about.html") {
    setText(".hero h1", "关于与透明度");
  }

  if (current === "compare.html") {
    setText(".hero h1", "对比");
  }

  if (current === "methodology.html") {
    setText(".hero h1", "测试方法");
  }

  if (current === "test-results.html") {
    setText(".hero h1", "测试结果数据库");
  }

  if (current === "guides.html") {
    setText(".hero h1", "指南与文章");
  }

  if (current === "brands.html") {
    setText(".hero h1", "品牌与型号");
  }

  if (current === "deals.html") {
    setText(".hero h1", "优惠与价格");
  }

  if (current === "community.html") {
    setText(".hero h1", "社区与反馈");
  }

  if (current === "auth-login.html") {
    setText(".hero h1", "用户登录");
  }

  if (current === "auth-register.html") {
    setText(".hero h1", "用户注册");
  }

  if (current === "account.html") {
    setText(".hero h1", "用户中心");
  }
}

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, " ").replace(/[.]/g, "").trim();
}

function applySingleLanguagePresentation() {
  const lang = getCurrentLang();
  for (const item of document.querySelectorAll(".list .item")) {
    if (item.tagName === "A") continue;

    const strong = item.querySelector("strong");
    const span = item.querySelector("span");
    if (!strong || !span) continue;

    span.style.display = "";

    const strongText = normalizeText(strong.textContent || "");
    const spanText = normalizeText(span.textContent || "");
    if (!strongText || !spanText) continue;

    if (lang === "en" && strongText === spanText) {
      span.style.display = "none";
      continue;
    }

    if (lang === "zh") {
      const strongRaw = strong.textContent || "";
      const spanRaw = span.textContent || "";
      const strongHasCjk = /[\u4e00-\u9fa5]/.test(strongRaw);
      const spanHasLatin = /[A-Za-z]/.test(spanRaw);
      const spanHasCjk = /[\u4e00-\u9fa5]/.test(spanRaw);
      if (strongHasCjk && spanHasLatin && !spanHasCjk) {
        span.style.display = "none";
      }
    }
  }
}

function applyPageLanguage() {
  const lang = getCurrentLang();
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  if (lang !== "en") {
    applyZhPageLanguage();
    return;
  }

  const titleMap = {
    "index.html": "KidscarLab Prototype - Home",
    "products.html": "Products - Prototype",
    "reviews.html": "Reviews - Prototype",
    "rankings.html": "Rankings - Prototype",
    "news.html": "News - Prototype",
    "about.html": "About & Transparency - Prototype",
    "compare.html": "Compare - Prototype",
    "methodology.html": "Test Methodology - Prototype",
    "test-results.html": "Test Results Database - Prototype",
    "guides.html": "Guides & Articles - Prototype",
    "brands.html": "Brands & Models - Prototype",
    "deals.html": "Deals & Prices - Prototype",
    "community.html": "Community & Feedback - Prototype",
    "auth-login.html": "Sign In - Prototype",
    "auth-register.html": "Sign Up - Prototype",
    "account.html": "Account Center - Prototype",
  };

  if (titleMap[current]) {
    document.title = titleMap[current];
  }

  if (current === "auth-login.html") {
    const h1 = document.querySelector(".hero h1");
    const p = document.querySelector(".hero p");
    const h2 = document.querySelector(".section h2");
    const idLabel = document.querySelector('label[for="loginIdentifier"]');
    const passLabel = document.querySelector('label[for="loginPassword"]');
    const submit = document.querySelector('#loginForm button[type="submit"]');
    const goRegister = document.querySelector('#loginForm .actions a');
    const idInput = document.querySelector("#loginIdentifier");
    const passInput = document.querySelector("#loginPassword");

    if (h1) h1.textContent = "Sign In";
    if (p) p.textContent = "Prototype phase: validating account entry and flow before integrating real authentication and sessions.";
    if (h2) h2.textContent = "Sign-in Form";
    if (idLabel) idLabel.textContent = "Email or phone";
    if (passLabel) passLabel.textContent = "Password";
    if (submit) submit.textContent = "Sign in";
    if (goRegister) goRegister.textContent = "Create account";
    if (idInput instanceof HTMLInputElement) idInput.placeholder = "Enter email or phone";
    if (passInput instanceof HTMLInputElement) passInput.placeholder = "Enter password (min 6 chars)";
  }

  if (current === "auth-register.html") {
    const h1 = document.querySelector(".hero h1");
    const p = document.querySelector(".hero p");
    const h2 = document.querySelector(".section h2");
    const emailLabel = document.querySelector('label[for="registerEmail"]');
    const phoneLabel = document.querySelector('label[for="registerPhone"]');
    const passLabel = document.querySelector('label[for="registerPassword"]');
    const confirmLabel = document.querySelector('label[for="registerConfirm"]');
    const agreeTextNode = document.querySelector('label[for="registerAgree"]');
    const submit = document.querySelector('#registerForm button[type="submit"]');
    const goLogin = document.querySelector('#registerForm .actions a');
    const phoneInput = document.querySelector("#registerPhone");
    const passInput = document.querySelector("#registerPassword");
    const confirmInput = document.querySelector("#registerConfirm");

    if (h1) h1.textContent = "Sign Up";
    if (p) p.textContent = "Prototype phase: validating registration entry and flow before integrating verification and policy consent services.";
    if (h2) h2.textContent = "Registration Form";
    if (emailLabel) emailLabel.textContent = "Email";
    if (phoneLabel) phoneLabel.textContent = "Phone";
    if (passLabel) passLabel.textContent = "Password";
    if (confirmLabel) confirmLabel.textContent = "Confirm password";
    if (agreeTextNode) {
      agreeTextNode.childNodes[agreeTextNode.childNodes.length - 1].textContent = " I agree to the Terms and Privacy Policy";
    }
    if (submit) submit.textContent = "Register and sign in";
    if (goLogin) goLogin.textContent = "Already have an account";
    if (phoneInput instanceof HTMLInputElement) phoneInput.placeholder = "Enter phone number";
    if (passInput instanceof HTMLInputElement) passInput.placeholder = "At least 6 characters";
    if (confirmInput instanceof HTMLInputElement) confirmInput.placeholder = "Enter password again";
  }

  if (current === "account.html") {
    const h1 = document.querySelector(".hero h1");
    const status = document.querySelector(".hero p");
    const title = document.querySelector(".section h2");
    const profileTitle = document.querySelectorAll(".section h2")[1];
    const metaTitles = document.querySelectorAll(".meta-item strong");
    const accountType = document.querySelectorAll(".meta-item span")[3];
    const listStrong = document.querySelectorAll(".list .item strong");
    const listSpan = document.querySelectorAll(".list .item span");

    if (h1) h1.textContent = "Account Center";
    if (status) {
      status.innerHTML = 'Current user: <strong id="accountName">-</strong> (Status: <span id="accountState">-</span>)';
    }
    if (title) title.textContent = "Profile Card (Demo)";
    if (profileTitle) profileTitle.textContent = "Feature Placeholders";
    if (metaTitles[0]) metaTitles[0].textContent = "Email";
    if (metaTitles[1]) metaTitles[1].textContent = "Phone";
    if (metaTitles[2]) metaTitles[2].textContent = "Region";
    if (metaTitles[3]) metaTitles[3].textContent = "Account type";
    if (accountType) accountType.textContent = t("accountTypeText");
    if (listStrong[0]) listStrong[0].textContent = "Profile";
    if (listStrong[1]) listStrong[1].textContent = "Favorites";
    if (listStrong[2]) listStrong[2].textContent = "Ratings & Comments";
    if (listStrong[3]) listStrong[3].textContent = "Notifications";
    if (listSpan[0]) listSpan[0].textContent = "Nickname, email, phone, region";
    if (listSpan[1]) listSpan[1].textContent = "Saved products and followed reviews";
    if (listSpan[2]) listSpan[2].textContent = "User rating records and comment history";
    if (listSpan[3]) listSpan[3].textContent = "Review updates, price alerts, system messages";
  }

  if (current === "index.html") {
    setText(".hero h1", "RTINGS-Style Kids Vehicle Review Prototype");
    setText(
      ".hero p",
      "This prototype is generated from your mind map: review-first, with rankings, products, updates, and transparency forming the decision path. This version focuses on first-level architecture and key second-level entries for the next step toward a real data-driven site."
    );

    setTextAt(".badges span", 0, "Review-driven decisions");
    setTextAt(".badges span", 1, "Comparison-oriented navigation");
    setTextAt(".badges span", 2, "Transparent, traceable testing");
    setTextAt(".badges span", 3, "Built for kids vehicle categories");

    setTextAt(".section h2", 0, "First-Level Structure Overview");
    setTextAt(".section .subtitle", 0, "Covers the minimum viable structure in your mind map and leaves room for expansion.");
    setTextAt(".grid .card h3", 0, "Reviews");
    setTextAt(".grid .card h3", 1, "Best Picks");
    setTextAt(".grid .card h3", 2, "Products");
    setTextAt(".grid .card h3", 3, "News");
    setTextAt(".grid .card h3", 4, "About & Transparency");
    setTextAt(".grid .card h3", 5, "Complete First-Level Modules");
    setTextAt(".grid .card p", 0, "Latest reviews organized by category, age, price tier, and testing metrics.");
    setTextAt(".grid .card p", 1, "Leaderboards by composite score, features, user ratings, origin, price, safety, and value.");
    setTextAt(".grid .card p", 2, "Browse products by category, age group, price tier, brand, and usage scenario.");
    setTextAt(".grid .card p", 3, "Industry updates, product launches, promotions, media coverage, and transparency updates.");
    setTextAt(".grid .card p", 4, "Testing process, data sources, review team, privacy policy, and supply chain transparency.");
    setTextAt(".grid .card p", 5, "Prototype pages already include compare, methodology, test results, guides, brands, deals, and community feedback.");

    setTextAt(".section h2", 1, "Complete First-Level Entry Links");
    setTextAt(".section .subtitle", 1, "All pages below are clickable prototypes for interaction refinement and real data integration.");
    setTextAt(".list .item strong", 0, "Compare");
    setTextAt(".list .item strong", 1, "Test Methodology");
    setTextAt(".list .item strong", 2, "Test Results Database");
    setTextAt(".list .item strong", 3, "Guides & Articles");
    setTextAt(".list .item strong", 4, "Brands & Models");
    setTextAt(".list .item strong", 5, "Deals & Prices");
    setTextAt(".list .item strong", 6, "Community & Feedback");
    setTextAt(".list .item strong", 7, "User Registration");
    setTextAt(".list .item strong", 8, "User Login");

    setTextAt(".section h2", 2, "Homepage Module Prototype");
    setTextAt(".section .subtitle", 2, "Mapped to your homepage blueprint: carousel, featured modules, editor picks, updates, and transparency block.");
    setTextAt(".list .item strong", 9, "Carousel");
    setTextAt(".list .item strong", 10, "Featured Modules");
    setTextAt(".list .item strong", 11, "Editor Picks");
    setTextAt(".list .item strong", 12, "News Feed");
    setTextAt(".list .item strong", 13, "Transparency Block");
    setTextAt(".list .item strong", 14, "Footer Links");
    setTextAt(".list .item span", 9, "Latest reviews / latest rankings / latest products");
    setTextAt(".list .item span", 10, "Composite ranking, feature ranking, user rating ranking, origin/price/safety/value");
    setTextAt(".list .item span", 11, "Selected reviews, selected rankings, selected products");
    setTextAt(".list .item span", 12, "Industry updates, product launches, promotions, media coverage");
    setTextAt(".list .item span", 13, "Methodology, data sources, review team, company information");
    setTextAt(".list .item span", 14, "Privacy policy, terms of use, contact, social media");

    setTextAt(".kpi .label", 0, "Core first-level sections");
    setTextAt(".kpi .label", 1, "Second-level entry points");
    setTextAt(".kpi .label", 2, "Unified navigation system");
    setTextAt(".kpi .label", 3, "Generated from blueprint");
  }

  if (current === "products.html") {
    setText(".hero h1", "Products");
    setText(".hero p", "Aggregates product data, structured specs, user feedback, and supply-chain transparency for filtering and comparison.");
    setTextAt(".section h2", 0, "Secondary Navigation");
    setTextAt(".list .item strong", 0, "Latest / All Products");
    setTextAt(".list .item strong", 1, "Products by category");
    setTextAt(".list .item strong", 2, "By age / price tier / scenario");
    setTextAt(".list .item strong", 3, "Products by brand");
    setTextAt(".list .item strong", 4, "Updates and version history");
    setTextAt(".list .item strong", 5, "Editor picks");
    setTextAt(".list .item span", 1, "Electric ride-ons, rocking cars, balance bikes, bicycles, scooters, tricycles");
    setTextAt(".list .item span", 3, "Domestic / International / OEM");
    setTextAt(".section h2", 1, "Product Information Database Prototype");
    setTextAt(".grid .card h3", 0, "Product Specs Database");
    setTextAt(".grid .card h3", 1, "User Reviews & Feedback");
    setTextAt(".grid .card h3", 2, "Origin & Factory Information");
    setTextAt(".grid .card p", 0, "Specifications, pricing, origin, testing data");
    setTextAt(".grid .card p", 1, "Verified comments, user ratings, keyword tags");
    setTextAt(".grid .card p", 2, "Origin traceability, factory certifications, manufacturer endorsements");
  }

  if (current === "reviews.html") {
    setText(".hero h1", "Reviews");
    setText(".hero p", "Organized around latest reviews, category-focused reviews, and update logs for a filterable, traceable, and comparable review system.");
    setTextAt(".section h2", 0, "Secondary Navigation");
    setTextAt(".list .item strong", 0, "Latest Reviews");
    setTextAt(".list .item strong", 1, "All Reviews");
    setTextAt(".list .item strong", 2, "Reviews by category");
    setTextAt(".list .item strong", 3, "Reviews by age group");
    setTextAt(".list .item strong", 4, "Reviews by price tier");
    setTextAt(".list .item strong", 5, "Reviews by scenario");
    setTextAt(".list .item strong", 6, "Reviews by testing metrics");
    setTextAt(".list .item strong", 7, "Reviews by score tier");
    setTextAt(".list .item strong", 8, "Reviews by brand");
    setTextAt(".list .item strong", 9, "Review updates & changelog");
    setTextAt(".list .item strong", 10, "Editor picks");
    setTextAt(".list .item span", 2, "Electric ride-ons, rocking cars, balance bikes, bicycles, scooters, tricycles");
    setTextAt(".list .item span", 3, "0-1, 1-3, 3-6, 6-12, 12-18");
    setTextAt(".list .item span", 4, "Entry / Mainstream / Premium");
    setTextAt(".list .item span", 5, "Indoor, outdoor, park, commuting, travel");
    setTextAt(".list .item span", 6, "Safety, durability, handling, range, comfort, value");
  }

  if (current === "rankings.html") {
    setText(".hero h1", "Best Picks");
    setText(".hero p", "From composite scores to feature metrics, user ratings, and origin dimensions, this section builds layered recommendation leaderboards.");
    setTextAt(".section h2", 0, "Core Ranking Entrances");
    setTextAt(".section h2", 1, "Secondary Navigation");
    setTextAt(".grid .card h3", 0, "Composite Score Ranking");
    setTextAt(".grid .card h3", 1, "Feature Ranking");
    setTextAt(".grid .card h3", 2, "User Ratings Ranking");
    setTextAt(".grid .card h3", 3, "Origin Ranking");
    setTextAt(".grid .card h3", 4, "Price Ranking");
    setTextAt(".grid .card h3", 5, "Safety / Value Ranking");
    setTextAt(".list .item strong", 0, "Latest / All Rankings");
    setTextAt(".list .item strong", 1, "By type / age / price / scenario");
    setTextAt(".list .item strong", 2, "By metric / score tier / brand");
    setTextAt(".list .item strong", 3, "Changelog / Editor Picks");
  }

  if (current === "news.html") {
    setText(".hero h1", "News & Updates");
    setText(".hero p", "Covers industry moves, product launches, promotions, and transparency updates to keep users informed and engaged.");
    setTextAt(".section h2", 0, "Secondary Navigation");
    setTextAt(".list .item strong", 0, "Latest News");
    setTextAt(".list .item strong", 1, "Industry Updates");
    setTextAt(".list .item strong", 2, "Product Launches");
    setTextAt(".list .item strong", 3, "Events & Promotions");
    setTextAt(".list .item strong", 4, "Media Coverage");
    setTextAt(".list .item strong", 5, "User Stories");
    setTextAt(".list .item strong", 6, "Company News");
    setTextAt(".list .item strong", 7, "Testing & Review Updates");
    setTextAt(".list .item strong", 8, "Community Updates");
    setTextAt(".list .item strong", 9, "Transparency Updates");
  }

  if (current === "about.html") {
    setText(".hero h1", "About & Transparency");
    setText(".hero p", "Explains methodology, data sources, review team practices, and supply-chain transparency to build trust in the platform.");
    setTextAt(".section h2", 0, "Secondary Navigation");
    setTextAt(".list .item strong", 0, "Company Information");
    setTextAt(".list .item strong", 1, "Methodology / Data Sources");
    setTextAt(".list .item strong", 2, "Review Team / Transparency Report");
    setTextAt(".list .item strong", 3, "Ethics & Responsibility");
    setTextAt(".list .item strong", 4, "Supply Chain Transparency / Origin Traceability");
    setTextAt(".list .item strong", 5, "Factory Endorsement / Dual Confirmation");
    setTextAt(".list .item strong", 6, "Privacy Policy / Terms of Use");
    setTextAt(".list .item strong", 7, "Contact / FAQ / Feedback");
  }

  if (current === "compare.html") {
    setText(".hero h1", "Compare");
    setText(".hero p", "Compare two or multiple products on one screen across specs, test metrics, user ratings, and price trends.");
  }

  if (current === "methodology.html") {
    setText(".hero h1", "Test Methodology");
    setText(".hero p", "Publicly documents testing procedures, equipment, sampling strategy, scoring rules, and retest mechanisms for reproducibility.");
  }

  if (current === "test-results.html") {
    setText(".hero h1", "Test Results Database");
    setText(".hero p", "Presents structured test metrics, version differences, downloadable interfaces, and filters.");
  }

  if (current === "guides.html") {
    setText(".hero h1", "Guides & Articles");
    setText(".hero p", "Hub for buying guides, maintenance guides, policy explainers, and industry analysis articles.");
  }

  if (current === "brands.html") {
    setText(".hero h1", "Brands & Models");
    setText(".hero p", "Entry point for brand profiles, model series, iteration history, and market performance comparisons.");
  }

  if (current === "deals.html") {
    setText(".hero h1", "Deals & Prices");
    setText(".hero p", "Shows live deals, historical price curves, and channel price gap comparisons.");
  }

  if (current === "community.html") {
    setText(".hero h1", "Community & Feedback");
    setText(".hero p", "Aggregates user discussions, Q&A, voting, and suggestion feedback.");
  }
}

function renderAuthNav() {
  const nav = document.querySelector(".nav-links");
  if (!nav) return;

  const registerLink = nav.querySelector('a[href^="auth-register.html"]');
  const loginLink = nav.querySelector('a[href^="auth-login.html"]');
  let accountLink = nav.querySelector('a[href="account.html"]');
  let logoutLink = nav.querySelector('a[data-auth="logout"]');

  if (!accountLink) {
    accountLink = nav.querySelector('a[data-auth="account"]');
  }

  if (isLoggedIn()) {
    if (registerLink) registerLink.style.display = "none";
    if (loginLink) loginLink.style.display = "none";

    if (!accountLink) {
      accountLink = document.createElement("a");
      accountLink.href = withLang("account.html");
      accountLink.textContent = `${getDisplayName()}${t("accountSuffix")}`;
      accountLink.setAttribute("data-auth", "account");
      nav.appendChild(accountLink);
    } else {
      accountLink.href = withLang("account.html");
      accountLink.textContent = `${getDisplayName()}${t("accountSuffix")}`;
      accountLink.style.display = "";
    }

    if (!logoutLink) {
      logoutLink = document.createElement("a");
      logoutLink.href = "#";
      logoutLink.textContent = t("logout");
      logoutLink.setAttribute("data-auth", "logout");
      nav.appendChild(logoutLink);
    } else {
      logoutLink.textContent = t("logout");
      logoutLink.style.display = "";
    }

    logoutLink.onclick = (event) => {
      event.preventDefault();
      clearAuth();
      window.location.href = withLang("index.html");
    };
  } else {
    if (registerLink) {
      registerLink.style.display = "";
      registerLink.href = withLang("auth-register.html");
    }
    if (loginLink) {
      loginLink.style.display = "";
      loginLink.href = withLang("auth-login.html");
    }
    if (accountLink) accountLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "none";
  }

  localizeNavText(nav);
  renderLanguageSwitch(nav);
  applyLanguageToLinks();
  highlightCurrentNav();
}

function bindLoginForm() {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  const identifier = document.querySelector("#loginIdentifier");
  const password = document.querySelector("#loginPassword");
  const error = document.querySelector("#loginError");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!identifier || !password || !error) return;

    const idValue = identifier.value.trim();
    const passValue = password.value;
    error.textContent = "";

    if (!idValue) {
      error.textContent = t("loginErrorIdentifier");
      return;
    }
    if (passValue.length < 6) {
      error.textContent = t("loginErrorPassword");
      return;
    }

    const displayName = idValue.includes("@") ? idValue.split("@")[0] : idValue;
    setLoggedIn(displayName);
    window.location.href = withLang("account.html");
  });
}

function bindRegisterForm() {
  const form = document.querySelector("#registerForm");
  if (!form) return;

  const email = document.querySelector("#registerEmail");
  const phone = document.querySelector("#registerPhone");
  const password = document.querySelector("#registerPassword");
  const confirm = document.querySelector("#registerConfirm");
  const agree = document.querySelector("#registerAgree");
  const error = document.querySelector("#registerError");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!email || !phone || !password || !confirm || !agree || !error) return;

    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const passValue = password.value;
    const confirmValue = confirm.value;
    error.textContent = "";

    if (!emailValue && !phoneValue) {
      error.textContent = t("registerErrorContact");
      return;
    }
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      error.textContent = t("registerErrorEmail");
      return;
    }
    if (phoneValue && !/^\d{6,}$/.test(phoneValue)) {
      error.textContent = t("registerErrorPhone");
      return;
    }
    if (passValue.length < 6) {
      error.textContent = t("registerErrorPassword");
      return;
    }
    if (passValue !== confirmValue) {
      error.textContent = t("registerErrorConfirm");
      return;
    }
    if (!agree.checked) {
      error.textContent = t("registerErrorAgree");
      return;
    }

    const displayName = emailValue ? emailValue.split("@")[0] : `${t("userDefault")}${phoneValue.slice(-4)}`;
    setLoggedIn(displayName);
    window.location.href = withLang("account.html");
  });
}

function renderAccountProfile() {
  const nameNode = document.querySelector("#accountName");
  const nameCardNode = document.querySelector("#accountNameCard");
  const stateNode = document.querySelector("#accountState");
  const badgeNode = document.querySelector("#accountBadge");
  const emailNode = document.querySelector("#accountEmail");
  const phoneNode = document.querySelector("#accountPhone");
  const regionNode = document.querySelector("#accountRegion");

  if (!nameNode || !stateNode || !badgeNode || !emailNode || !phoneNode || !regionNode) return;

  if (isLoggedIn()) {
    const name = getDisplayName();
    nameNode.textContent = name;
    if (nameCardNode) nameCardNode.textContent = t("accountCardTitle", { name });
    stateNode.textContent = t("accountStateLoggedIn");
    badgeNode.textContent = "Active";
    emailNode.textContent = `${name}@demo.local`;
    phoneNode.textContent = "138****1024";
    regionNode.textContent = getCurrentLang() === "en" ? "Handan, Hebei" : "河北 邯郸";
  } else {
    nameNode.textContent = t("guest");
    if (nameCardNode) nameCardNode.textContent = t("accountCardGuest");
    stateNode.textContent = t("accountStateGuest");
    badgeNode.textContent = "Guest";
    emailNode.textContent = "-";
    phoneNode.textContent = "-";
    regionNode.textContent = "-";
  }
}

function renderDevAuthSwitch() {
  if (!isDevMode()) return;
  if (document.querySelector("#devAuthBar")) return;

  const bar = document.createElement("div");
  bar.id = "devAuthBar";
  bar.className = "dev-auth-bar";
  bar.innerHTML = `
    <span class="label">${t("devBarLabel")}</span>
    <input id="devAuthName" type="text" placeholder="${t("devNamePlaceholder")}" value="${getDisplayName()}" />
    <button id="devLoginBtn" type="button">${t("devSetLoggedIn")}</button>
    <button id="devLogoutBtn" type="button">${t("devSetLoggedOut")}</button>
  `;
  document.body.appendChild(bar);

  const nameInput = document.querySelector("#devAuthName");
  const loginBtn = document.querySelector("#devLoginBtn");
  const logoutBtn = document.querySelector("#devLogoutBtn");

  loginBtn?.addEventListener("click", () => {
    const name = nameInput instanceof HTMLInputElement && nameInput.value.trim() ? nameInput.value.trim() : t("userDefault");
    setLoggedIn(name);
    renderAuthNav();
    renderAccountProfile();
  });

  logoutBtn?.addEventListener("click", () => {
    clearAuth();
    renderAuthNav();
    renderAccountProfile();
  });
}

function initializePage() {
  applyPageLanguage();
  renderAuthNav();
  bindLoginForm();
  bindRegisterForm();
  renderAccountProfile();
  renderDevAuthSwitch();
  applySingleLanguagePresentation();
}

function rerenderPage() {
  if (!ORIGINAL_BODY_HTML) return;
  document.body.innerHTML = ORIGINAL_BODY_HTML;
  initializePage();
}

document.addEventListener("DOMContentLoaded", () => {
  ORIGINAL_BODY_HTML = document.body.innerHTML;
  initializePage();
});
