"""Builds the hero: park plate, chalked bar, front lever and clapper as one picture, in white light and in UV.
Usage: make_scene.py SCRATCH_DIR. Writes tools/source/scene-*.png and masks for make_assets.py."""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from rembg import new_session, remove
from scipy.ndimage import gaussian_filter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools/source"
SCRATCH = Path(sys.argv[1])
CHALK = np.array([0.72, 0.87, 0.72])
rng = np.random.default_rng(31)


def cutouts():
    session = new_session("isnet-general-use")
    lever = remove(Image.open(SRC / "lever.png").convert("RGB"), session=session, post_process_mask=True)
    clap = remove(Image.open(SRC / "clapper.png").convert("RGB"), session=session, post_process_mask=True)
    a = np.array(lever)
    # The source bar goes: the composite draws its own, and the hands close around that one.
    a[:97, :, 3] = 0
    a[:97, 395:470, 3] = np.array(lever)[:97, 395:470, 3]
    # The clapper was lit like a portrait: bring him down into the night, leaving a side light.
    c = np.array(clap.transpose(Image.FLIP_LEFT_RIGHT)).astype(float)
    falloff = np.linspace(0.34, 0.86, c.shape[1])[None, :, None]
    grey = c[..., :3].mean(axis=2, keepdims=True)
    c[..., :3] = (c[..., :3] * 0.72 + grey * 0.28) * falloff
    return Image.fromarray(a), Image.fromarray(c.astype("uint8"))


def noise(h, w, s, amp=1.0):
    return gaussian_filter(rng.standard_normal((h, w)), s) * s * amp


def place(canvas, cut, scale, anchor, at):
    """Pastes cut so that its anchor pixel lands on at; returns the alpha it covered."""
    size = (round(cut.width * scale), round(cut.height * scale))
    small = cut.resize(size, Image.LANCZOS)
    pos = (round(at[0] - anchor[0] * scale), round(at[1] - anchor[1] * scale))
    canvas.paste(small, pos, small)
    layer = Image.new("L", canvas.size)
    layer.paste(small.getchannel("A"), pos)
    return np.asarray(layer).astype(float) / 255


def bar_layers(h, w, y, x0, x1, r, ground):
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    b = (yy - y) / r
    on_bar = (np.abs(b) < 1) & (xx > x0) & (xx < x1)
    shade = np.clip(0.34 + 0.66 * (1 - np.abs(b + 0.35)), 0, 1)
    posts = np.zeros((h, w), bool)
    post_shade = np.zeros((h, w))
    for px in (x0, x1):
        p = (xx - px) / (r * 1.25)
        hit = (np.abs(p) < 1) & (yy > y - r) & (yy < ground)
        posts |= hit
        post_shade[hit] = (0.25 + 0.55 * (1 - np.abs(p + 0.3)))[hit]
    coat = np.clip(0.72 + noise(h, w, 2.4, 0.6) + noise(h, w, 9, 0.25), 0, 1) * on_bar
    runs = np.zeros((h, w))
    for _ in range(max(7, (x1 - x0) // 230)):
        cx, length = rng.integers(x0 + 40, x1 - 40), r * rng.uniform(0.8, 3) ** 2
        width = rng.uniform(1.8, 3.4)
        d = np.abs(xx - cx - np.sin((yy - y) * 0.06) * 2) / (width * (1 + np.clip((yy - y) / (length + r), 0, 1) * 0.6))
        runs = np.maximum(runs, np.clip(1.2 - d, 0, 1) * ((yy > y) & (yy < y + r + length)))
    return on_bar, shade, posts, post_shade, np.clip(coat, 0, 1), gaussian_filter(runs, 0.7)


def dust(h, w, at, radius):
    """Chalk hanging off the hands: wisps close in, then loose grains. Part of the picture, not an effect."""
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    d = np.hypot((xx - at[0]) / radius, (yy - at[1]) / (radius * 0.86))
    wisps = np.clip(noise(h, w, radius * 0.09, 1.2) + noise(h, w, radius * 0.03, 0.7) + 0.2, 0, 1)
    body = np.exp(-(d * 1.9) ** 2) * wisps
    grains = (rng.random((h, w)) > 0.9975) * np.exp(-(d * 1.15) ** 2)
    return np.clip(body * 0.6 + gaussian_filter(grains.astype(float), 0.9) * 3.4, 0, 1)


def compose(name, size, plate_box, bar, lever_at, lever_scale, clap_at, clap_scale, lever, clap, fade=None):
    w, h = size
    canvas = Image.open(SRC / "plate.png").convert("RGB").crop(plate_box).resize(size, Image.LANCZOS).convert("RGBA")
    base = np.asarray(canvas.convert("RGB")).astype(float) / 255
    grey = base.mean(axis=2, keepdims=True)
    plate = (base * 0.28 + grey * 0.5) * 0.5
    canvas = Image.fromarray((plate * 255).astype("uint8")).convert("RGBA")

    y, x0, x1, r, ground = bar
    on_bar, shade, posts, post_shade, coat, runs = bar_layers(h, w, y, x0, x1, r, ground)
    a = np.asarray(canvas.convert("RGB")).astype(float) / 255
    a[posts] = (np.array([0.5, 0.52, 0.55]) * post_shade[..., None])[posts]
    steel = np.array([0.55, 0.57, 0.6])[None, None] * shade[..., None]
    chalked = steel * (1 - coat[..., None] * 0.85) + CHALK * (0.5 + 0.55 * shade[..., None]) * coat[..., None] * 0.85
    a[on_bar] = chalked[on_bar]
    a = a * (1 - runs[..., None] * 0.8) + CHALK * runs[..., None] * 0.8
    canvas = Image.fromarray((np.clip(a, 0, 1) * 255).astype("uint8")).convert("RGBA")

    lever_alpha = place(canvas, lever, lever_scale, (432, 86), lever_at)
    clap_alpha = place(canvas, clap, clap_scale, (232, 648), clap_at)
    a = np.asarray(canvas.convert("RGB")).astype(float) / 255
    if fade:
        # A cut-off waist would show in the tall crop: the body sinks into the dark first.
        ramp = np.clip((fade[1] - np.arange(h)) / (fade[1] - fade[0]), 0, 1)[:, None, None]
        a = a * (1 - clap_alpha[..., None]) + a * ramp * clap_alpha[..., None]

    # Bar glow is hidden wherever a body stands in front of it.
    bar_mask = np.clip(coat * 0.9 + runs, 0, 1) * (1 - np.maximum(lever_alpha, clap_alpha))
    px, py = clap_at
    radius = 150 * clap_scale
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    near = np.exp(-((((xx - px) / radius) ** 2 + ((yy - py) / (radius * 1.5)) ** 2) * 1.1))
    luma = a.mean(axis=2)
    hands = np.clip(clap_alpha * near * np.clip(luma * 3.2, 0, 1) * (a[..., 0] > a[..., 2] * 1.02), 0, 1)
    hands = gaussian_filter(hands, 0.8)
    chalk_dust = dust(h, w, (px, py), 210 * clap_scale)

    day = a * (1 - hands[..., None] * 0.62) + CHALK * luma[..., None] ** 0.6 * hands[..., None] * 0.62
    day = 1 - (1 - day) * (1 - chalk_dust[..., None] * CHALK * 0.5)
    Image.fromarray((np.clip(day, 0, 1) * 255).astype("uint8")).save(SRC / f"scene-{name}.png")
    np.savez_compressed(SCRATCH / f"masks-{name}.npz", bar=bar_mask, hands=hands, dust=chalk_dust, people=np.maximum(lever_alpha, clap_alpha))


lever, clap = cutouts()
compose("wide", (2016, 1152), (0, 0, 1344, 768), (172, 300, 1960, 13, 760), (800, 172), 0.8, (1340, 800), 0.8, lever, clap)
compose("tall", (1080, 1920), (360, 0, 792, 768), (240, 30, 1050, 11, 1240), (200, 240), 0.66, (500, 880), 0.8, lever, clap, fade=(1000, 1290))
