import sys
from PIL import Image
ids=sys.argv[2].split(","); out=sys.argv[1]; W=int(sys.argv[3]) if len(sys.argv)>3 else 540
ims=[Image.open(f'out/{i}.png').resize((W,int(W*16/9)),Image.LANCZOS) for i in ids]
s=Image.new('RGB',(W*len(ims)+12*(len(ims)-1),ims[0].height),'#777')
for k,im in enumerate(ims): s.paste(im,(k*(W+12),0))
s.save(out)
