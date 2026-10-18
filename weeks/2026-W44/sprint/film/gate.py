#!/usr/bin/env python3
# python3 gate.py <id> [hooks] -> exit 0 when every master passes: length = VO + tail (= composition), A/V offset 0,
# -14 +-0.5 LUFS, true peak <= -1 dBTP (measured on the delivered AAC), no static 0.5 s window, no subtitle stream
import json, sys
ID = sys.argv[1]; hooks = (sys.argv[2] if len(sys.argv) > 2 else "A,B,C").split(","); ok = True
for h in hooks:
    c = json.load(open(f"out/masters/{ID}-{h}-check.json")); e = json.load(open(f"out/masters/{ID}-{h}-energy.json"))
    errs = []
    if abs(c["v_dur"] - c["expected"]) > 0.04 or abs(c["a_dur"] - c["expected"]) > 0.04: errs.append("length")
    if c["v_start"] != 0 or c["a_start"] != 0 or c["xcorr_lag_samples"] != 0: errs.append("offset")
    if abs(c["lufs_I"] + 14) > 0.5: errs.append("loudness")
    if c["true_peak"] > -1.0: errs.append("true peak")
    if e["static"]: errs.append("static " + str(e["static"]))
    if c["subtitle_streams"] != "none": errs.append("subtitles")
    if "BEFORE" in c["cta"]: errs.append("cta")
    print(f"{ID}-{h}: {c['v_dur']:.2f}s (VO {c['vo_end']:.2f} + tail {c['tail']:.2f}), I {c['lufs_I']} LUFS, TP {c['true_peak']} dBTP, lowest energy {e['lowest'][1]:.3f} at {e['lowest'][0]}s, lag {c['xcorr_lag_samples']}", "OK" if not errs else "FAIL " + ", ".join(errs))
    ok &= not errs
sys.exit(0 if ok else 1)
