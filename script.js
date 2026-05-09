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

const pageTitleMap = window.PAGE_TITLE_MAP || { zh: {}, en: {} };
const pageTextOps = window.PAGE_TEXT_OPS || {};
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

function applyTextOps(ops) {
  if (!ops || !ops.length) return;
  for (const op of ops) {
    if (typeof op.index === "number") {
      setTextAt(op.selector, op.index, op.text);
    } else {
      setText(op.selector, op.text);
    }
  }
}

function validatePageI18nConfig() {
  if (!isDevMode()) return [];

  const lang = getCurrentLang();
  const pageOps = pageTextOps[current] || {};
  const ops = pageOps[lang] || [];
  const titleMap = pageTitleMap[lang] || {};
  const issues = [];

  if (!titleMap[current]) {
    issues.push(`Missing title mapping for ${current} (${lang})`);
  }

  for (const op of ops) {
    const selector = op.selector;
    const nodes = document.querySelectorAll(selector);
    if (typeof op.index === "number") {
      if (!nodes[op.index]) {
        issues.push(`Selector index miss: ${selector}[${op.index}] for ${current} (${lang})`);
      }
      continue;
    }

    if (!nodes.length) {
      issues.push(`Selector miss: ${selector} for ${current} (${lang})`);
    }
  }

  if (issues.length) {
    for (const issue of issues) {
      console.warn(`[i18n-config] ${issue}`);
    }
  }

  return issues;
}

function renderI18nDiagnostics(issues) {
  if (!isDevMode()) return;
  if (!issues || !issues.length) return;

  const existing = document.querySelector("#i18nDiagPanel");
  if (existing) existing.remove();

  const panel = document.createElement("aside");
  panel.id = "i18nDiagPanel";
  panel.className = "i18n-diag-panel";

  const title = document.createElement("div");
  title.className = "i18n-diag-title";
  title.textContent = `i18n diagnostics (${issues.length})`;

  const list = document.createElement("ul");
  list.className = "i18n-diag-list";
  for (const issue of issues) {
    const item = document.createElement("li");
    item.textContent = issue;
    list.appendChild(item);
  }

  panel.appendChild(title);
  panel.appendChild(list);
  document.body.appendChild(panel);
}

function applyZhPageLanguage() {
  const title = pageTitleMap.zh[current];
  if (title) document.title = title;
  const ops = pageTextOps[current] && pageTextOps[current].zh;
  applyTextOps(ops);
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

  const title = pageTitleMap.en[current];
  if (title) document.title = title;

  const ops = pageTextOps[current] && pageTextOps[current].en;
  applyTextOps(ops);

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
  const i18nIssues = validatePageI18nConfig();
  applyPageLanguage();
  renderAuthNav();
  bindLoginForm();
  bindRegisterForm();
  renderAccountProfile();
  renderDevAuthSwitch();
  applySingleLanguagePresentation();
  renderI18nDiagnostics(i18nIssues);
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
