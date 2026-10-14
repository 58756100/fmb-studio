# python3 sheet.py out.png "label" stills/C1/0.00.png ...  -> labelled contact sheet (time under each frame)
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, title, *fs = sys.argv[1:]
W = 300; H = int(W * 16 / 9); cols = min(len(fs), int(os.environ.get("COLS", 6))); rows = (len(fs) + cols - 1) // cols
try: font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20); tf = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
except Exception: font = tf = ImageFont.load_default()
s = Image.new("RGB", (cols * (W + 16) + 16, rows * (H + 44) + 70), "#E5E5EA"); d = ImageDraw.Draw(s)
d.text((16, 20), title, fill="#1D1D1F", font=tf)
for i, f in enumerate(fs):
    im = Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS)
    x = 16 + (i % cols) * (W + 16); y = 70 + (i // cols) * (H + 44); s.paste(im, (x, y))
    d.text((x, y + H + 8), os.path.basename(f).replace(".png", "") + " s", fill="#1D1D1F", font=font)
s.save(out)
