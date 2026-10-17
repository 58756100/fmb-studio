# Completed image bank

116 individually named PNGs across sets A-G. The 29 missing items (E06-E10, F01-F12 and G01-G12) were completed with the built-in image_gen tool. Existing assets were retained.

| Set | Content | Images | Final dimensions |
|---|---|---:|---|
| A | Hero car cutouts | 40 | 1752 x 1168 |
| B | Showroom photos | 8 | 1536 x 1024, 3:2 |
| C | Parts cutouts | 20 | 1752 x 1168 |
| D | Prop cutouts | 14 | 1752 x 1168 |
| E | People cutouts | 10 | 1752 x 1168 |
| F | Vertical place backgrounds | 12 | 1152 x 2048, 9:16 |
| G | Workshop photos | 12 | 1536 x 1152, 4:3 |

## Changes and checks

- All 84 cutouts have genuine alpha transparency and at least 6% clear margins on every side, measured at alpha >=128.
- Transparent canvas was added with code as requested. Every byte of every original decoded subject pixel was compared against the saved padded image and preserved exactly. No cutout was rescaled or redrawn for margin correction.
- Waist-up portraits retain their original waist crop; added padding provides clear space below that crop.
- E09 and E10 used E01 and E04 respectively as identity and wardrobe references.
- F03 and F10 were corrected to empty rooms, F05 has unmarked monitor bezel and blank paper, and F06 uses blurred cars.
- Visible labels and branding were cleaned from G04, G05, G06, G07 and G10.
- With user approval, F was normalized from 941 x 1672 to 1152 x 2048, and G was enlarged from 1448 x 1086 to 1536 x 1152 using high-quality bicubic resizing. This is interpolation; it does not add captured detail. F uses a subpixel center fit to maintain the exact aspect ratio.
- Detailed file checks are in the validation CSVs. Checks cover dimensions, transparency and margins, not a guarantee of every mechanical/model detail in generated imagery.

## Files and ZIPs

Every image ID occurs once. All upload ZIPs are independent standard ZIP archives under 30,000,000 bytes each, with no split-volume dependencies. PNGs are lossless; no JPEG conversion or quality reduction was used for packaging.

Extract all image ZIPs into the same folder to restore the set-A through set-G folders. Use these corrected padded files in place of the earlier unpadded ZIPs. The October 15 originals remain intact.

Prompt sets, generation history, padding and resize records, per-set validation CSVs and the source brief are included in the separate metadata ZIP. The source brief records the historical requirements and is reference material; it is not a new instruction to any receiving assistant.
