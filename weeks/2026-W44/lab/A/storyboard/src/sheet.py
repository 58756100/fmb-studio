# Contact sheet per video: python3 sheet.py L1 [L2 L3]  ->  ../A-<id>/A-<id>-sheet.png
import sys, glob, os, re
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, "..", "..", "fonts", "ibm-plex-mono-latin-500-normal.woff2")
TITLES = {
    "L1": "A-L1  Collectors: the upgrade a finished-car photo cannot prove  (hook 1)",
    "L2": "A-L2  Garages: the same finished-car photo can hide very different work  (hook 1)",
    "L3": "A-L3  Parts suppliers: a guess can become the answer  (hook 1)",
}
BG = {"L1": "#171A18", "L2": "#22211E", "L3": "#1D1B20"}
TX = {"L1": "#F2EBDD", "L2": "#F4EBDD", "L3": "#F3ECE2"}


def font(sz):
    try:
        return ImageFont.truetype(FONT, sz)  # woff2 needs brotli-enabled freetype; fall back if not
    except Exception:
        return ImageFont.load_default(size=sz)


for vid in sys.argv[1:]:
    d = os.path.join(HERE, "..", f"A-{vid}")
    files = sorted(f for f in glob.glob(os.path.join(d, f"A-{vid}-t??.png")))
    W, H, cols, pad, lab, top = 360, 640, 5, 24, 46, 80
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * W + (cols + 1) * pad, top + rows * (H + lab + pad) + pad), "#0E0E0E")
    dr = ImageDraw.Draw(sheet)
    dr.text((pad, 24), TITLES[vid], fill="#DDDDDD", font=font(30))
    for i, f in enumerate(files):
        t = int(re.search(r"-t(\d\d)\.png$", f).group(1))
        im = Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS)
        x = pad + (i % cols) * (W + pad)
        y = top + (i // cols) * (H + lab + pad)
        dr.text((x, y + 4), f"{t:02d}.0 s", fill="#FFFFFF", font=font(32))
        sheet.paste(im, (x, y + lab))
        dr.rectangle([x - 1, y + lab - 1, x + W, y + lab + H], outline="#555555")
    out = os.path.join(d, f"A-{vid}-sheet.png")
    sheet.save(out, optimize=True)
    print(out, sheet.size)
