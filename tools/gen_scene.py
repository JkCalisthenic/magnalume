"""Front lever render: draws the body as a depth guide, then runs SDXL with ControlNet union on local ComfyUI.
Usage: gen_scene.py OUT_DIR NAME SEED [SCALE] < prompt.json   (Pillow required)"""
import io, json, sys, time, urllib.request, uuid
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

API = "http://127.0.0.1:8188"
W, H = 1344, 768


def sweep(d, a, b, ra, rb):
    """Tapered limb: a run of discs from a to b."""
    for i in range(61):
        t = i / 60
        x, y, r = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, ra + (rb - ra) * t
        d.ellipse((x - r, y - r, x + r, y + r), fill=255)


def lever():
    """Body shape of a front lever, side on, used as a depth guide."""
    im = Image.new("L", (W, H))
    d = ImageDraw.Draw(im)
    d.line([(60, 92), (1290, 92)], fill=255, width=20)
    sweep(d, (408, 286), (438, 100), 40, 25)
    sweep(d, (440, 300), (600, 318), 74, 58)
    sweep(d, (600, 318), (730, 328), 58, 52)
    sweep(d, (730, 328), (900, 338), 50, 36)
    sweep(d, (900, 338), (1090, 346), 36, 20)
    sweep(d, (1090, 346), (1150, 350), 18, 14)
    d.ellipse((295, 245, 395, 345), fill=255)
    sweep(d, (380, 300), (420, 300), 26, 30)
    return im.filter(ImageFilter.GaussianBlur(5)).convert("RGB")


def upload(img, name):
    buf = io.BytesIO()
    img.save(buf, "PNG")
    edge = uuid.uuid4().hex
    body = (f'--{edge}\r\nContent-Disposition: form-data; name="image"; filename="{name}"\r\nContent-Type: image/png\r\n\r\n').encode() + buf.getvalue() + f'\r\n--{edge}\r\nContent-Disposition: form-data; name="overwrite"\r\n\r\ntrue\r\n--{edge}--\r\n'.encode()
    urllib.request.urlopen(urllib.request.Request(API + "/upload/image", body, {"Content-Type": f"multipart/form-data; boundary={edge}"}))


out, name, seed = Path(sys.argv[1]), sys.argv[2], int(sys.argv[3])
scale = float(sys.argv[4]) if len(sys.argv) > 4 else 1
text = json.load(sys.stdin)
upload(lever(), "magnalume_lever.png")

sampler = {"steps": 34, "cfg": 5.0, "sampler_name": "dpmpp_2m_sde", "scheduler": "karras", "model": ["1", 0]}
wf = {
    "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "RealVisXL_V5.0_fp16.safetensors"}},
    "2": {"class_type": "CLIPTextEncode", "inputs": {"text": text["positive"], "clip": ["1", 1]}},
    "3": {"class_type": "CLIPTextEncode", "inputs": {"text": text["negative"], "clip": ["1", 1]}},
    "20": {"class_type": "ControlNetLoader", "inputs": {"control_net_name": "controlnet-union-sdxl-1.0-promax.safetensors"}},
    "21": {"class_type": "SetUnionControlNetType", "inputs": {"control_net": ["20", 0], "type": "depth"}},
    "23": {"class_type": "LoadImage", "inputs": {"image": "magnalume_lever.png"}},
    "26": {"class_type": "ControlNetApplyAdvanced", "inputs": {"positive": ["2", 0], "negative": ["3", 0], "control_net": ["21", 0], "image": ["23", 0], "strength": 0.92, "start_percent": 0, "end_percent": 0.8, "vae": ["1", 2]}},
    "4": {"class_type": "EmptyLatentImage", "inputs": {"width": W, "height": H, "batch_size": 1}},
    "5": {"class_type": "KSampler", "inputs": {**sampler, "seed": seed, "denoise": 1.0, "positive": ["26", 0], "negative": ["26", 1], "latent_image": ["4", 0]}},
    "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
}
last = "6"
if scale > 1:
    wf["7"] = {"class_type": "ImageScale", "inputs": {"image": ["6", 0], "upscale_method": "lanczos", "width": round(W * scale / 8) * 8, "height": round(H * scale / 8) * 8, "crop": "disabled"}}
    wf["8"] = {"class_type": "VAEEncode", "inputs": {"pixels": ["7", 0], "vae": ["1", 2]}}
    wf["9"] = {"class_type": "KSampler", "inputs": {**sampler, "steps": 28, "cfg": 4.5, "seed": seed + 1, "denoise": 0.34, "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["8", 0]}}
    wf["10"] = {"class_type": "VAEDecode", "inputs": {"samples": ["9", 0], "vae": ["1", 2]}}
    last = "10"
wf["99"] = {"class_type": "SaveImage", "inputs": {"filename_prefix": "magnalume/" + name, "images": [last, 0]}}

pid = json.load(urllib.request.urlopen(urllib.request.Request(API + "/prompt", json.dumps({"prompt": wf}).encode(), {"Content-Type": "application/json"})))["prompt_id"]
while True:
    time.sleep(1.5)
    hist = json.load(urllib.request.urlopen(f"{API}/history/{pid}"))
    if pid in hist:
        break
if hist[pid]["status"].get("status_str") != "success":
    sys.exit(json.dumps(hist[pid]["status"])[:900])
for node in hist[pid]["outputs"].values():
    for img in node.get("images", []):
        url = f"{API}/view?filename={img['filename']}&subfolder={img['subfolder']}&type=output"
        (out / f"{name}.png").write_bytes(urllib.request.urlopen(url).read())
print(out / f"{name}.png")
