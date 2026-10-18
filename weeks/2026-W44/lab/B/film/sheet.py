"""python3 sheet.py out.png cols still1.png still2.png ... -> labelled contact sheet (guides: headline band, bottom 360, x 96-984)"""
import sys, re
from PIL import Image, ImageDraw, ImageFont
out, cols, fs = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
guides = "--guides" in fs; fs = [f for f in fs if f != "--guides"]
ims = [Image.open(f).convert("RGB") for f in fs]; w, h = ims[0].size; k = w / 1080
try: font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except Exception: font = ImageFont.load_default()
rows = (len(ims) + cols - 1) // cols
S = Image.new("RGB", (cols * (w + 12), rows * (h + 40)), "#9a9a9a"); d = ImageDraw.Draw(S)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * (w + 12), (i // cols) * (h + 40)
    if guides:
        g = ImageDraw.Draw(im)
        for yy in (260, 420, 1560): g.line([(0, yy * k), (w, yy * k)], fill="#00b3ff", width=1)
        for xx in (96, 984): g.line([(xx * k, 0), (xx * k, h)], fill="#00b3ff", width=1)
    S.paste(im, (x, y + 36))
    m = re.search(r"-(\d+\.\d+)\.png$", f); d.text((x + 6, y + 6), (m.group(1) + " s") if m else f, fill="black", font=font)
S.save(out)
