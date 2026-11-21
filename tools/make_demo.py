"""Draws the two demo kits: a camera bag and a delivery parcel.

Every frame is 1200 x 800. Slots are listed with their centre so the app and the
art never drift apart; `public/demo/samples.json` is written from the same data.
"""
import json
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent.parent / 'public' / 'demo'
SCALE = 2
W, H = 1200, 800

INK = (26, 22, 30)
FOAM = (203, 192, 170)
FOAM_DOT = (178, 166, 145)
RUBBER = (38, 33, 44)


def canvas(color):
    return Image.new('RGB', (W * SCALE, H * SCALE), color)


def rounded(draw, box, radius, fill, outline=None, width=2):
    draw.rounded_rectangle([c * SCALE for c in box], radius=radius * SCALE, fill=fill, outline=outline, width=width * SCALE)


def ellipse(draw, box, fill, outline=None, width=2):
    draw.ellipse([c * SCALE for c in box], fill=fill, outline=outline, width=width * SCALE)


def foam(draw, box, seed):
    """Foam padding: flat base with a scattered dot pattern."""
    rounded(draw, box, 10, FOAM)
    rnd = random.Random(seed)
    x0, y0, x1, y1 = box
    for _ in range(int((x1 - x0) * (y1 - y0) / 950)):
        x = rnd.uniform(x0 + 4, x1 - 4)
        y = rnd.uniform(y0 + 4, y1 - 4)
        r = rnd.uniform(0.8, 2.6)
        ellipse(draw, (x - r, y - r, x + r, y + r), FOAM_DOT)


def battery(draw, cx, cy, w=190, h=92):
    rounded(draw, (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), 9, (46, 51, 63), (16, 17, 22), 2)
    rounded(draw, (cx + w / 2, cy - 14, cx + w / 2 + 13, cy + 14), 3, (60, 66, 80))
    rounded(draw, (cx - w / 2 + 16, cy - h / 2 + 16, cx + w / 2 - 16, cy + 4), 3, (35, 39, 50))
    draw.rectangle([(cx - 40) * SCALE, (cy + 14) * SCALE, (cx + 40) * SCALE, (cy + 22) * SCALE], fill=(198, 132, 58))


def charger(draw, cx, cy, w=150, h=132):
    rounded(draw, (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), 12, (58, 60, 70), (20, 21, 26), 2)
    for i in (-1, 1):
        draw.rectangle(
            [(cx + i * 22 - 4) * SCALE, (cy - h / 2 - 16) * SCALE, (cx + i * 22 + 4) * SCALE, (cy - h / 2 + 2) * SCALE],
            fill=(176, 178, 186),
        )
    rounded(draw, (cx - w / 2 + 18, cy + 12, cx + w / 2 - 18, cy + h / 2 - 18), 4, (44, 46, 55))
    ellipse(draw, (cx - 6, cy - 18, cx + 6, cy - 6), (79, 227, 194))


def coil(draw, cx, cy, w=170, h=132, color=(206, 186, 158)):
    for i in range(4):
        r = 22 + i * 13
        ellipse(draw, (cx - r, cy - r * 0.82, cx + r, cy + r * 0.82), None, color, 4)
    draw.line([(cx + 58) * SCALE, (cy + 26) * SCALE, (cx + w / 2) * SCALE, (cy + h / 2) * SCALE], fill=color, width=4 * SCALE)


def lens(draw, cx, cy, d=170):
    ellipse(draw, (cx - d / 2, cy - d / 2, cx + d / 2, cy + d / 2), (36, 36, 42), (14, 14, 18), 3)
    ellipse(draw, (cx - d / 2 + 14, cy - d / 2 + 14, cx + d / 2 - 14, cy + d / 2 - 14), (20, 21, 26))
    ellipse(draw, (cx - 34, cy - 34, cx + 34, cy + 34), (44, 63, 74))
    ellipse(draw, (cx - 16, cy - 22, cx - 2, cy - 8), (126, 168, 180))


def cards(draw, cx, cy, w=150, h=112):
    rounded(draw, (cx - w / 2, cy - h / 2, cx + w / 2 - 14, cy + h / 2), 4, (52, 44, 66), (18, 16, 22), 2)
    rounded(draw, (cx - w / 2 + 18, cy - h / 2 + 16, cx + w / 2 + 6, cy + h / 2 - 6), 4, (66, 54, 82), (198, 158, 74), 2)
    draw.rectangle([(cx - w / 2 + 22) * SCALE, (cy - 8) * SCALE, (cx + w / 2 + 2) * SCALE, (cy + 2) * SCALE], fill=(198, 158, 74))


def cap(draw, cx, cy, d=130):
    ellipse(draw, (cx - d / 2, cy - d / 2, cx + d / 2, cy + d / 2), (54, 52, 60), (18, 18, 22), 3)
    ellipse(draw, (cx - d / 2 + 18, cy - d / 2 + 18, cx + d / 2 - 18, cy + d / 2 - 18), (42, 41, 48))
    ellipse(draw, (cx - 12, cy - 12, cx + 12, cy + 12), (72, 70, 80))


def power_bank(draw, cx, cy, w=200, h=126):
    rounded(draw, (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), 10, (44, 48, 58), (16, 17, 22), 2)
    rounded(draw, (cx - w / 2 + 14, cy - h / 2 + 14, cx + w / 2 - 14, cy + h / 2 - 14), 6, (33, 36, 45))
    for i in range(4):
        ellipse(draw, (cx - 60 + i * 16, cy + 34, cx - 52 + i * 16, cy + 42), (79, 227, 194) if i < 3 else (66, 60, 74))
    draw.rectangle([(cx + 34) * SCALE, (cy - 44) * SCALE, (cx + 66) * SCALE, (cy - 30) * SCALE], fill=(176, 178, 186))


def phone(draw, cx, cy, w=122, h=222):
    rounded(draw, (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), 16, (28, 28, 34), (12, 12, 16), 3)
    rounded(draw, (cx - w / 2 + 8, cy - h / 2 + 8, cx + w / 2 - 8, cy + h / 2 - 8), 10, (46, 50, 62))
    rounded(draw, (cx - 26, cy - h / 2 + 16, cx + 26, cy - h / 2 + 46), 8, (32, 33, 40))
    ellipse(draw, (cx - 12, cy - h / 2 + 24, cx + 10, cy - h / 2 + 42), (14, 22, 30))


def earbuds(draw, cx, cy, w=132):
    rounded(draw, (cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2), 34, (214, 208, 196), (150, 145, 134), 2)
    for i in (-1, 1):
        ellipse(draw, (cx + i * 30 - 15, cy - 6, cx + i * 30 + 15, cy + 24), (176, 170, 158))
        ellipse(draw, (cx + i * 30 - 9, cy - 22, cx + i * 30 + 9, cy + 2), (232, 226, 214))


def notebook(draw, cx, cy, w=228, h=152):
    rounded(draw, (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), 5, (226, 216, 192), (168, 158, 136), 2)
    for i in range(5):
        y = cy - h / 2 + 26 + i * 22
        draw.line([(cx - w / 2 + 20) * SCALE, y * SCALE, (cx + w / 2 - 40) * SCALE, y * SCALE], fill=(186, 176, 154), width=2 * SCALE)


def case_shell(draw, box):
    rounded(draw, box, 26, RUBBER, (92, 84, 108), 3)
    inner = (box[0] + 26, box[1] + 26, box[2] - 26, box[3] - 26)
    rounded(draw, inner, 16, (44, 38, 52), (70, 62, 82), 2)
    return inner


def grain(image, seed):
    rnd = random.Random(seed)
    noise = Image.new('L', (W, H))
    noise.putdata([rnd.randint(0, 255) for _ in range(W * H)])
    smooth = noise.filter(ImageFilter.GaussianBlur(1.2))
    return Image.blend(image, Image.merge('RGB', (smooth, smooth, smooth)), 0.045)


def frame(paint, seed):
    image = canvas(INK)
    paint(ImageDraw.Draw(image))
    return grain(image.resize((W, H), Image.Resampling.LANCZOS), seed)


KIT_BOX = (128, 118, 1072, 686)
PARCEL_BOX = (150, 132, 1050, 672)


def kit_frame(missing):
    def paint(draw):
        inner = case_shell(draw, KIT_BOX)
        foam(draw, inner, 11)
        rounded(draw, (210, 596, 990, 640), 8, (183, 172, 152))
        if not missing:
            battery(draw, 300, 300)
        charger(draw, 600, 300)
        coil(draw, 900, 300)
        lens(draw, 300, 520)
        cards(draw, 600, 520)
        cap(draw, 900, 520)
        rounded(draw, (560, 88, 640, 128), 8, (34, 30, 40), (96, 88, 112), 2)
        rounded(draw, (150, 644, 250, 672), 4, (34, 30, 40), (96, 88, 112), 2)

    return paint


def parcel_frame(missing):
    def paint(draw):
        inner = case_shell(draw, PARCEL_BOX)
        rounded(draw, inner, 12, (196, 166, 126))
        for y in range(inner[1] + 40, inner[3], 120):
            draw.line([(inner[0] + 10) * SCALE, y * SCALE, (inner[2] - 10) * SCALE, y * SCALE], fill=(176, 148, 112), width=2 * SCALE)
        draw.line([600 * SCALE, inner[1] * SCALE, 600 * SCALE, inner[3] * SCALE], fill=(176, 148, 112), width=3 * SCALE)
        if not missing:
            power_bank(draw, 330, 300)
        phone(draw, 700, 300)
        earbuds(draw, 900, 300)
        notebook(draw, 400, 530)
        coil(draw, 800, 530, 180, 140, (120, 96, 70))
        rounded(draw, (520, 660, 680, 690), 4, (226, 208, 176), (176, 148, 112), 2)

    return paint


KIT_SLOTS = [(300, 300), (600, 300), (900, 300), (300, 520), (600, 520), (900, 520)]
PARCEL_SLOTS = [(330, 300), (700, 300), (900, 300), (400, 530), (800, 530)]


def write(name, paint, slots, seed):
    reference = frame(paint(False), seed)
    returned = frame(paint(True), seed + 1)
    reference.save(OUT / f'{name}-reference.jpg', quality=86, optimize=True)
    returned.save(OUT / f'{name}-return.jpg', quality=86, optimize=True)
    return {
        'reference': f'/demo/{name}-reference.jpg',
        'scans': [f'/demo/{name}-return.jpg'],
        'slots': [{'x': round(x / W, 4), 'y': round(y / H, 4), 'label': ''} for x, y in slots],
    }


OUT.mkdir(parents=True, exist_ok=True)
for stale in OUT.glob('*.jpg'):
    stale.unlink()
samples = {
    'kit': write('kit', kit_frame, KIT_SLOTS, 3),
    'parcel': write('parcel', parcel_frame, PARCEL_SLOTS, 5),
}
(OUT / 'samples.json').write_text(json.dumps(samples, indent=2) + '\n')
for path in sorted(OUT.iterdir()):
    print(path.name, path.stat().st_size, 'bytes')
