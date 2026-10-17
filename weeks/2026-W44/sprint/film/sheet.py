#!/usr/bin/env python3
# python3 -I sheet.py <stills-dir> <out.jpg> "<title>" [cols]  -> contact sheet with time labels
import sys, os
from PIL import Image, ImageDraw, ImageFont
d, out, title = sys.argv[1], sys.argv[2], sys.argv[3]
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 6
fs = sorted(f for f in os.listdir(d) if f.endswith(".png"))
W, Hh = 360, 640
rows = (len(fs) + cols - 1) // cols
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    big = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
except Exception:
    font = big = ImageFont.load_default()
sheet = Image.new("RGB", (cols * (W + 12) + 12, rows * (Hh + 40) + 60), "#E8E8ED")
dr = ImageDraw.Draw(sheet)
dr.text((12, 14), title, fill="#111", font=big)
for i, f in enumerate(fs):
    im = Image.open(os.path.join(d, f)).convert("RGB").resize((W, Hh), Image.LANCZOS)
    x = 12 + (i % cols) * (W + 12); y = 60 + (i // cols) * (Hh + 40)
    dr.text((x, y), f[:-4].lstrip("0") + " s", fill="#555", font=font)
    sheet.paste(im, (x, y + 30))
sheet.save(out, quality=86)
print(out, sheet.size)
