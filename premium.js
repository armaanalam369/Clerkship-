/* Premium layer — floating dock, settings drawer, question-palette sheet, small quality-of-life extras.
   Loads after app.js and reuses its globals (prefs, setPref, ACTIONS, CONFIG, pick, finishTest, load, save, $). */
(function () {
  "use strict";
  const UI_KEY = "pyq_ui_v1";
  const DEF = { accent: "indigo", qfont: "serif", width: 70, compact: false, calm: false, auto: false, haptic: true, hideTimer: false, goal: CONFIG.dailyGoal };
  let ui = { ...DEF, ...load(UI_KEY, {}) };
  const ic = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const I = {
    gear: ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    focus: ic('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    grid: ic('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    up: ic('<path d="M12 19V5M5 12l7-7 7 7"/>'),
    home: ic('<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>')
  };

  /* ---- dock ---- */
  const dock = document.createElement("div"); dock.className = "dock";
  dock.innerHTML = `<button class="fab main" data-p="toggle" aria-label="Quick controls" aria-expanded="false">${I.gear}</button>
    <button class="fab" data-p="settings" data-tip="Settings" aria-label="Settings">${I.gear}</button>
    <button class="fab" data-p="theme" data-tip="Light / dark" aria-label="Toggle theme">${I.sun}</button>
    <button class="fab quiz-only" data-p="palette" data-tip="Question palette" aria-label="Question palette">${I.grid}</button>
    <button class="fab quiz-only" data-p="focus" data-tip="Focus mode" aria-label="Focus mode">${I.focus}</button>
    <button class="fab" data-p="home" data-tip="Dashboard" aria-label="Dashboard">${I.home}</button>
    <button class="fab" data-p="top" data-tip="Back to top" aria-label="Back to top">${I.up}</button>`;
  document.body.appendChild(dock);

  /* ---- drawer ---- */
  const scrim = document.createElement("div"); scrim.className = "scrim";
  const drawer = document.createElement("aside"); drawer.className = "drawer"; drawer.setAttribute("aria-label", "Settings"); drawer.setAttribute("role", "dialog");
  document.body.append(scrim, drawer);
  const seg = (k, opts, cur) => `<div class="seg" data-k="${k}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(cur) === String(v) ? "on" : ""}">${l}</button>`).join("")}</div>`;
  const sw = (c, v) => `<button class="sw ${ui.accent === v ? "on" : ""}" data-accent="${v}" style="background:${c}" aria-label="${v} colour"></button>`;
  const tog = (k, t, s) => `<label class="row"><span>${t}<small>${s}</small></span><input type="checkbox" class="switch" data-t="${k}" ${ui[k] ? "checked" : ""}></label>`;
  function drawDrawer() {
    const th = prefs.theme || "auto";
    drawer.innerHTML = `<h2>Settings <button class="x" data-p="close" aria-label="Close">×</button></h2>
      <p class="meta">Saved on this device only.</p>
      <h4>Theme</h4>${seg("theme", [["auto", "Auto"], ["light", "Light"], ["dark", "Dark"]], th)}
      <h4>Colour</h4><div class="swatches">${sw("#1F2A5C", "indigo")}${sw("#0F5E48", "emerald")}${sw("#8F1D4A", "rose")}${sw("#4B2A9B", "violet")}</div>
      <h4>Text size</h4><input type="range" min="0.9" max="1.4" step="0.05" value="${prefs.font}" data-r="font" aria-label="Text size">
      <h4>Question font</h4>${seg("qfont", [["serif", "Serif"], ["sans", "Sans"]], ui.qfont)}
      <h4>Reading width</h4><input type="range" min="46" max="90" step="2" value="${ui.width}" data-r="width" aria-label="Reading width">
      <h4>Quiz</h4>
      ${tog("auto", "Auto-advance", "Move on shortly after you pick an answer")}
      ${tog("haptic", "Vibration feedback", "Small tap on phones when you answer")}
      ${tog("hideTimer", "Hide the timer", "The clock still runs, you just don't see it")}
      <h4>Interface</h4>
      ${tog("compact", "Compact layout", "Tighter cards and options")}
      ${tog("calm", "Reduce motion", "Turns off animations")}
      <label class="row"><span>Daily goal<small>Questions per day</small></span><input type="number" min="5" max="500" step="5" value="${ui.goal}" data-n="goal"></label>
      <div class="quiz-actions"><button class="btn" data-p="reset">Reset appearance</button></div>`;
  }
  const open = () => { drawDrawer(); drawer.classList.add("open"); scrim.classList.add("on"); };
  const close = () => { drawer.classList.remove("open"); scrim.classList.remove("on"); document.body.classList.remove("palette-open"); };

  function apply() {
    const b = document.body;
    b.dataset.accent = ui.accent; b.dataset.qfont = ui.qfont;
    b.style.setProperty("--qwidth", ui.width + "ch");
    b.classList.toggle("compact", ui.compact); b.classList.toggle("calm", ui.calm);
    const t = document.createElement("style"); t.id = "pm-timer"; (document.getElementById("pm-timer") || document.head.appendChild(t)).textContent = ui.hideTimer ? ".timer{display:none}" : "";
    CONFIG.dailyGoal = ui.goal;
    save(UI_KEY, ui);
  }
  const set = (k, v) => { ui[k] = v; apply(); };

  /* ---- events ---- */
  const P = {
    toggle: () => { const o = dock.classList.toggle("open"); dock.querySelector(".main").setAttribute("aria-expanded", o); },
    settings: open, close, theme: () => ACTIONS.theme(),
    focus: () => { ACTIONS.focus(); dock.classList.remove("open"); },
    palette: () => { document.body.classList.add("palette-open"); scrim.classList.add("on"); },
    home: () => ACTIONS.home(), top: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    reset: () => { ui = { ...DEF }; setPref("font", 1); setPref("theme", null); apply(); drawDrawer(); toast("Appearance reset."); }
  };
  dock.addEventListener("click", e => { const b = e.target.closest("[data-p]"); if (b) P[b.dataset.p](); });
  drawer.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.p) return P[b.dataset.p]();
    if (b.dataset.accent) { set("accent", b.dataset.accent); drawDrawer(); }
    const g = b.closest(".seg"); if (!g) return;
    if (g.dataset.k === "theme") setPref("theme", b.dataset.v === "auto" ? null : b.dataset.v); else set(g.dataset.k, b.dataset.v);
    drawDrawer();
  });
  drawer.addEventListener("input", e => {
    const t = e.target;
    if (t.dataset.r === "font") setPref("font", +t.value); else if (t.dataset.r === "width") set("width", +t.value);
    else if (t.dataset.t) set(t.dataset.t, t.checked); else if (t.dataset.n) set("goal", Math.max(5, +t.value || DEF.goal));
  });
  drawer.addEventListener("change", e => { if (e.target.dataset.n && document.body.dataset.view === "dashboard") renderDashboard(); });
  scrim.addEventListener("click", close);
  document.addEventListener("click", e => { if (document.body.classList.contains("palette-open") && e.target.closest(".nav-cell")) close(); });
  document.addEventListener("keydown", e => {
    const typing = /TEXTAREA|INPUT|SELECT/.test(e.target.tagName);
    if (e.key === "Escape") { close(); dock.classList.remove("open"); const m = $("modal"); if (!m.classList.contains("hidden")) m.click(); }
    else if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && $("modal").classList.contains("hidden")) {
      if (e.key === ",") open(); else if (e.key.toLowerCase() === "f" && document.body.dataset.view === "quiz") ACTIONS.focus();
    }
  });

  /* ---- hooks into the quiz engine ---- */
  const origPick = pick;
  window.pick = function (i) {
    const a = activeQuiz, q = a && a.questions[a.index], fresh = q && !(a.mode === "practice" && a.answers[q.id] !== undefined);
    origPick(i);
    if (!fresh) return;
    if (ui.haptic && navigator.vibrate) navigator.vibrate(12);
    if (ui.auto && a.index < a.questions.length - 1) { const at = a.index; setTimeout(() => { if (activeQuiz === a && a.index === at) goToQuestion(at + 1); }, a.mode === "practice" ? 1400 : 350); }
  };
  const origFinish = finishTest;
  window.finishTest = function () {
    origFinish();
    if (currentRecord && currentRecord.scorePercent >= 80 && !ui.calm) confetti();
  };
  function confetti() {
    const cols = ["#D98E04", "#1E7A55", "#8E9DFF", "#B4372F", "#F2B33D"];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement("i"); c.className = "confetti";
      c.style.cssText = `left:${Math.random() * 100}vw;background:${cols[i % 5]};animation-duration:${1.6 + Math.random() * 1.8}s;animation-delay:${Math.random() * .5}s;transform:rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(c); setTimeout(() => c.remove(), 4200);
    }
  }
  apply();
})();
