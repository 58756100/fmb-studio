# python3 montage.py out.png files...   (review grid, 5 per row, 432x768 each)
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
W, H, cols = 432, 768, 5
rows = (len(files) + cols - 1) // cols
sh = Image.new("RGB", (cols * W, rows * (H + 28)), "#000")
d = ImageDraw.Draw(sh)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS)
    x, y = (i % cols) * W, (i // cols) * (H + 28)
    sh.paste(im, (x, y + 28)); d.text((x + 6, y + 4), f.split("/")[-1], fill="#fff")
sh.save(out)
