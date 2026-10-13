import json
import math
import os
import sys

import cv2
import numpy as np

cv2.setNumThreads(1)

ROOT = os.path.dirname(os.path.abspath(__file__))
CAP = os.path.join(ROOT, 'cap')
W, H = 1920, 1080
FPS = 60
SUB = 4
SHUTTER = 0.5 / FPS


def meta(shot):
    with open(os.path.join(CAP, shot, 'meta.json')) as f:
        return json.load(f)


def center(r):
    return (r[0] + r[2] / 2, r[1] + r[3] / 2)


def ease_io(u):
    u = min(max(u, 0.0), 1.0)
    return u * u * (3 - 2 * u)


def ease_out_cubic(u):
    u = min(max(u, 0.0), 1.0)
    return 1 - (1 - u) ** 3


def drift(u, a=2.0):
    # Ease-out arrival over the first third that hands off to a constant drift.
    u = min(max(u, 0.0), 1.0)
    v1 = 1 / (1 + a / 9)
    if u < 1 / 3:
        return v1 * (u + a * (1 - (1 - 3 * u) ** 3) / 9)
    return v1 * (u + a / 9)


def lerp(a, b, u):
    if isinstance(a, (tuple, list)):
        return tuple(lerp(x, y, u) for x, y in zip(a, b))
    return a + (b - a) * u


def path(keys, t):
    """Piecewise ease-in-out between (time, value) keys."""
    if t <= keys[0][0]:
        return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t <= t1:
            return lerp(v0, v1, ease_io((t - t0) / max(t1 - t0, 1e-6)))
    return keys[-1][1]


# ---------------------------------------------------------------- shot list

def build_shots():
    shots = []

    def add(**kw):
        shots.append(kw)

    m1 = meta('s01-nav')
    add(name='s01-nav', len=3.0, mag=(4.0, 4.16), pitch=36, roll=(-12, -12.8), yaw=(8, 9),
        persp=1300, look=((96, 96), (96, 128)), anchor=(0.46, 0.56), band=0.11, maxblur=20,
        ops=[(0, 'set', 'themes'), (0.75, 'fade', 'slides', 0.35, None)], meta=m1)

    m2 = meta('s02-grid')
    cards = m2['items']['cards']
    titles = m2['items']['titles']
    ops2 = [(0, 'set', 'empty')]
    for i, (c, ti) in enumerate(zip(cards, titles)):
        row = round((c[1] - cards[0][1]) / max(cards[3][1] - cards[0][1], 1))
        col = i % 3
        start = 0.35 + row * 0.55 + col * 0.14
        ops2.append((start, 'stipple', 'full', 0.55, c))
        ops2.append((start + 0.08, 'stipple', 'full', 0.5, [ti[0] - 2, ti[1] - 2, ti[2] + 4, ti[3] + 4]))
    add(name='s02-grid', len=5.5, mag=(2.1, 2.18), pitch=36, roll=(12, 13), yaw=(-8, -7),
        persp=1400, look=((520, 260), (930, 275)), anchor=(0.5, 0.56), band=0.16, maxblur=18,
        ops=ops2, meta=m2)

    m3 = meta('s03-agent')
    badge = center(m3['items']['badge'][0])
    add(name='s03-agent', len=2.5, mag=(6.0, 6.2), pitch=44, roll=(-16, -16.8), yaw=(10, 11),
        persp=1200, look=((badge[0] - 30, badge[1] + 6), (badge[0] + 12, badge[1] + 6)),
        anchor=(0.5, 0.5), band=0.06, maxblur=24, focus=[(0, (badge[0] - 10, badge[1]))],
        ops=[(0, 'set', 'disconnected'), (0.85, 'fade', 'connected', 0.3, None)], meta=m3)

    m4 = meta('s04-rail')
    thumbs = m4['items']['thumbs']
    ops4 = [(0, 'set', 'one')]
    fkeys = [(0, center(thumbs[0]))]
    for i in range(1, 7):
        st = 0.45 + (i - 1) * 0.8
        r = thumbs[i]
        ops4.append((st, 'stipple', 'full', 0.55, [r[0] - 4, r[1] - 2, r[2] + 8, r[3] + 4]))
        c = center(r)
        fkeys.append((st - 0.1, (c[0] + 20, c[1] - 30)))
        fkeys.append((st + 0.5, (c[0] + 20, c[1])))
    add(name='s04-rail', len=6.0, mag=(2.3, 2.4), pitch=34, roll=(12, 13.5), yaw=(-8, -7),
        persp=1400, look=((150, 300), (150, 760)), anchor=(0.5, 0.5), band=0.24, maxblur=14,
        focus=fkeys, ops=ops4, meta=m4)

    m5 = meta('s05-tool')
    cm = center(m5['items']['comment'][0])
    add(name='s05-tool', len=2.5, mag=(6.2, 6.4), pitch=46, roll=(-17, -17.6), yaw=(11, 12),
        persp=1200, look=((cm[0] - 22, cm[1] + 6), (cm[0] + 6, cm[1] + 6)), anchor=(0.5, 0.52),
        band=0.06, maxblur=24, focus=[(0, cm)],
        ops=[(0, 'set', 'edit'), (0.7, 'fade', 'comment', 0.35, None)], meta=m5)

    m6 = meta('s06-comment')
    note = m6['note']
    tgt = center(m6['items']['target'][0])
    comp = m6['items']['composer'][0]
    ops6 = [(0, 'set', 'idle'), (0.5, 'fade', 'open', 0.3, None)]
    t0 = 1.05
    for i in range(1, len(note) + 1):
        ops6.append((t0 + (i - 1) / 12.5, 'set', f'k{i:02d}'))
    t_send = t0 + len(note) / 12.5 + 0.55
    ops6.append((t_send, 'fade', 'posted', 0.35, None))
    line1 = (comp[0] + 40, comp[1] + 12)
    line2 = (comp[0] + 140, comp[1] + 32)
    pin = (tgt[0] + 140, tgt[1] - 40)
    add(name='s06-comment', len=7.5, mag=(3.0, 2.86), pitch=38, roll=(14, 15), yaw=(-6, -5),
        persp=1300, look=((comp[0] + 20, comp[1] + 20), (comp[0] + 230, comp[1] + 22)),
        anchor=(0.5, 0.52), band=0.12, maxblur=20,
        focus=[(0, (tgt[0], tgt[1])), (0.5, (tgt[0], tgt[1])), (1.0, line1),
               (t0 + 26 / 12.5, line1), (t0 + 34 / 12.5, line2), (t_send, line2),
               (t_send + 0.6, pin)],
        ops=ops6, meta=m6, typing=(t0, len(note)), send=t_send)

    m7 = meta('s07-apply')
    code = m7['items']['hint'][0]
    cc = center(code)
    add(name='s07-apply', len=2.5, mag=(5.5, 5.7), pitch=45, roll=(-15, -15.8), yaw=(9, 10),
        persp=1200, look=((cc[0] - 40, cc[1] + 4), (cc[0] + 10, cc[1] + 4)), anchor=(0.5, 0.5),
        band=0.07, maxblur=24, focus=[(0, cc)],
        ops=[(0, 'set', 'idle'), (0.55, 'fade', 'posted', 0.4, None)], meta=m7)

    m8 = meta('s08-design')
    acc = m8['items']['accent'][0]
    ops8 = [(0, 'set', 'before'), (0.6, 'fade', 'selected', 0.2, None)]
    for i in range(1, 7):
        ops8.append((1.45 + (i - 1) * 0.08, 'set', f'k{i}'))
    add(name='s08-design', len=2.5, mag=(3.3, 3.42), pitch=38, roll=(13, 14), yaw=(-7, -6),
        persp=1300, look=((acc[0] - 10, acc[1] + 14), (acc[0] + 50, acc[1] + 14)),
        anchor=(0.5, 0.5), band=0.11, maxblur=20, focus=[(0, (acc[0] + 30, acc[1] + 14))],
        ops=ops8, meta=m8, typing=(1.45, 6, 0.08))

    m9 = meta('s09-wide')
    sw = m9['items']['swatches']
    swf = m9['items']['swatchFields']
    canvas = m9['items']['canvas'][0]
    th = [r for r in m9['items']['thumbs'] if r[1] < 1000]
    ops9 = [(0, 'set', 'before'),
            (0.0, 'fade', 'after', 0.01, sw[2]), (0.0, 'fade', 'after', 0.01, swf[2])]
    ops9.append((0.5, 'fade', 'after', 0.4, canvas))
    for i, r in enumerate(th):
        ops9.append((0.62 + i * 0.09, 'fade', 'after', 0.3, r))
    ops9.append((1.4, 'fade', 'after', 0.3, None))
    ops9.append((3.6, 'fade', 'after2', 0.01, sw[0]))
    ops9.append((3.6, 'fade', 'after2', 0.01, swf[0]))
    ops9.append((3.75, 'fade', 'after2', 0.45, canvas))
    for i, r in enumerate(th):
        ops9.append((3.87 + i * 0.09, 'fade', 'after2', 0.3, r))
    ops9.append((4.6, 'fade', 'after2', 0.3, None))
    add(name='s09-wide', len=7.0, mag=(0.95, 1.0), pitch=10, roll=(0, 0), yaw=(2, 2.6),
        persp=2000, look=((800, 520), (800, 490)), anchor=(0.5, 0.5), band=0.6, maxblur=6,
        focus=[(0, center(canvas))], ops=ops9, meta=m9, wide=True)

    m10 = meta('s10-presenter')
    notes = [r for r in m10['items']['notes'] if r[3] < 30]
    timer = m10['items']['timer'][0][:4]
    ops10 = [(0, 'set', 'p1'), (0.55, 'fade', 'p2blank', 0.25, None)]
    for i, r in enumerate(notes):
        ops10.append((0.85 + i * 0.12, 'stipple', 'p2', 0.5, [r[0] - 2, r[1] - 2, r[2] + 4, r[3] + 4]))
    for k in range(5):
        ops10.append((1.0 + k, 'fade', f't{k}', 0.05, [timer[0] - 4, timer[1], timer[2] + 8, timer[3]]))
    n0 = notes[0]
    add(name='s10-presenter', len=5.0, mag=(3.0, 3.1), pitch=36, roll=(-12, -12.8), yaw=(8, 9),
        persp=1300, look=((n0[0] + 120, n0[1] + 10), (n0[0] + 300, n0[1] + 40)),
        anchor=(0.5, 0.5), band=0.12, maxblur=20,
        focus=[(0, (n0[0] + 180, n0[1] + 9)), (1.4, (n0[0] + 220, n0[1] + 30)),
               (2.4, (n0[0] + 260, n0[1] + 60))],
        ops=ops10, meta=m10, notes=len(notes))

    t = 0.0
    for s in shots:
        s['start'] = t
        t += s['len']
    return shots, t


SHOTS, UI_END = build_shots()
COPY_LEN = 4.8
LOGO_LEN = 4.8
COPY_START = UI_END
LOGO_START = COPY_START + COPY_LEN
END = LOGO_START + LOGO_LEN


# ---------------------------------------------------------------- textures

class Textures:
    def __init__(self):
        self.cache = {}

    def get(self, shot, state):
        key = (shot, state)
        if key not in self.cache:
            if len(self.cache) > 70:
                self.cache.clear()
            img = cv2.imread(os.path.join(CAP, shot, state + '.png'), cv2.IMREAD_COLOR)
            self.cache[key] = img
        return self.cache[key]


TEX = Textures()
NOISE = {}


def stipple_noise(h, w, cell, seed):
    key = (h, w, cell, seed)
    if key not in NOISE:
        rng = np.random.default_rng(seed)
        small = rng.random((h // cell + 2, w // cell + 2), dtype=np.float32)
        NOISE[key] = np.repeat(np.repeat(small, cell, 0), cell, 1)[:h, :w]
    return NOISE[key]


def compose(shot, t):
    m = shot['meta']
    dpr = m['dpr']
    cx, cy = m['clip']['x'], m['clip']['y']
    cur = None
    owned = False
    for i, op in enumerate(sorted(shot['ops'], key=lambda o: o[0])):
        ot, kind, state = op[0], op[1], op[2]
        if t < ot:
            continue
        src = TEX.get(shot['name'], state)
        if kind == 'set':
            cur, owned = src, False
            continue
        dur, rect = op[3], op[4]
        u = (t - ot) / dur
        if not owned:
            cur, owned = cur.copy(), True
        if rect is None:
            y0, y1, x0, x1 = 0, cur.shape[0], 0, cur.shape[1]
        else:
            x0 = max(int((rect[0] - cx) * dpr), 0)
            y0 = max(int((rect[1] - cy) * dpr), 0)
            x1 = min(int(math.ceil((rect[0] + rect[2] - cx) * dpr)), cur.shape[1])
            y1 = min(int(math.ceil((rect[1] + rect[3] - cy) * dpr)), cur.shape[0])
            if x1 <= x0 or y1 <= y0:
                continue
        if u >= 1:
            cur[y0:y1, x0:x1] = src[y0:y1, x0:x1]
            continue
        a = cur[y0:y1, x0:x1].astype(np.float32)
        b = src[y0:y1, x0:x1].astype(np.float32)
        if kind == 'fade':
            p = ease_io(u)
            cur[y0:y1, x0:x1] = (a + (b - a) * p).astype(np.uint8)
        elif kind == 'stipple':
            p = ease_out_cubic(u)
            n = stipple_noise(y1 - y0, x1 - x0, max(int(round(2 * dpr)), 2), i)
            vis = (n < p)[..., None]
            bright = np.minimum(b * (1 + 0.13 * (1 - p)), 255)
            if p < 1:
                bright = cv2.GaussianBlur(bright, (0, 0), max(1.2 * dpr * (1 - p), 0.3))
            cur[y0:y1, x0:x1] = np.where(vis, bright, a).astype(np.uint8)
    return cur


# ---------------------------------------------------------------- camera

def rot(pitch, yaw, roll):
    a, b, c = map(math.radians, (pitch, yaw, roll))
    rx = np.array([[1, 0, 0], [0, math.cos(a), -math.sin(a)], [0, math.sin(a), math.cos(a)]])
    ry = np.array([[math.cos(b), 0, math.sin(b)], [0, 1, 0], [-math.sin(b), 0, math.cos(b)]])
    rz = np.array([[math.cos(c), -math.sin(c), 0], [math.sin(c), math.cos(c), 0], [0, 0, 1]])
    return rx @ ry @ rz


def camera(shot, t):
    u = drift(t / shot['len'])
    mag = lerp(*shot['mag'], u)
    roll = lerp(*shot['roll'], u)
    yaw = lerp(*shot['yaw'], u)
    pitch = shot['pitch']
    look = lerp(*shot['look'], u)
    R = rot(pitch, yaw, roll)
    P = shot['persp']
    sx, sy = shot['anchor'][0] * W, shot['anchor'][1] * H
    ox, oy = look
    rz0, rz1 = mag * R[2, 0] / P, mag * R[2, 1] / P
    M = np.array([
        [mag * R[0, 0] - sx * rz0, mag * R[0, 1] - sx * rz1, sx],
        [mag * R[1, 0] - sy * rz0, mag * R[1, 1] - sy * rz1, sy],
        [-rz0, -rz1, 1.0],
    ])
    return dict(M=M, ox=ox, oy=oy, mag=mag, R=R, P=P)


def project(cam, x, y):
    v = cam['M'] @ np.array([x - cam['ox'], y - cam['oy'], 1.0])
    return v[0] / v[2], v[1] / v[2]


def depth_of(cam, x, y):
    R, mag = cam['R'], cam['mag']
    return mag * (R[2, 0] * (x - cam['ox']) + R[2, 1] * (y - cam['oy']))


def focus_point(shot, t):
    if 'focus' in shot:
        return path(shot['focus'], t)
    return lerp(*shot['look'], drift(t / shot['len']))


GRID_S = 4
gy, gx = np.mgrid[0:H // GRID_S, 0:W // GRID_S].astype(np.float64)
GX = gx * GRID_S + GRID_S / 2
GY = gy * GRID_S + GRID_S / 2


def depth_map(cam):
    Mi = np.linalg.inv(cam['M'])
    w = Mi[2, 0] * GX + Mi[2, 1] * GY + Mi[2, 2]
    u = (Mi[0, 0] * GX + Mi[0, 1] * GY + Mi[0, 2]) / w
    v = (Mi[1, 0] * GX + Mi[1, 1] * GY + Mi[1, 2]) / w
    R, mag = cam['R'], cam['mag']
    return mag * (R[2, 0] * u + R[2, 1] * v)


def calibrate(shot):
    """k so that blur reaches 1px at band/2 of frame height from the focal point."""
    cam = camera(shot, shot['len'] / 2)
    fx, fy = focus_point(shot, shot['len'] / 2)
    px, py = project(cam, fx, fy)
    Mi = np.linalg.inv(cam['M'])
    zs = []
    for dy in (-1, 1):
        X, Y = px, py + dy * shot['band'] * H / 2
        w = Mi[2] @ [X, Y, 1]
        uu = (Mi[0] @ [X, Y, 1]) / w + cam['ox']
        vv = (Mi[1] @ [X, Y, 1]) / w + cam['oy']
        zs.append(abs(depth_of(cam, uu, vv) - depth_of(cam, fx, fy)))
    return 1.0 / max(min(zs), 1e-3)


for s in SHOTS:
    s['k'] = calibrate(s)


# ---------------------------------------------------------------- optics

LEVELS = [0, 0.9, 1.8, 3, 4.5, 6.5, 9, 12, 16, 20, 24]


def dof(img, bsmall, maxb):
    lv = [l for l in LEVELS if l <= maxb + 4]
    b = np.clip(bsmall, 0, lv[-1])
    out = None
    for i, s in enumerate(lv):
        lo = lv[i - 1] if i > 0 else None
        hi = lv[i + 1] if i + 1 < len(lv) else None
        w = np.zeros_like(b)
        if lo is not None:
            w = np.maximum(w, np.where(b <= s, (b - lo) / (s - lo), 0))
        else:
            w = np.maximum(w, np.where(b <= s, 1.0, 0))
        if hi is not None:
            w = np.maximum(w, np.where(b > s, (hi - b) / (hi - s), 0))
        else:
            w = np.maximum(w, np.where(b > s, 1.0, 0))
        w = np.clip(w, 0, 1).astype(np.float32)
        if w.max() <= 1e-4:
            continue
        if s == 0:
            layer = img
        elif s <= 3:
            layer = cv2.GaussianBlur(img, (0, 0), s)
        else:
            f = 2 if s < 9 else 4
            small = cv2.resize(img, (W // f, H // f), interpolation=cv2.INTER_AREA)
            small = cv2.GaussianBlur(small, (0, 0), s / f)
            layer = cv2.resize(small, (W, H), interpolation=cv2.INTER_LINEAR)
        wf = cv2.resize(w, (W, H), interpolation=cv2.INTER_LINEAR)[..., None]
        out = layer * wf if out is None else out + layer * wf
    return out


YY, XX = (np.mgrid[0:H // 4, 0:W // 4].astype(np.float32) * 4 + 2)


def light(sx, sy, wide=False):
    rx, ry = (0.46 if not wide else 0.7) * W, (0.58 if not wide else 0.85) * H
    r = np.sqrt(((XX - sx) / rx) ** 2 + ((YY - sy) / ry) ** 2)
    stops_r = np.array([0, 0.45, 0.8, 1.0], dtype=np.float32)
    stops_a = np.array([0, 0.35, 0.85, 1.0], dtype=np.float32)
    if wide:
        stops_a = np.array([0, 0.12, 0.45, 0.8], dtype=np.float32)
    dark = np.interp(r, stops_r, stops_a).astype(np.float32)
    v = np.sqrt(((XX - W / 2) / (1.2 * W / 2)) ** 2 + ((YY - H / 2) / (0.95 * H / 2)) ** 2)
    vig = np.clip((v - 0.5) / 0.5, 0, 1) * 0.7
    return cv2.resize(((1 - dark) * (1 - vig)).astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)


def warp(shot, t):
    cam = camera(shot, t)
    m = shot['meta']
    dpr, clip = m['dpr'], m['clip']
    T = np.array([[1 / dpr, 0, clip['x'] - cam['ox']], [0, 1 / dpr, clip['y'] - cam['oy']], [0, 0, 1]])
    tex = compose(shot, t)
    return cv2.warpPerspective(tex, cam['M'] @ T, (W, H), flags=cv2.INTER_LINEAR,
                               borderMode=cv2.BORDER_CONSTANT, borderValue=0).astype(np.float32)


def render_ui(shot, t, times=None):
    times = times or [t]
    img = sum(warp(shot, st) for st in times) / (255.0 * len(times))
    cam = camera(shot, t)
    fx, fy = focus_point(shot, t)
    zf = depth_of(cam, fx, fy)
    dz = depth_map(cam) - zf
    bsmall = np.minimum(shot['maxblur'], shot['k'] * np.abs(dz)).astype(np.float32)
    out = dof(img, bsmall, shot['maxblur'])
    bmap = cv2.resize(bsmall, (W, H), interpolation=cv2.INTER_LINEAR)
    sx, sy = project(cam, fx, fy)
    out *= ((1 - 0.3 * np.clip(bmap / shot['maxblur'], 0, 1)) * light(sx, sy, shot.get('wide', False)))[..., None]
    return out


# ---------------------------------------------------------------- outro

OUT_META = json.load(open(os.path.join(CAP, 'outro', 'meta.json')))


def load_rgba(name):
    im = cv2.imread(os.path.join(CAP, 'outro', name), cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
    return im


OUTRO = {}


def outro_layer(name):
    if name not in OUTRO:
        OUTRO[name] = load_rgba(name)
    return OUTRO[name]


def place(canvas, layer, dx, dy, alpha, blur):
    rgba = layer
    if blur > 0.05:
        rgba = cv2.GaussianBlur(rgba, (0, 0), blur)
    Mt = np.float32([[1, 0, dx], [0, 1, dy]])
    rgba = cv2.warpAffine(rgba, Mt, (W, H))
    a = rgba[..., 3:4] * alpha
    canvas[:] = canvas * (1 - a) + rgba[..., :3] * a


def render_copy(t):
    canvas = np.zeros((H, W, 3), np.float32)
    n, g = OUT_META['n'], OUT_META['g']
    total = n[2] + g[2]
    y = H / 2 - n[3] / 2
    x_alone = W / 2 - n[2] / 2
    x_line = W / 2 - total / 2
    u = ease_out_cubic(t / 0.9)
    glow = (1 - u) * 0.3
    s = path([(1.5, 0.0), (2.2, 1.0)], t)
    nx = lerp(x_alone, x_line, s)
    name = outro_layer('name.png')
    if glow > 0.01:
        place(canvas, name, nx, y, glow * u, 18)
    place(canvas, name, nx, y, u, 16 * (1 - u))
    tu = ease_out_cubic((t - 1.65) / 0.7)
    if tu > 0:
        place(canvas, outro_layer('tag.png'), x_line + n[2], y, tu, 10 * (1 - tu))
    return canvas


def render_logo(t):
    canvas = np.zeros((H, W, 3), np.float32)
    place(canvas, outro_layer('logo.png'), 0, 0, min(t / 0.3, 1.0), 0)
    return canvas


# ---------------------------------------------------------------- frame

def shot_at(t):
    for s in SHOTS:
        if s['start'] <= t < s['start'] + s['len']:
            return s
    return None


def render_frame(f):
    t = f / FPS
    if t >= LOGO_START:
        return render_logo(t - LOGO_START)
    if t >= COPY_START:
        lt = t - COPY_START
        img = render_copy(lt)
        if lt < 0.4:
            last = SHOTS[-1]
            prev = render_ui(last, last['len'] - 0.001 + lt)
            k = lt / 0.4
            prev = cv2.GaussianBlur(prev, (0, 0), 0.5 + 12 * k) * (1 - k)
            img = np.maximum(img, prev)
        if lt > COPY_LEN - 0.3:
            img *= max(0.0, (COPY_LEN - lt) / 0.3)
        return img
    s = shot_at(t)
    lt = t - s['start']
    times = [min(max(lt + (k + 0.5) / SUB * SHUTTER - SHUTTER / 2, 0), s['len'] - 1e-4) for k in range(SUB)]
    return render_ui(s, lt, times)


def to8(img):
    return (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'info':
        for s in SHOTS:
            print(f"{s['name']:14s} start {s['start']:5.2f} len {s['len']:.1f} k {s['k']:.4f}")
        print('copy', COPY_START, 'logo', LOGO_START, 'end', END, 'frames', int(round(END * FPS)))
    elif cmd == 'still':
        out = sys.argv[2]
        os.makedirs(out, exist_ok=True)
        for tt in sys.argv[3:]:
            t = float(tt)
            cv2.imwrite(os.path.join(out, f'{t:06.2f}.png'), to8(render_frame(int(round(t * FPS)))))
    elif cmd == 'range':
        f0, f1, outfile = int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
        import subprocess
        p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24',
                              '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium',
                              '-crf', '8', '-pix_fmt', 'yuv444p', outfile], stdin=subprocess.PIPE)
        for f in range(f0, f1):
            p.stdin.write(to8(render_frame(f)).tobytes())
            if f % 60 == 0:
                print(outfile, f, flush=True)
        p.stdin.close()
        p.wait()
