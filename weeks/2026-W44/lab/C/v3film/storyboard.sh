#!/usr/bin/env bash
# bash storyboard.sh  -> renders the key stills from the scene code and writes ../v3storyboard/<id>/*.jpg,
# <id>-sheet.jpg (clean, with beat notes) and <id>-check-sheet.jpg (subtitle band + bottom 360 px overlaid)
set -e; cd "$(dirname "$0")"; SB=../v3storyboard
declare -A T CAPS
T[C3-COL]="0,1.05,3.4,5.8,9.3,12.3,13.9,14.8,16.5,19.8,23.3,25.2"
T[C3-GAR]="0,0.3,3.9,6.6,8.7,10.2,11.2,13.8,17.5,20.0,22.8,25.2"
T[C3-SUP]="0,3.3,5.3,7.7,10.6,13.2,14.7,15.6,17.2,20.8,23.0,25.2"
CAPS[C3-COL]="0.00|Frame 0 = last frame: bet chip, flags 2017 and 2021, empty tape ;; 1.05|Hook A: check presenter slaps the tape on 'dinner' ;; 3.40|Glide right, intake lifts, leader line to the ? ;; 5.80|Marisol's flag replants on 2021 (speed-lines) ;; 9.30|Longest pan: four years tint red, Dev plants 2017 ;; 12.30|Pull back to both flags, check nudges right ;; 13.90|'Look it up': the 2019 tick splits open ;; 14.80|Turn: frameless card rises out of the tape ;; 16.50|One record held 3 s: date, photo, logged by Marisol ;; 19.80|Card pinned over 2019, 2 years each side ;; 23.30|Check slides to the middle, red drains ;; 25.20|CTA over the story, fold-back to frame 0"
CAPS[C3-GAR]="0.00|Frame 0 = last frame: NEVER TOLD ME, \$1,850 chip, bell ;; 0.30|Hook A: bell ding, board re-clatters ;; 3.90|Hard punch-in: PELL ST GARAGE, DID HE? ;; 6.60|Punch-out: the week flips in row by row ;; 8.70|THU spins, slows, stalls blank (no VO) ;; 10.20|Counter monitor slides in, back to camera ;; 11.20|Monitor swings round to face Okafor ;; 13.80|Turn: one entry, photo, logged by Gus, held 3 s ;; 17.50|Slow push into the photo. 'Shows when. Not the call.' ;; 20.00|THU clatters to SORRY ;; 22.80|Monitor turns half back, chip goes grey ;; 25.20|CTA on the counter front, board back to frame 0"
CAPS[C3-SUP]="0.00|Frame 0 = last frame: exhaust on cotton string, one tag ;; 3.30|Camera drops, empty car slot, 'Car? Fitter? Date?' ;; 5.30|'Which car?' tag lands (paper-sticker), pipe sags ;; 7.70|Pencil 'WRX day 2', WRX fills the slot ;; 10.60|Third tag: more sag and tilt, 'Some shop day 4' ;; 13.20|Day six: lowest point, red 'Return?' chip ;; 14.70|Turn: question tags snap off and fall ;; 15.60|First tag swings to center and unfolds ;; 17.20|Unfolded tag = log card: brand, date, photo ;; 20.80|Small tag ties onto the rear hanger: 'Check first' ;; 23.00|Pipe lifts level, chips back ;; 25.20|CTA over the story, back to frame 0"
declare -A TITLE=([C3-COL]="C3-COL  Loser buys dinner  (collectors, 27.0 s, hook A)" [C3-GAR]="C3-GAR  You never told me  (garages, 27.0 s, hook A)" [C3-SUP]="C3-SUP  Rattle. Fix?  (parts suppliers, 27.0 s, hook A)")
for r in C3-COL C3-GAR C3-SUP; do
  rm -rf stills/$r stills/$r-check $SB/$r; mkdir -p $SB/$r
  node stills.mjs $r "${T[$r]}" 2>&1 | grep done
  node stills.mjs $r "${T[$r]}" --check 2>&1 | grep done
  for f in stills/$r/*.png; do python3 -c "import sys;from PIL import Image;Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2],quality=86)" $f $SB/$r/$(basename $f .png).jpg; done
  CAP="${CAPS[$r]}" python3 sheet.py $SB/$r-sheet.jpg "${TITLE[$r]}   yellow tags = placeholder images" $(ls stills/$r/*.png | sort -t/ -k3 -n)
  python3 sheet.py $SB/$r-check-sheet.jpg "$r review: subtitle band (blue) + platform-covered bottom 360 px (orange)" $(ls stills/$r-check/*.png | sort -t/ -k3 -n)
done
