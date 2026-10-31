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

function scrawl(ctx, text, x, y, size, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.font = `italic 800 ${size}px Archivo, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,.95)';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function paintHero(ctx, w, h) {
  const u = h / 100, wide = w > h * 1.1;
  if (wide) {
    hand(ctx, w * .72, h * .46, 19 * u, .18, false, 1);
    hand(ctx, w * .94, h * .2, 14 * u, -.34, true, .86);
    smear(ctx, w * .55, h * .13, 28 * u, .32, 11 * u, .85);
    smear(ctx, w * .86, h * .64, 22 * u, 2.1, 9 * u, .7);
    ticks(ctx, w * .56, h * .46, 5.5 * u, .2);
    ticks(ctx, w * .91, h * .55, 4.5 * u, -.5);
    ticks(ctx, w * .33, h * .1, 5 * u, .9, 2, .8);
    spray(ctx, w * .72, h * .47, 30 * u, 90, .6);
    spray(ctx, w * .94, h * .2, 18 * u, 50, .55);
    scrawl(ctx, 'YOUR STRENGTH LEAVES A MARK.', w * .405, h * .925, 3.15 * u, -.016);
  } else {
    const v = w / 100;
    hand(ctx, w * .55, h * .27, 30 * v, .16, false, 1);
    smear(ctx, w * .04, h * .1, 40 * v, .3, 17 * v, .8);
    ticks(ctx, w * .12, h * .33, 9 * v, .25);
    ticks(ctx, w * .9, h * .46, 7 * v, -.4);
    spray(ctx, w * .55, h * .28, 52 * v, 80, .6);
  }
}

export function paintRoute(ctx, w, h, holds, size) {
  const px = ([x, y]) => [x / size[0] * w, h - y / size[1] * h];
  const u = w / size[0];
  holds.forEach(([x, y, rx, ry], i) => {
    const [cx, cy] = px([x, y]);
    blob(ctx, cx - rx * u * .18, cy + ry * u * .1, rx * u * .62, ry * u * .62, -.15, .95);
    blob(ctx, cx + rx * u * .3, cy - ry * u * .1, rx * u * .46, ry * u * .5, .25, .8);
    ticks(ctx, cx + (i % 2 ? -1 : 1) * rx * u * 1.35, cy - ry * u * .4, ry * u * 1.25, (i % 2 ? .4 : -.4));
    spray(ctx, cx, cy, rx * u * 1.7, 34, .55);
  });
  for (let i = 1; i < holds.length; i += 2) {
    const [cx, cy] = px(holds[i]);
    hand(ctx, cx + holds[i][2] * u * (i % 4 === 1 ? -1.9 : 2), cy + holds[i][3] * u * 4.2, holds[i][2] * u * .92, i % 4 === 1 ? -.28 : .3, i % 4 === 1, .8);
  }
}

export function paintBar(ctx, w, h, barY, barR) {
  const y = h * (1 - barY), r = barR * h;
  for (const [cx, dir] of [[w * .36, 1], [w * .66, -1]]) {
    for (let f = 0; f < 4; f++) {
      const x = cx + (f - 1.5) * r * .9 * dir;
      blob(ctx, x, y + r * .1, r * .38, r * 1.15, .08 * dir, 1);
      blob(ctx, x + r * .04, y - r * .4, r * .3, r * .6, 0, .9);
    }
    blob(ctx, cx + dir * r * 2.1, y + r * .35, r * .55, r * .92, .3 * dir, .9);
    for (let i = 0; i < 80; i++) {
      const sx = cx + (R() - .5) * r * 9;
      blob(ctx, sx, y + (R() - .5) * r * 1.9, r * .3 * R(), r * .22 * R(), 0, .5 * R());
    }
  }
  for (const [cx, span, a] of [[w * .51, w * .5, .34], [w * .22, w * .2, .16], [w * .82, w * .2, .14]]) {
    for (let i = 0; i < span / (r * .14); i++) {
      const sx = cx + (R() - .5) * span;
      blob(ctx, sx, y + (R() - .5) * r * 1.9, r * (.12 + R() * .4), r * (.08 + R() * .16), 0, a * R());
    }
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
