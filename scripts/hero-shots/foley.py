import wave

import numpy as np

SR = 48000
END = 53.6
rng = np.random.default_rng(7)
track = np.zeros(int(END * SR) + SR, np.float32)


def band(x, lo, hi):
    f = np.fft.rfft(x)
    fr = np.fft.rfftfreq(len(x), 1 / SR)
    f[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(f, len(x)).astype(np.float32)


def put(t, sig, gain):
    i = int(t * SR)
    track[i:i + len(sig)] += sig * gain


def tick(t, gain=0.22):
    n = int(0.018 * SR)
    env = np.exp(-np.arange(n) / (0.0022 * SR))
    s = band(rng.standard_normal(n), 2500, 7500) * env
    thump = np.sin(2 * np.pi * rng.uniform(170, 230) * np.arange(n) / SR) * np.exp(-np.arange(n) / (0.004 * SR))
    put(t, s + 0.35 * thump, gain * rng.uniform(0.7, 1.0))


def click(t, gain=0.3):
    tick(t, gain)
    tick(t + 0.045, gain * 0.55)


def whoosh(t, dur=0.45, gain=0.12):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    env = np.sin(np.pi * x) ** 2
    s = band(rng.standard_normal(n), 300, 3200) * env
    put(t, s, gain)


def hiss(t0, t1, gain=0.035):
    n = int((t1 - t0) * SR)
    x = np.linspace(0, 1, n)
    grains = np.repeat(rng.uniform(0.3, 1, n // 480 + 1), 480)[:n]
    env = np.minimum(1, np.minimum(x * 6, (1 - x) * 6))
    s = band(rng.standard_normal(n), 5000, 14000) * grains * env
    put(t0, s, gain)


click(0.75, 0.22)
hiss(3.35, 5.6)
click(9.35, 0.18)
hiss(11.45, 16.2)
click(17.7, 0.28)
click(20.0, 0.22)
for i in range(46):
    tick(19.5 + 1.05 + i / 12.5)
whoosh(19.5 + 1.05 + 46 / 12.5 + 0.55)
whoosh(27.55, 0.35, 0.06)
click(30.1, 0.2)
for i in range(6):
    tick(29.5 + 1.45 + i * 0.08)
tick(32.0)
whoosh(32.5, 0.6, 0.07)
hiss(32.55, 33.6, 0.025)
whoosh(35.75, 0.6, 0.07)
hiss(35.8, 36.8, 0.025)
click(39.55, 0.25)
hiss(39.85, 41.0)

room = band(rng.standard_normal(len(track)), 40, 400) * 0.004
track += room
track[int(44.0 * SR):] *= 0
track[int(43.6 * SR):int(44.0 * SR)] *= np.linspace(1, 0, int(0.4 * SR))
track = track[:int(END * SR)]
pcm = (np.clip(track, -1, 1) * 32767).astype(np.int16)
stereo = np.stack([pcm, pcm], 1)
with wave.open('foley.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(stereo.tobytes())
print('ok', len(pcm) / SR)
