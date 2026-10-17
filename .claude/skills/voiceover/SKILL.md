---
name: voiceover
description: This skill should be used when generating voiceovers, auditioning voices, casting voices per audience, mixing two voices for dialogue, or rotating ElevenLabs API keys for FuelMyBuild videos.
---

# Voiceover

Use `scripts/tts.py`. It rotates through every ElevenLabs key it's given and moves to the next on quota, auth or rate-limit errors. Only when all keys fail does it stop and ask Wayne for a new one.

## Keys
- Read keys from the `ELEVENLABS_API_KEYS` environment variable (comma-separated; set as API credentials on the cloud environment), or `secrets/elevenlabs_keys.txt` locally (gitignored, one per line).
- When Wayne pastes a new key in chat, append it to the local keys file and remind him to add it to the environment's credentials. Never write keys to the repo, memory or docs.
- The cloud workspace needs `api.elevenlabs.io` in the environment's allowed domains. Without it, fall back to the desktop built-in browser method: run JS on an elevenlabs.io tab, keep the result in `window`, and pull the base64 in chunks of 240k characters or less.

## Casting (`references/voice-roster.md`)
- Keep a roster: voice id, name, character, best audience and format, settings, and results.
- When Wayne sends new voices, audition each on the same hook line plus one body line, send the clips, and record his pick.
- Dialogue formats (POV skit, buyer/seller) use two voices: `tts.py --dialogue script.json` renders each line separately and merges them with natural 120–250 ms gaps and one combined word-timing file.

## Pacing (voices differ)
Every voice has its own natural speed, pause length and energy, so never assume the house pace.
1. Before a voice's first full job, audition it on one hook line and one body line at speed 1.0 and measure words/second from the alignment. Record it as `wps` in `references/voice-roster.md`.
2. Set that voice's ElevenLabs `speed` (0.9–1.1) so it lands near 2.7 words/s; a slow, premium voice (Jerry B) may stay slower on trailers, where the pauses are the point.
3. In dialogue, fit each line to its own speaker: tighten or tempo each segment separately, never the merged file, so a fast and a slow voice still sound natural together.
4. After generation, compare each beat's real duration with the beat sheet. Over by more than 10 %: cut words in the script (retention-editor), don't speed up past atempo 1.06.
5. Motion always times cuts and word reveals to the real word timestamps (`words.json`), never to the beat-sheet estimates.
6. Casting per week lives in `weeks/<week>/vo/casting.json` (speaker → actor). `extract_vo.py` pulls the lines; apply casting before generating.

## Process
1. Use the eleven_v4 model (tts.py default; override with --model or ELEVENLABS_MODEL) with the with-timestamps endpoint, and break tags from the script's direction.
2. Trim only dragging pauses (`tts.py --tighten`): it keeps about 0.4 s at sentence ends and 0.24 s at commas, cuts only in real silence and crossfades every join. Statements must flow naturally (Wayne, 2026-10-17); never cut into a word.
3. Fit the runtime with atempo 1.00–1.06 at most. If it's still long, cut words, not speed.
4. Output `vo.wav`, `words.json` (word, start, end) and one file per hook opener.
