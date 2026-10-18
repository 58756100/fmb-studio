"""python3 check_mux.py master.mp4 master.wav -> offset of the muxed AAC vs the source wav (ms), must be within one frame"""
import sys, subprocess, numpy as np, soundfile as sf
mp4, wav = sys.argv[1:3]
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-f", "f32le", "-ac", "1", "-ar", "48000", "-"], capture_output=True).stdout
a = np.frombuffer(raw, np.float32); b, sr = sf.read(wav); b = b.mean(1)
n = min(len(a), len(b), 48000 * 12); A = np.fft.rfft(a[:n], 2 * n); B = np.fft.rfft(b[:n], 2 * n)
c = np.fft.irfft(A * np.conj(B)); lag = int(np.argmax(np.abs(np.concatenate([c[-2000:], c[:2000]])))) - 2000
print("mux offset %.2f ms (%.3f frames), mp4 audio %.3f s" % (lag / 48, lag / 1600, len(a) / 48000))
