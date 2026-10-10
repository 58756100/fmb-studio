---
name: sound
description: This skill should be used when scoring, adding sound effects, mixing or mastering a FuelMyBuild video — "add music", "sound design", "mix", "master", "no-music version".
---

# Sound

Use `kit/audio/audio.py` as the template. Copy it per reel and edit the cue list.

1. Score: an original bed so the reel can't be muted for copyright. Pick tempo and key per mood (default 100 bpm, F minor). Set the phase so the reveal lands on a downbeat, add a tape stop or dead silence before the reveal, and drop back in on the logo or turn.
2. SFX: one sound per visible action, timed to the same frames as the scene code: key taps, notification ticks, whooshes on transitions, pops on seals, chimes on checks, a shutter on photos, deep hits on dark beats.
3. Mix: voice around -20 dB RMS, music around -24 ducked 55% under the voice, SFX around -25.
4. Master: `ffmpeg -af loudnorm=I=-14:TP=-1:LRA=9` for both the full mix and the voice-and-SFX stem.
5. Be honest: you can't listen. Check levels and timing, and ask Wayne to listen to the first reel of each new sound design.
