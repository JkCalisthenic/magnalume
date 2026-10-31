// Chalk drawn by hand, in white on black, in pixels of the mark canvas.

const R = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(20261031);

function blob(ctx, x, y, rx, ry, rot, a) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(rx, ry);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, `rgba(255,255,255,${a})`);
  g.addColorStop(.62, `rgba(255,255,255,${a * .86})`);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// A right hand pressed flat, fingers up, palm width s. Prints are patchy: chalk only lands on the pads.
export function hand(ctx, x, y, s, rot = 0, mirror = false, a = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(mirror ? -s : s, s);
  const pad = (px, py, rx, ry, r = 0, k = 1) => blob(ctx, px, py, rx, ry, r, a * k * (.72 + R() * .28));

  pad(.02, .5, .46, .25, 0, .78);
  pad(-.36, .16, .24, .44, -.2, .92);
  pad(.38, .2, .2, .44, .14, .78);
  pad(0, .12, .26, .3, 0, .42);
  [-.34, -.11, .12, .35].forEach(px => pad(px, -.34, .15, .16, 0, .96));

  const fingers = [[-.35, 1.16, -.15], [-.115, 1.32, -.045], [.125, 1.22, .05], [.35, .92, .18]];
  for (const [px, len, ang] of fingers) {
    let fx = px, fy = -.46;
    for (let j = 0; j < 3; j++) {
      const seg = len * [.37, .3, .33][j];
      fx += Math.sin(ang) * seg * .5;
      fy -= Math.cos(ang) * seg * .5;
      pad(fx, fy, .118 - j * .007, seg * .62, ang, j === 2 ? 1 : .9);
      fx += Math.sin(ang) * seg * .5;
      fy -= Math.cos(ang) * seg * .5;
    }
  }
  pad(-.62, -.04, .15, .28, -.72, .9);
  pad(-.86, -.36, .125, .25, -.62, .96);
  ctx.restore();
}

// A swipe of chalked fingers dragged across the rock.
export function smear(ctx, x, y, length, angle, width, a = .8) {
  for (let f = 0; f < 4; f++) {
    const off = (f - 1.5) * width * .3 + (R() - .5) * width * .08;
    const end = length * (.72 + R() * .28);
    for (let t = 0; t < end; t += width * .09) {
      const fade = (1 - t / end) ** 1.5 * a;
      const px = x + Math.cos(angle) * t - Math.sin(angle) * off;
      const py = y + Math.sin(angle) * t + Math.cos(angle) * off;
      blob(ctx, px, py, width * .16, width * .12, angle, fade * .26);
    }
  }
}

// Climbers leave these on purpose: short strokes that say "the hold is here".
export function ticks(ctx, x, y, s, angle, count = 3, a = .95) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    ctx.lineWidth = s * (.13 + R() * .05);
    ctx.strokeStyle = `rgba(255,255,255,${a * (.75 + R() * .25)})`;
    ctx.beginPath();
    const px = (i - (count - 1) / 2) * s * .36;
    ctx.moveTo(px + (R() - .5) * s * .1, -s * .5);
    ctx.quadraticCurveTo(px + s * .06, 0, px + (R() - .5) * s * .1, s * (.42 + R() * .14));
    ctx.stroke();
  }
  ctx.restore();
}

export function spray(ctx, x, y, r, n, a = .75) {
  for (let i = 0; i < n; i++) {
    const t = R() * Math.PI * 2, d = R() ** 1.6 * r;
    const size = r * (.012 + R() * .03);
    blob(ctx, x + Math.cos(t) * d, y + Math.sin(t) * d, size, size, 0, a * (.4 + R() * .6));
  }
}

export function paintRoute(ctx, w, h, holds, size) {
  const px = ([x, y]) => [x / size[0] * w, h - y / size[1] * h];
  const u = w / size[0];
  holds.forEach(([x, y, rx, ry], i) => {
    const [cx, cy] = px([x, y]);
    blob(ctx, cx - rx * u * .12, cy, rx * u * .95, ry * u * 1.2, -.08, .9);
    spray(ctx, cx, cy + ry * u, rx * u * 1.3, 26, .5);
    if (i % 3 !== 2) {
      ticks(ctx, cx + (i % 2 ? -1 : 1) * rx * u * 1.35, cy - ry * u * .4, ry * u * 1.25, i % 2 ? .4 : -.4, [3, 2][i % 2]);
    }
  });
  for (const i of [1, 4]) {
    const [cx, cy] = px(holds[i]);
    hand(ctx, cx + holds[i][2] * u * (i === 1 ? -1.9 : 2), cy + holds[i][3] * u * 4.2, holds[i][2] * u * .92, i === 1 ? -.28 : .3, i === 1, .8);
  }
}

function shade(ctx, x, y, rx, ry, rot, a) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(rx, ry);
  const g = ctx.createRadialGradient(0, 0, .3, 0, 0, 1);
  g.addColorStop(0, `rgba(0,0,0,${a})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Liquid chalk painted along the bar: long brushed streaks, runs that hang off the underside,
// and two worn patches where the last set rubbed it thin.
export function paintBar(ctx, w, h, barY, barR) {
  const y = h * (1 - barY), r = barR * h, narrow = w < h;
  const from = w * .06, to = w * .94;

  for (let i = 0; i < (to - from) / (r * .34); i++) {
    const sx = from + R() * (to - from);
    blob(ctx, sx, y + (R() - .5) * r * 1.9, r * (2 + R() * 6), r * (.14 + R() * .22), (R() - .5) * .03, .4 + R() * .5);
  }
  for (const cx of [w * (narrow ? .29 : .375), w * (narrow ? .71 : .625)]) {
    for (let f = 0; f < 4; f++) shade(ctx, cx + (f - 1.5) * r * 1.42, y, r * .62, r * 1.3, .1, .62);
    shade(ctx, cx, y, r * 4.4, r * 1.3, 0, .34);
  }

  const runs = narrow ? 13 : 26;
  for (let i = 0; i < runs; i++) {
    const sx = from + r * 2 + R() * (to - from - r * 4);
    const length = r * (1.5 + R() ** 2 * 7);
    const width = r * (.12 + R() * .16);
    for (let t = 0; t < length; t += width * .5) {
      blob(ctx, sx + Math.sin(t * .05) * r * .08, y + r * .8 + t, width * (1 - t / length * .5), width * 1.5, 0, .85);
    }
    blob(ctx, sx, y + r * .8 + length, width * 1.25, width * 1.8, 0, .95);
    if (R() > .55) blob(ctx, sx, y + r * .8 + length + r * (1 + R() * 3), width * .9, width * 1.5, 0, .9);
  }
}

export function paintPrint(ctx, w, h, img) {
  const wide = w > h, s = wide ? h * 1.08 : w * 1.2;
  const cx = wide ? w * .73 : w * .5, cy = wide ? h * .5 : h * .28;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(.22);
  ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(img, -s / 2, -s / 2, s, s);
  ctx.restore();
}
