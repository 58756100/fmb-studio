# python3 sheet.py out.jpg "title" stills/X/0.00.png ...  [COLS=6] [CAP="t1|cap1;t2|cap2"]  -> labelled contact sheet
# Each frame gets its time and, if given, a one-line beat caption underneath.
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, title, *fs = sys.argv[1:]
caps = dict(c.split("|", 1) for c in os.environ.get("CAP", "").split(" ;; ") if "|" in c)
W = int(os.environ.get("TW", 300)); H = int(W * 16 / 9); cols = min(len(fs), int(os.environ.get("COLS", 6))); rows = (len(fs) + cols - 1) // cols
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
try: font = ImageFont.truetype(F, 19); tf = ImageFont.truetype(F.replace("Sans.", "Sans-Bold."), 28); bf = ImageFont.truetype(F.replace("Sans.", "Sans-Bold."), 20)
except Exception: font = tf = bf = ImageFont.load_default()
CH = 100 if caps else 40
s = Image.new("RGB", (cols * (W + 18) + 18, rows * (H + CH) + 78), "#E5E5EA"); d = ImageDraw.Draw(s)
d.text((18, 22), title, fill="#1D1D1F", font=tf)
def wrap(txt, n=28):
    out, line = [], ""
    for w in txt.split():
        if len(line) + len(w) + 1 > n: out.append(line); line = w
        else: line = (line + " " + w).strip()
    return out + [line] if line else out
for i, f in enumerate(fs):
    im = Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS)
    x = 18 + (i % cols) * (W + 18); y = 78 + (i // cols) * (H + CH); s.paste(im, (x, y))
    t = os.path.splitext(os.path.basename(f))[0]
    d.text((x, y + H + 6), t + " s", fill="#1D1D1F", font=bf)
    for k, ln in enumerate(wrap(caps.get(t, ""))[:3]): d.text((x, y + H + 30 + k * 22), ln, fill="#3A3A3C", font=font)
s.save(out, quality=88)
