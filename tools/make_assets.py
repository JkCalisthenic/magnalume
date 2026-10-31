"""Derives every shipped raster from the two source images, plus the procedural fingerprint."""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter, map_coordinates

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools/source"
OUT = ROOT / "docs/assets"
SCRATCH = Path(sys.argv[1])
LIME = np.array([0.62, 1.0, 0.09])


def logo_masks():
    """Splits the logo into grayscale masks for potrace: dark letters and lime parts."""
    im = np.asarray(Image.open(SRC / "logo.png").convert("RGB")).astype(float) / 255
    h, w, _ = im.shape
    scale = 4
    big = np.asarray(Image.fromarray((im * 255).astype("uint8")).resize((w * scale, h * scale), Image.LANCZOS)).astype(float) / 255
    r, g, b = big[..., 0], big[..., 1], big[..., 2]
    lime = np.clip((g - b - 0.12) * 4, 0, 1)
    dark = np.clip((0.72 - g) * 2.4, 0, 1) * (1 - np.clip((g - b) * 6, 0, 1))
    for name, m in (("logo-dark", dark), ("logo-lime", lime)):
        m = gaussian_filter(m, 1.2)
        Image.fromarray((255 - m * 255).astype("uint8")).save(SCRATCH / f"{name}.png")


def uv_product():
    """Relights the product render: everything falls to violet, the chalk turns into the light source."""
    img = Image.open(SRC / "product.png").convert("RGB")
    a = np.asarray(img).astype(float) / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    luma = 0.3 * r + 0.59 * g + 0.11 * b
    chalk = np.clip((g - np.maximum(r, b) - 0.06) * 6.5, 0, 1)

    base = luma[..., None] ** 1.12 * np.array([0.34, 0.2, 0.92]) * 0.8 * (1 - chalk[..., None] * 0.9)
    rim = np.clip(luma - 0.34, 0, 1)[..., None] * np.array([0.5, 0.32, 1.0]) * 1.1
    core = chalk[..., None] * LIME * (0.75 + 1.0 * luma[..., None])
    bloom = sum(gaussian_filter(chalk, s)[..., None] * LIME * w for s, w in ((5, 0.5), (18, 0.45), (52, 0.42)))
    glow = 1 - (1 - np.clip(base + rim, 0, 1)) * (1 - np.clip(core, 0, 1)) * (1 - np.clip(bloom, 0, 1))
    out = (np.clip(glow, 0, 1) * 255).astype("uint8")
    uv = Image.fromarray(out)

    img.save(OUT / "product-white.webp", quality=84, method=6)
    uv.save(OUT / "product-uv.webp", quality=84, method=6)
    og = uv.resize((1600, 900), Image.LANCZOS).crop((0, 45, 1600, 885)).resize((1200, 630), Image.LANCZOS)
    og.save(OUT / "og.jpg", quality=86)


def fingerprint(n=1400):
    """A plain-arch-into-whorl ridge field: warped radial ridges inside a thumb-shaped mask."""
    rng = np.random.default_rng(14)
    y, x = np.mgrid[-1:1:n * 1j, -1:1:n * 1j]
    def field(sigma, amp):
        return gaussian_filter(rng.standard_normal((n, n)), sigma) * sigma * amp
    wx, wy = field(110, 1.0) + field(30, 0.1), field(110, 1.0) + field(30, 0.1)
    px, py = x + wx * 0.1, y + wy * 0.1
    cx, cy = 0.03, -0.04
    dx, dy = px - cx, (py - cy) * 0.62
    r = np.sqrt(dx ** 2 + dy ** 2)
    ang = np.arctan2(dy, dx)
    # Whorl at the core, relaxing into arches over the top and a delta low on the left.
    swirl = 0.035 * r * np.sin(ang + 2.4 * r)
    arch = 0.16 * np.clip(-py - 0.1, 0, 1) ** 1.6
    delta = -0.05 * np.exp(-(((px + 0.42) / 0.3) ** 2 + ((py - 0.42) / 0.22) ** 2))
    flow = r + swirl + arch + delta
    ridges = np.sin(flow * 205)
    width = 0.06 + field(46, 0.55)
    ink = np.clip((ridges + width) * 3.2 + 0.5, 0, 1)
    pores = gaussian_filter(rng.standard_normal((n, n)), 1.3) * 3.2
    ink *= np.clip(1.25 - np.abs(pores) * 0.36, 0, 1)
    ex, ey = x / 0.72, (y - 0.02) / 0.94
    ey = np.where(ey > 0, ey * 0.92, ey)
    edge = np.sqrt(ex ** 2 + ey ** 2) + 0.02 * field(60, 1.0)
    mask = np.clip((1 - edge) * 7, 0, 1) ** 0.8
    press = np.clip(0.8 + 0.4 * (1 - edge) + field(70, 0.35), 0, 1)
    alpha = np.clip(ink * mask * press, 0, 1)
    a8 = Image.fromarray((alpha * 255).astype("uint8"), "L").resize((1000, 1000), Image.LANCZOS)
    print_rgba = Image.merge("RGBA", (Image.new("L", a8.size, 255),) * 3 + (a8,))
    print_rgba.save(OUT / "fingerprint.webp", quality=70, alpha_quality=82, method=6)


def uv_clap():
    """Same relight for the generated hero: the chalk cloud becomes the light source of the scene."""
    img = Image.open(SRC / "clap.png").convert("RGB")
    a = np.asarray(img).astype(float) / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    luma = 0.3 * r + 0.59 * g + 0.11 * b
    cloud = np.clip((g - np.maximum(r, b) * 0.96 - 0.012) * 7, 0, 1) * np.clip(luma * 2.6, 0, 1)
    cloud = np.maximum(cloud, np.clip((luma - 0.42) * 2.4, 0, 1) * np.clip((g - r) * 9, 0, 1))
    body = luma[..., None] ** 1.05 * np.array([0.36, 0.22, 0.95]) * 0.9 * (1 - cloud[..., None])
    depth = np.clip(luma * 1.75, 0, 1) ** 2.1
    core = (cloud ** 0.9 * depth)[..., None] * LIME * 1.1
    shadow = (cloud * (1 - depth))[..., None] * np.array([0.1, 0.06, 0.34]) * 0.8
    bloom = sum(gaussian_filter(cloud * depth, s)[..., None] * LIME * w for s, w in ((8, 0.14), (40, 0.12)))
    body = body + shadow
    out = 1 - (1 - np.clip(body, 0, 1)) * (1 - np.clip(core, 0, 1)) * (1 - np.clip(bloom, 0, 1))
    img.save(OUT / "clap-white.webp", quality=82, method=6)
    Image.fromarray((np.clip(out, 0, 1) * 255).astype("uint8")).save(OUT / "clap-uv.webp", quality=82, method=6)
    uv = Image.open(OUT / "clap-uv.webp").convert("RGB")
    w, h = uv.size
    box = (0, int(h * 0.03), w, int(h * 0.03) + int(w * 630 / 1200))
    uv.crop(box).resize((1200, 630), Image.LANCZOS).save(OUT / "og.jpg", quality=86)


logo_masks()
uv_product()
fingerprint()
uv_clap()
