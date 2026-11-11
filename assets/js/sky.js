/* The sky engine. The page is one night: scroll position becomes the time of night.
   Sections carry data-phase (0 golden hour ... 5 first light). */
(function () {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // [phase, sky top, sky mid, horizon, accent, star alpha]
  const KEYS = [
    [0, "#2a1450", "#7a2f6b", "#f08a2c", "#f5a524", 0.0],
    [1, "#0b1236", "#1c3168", "#1d6f8c", "#7dd3fc", 0.35],
    [2, "#0b0720", "#2a1456", "#7a1f6e", "#e879f9", 0.8],
    [3, "#04020a", "#0b0820", "#1b1446", "#2fd9f4", 1.0],
    [4, "#0a0924", "#251752", "#5f2468", "#b794ff", 0.65],
    [5, "#262c66", "#8a3f8f", "#f59fbf", "#ffd1e8", 0.08],
  ];
  const CLOCK = [[0, 30], [1, 100], [2, 180], [3, 310], [3.4, 440], [3.8, 520], [4.2, 610], [4.5, 660], [5, 700]];
  const NAMES = ["Golden hour", "Blue hour", "Nightfall", "Midnight", "Before dawn", "First light"];

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`; };
  const lerp = (a, b, t) => a + (b - a) * t;

  function sample(p) {
    p = Math.max(0, Math.min(5, p));
    const i = Math.min(4, Math.floor(p)), t = p - i, A = KEYS[i], B = KEYS[i + 1];
    return { top: mix(A[1], B[1], t), mid: mix(A[2], B[2], t), low: mix(A[3], B[3], t), acc: mix(A[4], B[4], t), stars: lerp(A[5], B[5], t) };
  }
  function clockFor(p) {
    for (let i = 0; i < CLOCK.length - 1; i++) {
      const [p0, m0] = CLOCK[i], [p1, m1] = CLOCK[i + 1];
      if (p <= p1) { const m = lerp(m0, m1, Math.max(0, (p - p0) / (p1 - p0))); return m; }
    }
    return CLOCK[CLOCK.length - 1][1];
  }

  /* which phase is the viewport in? interpolate between section anchors */
  let anchors = [];
  function measure() {
    anchors = [...document.querySelectorAll("[data-phase]")].map(s => ({ y: s.offsetTop, p: parseFloat(s.dataset.phase) }));
    const end = document.documentElement.scrollHeight - innerHeight;
    anchors.push({ y: Math.max(end, anchors.at(-1).y + 1), p: 5 });
    if (typeof Ptarget !== "undefined") Ptarget = phaseNow();
  }
  function phaseNow() {
    const y = scrollY + innerHeight * 0.45;
    if (scrollY >= document.documentElement.scrollHeight - innerHeight - 4) return 5;
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i], b = anchors[i + 1];
      if (y < b.y) return lerp(a.p, b.p, Math.max(0, (y - a.y) / (b.y - a.y)));
    }
    return 5;
  }

  /* canvas: stars, Leo, moon, sun, fireflies, shooting stars */
  const cv = document.getElementById("skyCanvas"), cx = cv.getContext("2d");
  let W, H, DPR, stars = [], flies = [], shoot = null; const moonCv = document.createElement("canvas");
  function resize() {
    DPR = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.round(W * H / 2600);
    stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.92, r: Math.random() * 1.25 + 0.2, tw: Math.random() * 6.28, sp: 0.4 + Math.random() * 1.6, c: Math.random() < 0.18 ? (Math.random() < 0.5 ? "#a2eeff" : "#e9d5ff") : "#ffffff" }));
    flies = Array.from({ length: Math.round(W / 34) }, () => ({ x: Math.random() * W, y: H * (0.55 + Math.random() * 0.45), vx: (Math.random() - 0.5) * 0.25, vy: -0.05 - Math.random() * 0.2, ph: Math.random() * 6.28, hue: Math.random() < 0.7 ? "245,165,36" : "162,238,255" }));
    measure();
  }

  // Leo: Regulus, Eta, Algieba, Adhafera, Rasalas, Epsilon | Zosma, Denebola, Chertan
  const LEO = [[0, 0], [0.1, -0.8], [0.35, -1.35], [0.2, -1.9], [-0.15, -2.2], [-0.45, -1.95], [2.2, -1.4], [3.2, -0.9], [2.1, -0.6]];
  const LEO_LINES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 8], [8, 0], [6, 8]];

  let P = 0, Ptarget = 0, t0 = performance.now();
  function frame(now) {
    const t = (now - t0) / 1000;
    P += (Ptarget - P) * (reduce ? 1 : 0.16);
    const s = sample(P);
    root.style.setProperty("--sky-top", s.top);
    root.style.setProperty("--sky-mid", s.mid);
    root.style.setProperty("--sky-low", s.low);
    root.style.setProperty("--phase-accent", s.acc);

    cx.clearRect(0, 0, W, H);
    // stars
    if (s.stars > 0.01) {
      for (const st of stars) {
        const a = s.stars * (0.55 + 0.45 * Math.sin(st.tw + t * st.sp));
        cx.globalAlpha = a; cx.fillStyle = st.c;
        cx.beginPath(); cx.arc(st.x, st.y, st.r, 0, 6.283); cx.fill();
      }
    }
    // Leo constellation, the lion in the sky, visible around midnight
    const leoA = Math.max(0, 1 - Math.abs(P - 3.2) / 0.9);
    if (leoA > 0.01) {
      const u = Math.min(W, H) * 0.075, ox = W * 0.72, oy = H * 0.42;
      const pts = LEO.map(([x, y]) => [ox + x * u, oy + y * u]);
      cx.globalAlpha = leoA * 0.5; cx.strokeStyle = "#a2eeff"; cx.lineWidth = 0.8;
      cx.beginPath(); for (const [a, b] of LEO_LINES) { cx.moveTo(...pts[a]); cx.lineTo(...pts[b]); } cx.stroke();
      for (let i = 0; i < pts.length; i++) {
        const r = i === 0 ? 3.2 : 2;
        cx.globalAlpha = leoA; cx.fillStyle = "#e0faff";
        cx.shadowColor = "#2fd9f4"; cx.shadowBlur = 12;
        cx.beginPath(); cx.arc(pts[i][0], pts[i][1], r, 0, 6.283); cx.fill();
      }
      cx.shadowBlur = 0;
      cx.globalAlpha = leoA * 0.8; cx.fillStyle = "#a2eeff"; cx.font = "11px JetBrains Mono, monospace";
      cx.fillText("LEO · REGULUS", pts[0][0] + 10, pts[0][1] + 18);
    }
    // sun setting (0 -> 1), sun rising (4.4 -> 5)
    const sunSet = P < 1.1 ? P / 1.1 : null, sunRise = P > 4.4 ? (P - 4.4) / 0.6 : null;
    const sunK = sunSet !== null ? sunSet : sunRise !== null ? 1 - sunRise : null;
    if (sunK !== null) {
      const sx = sunSet !== null ? W * 0.62 : W * 0.3, sy = H * (0.8 + sunK * 0.3), R = Math.min(W, H) * 0.13;
      const g = cx.createRadialGradient(sx, sy, R * 0.2, sx, sy, R * 3.2);
      const warm = sunSet !== null ? "255,170,60" : "255,190,220";
      g.addColorStop(0, `rgba(${warm},.95)`); g.addColorStop(0.28, `rgba(${warm},.35)`); g.addColorStop(1, `rgba(${warm},0)`);
      cx.globalAlpha = 1 - sunK * 0.6; cx.fillStyle = g; cx.beginPath(); cx.arc(sx, sy, R * 3.2, 0, 6.283); cx.fill();
      const core = cx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.6); core.addColorStop(0, `rgba(255,236,200,1)`); core.addColorStop(0.7, `rgba(${warm},.95)`); core.addColorStop(1, `rgba(${warm},0)`);
      cx.globalAlpha = 1 - sunK * 0.5; cx.fillStyle = core; cx.beginPath(); cx.arc(sx, sy, R * 0.6, 0, 6.283); cx.fill();
    }
    // moon arc 1.8 -> 4.4
    if (P > 1.6 && P < 4.6) {
      const k = (P - 1.6) / 3.0, mx = W * (0.12 + k * 0.76), my = H * (0.58 - Math.sin(k * Math.PI) * 0.42), R = Math.min(W, H) * 0.045;
      const fade = Math.min(1, (P - 1.6) * 2, (4.6 - P) * 2);
      const g = cx.createRadialGradient(mx, my, R, mx, my, R * 6);
      g.addColorStop(0, "rgba(162,238,255,.25)"); g.addColorStop(1, "rgba(162,238,255,0)");
      cx.globalAlpha = fade; cx.fillStyle = g; cx.beginPath(); cx.arc(mx, my, R * 6, 0, 6.283); cx.fill();
      // crescent: full disc minus an offset disc, cut on a scratch canvas so the sky shows through
      const S = Math.ceil(R * 2 + 4), mc = moonCv; mc.width = mc.height = S; const m2 = mc.getContext("2d");
      m2.fillStyle = "#e6f9ff"; m2.beginPath(); m2.arc(S / 2, S / 2, R, 0, 6.283); m2.fill();
      m2.globalCompositeOperation = "destination-out"; m2.beginPath(); m2.arc(S / 2 + R * 0.45, S / 2 - R * 0.2, R * 0.9, 0, 6.283); m2.fill();
      cx.drawImage(mc, mx - S / 2, my - S / 2);
    }
    // fireflies and embers, mostly early in the night
    const flyA = Math.max(0.15, 1 - P / 3.2);
    if (!reduce) for (const f of flies) {
      f.x += f.vx + Math.sin(t * 0.7 + f.ph) * 0.18; f.y += f.vy;
      if (f.y < H * 0.35 || f.x < -10 || f.x > W + 10) { f.y = H + 5; f.x = Math.random() * W; }
      const a = flyA * (0.35 + 0.65 * Math.max(0, Math.sin(t * 1.6 + f.ph)));
      cx.globalAlpha = a; cx.fillStyle = `rgb(${f.hue})`; cx.shadowColor = `rgb(${f.hue})`; cx.shadowBlur = 8;
      cx.beginPath(); cx.arc(f.x, f.y, 1.4, 0, 6.283); cx.fill();
    }
    cx.shadowBlur = 0;
    // a shooting star now and then, only deep in the night
    if (!reduce && P > 2.4 && P < 4.2) {
      if (!shoot && Math.random() < 0.006) shoot = { x: Math.random() * W * 0.7 + W * 0.2, y: Math.random() * H * 0.3, life: 0 };
      if (shoot) {
        shoot.life += 0.025; const L = 140, x = shoot.x - shoot.life * 420, y = shoot.y + shoot.life * 180;
        const g = cx.createLinearGradient(x, y, x + L, y - L * 0.43);
        g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
        cx.globalAlpha = 1 - shoot.life; cx.strokeStyle = g; cx.lineWidth = 1.4;
        cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + L, y - L * 0.43); cx.stroke();
        if (shoot.life >= 1) shoot = null;
      }
    }
    cx.globalAlpha = 1;

    // the clock in the top bar
    const m = clockFor(P), hh = Math.floor((18 * 60 + m) / 60) % 24, mm = Math.floor(m % 60);
    const timeStr = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    if (clockTime.textContent !== timeStr) clockTime.textContent = timeStr;
    const names = (window.I18N && I18N.ui.phases[window.__langIdx || 0]) || NAMES, name = names[Math.min(5, Math.round(P))];
    if (clockPhase.textContent !== name) clockPhase.textContent = name;
    const ang = (m / 720) * 2 * Math.PI, r = 10;
    dialDot.setAttribute("cx", 11 + r * Math.sin(ang)); dialDot.setAttribute("cy", 11 - r * Math.cos(ang));
    dialArc.setAttribute("d", `M11 1 A10 10 0 ${ang > Math.PI ? 1 : 0} 1 ${11 + r * Math.sin(ang)} ${11 - r * Math.cos(ang)}`);

    requestAnimationFrame(frame);
  }
  const clockTime = document.getElementById("clockTime"), clockPhase = document.getElementById("clockPhase");
  const dialDot = document.getElementById("dialDot"), dialArc = document.getElementById("dialArc");

  addEventListener("resize", resize);
  addEventListener("load", measure);
  addEventListener("scroll", () => { Ptarget = phaseNow(); }, { passive: true });
  resize(); Ptarget = phaseNow(); P = Ptarget;
  requestAnimationFrame(frame);
  window.__sky = { measure, get phase() { return P; } };
})();
