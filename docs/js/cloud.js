// The clap: a chalk cloud as point sprites, computed in the vertex shader from each clap's start time.

const VERT = `#version 300 es
in vec4 seed;
uniform vec2 origin;
uniform float aspect, time, scale, power;
uniform float claps[3];
out float alpha;
out float mist;
out vec2 grain;
void main() {
  int slot = gl_VertexID % 4;
  bool idle = slot == 3;
  float life = idle ? 6. + seed.z * 4. : 2.8 + seed.z * 3.6;
  float age = idle ? mod(time + seed.x * 11., life) : time - claps[slot];
  mist = step(seed.w, .3);

  float ang = seed.x * 6.2832 + seed.w * 3.;
  float reach = (idle ? .04 + seed.y * .2 : .08 + seed.y * seed.y * .64) * (mist > .5 ? .72 : 1.);
  vec2 p = vec2(cos(ang), sin(ang) * .74) * reach * (1. - exp(-age * 2.7));
  p += vec2(sin(age * .7 + seed.y * 20.), cos(age * .5 + seed.z * 20.)) * .022 * age;
  p.y += age * (mist > .5 ? .03 : .012) - (mist > .5 ? 0. : age * age * .012);

  float fade = smoothstep(0., .1, age) * pow(max(1. - age / life, 0.), 1.5);
  float shown = step(0., age) * step(age, life);
  alpha = fade * shown * power * (mist > .5 ? (idle ? .03 : .075) : .9);
  grain = seed.yz * 9.;

  gl_Position = vec4(origin + p * vec2(2. / aspect, 2.), 0., 1.);
  gl_PointSize = (mist > .5 ? (60. + seed.y * 210.) * (1. + age * .34) : 1.2 + seed.y * seed.z * 4.2) * scale;
}`;

const FRAG = `#version 300 es
precision highp float;
in float alpha;
in float mist;
in vec2 grain;
uniform float white;
out vec4 color;
float wave(vec2 p) { return sin(p.x * 3.1 + sin(p.y * 2.3)) * sin(p.y * 3.7 + sin(p.x * 2.9)); }
void main() {
  vec2 c = gl_PointCoord - .5;
  float r = length(c) * 2.;
  float a = mist > .5
    ? exp(-r * r * 3.4) * (.68 + wave(c * 7. + grain) * .32)
    : smoothstep(1., .15, r);
  a *= alpha * (1. - white * .45);
  vec3 tint = mix(vec3(.62, 1., .1), vec3(.7, .86, .7), white);
  color = vec4(tint * a, a * white * .8);
}`;

function shader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

export class Cloud {
  constructor(canvas) {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) throw new Error('no webgl2');
    Object.assign(this, { canvas, gl, origin: [0, 0], claps: [-99, -99, -99], next: 0 });

    const cw = canvas.clientWidth, ch = canvas.clientHeight, dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    this.aspect = cw / ch;
    this.scale = dpr * Math.min(1, ch / 900);

    const p = gl.createProgram();
    gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(p, 0, 'seed');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    gl.useProgram(p);
    this.u = new Proxy({}, { get: (c, k) => (k in c ? c[k] : (c[k] = gl.getUniformLocation(p, k))) });

    this.count = cw < 760 ? 640 : 1200;
    gl.bindVertexArray(gl.createVertexArray());
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.count * 4).map(() => Math.random()), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  clap(time) {
    this.claps[this.next] = time;
    this.next = (this.next + 1) % 3;
  }

  draw(time, power, white) {
    const { gl, u } = this;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.origin, ...this.origin);
    gl.uniform1f(u.aspect, this.aspect);
    gl.uniform1f(u.time, time);
    gl.uniform1f(u.scale, this.scale);
    gl.uniform1f(u.power, power);
    gl.uniform1f(u.white, white);
    gl.uniform1fv(u['claps[0]'], this.claps);
    gl.drawArrays(gl.POINTS, 0, this.count);
  }
}
