# Voice auditions, 2026-W44 sprint (2026-10-17)

Same two lines for every voice, rendered as one clip with `tts.py --tighten` (eleven_multilingual_v2):

1. Hook: "Okay so, when did you last change your clutch? Be honest."
2. Body: "Look, nobody remembers. That's why Andre keeps it on his car's page: the date, the shop, the brand, and the photos, all in one place."

wps = words per second, measured from `words.json` (36 words, first word start to last word end). Single sample per voice, so treat as approximate. Tightened alignment, so gaps are already trimmed.

## Rendered

| No. | Voice | Voice ID | Accent | Character | wps | Note |
|---|---|---|---|---|---|---|
| 01 | Jerry B | Dg1lUQiSAGVHkoQMG3QX | US | Refined, premium, understated | 2.29 | Slowest of the house three. Deliberate, luxury-commercial, and the pauses sell it. Trailer voice. |
| 02 | Jerry B (fast) | Dg1lUQiSAGVHkoQMG3QX | US | Refined, premium, understated | 2.48 | Speed 1.1 (the cap) still lands below house pace. Keep him slower on trailers. |
| 03 | Emma | 9HBoEQ8LqyvVZFYDodnr | US | Clear, confident, polished | 2.66 | Closest to house pace at speed 1.0. Clean and easy to follow. |
| 04 | Emma (fast) | 9HBoEQ8LqyvVZFYDodnr | US | Clear, confident, polished | 2.80 | Speed 1.1 is brisk. Fine for social cuts, a little hurried for story. |
| 05 | Justin Case | DtQLDxHbTiQTpVVanTy1 | US | Warm, conversational ad narrator | 2.80 | Already slightly above 2.7 at speed 1.0, so speed about 0.96 would land on house pace. Most natural of the three on the body line. |
| 06 | Justin Case (fast) | DtQLDxHbTiQTpVVanTy1 | US | Warm, conversational ad narrator | 2.89 | Speed 1.1 is too quick for a story narrator. Use 1.0 or slightly under. |

## Not rendered yet

These are blocked. The ElevenLabs voice library search (`/v1/shared-voices`) needs an API call with the key, and that call was denied by the auto-mode permission check, so no candidate IDs were picked. Nothing below has been rendered or has a voice ID.

- 4 US alternatives from the library: relaxed young male enthusiast, warm female storyteller, gritty older male shop voice, energetic social-media narrator.
- International: British English male, British English female, Australian English, native German (eleven_multilingual_v2, German line from the brief).

Once the library search is allowed, these follow the same numbering from 07 on.

## Pacing read-out

- House target is about 2.7 wps. At speed 1.0, Emma (2.66) is already on target, Justin (2.80) is a touch fast, and Jerry B (2.29) is slow. Jerry B stays slower by design.
- Speed 1.0 to 1.1 moves the pace by only 0.09 to 0.19 wps across the three, so casting should decide the pace, not the speed knob.

## Library candidates (rendered 2026-10-17 by the orchestrator, speed 1.0)

| No. | Voice | Voice ID | Accent | Character | wps |
|---|---|---|---|---|---|
| 07 | Liam, Viral Short-Form Storyteller | VCgLBmBjldJmfphyB8sZ | US | young male, short-form storyteller | 3.22 |
| 08 | Desiree, Warm Storyteller | HvylbcEdW4ILK4GRwetV | US | middle-aged female, warm conversational | 2.70 |
| 09 | Frank, Wise, Deep | V2bPluzT7MuirpucVAKH | US | older male, gritty, deep | 3.02 |
| 10 | Dan, Upbeat, Dynamic | 9F4C8ztpNUmXkdDDbz3J | US | young male, upbeat social | 2.79 |
| 11 | Archer, Conversational | Fahco4VZzobUeiPqni1S | British | male, casual thirties | 3.05 |
| 12 | Blondie, Conversational | exsUS4vynmxd379XN4yO | British | female, warm natural | 2.75 |
| 13 | Steve, Australian Male | aGkVQvWUZi16EH8aZJvT | Australian | male, mid-40s professional | 3.74 |
| 14 | Ben, Effortless and Casual | aTTiK3YzK3dXETpuDE2h | German | young male, casual (German line) | 2.59 |
