/* MUFASA site behaviour: renders content from data.js in English or Hebrew and wires the players.
   INLINE playback (YouTube / SoundCloud embeds) runs only when the page is served over http(s) by a normal host.
   Inside a Claude artifact (window.ARTIFACT) or from file://, every play control is a real link that opens the source. */
(function () {
  const D = window.MUFASA, I = window.I18N, U = I.ui, HE = I.he;
  // SoundCloud's widget works from any page except a Claude artifact. YouTube embeds also need a real web address:
  // from file:// YouTube receives no referrer and refuses with error 153.
  const SC_INLINE = !window.ARTIFACT;
  const INLINE = !window.ARTIFACT && /^https?:$/.test(location.protocol);
  const $ = s => document.querySelector(s);
  const el = (tag, attrs = {}, html = "") => { const n = document.createElement(tag); for (const k in attrs) n.setAttribute(k, attrs[k]); n.innerHTML = html; return n; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const toSec = ts => ts.split(":").map(Number).reduce((a, v) => a * 60 + v, 0);
  const fmt = s => { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0"); };
  const parseList = txt => txt.trim().split("\n").map(l => { const [ts, name] = l.split("|"); return { ts: ts.trim(), s: toSec(ts.trim()), name: name.trim(), own: /- Mufasa/i.test(name) }; });
  const LOCAL = { "07K_ATuu5UI": "bday-set", "49zcWd8tcqg": "interview", "XzL-l122XKU": "pov", "q-HHcyZXJs8": "why-worry", "X3ODDjnSJu8": "masks-off", "asoT7YqhYEg": "sound-healing" };
  const ytThumb = id => LOCAL[id] ? `assets/img/art/${LOCAL[id]}.jpg` : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const ytUrl = (id, s) => `https://www.youtube.com/watch?v=${id}${s ? "&t=" + s + "s" : ""}`;
  const icon = n => `<svg><use href="#i-${n}"/></svg>`;
  const ext = 'target="_blank" rel="noopener"';

  let L = 0; // 0 = English, 1 = Hebrew
  const t = k => (U[k] ? U[k][L] : k);
  const he = (group, key, field, fallback) => (L && HE[group] && HE[group][key] && HE[group][key][field] != null ? HE[group][key][field] : fallback);
  if (!INLINE) document.documentElement.classList.add("linkout");

  /* ---------- playable registry ---------- */
  const PLAY = {};
  D.horizon.forEach(e => { if (e.sc) PLAY["ep-" + e.ep] = { url: e.sc, title: `Horizon ${e.ep}: ${e.title}`, sub: "Horizon Series", art: e.art, page: e.scPage }; });
  D.originals.forEach(o => PLAY[o.id] = { url: o.sc, title: o.title + (o.feat ? " " + o.feat : ""), sub: "MUFASA", art: o.art, page: o.scPage });
  PLAY.bday = { url: D.bday.sc, title: "Birthday set, 27.8.26", sub: "Live", art: D.bday.art, page: D.bday.scPage };
  const playLink = (key, cls, label) => `<a class="${cls}" data-play="${key}" href="${PLAY[key].page}" ${ext}>${icon("play")} ${label}</a>`;

  /* ---------- static text ---------- */
  function applyStatic() {
    document.querySelectorAll("[data-i18n]").forEach(n => { const v = U[n.dataset.i18n]; if (v) n.innerHTML = v[L]; });
    document.querySelectorAll("[data-i18n-ph]").forEach(n => { const v = U[n.dataset.i18nPh]; if (v) n.placeholder = v[L]; });
    $("#ticker").innerHTML = t("ticker") + t("ticker");
    $("#langBtn").textContent = t("lang.switch");
    $("#langBtn").setAttribute("lang", L ? "en" : "he");
    if (!dock.key) $("#dockSub").textContent = t("dock.now");
  }

  /* ---------- horizon strata ---------- */
  function renderStrata() {
    const strata = $("#strata"); strata.innerHTML = "";
    D.horizon.forEach(e => {
      const soon = he("horizon", e.ep, "soon", e.soon), phase = he("horizon", e.ep, "phase", e.phase), text = he("horizon", e.ep, "text", e.text);
      const row = el("article", { class: "stratum rv", style: `--band:${e.band}` });
      const list = e.list ? parseList(e.list) : [];
      row.innerHTML = `
        <div class="stratum__time mono">Ep ${e.ep}<b>${e.clock}</b>${phase}</div>
        ${e.art ? `<img class="stratum__art" src="${e.art}" alt="Horizon ${e.ep}: ${esc(e.title)}" loading="lazy">` : `<div class="stratum__art stratum__art--empty mono">${soon}</div>`}
        <div class="stratum__text"><h3 lang="en">${esc(e.title)}</h3><p>${text}</p></div>
        <div class="stratum__acts">${e.sc ? `
          ${playLink("ep-" + e.ep, "chip", t("btn.play"))}
          <a class="chip" href="${ytUrl(e.yt)}" ${ext}>YouTube ${icon("arrow")}</a>
          <button class="chip" type="button" data-toggle aria-expanded="false">${list.length} ${t("btn.tracks")}</button>` : `<span class="chip chip--static">${soon}</span>`}
        </div>
        ${list.length ? `<ol class="stratum__list" dir="ltr">${list.map(x => `<li><a href="${ytUrl(e.yt, x.s)}" ${ext}><time>${x.ts}</time><span class="${x.own ? "own" : ""}">${esc(x.name)}</span></a></li>`).join("")}</ol>` : ""}`;
      strata.append(row);
    });
  }
  $("#strata").addEventListener("click", ev => {
    const b = ev.target.closest("[data-toggle]"); if (!b) return;
    const open = b.closest(".stratum").classList.toggle("is-open");
    b.setAttribute("aria-expanded", open); setTimeout(() => window.__sky.measure(), 50);
  });

  /* ---------- originals slabs ---------- */
  let openSlabIdx = 3;
  function renderSlabs() {
    const slabs = $("#slabs"); slabs.innerHTML = "";
    D.originals.forEach((o, i) => {
      const date = he("originals", o.id, "date", o.date), plays = he("originals", o.id, "plays", o.plays);
      const quote = he("originals", o.id, "quote", o.quote), text = he("originals", o.id, "text", o.text), feat = he("originals", o.id, "feat", o.feat);
      const s = el("article", { class: "slab rv" + (i === openSlabIdx ? " is-open" : ""), tabindex: "0", "aria-label": o.title });
      s.dataset.i = i;
      s.innerHTML = `
        <img class="slab__art" src="${o.art}" alt="" loading="lazy">
        ${o.isNew ? `<span class="badge-new">${t("badge.new")}</span>` : ""}
        <span class="slab__no mono">0${i + 1} / ${date}</span>
        <div class="slab__title" lang="en">${esc(o.title)}</div>
        <div class="slab__body">
          <h3><span lang="en">${esc(o.title)}</span>${feat ? ` <span class="slab__feat">${esc(feat)}</span>` : ""}</h3>
          <blockquote>${quote}</blockquote>
          <p>${esc(text)}</p>
          <div class="slab__meta mono">${o.credits.map(([k, v]) => `<span>${(L && U.credit[1][k]) || k} <b>${esc(v)}</b></span>`).join("")}<span>${plays}</span></div>
          <div class="slab__acts">
            ${playLink(o.id, "btn", t("btn.play"))}
            <a class="btn btn--ghost" href="${o.scPage}" ${ext}>SoundCloud ${icon("arrow")}</a>
            ${o.yt ? `<a class="btn btn--ghost" href="${ytUrl(o.yt)}" ${ext}>YouTube ${icon("arrow")}</a>` : ""}
          </div>
        </div>`;
      slabs.append(s);
    });
  }
  const slabsEl = $("#slabs");
  const openSlab = s => { if (s.classList.contains("is-open")) return; openSlabIdx = +s.dataset.i; slabsEl.querySelectorAll(".slab").forEach(x => x.classList.toggle("is-open", x === s)); };
  slabsEl.addEventListener("click", ev => { const s = ev.target.closest(".slab"); if (s && !ev.target.closest("a,button")) openSlab(s); });
  slabsEl.addEventListener("keydown", ev => { if (ev.key === "Enter" && ev.target.classList.contains("slab")) openSlab(ev.target); });

  /* ---------- YouTube: facade that embeds where allowed, links out everywhere else ---------- */
  function facade(box, id, start, label) {
    box.dataset.label = label;
    box.innerHTML = `<img src="${ytThumb(id)}" alt="" loading="lazy"><a class="yt-play" href="${ytUrl(id, start)}" ${ext} aria-label="${esc(label)}"><span class="play-diamond">${icon("play")}</span><span class="yt-badge mono">YouTube &nearr;</span></a>`;
    box.querySelector("a").addEventListener("click", ev => { if (INLINE) { ev.preventDefault(); embed(box, id, start); } });
  }
  function embed(box, id, start = 0) {
    // YouTube error 153 = the embed arrived without a referrer. Send the origin explicitly.
    if (typeof widget !== "undefined" && widget && dock.playing) widget.pause();
    // only one video at a time: put the previous one back to its cover image
    if (embed.cur && embed.cur.box !== box && embed.cur.box.isConnected) { const c = embed.cur; facade(c.box, c.id, c.start, c.label); }
    embed.cur = { box, id, start, label: box.dataset.label || "" };
    const origin = encodeURIComponent(location.origin);
    box.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&start=${start}&rel=0&playsinline=1&origin=${origin}" title="YouTube video" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  }

  /* ---------- set anatomy ---------- */
  const B = D.bday, set = parseList(B.list), frame = $("#bdayFrame"), tl = $("#timeline"), tip = $("#tip");
  let curSeg = -1;
  function nowTrack(i) {
    if (i < 0) { $("#nowTrack").innerHTML = `<span class="mono">${t("an.pick")}</span><strong lang="en">Mufasa B-Day set, 27.8.26</strong>`; return; }
    const x = set[i];
    $("#nowTrack").innerHTML = `<span class="mono">${t("an.track")} ${i + 1} ${t("an.of")} ${set.length} &middot; <span dir="ltr">${x.ts}</span>${x.own ? " &middot; " + t("an.own") : ""}</span><strong lang="en" dir="ltr">${esc(x.name)}</strong>
      ${INLINE ? "" : `<a class="chip" style="margin-top:12px" href="${ytUrl(B.yt, x.s)}" ${ext}>${t("an.open")} <span dir="ltr">${x.ts}</span> ${icon("arrow")}</a>`}`;
  }
  facade(frame, B.yt, 0, "Birthday set");
  set.forEach((x, i) => {
    const end = (set[i + 1] || { s: B.end }).s, dur = end - x.s;
    const seg = el("a", { class: "seg" + (x.own ? " own" : ""), role: "listitem", style: `flex:${dur} 0 0`, href: ytUrl(B.yt, x.s), target: "_blank", rel: "noopener", "aria-label": `${x.ts} ${x.name}` });
    seg.addEventListener("mouseenter", () => { tip.innerHTML = `<span class="mono" dir="ltr">${x.ts} &middot; ${Math.round(dur / 60)} ${t("an.min")}</span><span dir="ltr">${esc(x.name)}</span>`; tip.classList.add("on"); });
    seg.addEventListener("mousemove", ev => { tip.style.left = Math.min(innerWidth - 300, ev.clientX + 14) + "px"; tip.style.top = (ev.clientY - 70) + "px"; });
    seg.addEventListener("mouseleave", () => tip.classList.remove("on"));
    seg.addEventListener("click", ev => {
      curSeg = i; tl.querySelectorAll(".is-on").forEach(n => n.classList.remove("is-on")); seg.classList.add("is-on");
      nowTrack(i);
      if (INLINE) { ev.preventDefault(); embed(frame, B.yt, x.s); if (dock.playing && widget) widget.pause(); }
    });
    tl.append(seg);
  });
  for (let h = 0; h <= 150; h += 30) $("#ticks").append(el("span", { style: `left:${h / 150 * 100}%` }, h === 0 ? "0:00" : `${Math.floor(h / 60)}:${String(h % 60).padStart(2, "0")}`));

  /* ---------- watch ---------- */
  function renderReel() {
    const reel = $("#reel"); reel.innerHTML = "";
    D.videos.forEach(v => {
      const title = he("videos", v.yt, "title", v.title), sub = he("videos", v.yt, "sub", v.sub);
      const f = el("figure", { class: "vid rv" + (v.big ? " vid--big" : "") });
      f.innerHTML = `<div class="yt-frame"></div><figcaption><b>${esc(title)}</b><span class="mono">${sub}</span></figcaption>`;
      facade(f.querySelector(".yt-frame"), v.yt, 0, title);
      reel.append(f);
    });
  }

  /* ---------- dates ---------- */
  function renderDates() {
    const dl = $("#datesList"); dl.innerHTML = "";
    D.dates.forEach((d, i) => {
      const h = L ? HE.dates[i] : d;
      const r = el("div", { class: "date rv" });
      const cta = d.status === "Sold out" ? `<span class="chip sold">${t("d.sold")}</span>` : d.status === "Soon" ? `<a class="chip" href="#book">${t("d.notify")}</a>` : `<a class="chip" href="#book">${t("d.tickets")} ${icon("arrow")}</a>`;
      r.innerHTML = `<div class="date__day">${d.d}<small>${h.dow} &middot; ${h.m}</small></div>
        <div class="date__event">${esc(h.event)}<span>${esc(h.where)}</span></div>
        <div class="date__coord mono" dir="ltr">${d.coord}</div><div class="date__slot mono">${h.slot}</div>${cta}`;
      dl.append(r);
    });
  }

  /* ---------- field notes ---------- */
  function renderNotes() {
    const nl = $("#notesList"); nl.innerHTML = "";
    D.notes.forEach((n, i) => {
      const a = el("a", { class: "note", href: n.href, target: "_blank", rel: "noopener", style: `--n1:${n.n[0]};--n2:${n.n[1]}` });
      a.innerHTML = `<span class="note__kind mono"><span>${L ? HE.noteKinds[n.kind] : n.kind}</span><span>&nearr;</span></span><span class="note__text">${esc(L ? HE.notes[i] : n.text)}</span><span class="note__date mono" dir="ltr">${n.date}</span>`;
      nl.append(a);
    });
  }

  /* ---------- masks off slider ---------- */
  const masks = $("#masks");
  const setCut = pct => { pct = Math.max(0, Math.min(100, pct)); masks.style.setProperty("--cut", pct + "%"); masks.setAttribute("aria-valuenow", Math.round(pct)); };
  let dragging = false, idle = true;
  const fromEvent = ev => { const r = masks.getBoundingClientRect(); setCut((ev.clientX - r.left) / r.width * 100); };
  masks.addEventListener("pointerdown", ev => { idle = false; dragging = true; masks.setPointerCapture(ev.pointerId); fromEvent(ev); });
  masks.addEventListener("pointermove", ev => { if (dragging) fromEvent(ev); });
  masks.addEventListener("pointerup", () => dragging = false);
  masks.addEventListener("keydown", ev => { idle = false; const v = +masks.getAttribute("aria-valuenow"); if (ev.key === "ArrowLeft") setCut(v - 5); if (ev.key === "ArrowRight") setCut(v + 5); });
  const t0 = performance.now();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) (function sway(now) { if (!idle) return; setCut(50 + Math.sin((now - t0) / 1800) * 22); requestAnimationFrame(sway); })(t0);

  /* ---------- dock player (SoundCloud widget API, inline mode only) ---------- */
  const dockEl = $("#dock"), dock = { playing: false, dur: 0, key: null };
  let widget = null;
  if (SC_INLINE && window.SC && SC.Widget) {
    try {
      widget = SC.Widget($("#scWidget"));
      widget.bind(SC.Widget.Events.PLAY, () => setPlaying(true));
      widget.bind(SC.Widget.Events.PAUSE, () => setPlaying(false));
      widget.bind(SC.Widget.Events.FINISH, () => setPlaying(false));
      widget.bind(SC.Widget.Events.PLAY_PROGRESS, e => {
        if (!dock.dur) widget.getDuration(d => dock.dur = d);
        $("#dockFill").style.width = (e.relativePosition * 100) + "%";
        $("#dockTime").textContent = fmt(e.currentPosition / 1000) + (dock.dur ? " / " + fmt(dock.dur / 1000) : "");
      });
    } catch (e) { widget = null; }
  }
  function setPlaying(on) {
    dock.playing = on; dockEl.classList.toggle("playing", on);
    $("#dockIcon").setAttribute("href", on ? "#i-pause" : "#i-play");
  }
  function play(key) {
    const p = PLAY[key]; if (!p) return;
    dockEl.classList.add("on");
    $("#dockTitle").textContent = p.title; $("#dockSub").textContent = t("dock.now"); $("#dockArt").src = p.art; $("#dockOpen").href = p.page;
    if (dock.key === key) { widget.toggle(); return; }
    dock.key = key; dock.dur = 0; $("#dockFill").style.width = "0"; $("#dockTime").textContent = t("dock.loading");
    widget.load(p.url, { auto_play: true, visual: false, show_artwork: false, callback: () => widget.play() });
  }
  // With a working widget the links play in the dock; otherwise they simply open SoundCloud.
  document.addEventListener("click", ev => { const b = ev.target.closest("[data-play]"); if (b && widget) { ev.preventDefault(); play(b.dataset.play); } });
  $("#dockPP").onclick = () => widget && widget.toggle();
  $("#dockClose").onclick = () => { widget && widget.pause(); dockEl.classList.remove("on"); };
  $("#dockTrack").onclick = ev => { if (!widget || !dock.dur) return; const r = ev.currentTarget.getBoundingClientRect(); widget.seekTo((ev.clientX - r.left) / r.width * dock.dur); };

  /* ---------- copy helpers ---------- */
  function copyText(text, btn, done) {
    const ok = () => { const o = btn.textContent; btn.textContent = done; setTimeout(() => btn.textContent = o, 1600); };
    const fallback = () => { const r = document.createRange(); const n = $("#readyText").hidden ? $("#mailAddr") : $("#readyText"); r.selectNodeContents(n); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(text).then(ok, fallback); } catch (e) { fallback(); }
  }
  $("#copyMail").addEventListener("click", ev => copyText(D.links.email, ev.currentTarget, t("f.copied")));

  /* ---------- booking form: build the message in the page ---------- */
  let lastMsg = null;
  function buildMsg() {
    const f = Object.fromEntries(new FormData($("#bookForm")));
    const slot = t("f." + f.slot);
    const subject = L ? `בקשת הזמנה: ${f.event}${f.date ? " בתאריך " + f.date : ""}` : `Booking request: ${f.event}${f.date ? " on " + f.date : ""}`;
    const body = L
      ? `היי אופיר,\n\nשם: ${f.name}\nאימייל: ${f.email}\nאירוע / מקום: ${f.event}\nעיר: ${f.city || "-"}\nתאריך: ${f.date || "-"}\nסט: ${slot}\n\n${f.msg || ""}\n`
      : `Hi Ofir,\n\nName: ${f.name}\nEmail: ${f.email}\nEvent / venue: ${f.event}\nCity: ${f.city || "-"}\nDate: ${f.date || "-"}\nSet: ${slot}\n\n${f.msg || ""}\n`;
    return { subject, body };
  }
  $("#bookForm").addEventListener("submit", ev => {
    ev.preventDefault();
    lastMsg = buildMsg();
    $("#readyText").textContent = `To: ${D.links.email}\nSubject: ${lastMsg.subject}\n\n${lastMsg.body}`;
    $("#mailApp").href = `mailto:${D.links.email}?subject=${encodeURIComponent(lastMsg.subject)}&body=${encodeURIComponent(lastMsg.body)}`;
    $("#ready").hidden = false;
    $("#ready").scrollIntoView({ block: "nearest" });
  });
  $("#copyMsg").addEventListener("click", ev => copyText($("#readyText").textContent, ev.currentTarget, t("f.copied")));

  /* ---------- nav ---------- */
  const burger = $("#burger"), nav = $("#nav");
  burger.onclick = () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
  nav.addEventListener("click", ev => { if (ev.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });
  const links = [...nav.querySelectorAll("a")];
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(a => { const s = document.querySelector(a.getAttribute("href")); s && spy.observe(s); });

  /* ---------- language ---------- */
  function setLang(l, save) {
    L = l; window.__langIdx = l;
    const root = document.documentElement;
    root.lang = l ? "he" : "en"; root.dir = l ? "rtl" : "ltr";
    applyStatic(); renderStrata(); renderSlabs(); renderReel(); renderDates(); renderNotes(); nowTrack(curSeg);
    $("#pressLink").href = l ? "press.html#he" : "press.html";
    if (save) { try { localStorage.setItem("mufasa-lang", l ? "he" : "en"); } catch (e) {} }
    setTimeout(() => window.__sky.measure(), 60);
  }
  $("#langBtn").addEventListener("click", () => setLang(L ? 0 : 1, true));
  let start = 0;
  try { start = localStorage.getItem("mufasa-lang") === "he" ? 1 : 0; } catch (e) {}
  if (location.hash === "#he") start = 1;
  setLang(start, false);
})();
