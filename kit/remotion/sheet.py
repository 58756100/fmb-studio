import sys
from PIL import Image
fr=sys.argv[2].split(","); W=360
ims=[Image.open(f'stills/f{n}.png').convert('RGB').resize((W,640)) for n in fr]
cols=min(6,len(ims)); rows=(len(ims)+cols-1)//cols
s=Image.new('RGB',(cols*(W+8),rows*648),'#777')
for i,im in enumerate(ims): s.paste(im,((i%cols)*(W+8),(i//cols)*648))
s.save(sys.argv[1])
