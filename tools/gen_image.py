"""Queues a photoreal SDXL render on local ComfyUI. Usage: gen_image.py OUT_DIR NAME W H SEED [SCALE] < prompt.json"""
import json, sys, time, urllib.request
from pathlib import Path

API = "http://127.0.0.1:8188"
out, name, w, h, seed = Path(sys.argv[1]), sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
scale = float(sys.argv[6]) if len(sys.argv) > 6 else 1
text = json.load(sys.stdin)

wf = {
    "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "RealVisXL_V5.0_fp16.safetensors"}},
    "2": {"class_type": "CLIPTextEncode", "inputs": {"text": text["positive"], "clip": ["1", 1]}},
    "3": {"class_type": "CLIPTextEncode", "inputs": {"text": text["negative"], "clip": ["1", 1]}},
    "4": {"class_type": "EmptyLatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
    "5": {"class_type": "KSampler", "inputs": {"seed": seed, "steps": 32, "cfg": 5.0, "sampler_name": "dpmpp_2m_sde", "scheduler": "karras", "denoise": 1.0, "model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["4", 0]}},
    "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
}
last = "6"
if scale > 1:
    wf["7"] = {"class_type": "ImageScale", "inputs": {"image": ["6", 0], "upscale_method": "lanczos", "width": round(w * scale / 8) * 8, "height": round(h * scale / 8) * 8, "crop": "disabled"}}
    wf["8"] = {"class_type": "VAEEncode", "inputs": {"pixels": ["7", 0], "vae": ["1", 2]}}
    wf["9"] = {"class_type": "KSampler", "inputs": {"seed": seed + 1, "steps": 28, "cfg": 4.5, "sampler_name": "dpmpp_2m_sde", "scheduler": "karras", "denoise": 0.36, "model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["8", 0]}}
    wf["10"] = {"class_type": "VAEDecode", "inputs": {"samples": ["9", 0], "vae": ["1", 2]}}
    last = "10"
wf["99"] = {"class_type": "SaveImage", "inputs": {"filename_prefix": "magnalume/" + name, "images": [last, 0]}}

req = urllib.request.Request(API + "/prompt", json.dumps({"prompt": wf}).encode(), {"Content-Type": "application/json"})
pid = json.load(urllib.request.urlopen(req))["prompt_id"]
while True:
    time.sleep(1.5)
    hist = json.load(urllib.request.urlopen(f"{API}/history/{pid}"))
    if pid in hist:
        break
if hist[pid]["status"].get("status_str") != "success":
    sys.exit(json.dumps(hist[pid]["status"])[:500])
for node in hist[pid]["outputs"].values():
    for img in node.get("images", []):
        url = f"{API}/view?filename={img['filename']}&subfolder={img['subfolder']}&type=output"
        (out / f"{name}.png").write_bytes(urllib.request.urlopen(url).read())
print(out / f"{name}.png")
