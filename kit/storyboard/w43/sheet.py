import sys, json
from PIL import Image, ImageDraw, ImageFont
reel = sys.argv[1]; d = f"out/{reel}"; fr = json.load(open(f"{d}/frames.json"))
W = 300; H = int(W * 16 / 9); cols = min(len(fr), 5); rows = (len(fr) + cols - 1) // cols
s = Image.new("RGB", (cols * (W + 14) + 14, rows * (H + 50) + 14), "#E5E5EA"); dr = ImageDraw.Draw(s)
for i, f in enumerate(fr):
    im = Image.open(f"{d}/{f['id']}.png").convert("RGB").resize((W, H), Image.LANCZOS)
    x = 14 + (i % cols) * (W + 14); y = 14 + (i // cols) * (H + 50); s.paste(im, (x, y))
    dr.text((x, y + H + 8), f"{f['id']}  {f['t']:.1f}s", fill="#1D1D1F")
s.save(f"{d}/sheet.jpg", quality=88)
