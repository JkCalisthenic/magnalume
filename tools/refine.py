"""Low-denoise SDXL pass over a composite, so the layers share one grain and light. Usage: refine.py IMAGE SEED"""
import io, json, sys, time, urllib.request, uuid
from pathlib import Path
API = "http://127.0.0.1:8188"
path, seed = Path(sys.argv[1]), int(sys.argv[2])
edge = uuid.uuid4().hex
data = path.read_bytes()
body = (f'--{edge}\r\nContent-Disposition: form-data; name="image"; filename="{path.name}"\r\nContent-Type: image/png\r\n\r\n').encode() + data + f'\r\n--{edge}\r\nContent-Disposition: form-data; name="overwrite"\r\n\r\ntrue\r\n--{edge}--\r\n'.encode()
urllib.request.urlopen(urllib.request.Request(API + "/upload/image", body, {"Content-Type": f"multipart/form-data; boundary={edge}"}))
positive = "cinematic night photograph, dark outdoor calisthenics park, a young athlete with chalked hands in the foreground, an athlete holding a front lever on a chalk coated pull-up bar behind him, low key lighting, film grain, realistic skin"
negative = "cartoon, painting, illustration, text, watermark, deformed hands, extra fingers, bad anatomy, smoke, fog"
wf = {
    "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "RealVisXL_V5.0_fp16.safetensors"}},
    "2": {"class_type": "CLIPTextEncode", "inputs": {"text": positive, "clip": ["1", 1]}},
    "3": {"class_type": "CLIPTextEncode", "inputs": {"text": negative, "clip": ["1", 1]}},
    "4": {"class_type": "LoadImage", "inputs": {"image": path.name}},
    "5": {"class_type": "VAEEncode", "inputs": {"pixels": ["4", 0], "vae": ["1", 2]}},
    "6": {"class_type": "KSampler", "inputs": {"seed": seed, "steps": 26, "cfg": 4.5, "sampler_name": "dpmpp_2m_sde", "scheduler": "karras", "denoise": 0.2, "model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["5", 0]}},
    "7": {"class_type": "VAEDecode", "inputs": {"samples": ["6", 0], "vae": ["1", 2]}},
    "8": {"class_type": "SaveImage", "inputs": {"filename_prefix": "magnalume/refined", "images": ["7", 0]}},
}
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
        path.write_bytes(urllib.request.urlopen(f"{API}/view?filename={img['filename']}&subfolder={img['subfolder']}&type=output").read())
print("refined", path)
