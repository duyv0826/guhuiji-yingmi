/* ============================================================
   骨灰级 · 页面引擎（v2）
   零内容耦合：文案、结构、色板、玩法、题目全部读自 window.GUIHUIJI_CONFIG。
   引擎只认三样东西：结构挂载点（[data-mount]/[data-ash]）、配置字段名、章节类型名。
   ============================================================ */
(function () {
  "use strict";

  const CONFIG = window.GUIHUIJI_CONFIG;

  /* —— 结构常量（挂载点名，非内容） —— */
  const MOUNT = {
    WORDMARK: "wordmark",
    NAV: "nav",
    THEME_BTN: "theme-btn",
    HERO_KICKER: "hero-kicker",
    HERO_TITLE: "hero-title",
    HERO_SUB: "hero-sub",
    HERO_CTA: "hero-cta",
    TICKER: "ticker",
    SECTIONS: "sections",
    FOOTER: "footer"
  };

  /* —— 章节类型 → 渲染器（引擎感知类型，不感知内容） —— */
  const SECTION_RENDERERS = {
    dictionary: renderDictionarySection,
    timeline: renderTimelineSection,
    quiz: renderQuizSection
  };

  /* —— 引擎内部具名常量（非测量值） —— */
  const ASH_PER_SIDE = 5;        // [data-ash] 容器内注入的像素方块数，与 CSS nth-child 规则一一对应
  const TIMER_TICK_MS = 250;     // 限时条刷新周期
  const ARCHIVE_DEFAULT_MAX = 50;
  const CARD = { W: 640, H: 800, PAD: 48, INSET: 16, SEAL: 96 };  // 分享卡画布

  const URL_PARAMS = new URLSearchParams(window.location.search);

  if (!CONFIG) {
    if (document.body) {
      document.body.textContent = "配置缺失：js/config.js 未加载。";
    }
    return;
  }

  /* ================= 工具 ================= */

  function mount(name) {
    const node = document.querySelector(`[data-mount="${name}"]`);
    if (!node) {
      throw new Error(`缺少挂载点 data-mount="${name}"`);
    }
    return node;
  }

  function clear(node) {
    node.textContent = "";
    return node;
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function serialFor(score, tag) {
    const compact = todayKey().replace(/-/g, "");
    return `${CONFIG.quiz.ui.serialPrefix}-${compact}-${tag}${pad2(score)}`;
  }

  /* 模板占位符替换："{i} / {total}" → "03 / 10" */
  function fill(template, vars) {
    return template.replace(/\{(\w+)\}/g, (raw, key) =>
      Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : raw
    );
  }

  /* —— 种子随机（每日挑战：同一天同一张卷） —— */

  function hashStr(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i += 1) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  function mulberry32(a) {
    return () => {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffleWith(arr, rng) {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function shuffleInPlace(arr) {
    return shuffleWith(arr, Math.random);
  }

  /* ================= 主题 ================= */

  /* 色板值全部来自 config.themes.list[NAME].tokens；默认主题注入 :root，
     其余注入 [data-theme=NAME]，切换只翻 <html> 属性。 */
  function injectThemeStyles() {
    const lines = Object.entries(CONFIG.themes.list).map(([name, theme]) => {
      const vars = Object.entries(theme.tokens)
        .map(([k, v]) => `${k}:${v};`)
        .join("");
      const selector = name === CONFIG.themes.default ? ":root" : `[data-theme="${name}"]`;
      return `${selector}{${vars}}`;
    });
    const style = document.createElement("style");
    style.id = "theme-tokens";
    style.textContent = lines.join("\n");
    document.head.appendChild(style);
  }

  function currentTheme() {
    return document.documentElement.dataset.theme || CONFIG.themes.default;
  }

  function renderThemeToggle() {
    const order = CONFIG.themeOrder;
    const cur = currentTheme();
    const next = order[(order.indexOf(cur) + 1) % order.length];
    mount(MOUNT.THEME_BTN).textContent = CONFIG.themes.list[next].label;
  }

  function applyTheme(name) {
    if (!CONFIG.themes.list[name]) return;
    if (name === CONFIG.themes.default) {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = name;
    }
    renderThemeToggle();
  }

  function initThemeToggle() {
    mount(MOUNT.THEME_BTN).addEventListener("click", () => {
      const order = CONFIG.themeOrder;
      const next = order[(order.indexOf(currentTheme()) + 1) % order.length];
      applyTheme(next);
    });
    const requested = URL_PARAMS.get("theme");
    if (requested && CONFIG.themes.list[requested]) {
      applyTheme(requested);
    } else {
      renderThemeToggle();
    }
  }

  /* ================= 页头 / 首屏 / 跑马灯 ================= */

  function renderChrome() {
    document.title = CONFIG.meta.title;
    mount(MOUNT.WORDMARK).textContent = CONFIG.meta.wordmark;

    const nav = clear(mount(MOUNT.NAV));
    CONFIG.meta.nav.forEach((item) => {
      const link = make("a", null, item.label);
      link.href = item.href;
      nav.appendChild(link);
    });

    mount(MOUNT.HERO_KICKER).textContent = CONFIG.meta.hero.kicker;
    mount(MOUNT.HERO_TITLE).textContent = CONFIG.meta.hero.title;
    mount(MOUNT.HERO_SUB).textContent = CONFIG.meta.hero.sub;

    // CTA 指向考试章节——章节 id 来自 config.sections，引擎不硬编码
    const quizSection = CONFIG.sections.find((s) => s.type === "quiz");
    const cta = mount(MOUNT.HERO_CTA);
    cta.textContent = CONFIG.meta.hero.cta;
    if (quizSection) cta.href = `#${quizSection.id}`;

    const track = clear(mount(MOUNT.TICKER));
    // 复制一份实现无缝循环，CSS 用 translateX(-50%) 收尾
    CONFIG.ticker.concat(CONFIG.ticker).forEach((text) => {
      track.appendChild(make("span", "ticker-item", text));
    });
  }

  /* 像素灰烬装饰：引擎只负责按常量数量注入空方块，形态交给 CSS */
  function renderAsh() {
    document.querySelectorAll("[data-ash]").forEach((field) => {
      clear(field);
      for (let i = 0; i < ASH_PER_SIDE; i += 1) {
        field.appendChild(make("span", "ash"));
      }
    });
  }

  /* ================= 章节框架 ================= */

  function renderSections() {
    const root = clear(mount(MOUNT.SECTIONS));
    CONFIG.sections.forEach((section) => {
      const renderer = SECTION_RENDERERS[section.type];
      if (!renderer) {
        throw new Error(`未知章节类型: ${section.type}`);
      }
      const el = make("section", `section section-${section.type}`);
      el.id = section.id;
      const inner = make("div", "section-inner");
      const head = make("header", "section-head");
      head.appendChild(make("span", "section-index", section.index));
      head.appendChild(make("h2", "section-title", section.title));
      inner.appendChild(head);
      const host = make("div");
      host.dataset.mount = section.id;
      inner.appendChild(host);
      el.appendChild(inner);
      root.appendChild(el);
      renderer(host);
    });
  }

  /* ================= 词源考 ================= */

  function renderDictionarySection(host) {
    const dict = CONFIG.dictionary;
    const card = make("article", "dict-card");

    const head = make("div", "dict-word-row");
    head.appendChild(make("h3", "dict-word", dict.word));
    head.appendChild(make("span", "dict-pinyin", dict.pinyin));
    head.appendChild(make("span", "dict-pos", dict.pos));
    card.appendChild(head);

    const senses = make("div", "dict-block");
    senses.appendChild(make("span", "dict-label", dict.labels.senses));
    const list = make("ol", "dict-senses");
    dict.senses.forEach((sense) => {
      list.appendChild(make("li", null, sense));
    });
    senses.appendChild(list);
    card.appendChild(senses);

    const origin = make("div", "dict-block");
    origin.appendChild(make("span", "dict-label", dict.labels.origin));
    origin.appendChild(make("p", "dict-text", dict.origin));
    card.appendChild(origin);

    const usage = make("div", "dict-block");
    usage.appendChild(make("span", "dict-label", dict.labels.usage));
    usage.appendChild(make("blockquote", "dict-usage", dict.usage));
    card.appendChild(usage);

    const caveat = make("p", "dict-caveat");
    caveat.appendChild(make("span", "dict-caveat-tag", dict.labels.caveat));
    caveat.appendChild(document.createTextNode(dict.caveat));
    card.appendChild(caveat);

    host.appendChild(card);
  }

  /* ================= 世代刻度 ================= */

  function renderTimelineSection(host) {
    const list = make("ol", "era-list");
    CONFIG.eras.forEach((era) => {
      const item = make("li", "era-item");
      item.appendChild(make("span", "era-year", era.year));
      const body = make("div", "era-body");
      body.appendChild(make("h3", "era-name", era.name));
      body.appendChild(make("p", "era-line", era.line));
      item.appendChild(body);
      list.appendChild(item);
    });
    host.appendChild(list);
  }

  /* ================= 认证考试 ================= */

  const quiz = {
    root: null,
    ui: null,
    mode: null,
    run: [],
    index: 0,
    score: 0,
    timerId: null
  };

  function renderQuizSection(host) {
    quiz.root = host;
    host.classList.add("quiz");
    host.setAttribute("aria-live", "polite");
    quiz.ui = CONFIG.quiz.ui;
    renderQuizIntro();
  }

  /* —— 开考页：规则 + 模式卡 —— */
  function renderQuizIntro() {
    stopTimer();
    const root = clear(quiz.root);
    const intro = make("div", "q-intro");
    intro.appendChild(make("h3", "q-intro-title", CONFIG.quiz.intro.title));

    const rules = make("ul", "q-rules");
    CONFIG.quiz.intro.rules.forEach((rule) => {
      rules.appendChild(make("li", null, rule));
    });
    intro.appendChild(rules);

    const cards = make("div", "mode-cards");
    CONFIG.quiz.modes.forEach((mode) => {
      const card = make("button", "mode-card");
      card.type = "button";
      if (URL_PARAMS.get("mode") === mode.id) {
        card.classList.add("is-active");   // URL 指定的模式只做高亮，不自动开考
      }
      card.appendChild(make("span", "mode-card-name", mode.name));
      card.appendChild(make("span", "mode-card-desc", mode.desc));
      card.addEventListener("click", () => startRun(mode));
      cards.appendChild(card);
    });
    intro.appendChild(cards);

    root.appendChild(intro);
  }

  /* —— 每局开卷：题目乱序（可种子化）+ 选项乱序并重映射正解 —— */
  function buildRun(mode) {
    const pool = [...CONFIG.quiz.questions];
    const rng = mode.seed === "daily" ? mulberry32(hashStr(todayKey())()) : null;
    const shuffler = (arr) => (rng ? shuffleWith(arr, rng) : shuffleInPlace(arr));
    const count = Math.min(mode.count ?? pool.length, pool.length);
    return shuffler(pool)
      .slice(0, count)
      .map((q) => {
        const order = shuffler([...q.options.keys()]);
        return {
          prompt: q.prompt,
          fact: q.fact,
          options: order.map((i) => q.options[i]),
          answerIndex: order.indexOf(q.answerIndex)
        };
      });
  }

  function startRun(mode) {
    stopTimer();
    quiz.mode = mode;
    quiz.index = 0;
    quiz.score = 0;
    quiz.run = buildRun(mode);
    renderQuestion();
  }

  function stopTimer() {
    if (quiz.timerId !== null) {
      clearInterval(quiz.timerId);
      quiz.timerId = null;
    }
  }

  function renderQuestion() {
    const root = clear(quiz.root);
    const q = quiz.run[quiz.index];
    const total = quiz.run.length;
    const ui = quiz.ui;

    const stage = make("div", "q-stage");

    // 进度：像素方块 + 计数（文案模板来自配置）
    const progress = make("div", "q-progress");
    const cells = make("span", "q-cells");
    for (let i = 0; i < total; i += 1) {
      const cell = make("i", "q-cell");
      if (i < quiz.index) cell.classList.add("is-done");
      if (i === quiz.index) cell.classList.add("is-now");
      cells.appendChild(cell);
    }
    progress.appendChild(cells);
    progress.appendChild(make("span", "q-count",
      fill(ui.progress, { i: pad2(quiz.index + 1), total: pad2(total) })));
    stage.appendChild(progress);

    // 限时条（仅限时模式；秒数来自配置）
    let timerFill = null;
    let timerCount = null;
    if (quiz.mode.secondsPerQuestion) {
      const timer = make("div", "q-timer");
      timerFill = make("div", "q-timer-fill");
      timer.appendChild(timerFill);
      stage.appendChild(timer);
      timerCount = make("div", "q-timer-count");
      stage.appendChild(timerCount);
    }

    stage.appendChild(make("h3", "q-prompt", q.prompt));

    const options = make("div", "q-options");
    q.options.forEach((optionText, idx) => {
      const label = fill(ui.optionFormat, {
        letter: ui.optionLetters[idx] ?? "",
        text: optionText
      });
      const btn = make("button", "q-option", label);
      btn.type = "button";
      btn.addEventListener("click", () => answer(idx));
      options.appendChild(btn);
    });
    stage.appendChild(options);

    // 反馈区：默认隐藏，答后/超时展开
    const feedback = make("div", "q-feedback");
    feedback.hidden = true;
    const verdict = make("span", "q-verdict");
    feedback.appendChild(verdict);

    const fact = make("p", "q-fact");
    fact.appendChild(make("span", "q-fact-tag", ui.source));
    fact.appendChild(document.createTextNode(q.fact));
    feedback.appendChild(fact);

    const next = make("button", "btn q-next",
      quiz.index === total - 1 ? ui.toResult : ui.next);
    next.type = "button";
    next.addEventListener("click", () => {
      if (quiz.index === total - 1) {
        renderResult();
      } else {
        quiz.index += 1;
        renderQuestion();
      }
    });
    feedback.appendChild(next);
    stage.appendChild(feedback);

    root.appendChild(stage);

    function revealOptions(pickedIndex) {
      options.querySelectorAll(".q-option").forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answerIndex) {
          btn.classList.add("is-correct");
        } else if (idx === pickedIndex) {
          btn.classList.add("is-wrong");
        } else {
          btn.classList.add("is-muted");
        }
      });
    }

    function showFeedback(text, tone) {
      verdict.textContent = text;
      verdict.classList.add(tone);
      feedback.hidden = false;
      next.focus();
    }

    function answer(picked) {
      stopTimer();
      const isCorrect = picked === q.answerIndex;
      if (isCorrect) quiz.score += 1;
      revealOptions(picked);
      showFeedback(isCorrect ? ui.correct : ui.wrong,
        isCorrect ? "is-correct" : "is-wrong");
    }

    function onTimeout() {
      revealOptions(null);
      showFeedback(ui.timeout, "is-wrong");
    }

    function startTimer() {
      const seconds = quiz.mode.secondsPerQuestion;
      if (!seconds || !timerFill || !timerCount) return;
      const deadline = Date.now() + seconds * 1000;
      timerFill.style.width = "100%";
      timerCount.textContent = String(seconds);
      quiz.timerId = setInterval(() => {
        const remain = Math.max(0, deadline - Date.now());
        timerFill.style.width = `${(remain / (seconds * 1000)) * 100}%`;
        timerCount.textContent = String(Math.ceil(remain / 1000));
        if (remain <= 0) {
          stopTimer();
          onTimeout();
        }
      }, TIMER_TICK_MS);
    }

    startTimer();
  }

  /* —— 结果页：档位（按得分比例）+ 档案 + 分享卡 —— */
  function renderResult() {
    stopTimer();
    const root = clear(quiz.root);
    const ui = quiz.ui;
    const total = quiz.run.length;
    const ratio = total > 0 ? quiz.score / total : 0;
    const tier = CONFIG.tiers.find((t) => ratio >= t.min && ratio <= t.max)
      || CONFIG.tiers[CONFIG.tiers.length - 1];
    const certified = quiz.score === total;   // 全对才有编号与印章
    const serial = certified ? serialFor(quiz.score, quiz.mode.tag) : null;

    const entries = pushArchive({
      date: todayKey(),
      mode: quiz.mode.id,
      score: quiz.score,
      total,
      serial
    });
    const sameMode = entries.filter((e) => e.mode === quiz.mode.id);
    const best = sameMode.reduce((m, e) => Math.max(m, e.score), 0);

    const result = make("div", "q-result");

    const cert = make("div", certified ? "cert cert-certified" : "cert");
    cert.appendChild(make("span", "cert-tag", ui.certTag));
    cert.appendChild(make("h3", "cert-tier", tier.title));
    cert.appendChild(make("p", "cert-verdict", tier.verdict));

    const meta = make("dl", "cert-meta");
    [
      { dt: ui.scoreLabel, dd: `${pad2(quiz.score)} / ${pad2(total)}` },
      { dt: ui.modeLabel, dd: quiz.mode.name },
      { dt: ui.serialLabel, dd: serial || ui.noSerial },
      { dt: ui.dateLabel, dd: todayKey() }
    ].forEach((row) => {
      const wrap = make("div", "cert-row");
      wrap.appendChild(make("dt", null, row.dt));
      wrap.appendChild(make("dd", null, row.dd));
      meta.appendChild(wrap);
    });
    cert.appendChild(meta);
    cert.appendChild(make("span", "cert-seal"));   // 纯 CSS 印章

    result.appendChild(cert);

    result.appendChild(make("p", "q-stats",
      fill(ui.statsTemplate, { n: entries.length, mode: quiz.mode.name, best, total })));

    const actions = make("div", "q-actions");
    const share = make("button", "btn q-share", ui.share);
    share.type = "button";
    share.addEventListener("click", () => {
      drawShareCard({ tierTitle: tier.title, certified, serial });
    });
    actions.appendChild(share);

    const retry = make("button", "btn btn-primary q-retry", ui.retry);
    retry.type = "button";
    retry.addEventListener("click", renderQuizIntro);
    actions.appendChild(retry);
    result.appendChild(actions);

    root.appendChild(result);
  }

  /* ================= 成绩档案（localStorage，仅本机） ================= */

  function readArchive() {
    try {
      const raw = localStorage.getItem(CONFIG.archive.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function pushArchive(entry) {
    const max = CONFIG.archive.maxEntries ?? ARCHIVE_DEFAULT_MAX;
    const entries = readArchive();
    entries.push(entry);
    try {
      localStorage.setItem(CONFIG.archive.storageKey, JSON.stringify(entries.slice(-max)));
    } catch {
      /* 隐私模式下写不进去就算了，不影响本局 */
    }
    return entries;
  }

  /* ================= 分享卡（Canvas，读取当前主题 Token 上色） ================= */

  function drawShareCard(data) {
    const ui = quiz.ui;
    const css = getComputedStyle(document.documentElement);
    const tok = (name, fallback) => {
      const v = css.getPropertyValue(name).trim();
      return v || fallback;
    };
    const num = (name, fallback) => {
      const v = parseFloat(css.getPropertyValue(name));
      return Number.isFinite(v) ? v : fallback;
    };

    const canvas = document.createElement("canvas");
    canvas.width = CARD.W;
    canvas.height = CARD.H;
    const ctx = canvas.getContext("2d");

    // 底色 + 双框（线宽取自 Design Token）
    ctx.fillStyle = tok("--paper", "#F3EFE4");
    ctx.fillRect(0, 0, CARD.W, CARD.H);
    ctx.strokeStyle = tok("--ink", "#1A1713");
    ctx.lineWidth = num("--border-frame", 6);
    ctx.strokeRect(CARD.PAD, CARD.PAD, CARD.W - CARD.PAD * 2, CARD.H - CARD.PAD * 2);
    ctx.lineWidth = num("--border-hair", 1);
    ctx.strokeRect(
      CARD.PAD + CARD.INSET, CARD.PAD + CARD.INSET,
      CARD.W - (CARD.PAD + CARD.INSET) * 2, CARD.H - (CARD.PAD + CARD.INSET) * 2
    );

    const centerX = CARD.W / 2;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "8px";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = tok("--ink-soft", "#4A443C");
    ctx.font = `500 20px "JetBrains Mono", Consolas, monospace`;
    ctx.fillText(ui.certTag, centerX, CARD.PAD + 110);

    ctx.fillStyle = data.certified ? tok("--accent", "#C0271D") : tok("--ink", "#1A1713");
    ctx.font = `900 88px Georgia, "Songti SC", "SimSun", serif`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "4px";
    ctx.fillText(data.tierTitle, centerX, CARD.PAD + 230);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

    ctx.fillStyle = tok("--ink-soft", "#4A443C");
    ctx.font = `400 22px Georgia, "Songti SC", "SimSun", serif`;
    ctx.fillText(CONFIG.tiers.find((t) => t.title === data.tierTitle)?.verdict ?? "",
      centerX, CARD.PAD + 290);

    // 元信息（细线分隔）
    const rows = [
      [ui.scoreLabel, `${pad2(quiz.score)} / ${pad2(quiz.run.length)}`],
      [ui.modeLabel, quiz.mode.name],
      [ui.serialLabel, data.serial || ui.noSerial],
      [ui.dateLabel, todayKey()]
    ];
    const metaTop = CARD.PAD + 360;
    const rowH = 48;
    const metaW = CARD.W - (CARD.PAD + CARD.INSET) * 2 - 96;
    const metaX = (CARD.W - metaW) / 2;
    rows.forEach(([label, value], i) => {
      const y = metaTop + i * rowH;
      ctx.strokeStyle = tok("--line", "rgba(26,23,19,0.16)");
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(metaX, y);
      ctx.lineTo(metaX + metaW, y);
      ctx.stroke();
      ctx.font = `400 18px "JetBrains Mono", Consolas, monospace`;
      ctx.textAlign = "left";
      ctx.fillStyle = tok("--ink-soft", "#4A443C");
      ctx.fillText(label, metaX, y + 30);
      ctx.textAlign = "right";
      ctx.fillStyle = tok("--ink", "#1A1713");
      ctx.fillText(value, metaX + metaW, y + 30);
    });

    // 印章（全对才有）
    if (data.certified) {
      ctx.save();
      ctx.translate(CARD.W - CARD.PAD - CARD.SEAL / 2 - 24, CARD.PAD + CARD.SEAL / 2 + 24);
      ctx.rotate(-12 * Math.PI / 180);
      ctx.strokeStyle = tok("--accent", "#C0271D");
      ctx.lineWidth = num("--border-bold", 3);
      ctx.strokeRect(-CARD.SEAL / 2, -CARD.SEAL / 2, CARD.SEAL, CARD.SEAL);
      ctx.fillStyle = tok("--accent", "#C0271D");
      ctx.fillRect(-CARD.SEAL / 4, -CARD.SEAL / 4, CARD.SEAL / 2, CARD.SEAL / 2);
      ctx.restore();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = tok("--ink-faint", "rgba(26,23,19,0.38)");
    ctx.font = `400 15px "JetBrains Mono", Consolas, monospace`;
    ctx.fillText(`${ui.serialPrefix} · ${todayKey()}`, centerX, CARD.H - CARD.PAD - 24);

    // toDataURL 同步导出（部分内嵌环境 toBlob 回调不触发）
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${data.serial || ui.serialPrefix}.png`;
    a.click();
  }

  /* ================= 页脚 ================= */

  function renderFooter() {
    const root = clear(mount(MOUNT.FOOTER));
    root.appendChild(make("p", "foot-note", CONFIG.footer.note));
    root.appendChild(make("p", "foot-colophon", CONFIG.footer.colophon));
  }

  /* ================= 启动 ================= */

  function boot() {
    injectThemeStyles();
    initThemeToggle();
    renderChrome();
    renderAsh();
    renderSections();
    renderFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
