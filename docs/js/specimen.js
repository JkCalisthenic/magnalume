// One lit specimen: rock or steel baked once to textures, then relit every frame by the lamp.

const VERT = `#version 300 es
in vec2 p;
out vec2 v;
void main() { v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;

const NOISE = `
vec2 hash2(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy);
}
float gn(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * f * (f * (f * 6. - 15.) + 10.);
  vec2 a = hash2(i) * 2. - 1., b = hash2(i + vec2(1, 0)) * 2. - 1.;
  vec2 c = hash2(i + vec2(0, 1)) * 2. - 1., d = hash2(i + vec2(1, 1)) * 2. - 1.;
  return mix(mix(dot(a, f), dot(b, f - vec2(1, 0)), u.x),
             mix(dot(c, f - vec2(0, 1)), dot(d, f - vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p, int n) {
  float a = .5, s = 0.;
  for (int i = 0; i < n; i++) { s += a * gn(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p; a *= .5; }
  return s;
}`;

const BAKE = `#version 300 es
precision highp float;
in vec2 v;
layout(location = 0) out vec4 o0;
layout(location = 1) out vec4 o1;
uniform sampler2D marks;
uniform vec2 size;
uniform vec2 texel;
uniform int scene;
uniform int holdCount;
uniform vec4 holds[8];
uniform float barY;
uniform float barR;
${NOISE}

// Fractured faces: Voronoi cells are tilted planes, blended so edges read as creases, not ink lines.
float facets(vec2 p) {
  vec2 g = floor(p), f = fract(p);
  float sum = 0., weight = 0.;
  for (int y = -2; y <= 2; y++) for (int x = -2; x <= 2; x++) {
    vec2 c = vec2(x, y), r = hash2(g + c), o = c + r - f;
    float w = exp(-dot(o, o) * 11.);
    vec2 t = hash2(g + c + 19.) * 2. - 1.;
    sum += w * (dot(t, o) * .55 + r.x * .5);
    weight += w;
  }
  return sum / weight;
}

float rock(vec2 p) {
  vec2 w = vec2(fbm(p * 1.1 + 3., 4), fbm(p * 1.1 + 9., 4));
  vec2 q = p + w * .5;
  float h = fbm(q * 1.7, 5) * .9;
  h += facets(q * vec2(3.2, 4.6)) * .3;
  h += facets(q * vec2(8.5, 12.) + 4.) * .1;
  h -= pow(max(1. - abs(gn(q * vec2(1.6, 3.4) + w)) * 14., 0.), 2.) * .05;
  h += fbm(q * 26., 4) * .07;
  return h;
}

float bump(vec2 p) {
  float h = 0.;
  for (int i = 0; i < holdCount; i++) {
    vec4 c = holds[i];
    float d = length((p - c.xy) / c.zw) + fbm(p * 7. + float(i) * 3.1, 3) * 1.1;
    h += smoothstep(1.15, .2, d) * (.3 + fbm(p * 16. + float(i), 3) * .28);
  }
  return h;
}

float height(vec2 p) {
  float h = rock(p);
  if (scene == 1) h += bump(p);
  if (scene == 2) h *= .3;
  return h;
}

void main() {
  vec2 p = v * size;
  float e = texel.y * size.y * 1.5;
  float h = height(p);
  float hx = height(p + vec2(e, 0.)), hy = height(p + vec2(0., e));
  float k = scene == 2 ? 3.2 : 4.2;
  vec3 n = normalize(vec3((h - hx) / e * k * .02, (h - hy) / e * k * .02, 1.));
  float mat = 0.;
  float m = texture(marks, vec2(v.x, 1. - v.y)).r;

  float grit = fbm(p * 120., 4) * .5 + .5;
  float flow = sin((p.x * .9 + p.y + fbm(p * 2.6, 3) * .55) * 260.) * .5 + .5;
  float tooth = smoothstep(-.1, .2, h - fbm(p * 5., 3) * .6);
  float patchy = fbm(p * 15., 3) + fbm(p * 44., 3) * .5;

  if (scene == 2) {
    float ax = size.x, inset = ax * .06, postR = barR * 1.35;
    float b = (p.y - barY) / barR;
    float side = p.x < ax * .5 ? p.x - inset : ax - inset - p.x;
    float pb = side / postR;
    bool post = abs(pb) < 1. && p.y < barY + barR;
    bool onBar = abs(b) < 1. && side > 0.;
    if (onBar || post) {
      mat = 1.;
      h = .95;
      tooth = 1.;
      if (onBar) {
        n = vec3(0., b, sqrt(1. - b * b));
        // Chalk wraps the tube, so the marks foreshorten toward its edges.
        m = texture(marks, vec2(v.x, 1. - (barY + barR * asin(b) * .6366) / size.y)).r;
      } else {
        n = vec3(p.x < ax * .5 ? pb : -pb, 0., sqrt(1. - pb * pb));
        m = 0.;
      }
    } else {
      // The park at night: treeline and the dead street lamp, far beyond the lamp's reach.
      mat = .7;
      m = 0.;
      float trees = .24 + fbm(vec2(p.x * 2.4, 1.), 4) * .22 + fbm(vec2(p.x * 17., 3.), 3) * .05;
      float lx = ax * .79;
      float pole = step(abs(p.x - lx), .0035) * step(p.y, .8);
      float arm = step(abs(p.y - .8 - (p.x - lx) * .16), .0035) * step(lx, p.x) * step(p.x, lx + .07);
      float head = step(abs(p.x - lx - .075), .022) * step(abs(p.y - .808), .007);
      float solid = max(max(step(p.y, trees), pole), max(arm, head));
      h = mix(.34 + .66 * exp(-max(p.y - .2, 0.) * 2.2), .05, solid);
    }
  }
  if (scene == 1) {
    float rise = bump(p);
    if (rise > .05) {
      mat = .5;
      m *= smoothstep(.0, .05, rise - bump(p + vec2(0., .03)));
    }
  }
  if (scene == 3) { tooth = 1.; patchy = 0.; }

  float cover = clamp(m * mix(.5, 1.02, tooth) * (1. + patchy * 1.25), 0., 1.2);
  float dust = smoothstep(1. - cover, 1. - cover + .16, grit * .82 + flow * .18);
  float density = scene == 3 ? 1. : .55 + .45 * smoothstep(-.2, .2, fbm(p * 62., 3));
  float chalk = dust * smoothstep(.0, .22, m) * density;

  o0 = vec4(n.xy * .5 + .5, clamp(mat > .6 ? h : h * .5 + .5, 0., 1.), mat);
  o1 = vec4(chalk, chalk, chalk, 1.);
}`;

const RUN = `#version 300 es
precision highp float;
in vec2 v;
out vec4 color;
uniform sampler2D t0, t1;
uniform vec2 size;
uniform vec4 view;
uniform vec3 lamp;
uniform float power, white, reach, time;
const vec3 UV = vec3(.27, .13, 1.);
const vec3 LIME = vec3(.6, 1., .07);

float rand(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + time * 7.) * 43758.5453); }

void main() {
  vec2 uv = view.xy + v * view.zw;
  vec2 p = uv * size;
  vec4 a = texture(t0, uv);
  vec3 n = vec3(a.xy * 2. - 1., 0.);
  n.z = sqrt(max(1. - dot(n.xy, n.xy), 0.));
  float h = a.b, mat = a.a;
  float steel = step(.9, mat), far = step(.6, mat) * (1. - steel);

  vec2 d = p - lamp.xy;
  float r2 = dot(d, d) / (reach * reach);
  float beam = (exp(-r2 * 1.5) + .055 * exp(-r2 * .16)) * power;
  vec3 L = normalize(vec3(-d, lamp.z - (h - .5) * .12));
  float diff = max(dot(n, L), 0.);
  float tone = .3 + h * h * 1.1;
  vec3 lit = UV * (.03 + diff * diff * diff * 1.5) * beam * tone;
  if (steel > .5) {
    float cut = smoothstep(-.08, .52, dot(n, normalize(L + vec3(0., .55, 0.))));
    lit = UV * (.05 + cut * 1.15 + pow(1. - n.z, 3.) * cut * .9) * beam;
  }
  if (far > .5) lit = vec3(.02, .02, .05) * h * h + UV * beam * .05;
  vec3 R = reflect(-L, n);
  float spec = pow(max(R.z, 0.), steel > .5 ? 26. : 14.);
  lit += UV * spec * beam * (steel > .5 ? 2.6 : .16) * tone * (1. - far);

  float c = texture(t1, uv).r;
  float b1 = textureLod(t1, uv, 3.).r, b2 = textureLod(t1, uv, 5.).r, b3 = textureLod(t1, uv, 6.5).r;
  float excited = smoothstep(.0, .75, beam);
  vec3 glow = LIME * (c * 1.25 + b1 * .5 + b2 * .4 + b3 * .3) * excited;
  vec3 night = lit * (1. - c * .85) + glow + vec3(.8, 1., .55) * c * excited * excited * .1;

  vec3 sun = normalize(vec3(-.35, .55, .75));
  float side = max(dot(n, sun), 0.);
  vec3 room = vec3(.62, .62, .6) * (.2 + side * side * 1.05) * (.4 + h * .95);
  room += vec3(.9) * pow(max(reflect(-sun, n).z, 0.), 22.) * .03;
  if (steel > .5) room = vec3(.56, .58, .62) * (.16 + side * .8) + vec3(.8) * pow(max(reflect(-sun, n).z, 0.), 18.);
  if (far > .5) room = mix(vec3(.2, .24, .21), vec3(.82, .87, .92), smoothstep(.1, .9, h));
  room = mix(room, vec3(.56, .78, .58) * (.5 + side * .55), c * .92);
  room *= 1.05 - dot(v - .5, v - .5) * .8;

  vec3 col = mix(night, room, white);
  col = 1. - exp(-col * 1.55);
  col = pow(col, vec3(.86));
  col += (rand(v) - .5) * 2.2 / 255.;
  color = vec4(col, 1.);
}`;

const DUST_V = `#version 300 es
in vec3 seed;
uniform vec2 size;
uniform vec4 view;
uniform vec3 lamp;
uniform float time, power, white, reach, scale;
out float glow;
out float hue;
void main() {
  float t = time * (.012 + seed.z * .02);
  vec2 q = fract(seed.xy + vec2(sin(time * .13 + seed.y * 40.) * .012, t));
  vec2 p = q * size;
  vec2 d = p - lamp.xy;
  float beam = exp(-dot(d, d) / (reach * reach) * 2.2) * power;
  glow = beam * (.35 + seed.z) * (1. - white);
  hue = seed.z;
  gl_Position = vec4(((q - view.xy) / view.zw) * 2. - 1., 0., 1.);
  gl_PointSize = (1. + seed.z * 2.6) * scale;
}`;

const DUST_F = `#version 300 es
precision highp float;
in float glow;
in float hue;
out vec4 color;
void main() {
  float r = length(gl_PointCoord - .5) * 2.;
  float a = smoothstep(1., .1, r) * glow;
  color = vec4(mix(vec3(.45, .3, 1.), vec3(.65, 1., .15), step(.5, hue)) * a, 1.);
}`;

function program(gl, vs, fs) {
  const p = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    gl.attachShader(p, s);
  }
  gl.bindAttribLocation(p, 0, 'p');
  gl.bindAttribLocation(p, 1, 'seed');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = new Proxy({}, { get: (c, k) => (k in c ? c[k] : (c[k] = gl.getUniformLocation(p, k))) });
  return { p, u };
}

function texture(gl, w, h, mips) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texStorage2D(gl.TEXTURE_2D, mips ? Math.floor(Math.log2(Math.max(w, h))) + 1 : 1, gl.RGBA8, w, h);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

export class Specimen {
  // size: world size, height 1 means one screen. paint(ctx, w, h) draws the chalk in white on black.
  constructor(canvas, { scene = 0, size, paint, holds = [], barY = .5, barR = .03, reach = .36, lampZ = .42 }) {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('no webgl2');
    Object.assign(this, { canvas, gl, size, reach, lampZ, lamp: [size[0] * .5, size[1] * .5], view: [0, 0, 1, 1] });

    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    canvas.width = Math.min(Math.round(cw * dpr), 2200);
    canvas.height = Math.round(canvas.width * ch / cw);
    this.scale = canvas.width / cw;

    // Sized from the screen width, so a tall wall keeps its detail across the viewport.
    const ratio = size[0] / size[1];
    let tw = Math.min(Math.round(cw * Math.min(devicePixelRatio || 1, 2)), 1800), th = Math.round(tw / ratio);
    if (th > 3000) { tw = Math.round(tw * 3000 / th); th = 3000; }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    this.quadVao = gl.createVertexArray();
    gl.bindVertexArray(this.quadVao);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const marks = document.createElement('canvas');
    marks.width = tw; marks.height = th;
    const ctx = marks.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, tw, th);
    paint(ctx, tw, th);

    const mt = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, mt);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, marks);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.t0 = texture(gl, tw, th, false);
    this.t1 = texture(gl, tw, th, true);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.t0, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.t1, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

    const bake = program(gl, VERT, BAKE);
    gl.useProgram(bake.p);
    gl.viewport(0, 0, tw, th);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, mt);
    gl.uniform1i(bake.u.marks, 0);
    gl.uniform2f(bake.u.size, size[0], size[1]);
    gl.uniform2f(bake.u.texel, 1 / tw, 1 / th);
    gl.uniform1i(bake.u.scene, scene);
    gl.uniform1i(bake.u.holdCount, holds.length);
    if (holds.length) gl.uniform4fv(bake.u['holds[0]'], new Float32Array(holds.flat()));
    gl.uniform1f(bake.u.barY, barY);
    gl.uniform1f(bake.u.barR, barR);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fbo);
    gl.deleteTexture(mt);
    gl.bindTexture(gl.TEXTURE_2D, this.t1);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.run = program(gl, VERT, RUN);
    this.dust = program(gl, DUST_V, DUST_F);

    const count = cw < 760 ? 90 : 170;
    const seeds = new Float32Array(count * 3).map(() => Math.random());
    this.dustVao = gl.createVertexArray();
    gl.bindVertexArray(this.dustVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    this.count = count;
  }

  // Lamp position in world units. view is [x, y, w, h] in texture space.
  draw(time, power, white) {
    const { gl, run, dust, size, lamp, view, reach, lampZ } = this;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.disable(gl.BLEND);
    gl.useProgram(run.p);
    gl.bindVertexArray(this.quadVao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.t0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.t1);
    gl.uniform1i(run.u.t0, 0);
    gl.uniform1i(run.u.t1, 1);
    gl.uniform2f(run.u.size, size[0], size[1]);
    gl.uniform4f(run.u.view, ...view);
    gl.uniform3f(run.u.lamp, lamp[0], lamp[1], lampZ);
    gl.uniform1f(run.u.power, power);
    gl.uniform1f(run.u.white, white);
    gl.uniform1f(run.u.reach, reach);
    gl.uniform1f(run.u.time, time % 60);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (white < 1) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(dust.p);
      gl.bindVertexArray(this.dustVao);
      gl.uniform2f(dust.u.size, size[0], size[1]);
      gl.uniform4f(dust.u.view, ...view);
      gl.uniform3f(dust.u.lamp, lamp[0], lamp[1], lampZ);
      gl.uniform1f(dust.u.time, time);
      gl.uniform1f(dust.u.power, power);
      gl.uniform1f(dust.u.white, white);
      gl.uniform1f(dust.u.reach, reach);
      gl.uniform1f(dust.u.scale, this.scale);
      gl.drawArrays(gl.POINTS, 0, this.count);
    }
  }
}
