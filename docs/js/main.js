import { Specimen } from './specimen.js';
import { paintHero, paintRoute, paintBar, paintPrint } from './marks.js';

const root = document.documentElement;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(pointer: coarse)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const light = { power: calm ? 1 : 0, white: 0, script: [], t0: 0, wanted: 'uv' };

// Tubes do not fade: they stutter and catch. script is [ms, power, white] keyframes.
function strike(steps) {
  light.t0 = performance.now();
  light.script = calm ? steps.slice(-1).map(s => [0, s[1], s[2]]) : steps;
}

function playScript(now) {
  if (!light.script.length) return;
  const t = now - light.t0;
  while (light.script.length && light.script[0][0] <= t) {
    const [, power, white] = light.script.shift();
    light.power = power;
    light.white = white;
    root.style.setProperty('--white', white);
  }
}

let audio;
function click() {
  try {
    audio ??= new AudioContext();
    const n = audio.sampleRate * .018 | 0, buffer = audio.createBuffer(1, n, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3;
    const src = audio.createBufferSource(), gain = audio.createGain();
    gain.gain.value = .12;
    src.buffer = buffer;
    src.connect(gain).connect(audio.destination);
    src.start();
  } catch { /* the switch works without its click */ }
}

function setLight(mode) {
  if (mode === light.wanted) return;
  light.wanted = mode;
  root.dataset.light = mode;
  $$('.rocker').forEach(b => b.setAttribute('aria-checked', String(mode === 'uv')));
  $$('[data-light-word]').forEach(el => { el.textContent = mode === 'uv' ? el.dataset.uv : el.dataset.white; });
  strike(mode === 'white'
    ? [[0, 0, 0], [70, 0, .75], [130, 0, .05], [230, 0, .9], [290, 0, .3], [380, 0, 1]]
    : [[0, 0, 1], [40, 0, 0], [170, .5, 0], [220, .05, 0], [320, .8, 0], [370, .35, 0], [460, 1, 0]]);
}

$$('.rocker').forEach(b => b.addEventListener('click', () => {
  click();
  setLight(light.wanted === 'uv' ? 'white' : 'uv');
}));

/* Scenes */

const scenes = [];
const frameCallbacks = [];

function loop(now) {
  playScript(now);
  const time = now / 1000;
  for (const fn of frameCallbacks) fn(now);
  for (const s of scenes) if (s.visible && s.specimen) { s.update(time); s.specimen.draw(time, light.power, light.white); }
  requestAnimationFrame(loop);
}

function scene(el, build, update) {
  const entry = { visible: false, specimen: null, update, build };
  scenes.push(entry);
  new IntersectionObserver(([e]) => {
    entry.visible = e.isIntersecting;
    if (e.isIntersecting && !entry.specimen && !entry.failed) {
      try { entry.specimen = build(); } catch (err) {
        entry.failed = true;
        root.classList.add('no-gl');
        console.warn('Magnalume: escena sin WebGL', err);
      }
    }
  }, { rootMargin: '30% 0px' }).observe(el);
  return entry;
}

function pointerLamp(section) {
  const state = { x: 0, y: 0, last: -1e9, active: false };
  const read = e => {
    const r = section.getBoundingClientRect();
    state.x = clamp((e.clientX - r.left) / r.width);
    state.y = clamp(1 - (e.clientY - r.top) / r.height);
    state.last = performance.now();
    if (!state.active) { state.active = true; section.classList.add('lamp-held'); }
  };
  section.addEventListener('pointermove', read, { passive: true });
  section.addEventListener('pointerdown', read, { passive: true });
  return state;
}

function follow(lamp, x, y, dt, rate = 9) {
  const k = 1 - Math.exp(-dt * rate);
  lamp[0] += (x - lamp[0]) * k;
  lamp[1] += (y - lamp[1]) * k;
}

const ratioOf = el => el.clientWidth / el.clientHeight;
const ready = Promise.all([document.fonts.load('italic 800 40px Archivo'), document.fonts.ready]);

/* Hero */
function initHero() {
  const section = $('#hero'), canvas = $('canvas', section);
  const held = pointerLamp(section);
  let prev = 0;
  scene(section, () => new Specimen(canvas, {
    scene: 0,
    size: [ratioOf(canvas), 1],
    paint: paintHero,
    reach: ratioOf(canvas) > 1.1 ? .37 : .3,
  }), function (time) {
    const s = this.specimen, a = s.size[0], dt = Math.min(time - prev, .05);
    prev = time;
    const wide = a > 1.1;
    const idle = performance.now() - held.last > 3200;
    const home = wide ? [a * .7, .54] : [a * .55, .73];
    const sway = calm ? [0, 0] : [Math.sin(time * .47) * a * (wide ? .17 : .28), Math.sin(time * .73 + 1) * (wide ? .23 : .14)];
    const tx = idle ? home[0] + sway[0] : held.x * a;
    const ty = idle ? home[1] + sway[1] : held.y;
    follow(s.lamp, tx, ty, dt, idle ? 1.6 : 9);
  });
}

/* Route */
const HOLDS = [
  { x: .62, y: .08, n: '014', name: 'Salida', note: 'Dos manos, mismo canto' },
  { x: .74, y: .22, n: '015', name: 'Regleta', note: 'Mano izquierda' },
  { x: .56, y: .36, n: '016', name: 'Romo', note: 'Que no se te vaya el pie' },
  { x: .7, y: .5, n: '017', name: 'Agujero', note: 'Caben dos dedos' },
  { x: .52, y: .64, n: '018', name: 'Canto bueno', note: 'Aquí se respira' },
  { x: .67, y: .78, n: '019', name: 'Lanzar', note: 'Sin pensarlo' },
  { x: .58, y: .92, n: '020', name: 'Top', note: 'Dos manos y a casa' },
];
const WALL = 2.7;

function catmull(points, t) {
  const n = points.length - 1, f = clamp(t) * n, i = Math.min(f | 0, n - 1), u = f - i;
  const p = k => points[clamp(i + k, 0, n)];
  const c = (a, b, d, e) => .5 * (2 * b + (d - a) * u + (2 * a - 5 * b + 4 * d - e) * u * u + (3 * b - a - 3 * d + e) * u ** 3);
  return [c(p(-1)[0], p(0)[0], p(1)[0], p(2)[0]), c(p(-1)[1], p(0)[1], p(1)[1], p(2)[1])];
}

function initRoute() {
  const section = $('#escalada'), stage = $('.route-stage', section), canvas = $('canvas', section);
  const layer = $('.route-labels', section);
  const labels = HOLDS.map(h => {
    const el = document.createElement('aside');
    el.className = 'label label-float';
    el.innerHTML = `<b>Nº ${h.n}</b><span>${h.name}</span><small>${h.note}</small>`;
    layer.append(el);
    return el;
  });

  const placed = (a) => {
    const narrow = a < 1.1;
    return HOLDS.map(h => ({
      ...h,
      wx: narrow ? (h.x - .62) * 3.1 * a + a * .55 : h.x * a,
      wy: h.y * WALL,
    }));
  };

  const ratio = ratioOf(stage);
  let points = placed(ratio);
  let prev = 0;

  scene(stage, () => {
    const a = ratioOf(stage);
    points = placed(a);
    const narrow = a < 1.1;
    const holds = points.map((h, i) => [h.wx, h.wy, (narrow ? .1 : .105) * (i % 3 === 1 ? .8 : 1.08), narrow ? .05 : .056]);
    const size = [a, WALL];
    return new Specimen(canvas, {
      scene: 1, size, holds, reach: .46, lampZ: .4,
      paint: (ctx, w, h) => paintRoute(ctx, w, h, holds, size),
    });
  }, function (time) {
    const s = this.specimen, dt = Math.min(time - prev, .05);
    prev = time;
    const r = section.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight));
    const path = points.map(h => [h.wx, h.wy]);
    const [x, y] = catmull(path, p);
    follow(s.lamp, x + (calm ? 0 : Math.sin(time * .9) * .012), y, dt, 12);
    const span = 1 / WALL;
    const camera = clamp(s.lamp[1] / WALL - span * .46, 0, 1 - span);
    s.view = [0, camera, 1, span];

    const w = stage.clientWidth, h = stage.clientHeight, narrow = w / h < 1.1;
    const half = .11 / s.size[0] * w;
    points.forEach((pt, i) => {
      const sy = (1 - (pt.wy / WALL - camera) / span) * h;
      const sx = pt.wx / s.size[0] * w;
      const near = Math.hypot(pt.wx - s.lamp[0], pt.wy - s.lamp[1]);
      const show = clamp((.34 - near) * 7) * (1 - light.white) * (narrow ? clamp((h * .56 - sy) / 50) : 1);
      const right = i % 2 === 1;
      const lx = narrow ? clamp(sx - 80, 12, w - 172) : sx + (right ? half + 22 : -half - 188);
      const ly = narrow ? sy - 104 : sy - 34;
      labels[i].style.opacity = show.toFixed(3);
      labels[i].style.transform = `translate(${lx | 0}px, ${ly | 0}px) rotate(${right ? 1.2 : -1.4}deg)`;
    });
  });
}

/* Bar */
function initBar() {
  const section = $('#calistenia'), canvas = $('canvas', section);
  const held = pointerLamp(section);
  const barY = .46;
  const barR = .0165;
  let prev = 0;
  scene(section, () => new Specimen(canvas, {
    scene: 2,
    size: [ratioOf(canvas), 1],
    barY, barR, reach: .38, lampZ: .36,
    paint: (ctx, w, h) => paintBar(ctx, w, h, barY, barR),
  }), function (time) {
    const s = this.specimen, a = s.size[0], dt = Math.min(time - prev, .05);
    prev = time;
    const r = section.getBoundingClientRect();
    const p = clamp((innerHeight - r.top) / (innerHeight + r.height));
    const idle = performance.now() - held.last > 2600;
    const tx = idle ? a * (.16 + p * .68) : held.x * a;
    const ty = idle ? barY + .03 + Math.sin(time * .6) * (calm ? 0 : .025) : held.y;
    follow(s.lamp, tx, ty, dt, idle ? 3 : 9);
  });
}

/* Close */
function initClose() {
  const section = $('#probar'), canvas = $('canvas', section);
  const held = pointerLamp(section);
  const img = new Image();
  img.src = 'assets/fingerprint.webp';
  let prev = 0;
  img.decode().catch(() => {}).then(() => {
    scene(section, () => new Specimen(canvas, {
      scene: 3,
      size: [ratioOf(canvas), 1],
      paint: (ctx, w, h) => paintPrint(ctx, w, h, img),
      reach: .42,
    }), function (time) {
      const s = this.specimen, a = s.size[0], dt = Math.min(time - prev, .05);
      prev = time;
      const wide = a > 1.1;
      const idle = performance.now() - held.last > 3000;
      const hx = wide ? a * .73 : a * .5, hy = wide ? .5 : .72;
      const tx = idle ? hx + (calm ? 0 : Math.sin(time * .4) * a * .1) : held.x * a;
      const ty = idle ? hy + (calm ? 0 : Math.cos(time * .53) * .17) : held.y;
      follow(s.lamp, tx, ty, dt, idle ? 1.8 : 9);
    });
  });
}

/* Page furniture */

function initProgress() {
  const nav = $('.nav'), band = $('#pasos'), print = $('.print-ink');
  let ticking = false;
  const measure = () => {
    ticking = false;
    const r = band.getBoundingClientRect();
    nav.classList.toggle('over-band', r.top < nav.offsetHeight && r.bottom > 0);
    if (!calm && print) {
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height));
      print.style.transform = `rotate(${(-16 + p * 30).toFixed(2)}deg) scale(${(1.02 + p * .12).toFixed(3)})`;
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(measure); } }, { passive: true });
  addEventListener('resize', measure, { passive: true });
  measure();

  // One switch in view: the nav gives way to the big one.
  new IntersectionObserver(([e]) => nav.classList.toggle('yields', e.isIntersecting), { rootMargin: '-64px 0px 0px' }).observe($('.rocker-big'));
}

function initPlate() {
  const plate = $('.plate'), img = $('.plate-img');
  plate.addEventListener('pointermove', e => {
    const r = img.getBoundingClientRect();
    img.style.setProperty('--mx', `${e.clientX - r.left}px`);
    img.style.setProperty('--my', `${e.clientY - r.top}px`);
    img.classList.add('lamp');
  }, { passive: true });
  plate.addEventListener('pointerleave', () => img.classList.remove('lamp'));
}

function initForm() {
  const form = $('#lista'), email = $('#correo'), status = $('#lista-estado'), submit = $('button[type=submit]', form);
  const say = (text, kind) => { status.textContent = text; status.dataset.kind = kind; };
  email.addEventListener('input', () => { email.removeAttribute('aria-invalid'); if (status.dataset.kind === 'error') say('', ''); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = email.value.trim();
    if (!value) {
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      return say('Falta tu correo. Sin él no podemos avisarte.', 'error');
    }
    if (!email.validity.valid) {
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      return say('Ese correo no parece completo. Revisa que lleve @ y dominio.', 'error');
    }
    submit.disabled = true;
    say('Vista previa: tu correo no se ha guardado.', 'done');
  });
}

function initCopy() {
  $$('[data-touch]').forEach(el => { if (touch) el.textContent = el.dataset.touch; });
  const title = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'Se ha ido la luz…' : title;
  });
  addEventListener('load', () => document.body.classList.add('loaded'));
}

function initResize() {
  let width = innerWidth, timer;
  addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (Math.abs(innerWidth - width) < 80) return;
      width = innerWidth;
      for (const s of scenes) if (s.specimen) s.specimen = s.build();
    }, 250);
  }, { passive: true });
}

initCopy();
initProgress();
initPlate();
initForm();
initResize();

ready.then(() => {
  initHero();
  initRoute();
  initBar();
  initClose();
  strike([[250, .55, 0], [310, .03, 0], [430, .85, 0], [490, .2, 0], [610, 1, 0]]);
  requestAnimationFrame(loop);
});
