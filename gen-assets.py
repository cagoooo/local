"""
Generate all favicon + social share image assets for the app.

Outputs (all in project root):
  favicon.ico              — legacy browser favicon (multi-res)
  favicon.svg              — modern browser favicon (scalable)
  favicon-16x16.png
  favicon-32x32.png
  apple-touch-icon.png     — iOS home screen (180x180)
  android-chrome-192x192.png
  android-chrome-512x512.png
  og-image.png             — social sharing preview (1200x630)
  og-image-square.png      — LINE-optimized square (800x800)
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Force UTF-8 output on Windows cp950 consoles
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

OUT = Path(os.path.abspath(__file__) if '__file__' in globals() else os.getcwd()).parent if '__file__' in globals() else Path.cwd()
FONT_BOLD = 'C:/Windows/Fonts/msjhbd.ttc'   # Microsoft JhengHei Bold
FONT_REG  = 'C:/Windows/Fonts/msjh.ttc'     # Microsoft JhengHei Regular

BRAND_START = (99, 102, 241)    # indigo-500 #6366f1
BRAND_MID   = (124, 58, 237)    # violet-600 #7c3aed
BRAND_END   = (168, 85, 247)    # purple-500 #a855f7
WHITE       = (255, 255, 255)
SOFT_WHITE  = (255, 255, 255, 240)


def make_gradient(size, start, end, angle=135):
    """Create a diagonal gradient image."""
    w, h = size
    base = Image.new('RGB', size, start)
    top = Image.new('RGB', size, end)
    mask = Image.new('L', size)
    md = ImageDraw.Draw(mask)
    # Simple diagonal gradient via scanline
    import math
    rad = math.radians(angle)
    dx, dy = math.cos(rad), math.sin(rad)
    max_proj = abs(dx) * w + abs(dy) * h
    for y in range(h):
        for x in range(w):
            proj = (x * dx + y * dy) / max_proj
            proj = max(0, min(1, (proj + 0.5)))
            md.point((x, y), int(255 * proj))
    return Image.composite(top, base, mask)


def make_gradient_fast(size, start, end, steps=64):
    """Faster gradient using horizontal/vertical bands."""
    w, h = size
    img = Image.new('RGB', size)
    for i in range(h):
        t = i / max(h - 1, 1)
        r = int(start[0] + (end[0] - start[0]) * t)
        g = int(start[1] + (end[1] - start[1]) * t)
        b = int(start[2] + (end[2] - start[2]) * t)
        for j in range(w):
            # Add diagonal blend
            td = (i + j) / (w + h)
            r2 = int(start[0] + (end[0] - start[0]) * td)
            g2 = int(start[1] + (end[1] - start[1]) * td)
            b2 = int(start[2] + (end[2] - start[2]) * td)
            img.putpixel((j, i), (r2, g2, b2))
    return img


def make_gradient_simple(size, start, end):
    """Vertical gradient (fastest)."""
    w, h = size
    img = Image.new('RGB', size, start)
    pixels = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(start[0] + (end[0] - start[0]) * t)
        g = int(start[1] + (end[1] - start[1]) * t)
        b = int(start[2] + (end[2] - start[2]) * t)
        for x in range(w):
            pixels[x, y] = (r, g, b)
    return img


def make_radial_gradient(size, center_color, edge_color, center=None):
    """Radial gradient centered at `center`."""
    w, h = size
    if center is None:
        center = (w // 2, h // 2)
    cx, cy = center
    max_dist = max(
        ((0 - cx) ** 2 + (0 - cy) ** 2) ** 0.5,
        ((w - cx) ** 2 + (0 - cy) ** 2) ** 0.5,
        ((0 - cx) ** 2 + (h - cy) ** 2) ** 0.5,
        ((w - cx) ** 2 + (h - cy) ** 2) ** 0.5,
    )
    img = Image.new('RGB', size, edge_color)
    pixels = img.load()
    for y in range(h):
        for x in range(w):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            t = min(1, d / max_dist)
            r = int(center_color[0] + (edge_color[0] - center_color[0]) * t)
            g = int(center_color[1] + (edge_color[1] - center_color[1]) * t)
            b = int(center_color[2] + (edge_color[2] - center_color[2]) * t)
            pixels[x, y] = (r, g, b)
    return img


def rounded_mask(size, radius):
    """Create a rounded-rectangle mask."""
    mask = Image.new('L', size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([(0, 0), size], radius=radius, fill=255)
    return mask


# ==========================================================
# 1. Favicon SVG (scalable, preferred by modern browsers)
# ==========================================================
def gen_favicon_svg():
    svg = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <text x="32" y="48" text-anchor="middle"
        font-family="'Microsoft JhengHei','PingFang TC','Noto Sans TC',sans-serif"
        font-weight="900" font-size="44" fill="white">本</text>
</svg>
'''
    (OUT / 'favicon.svg').write_text(svg, encoding='utf-8')
    print('✓ favicon.svg')


# ==========================================================
# 2. Square logo icon (used for all PNG sizes)
# ==========================================================
def make_logo(size, radius_ratio=0.22, char='本'):
    """Create a rounded-square logo with centered Chinese character."""
    s = size
    # Background gradient
    bg = make_gradient_simple((s, s), BRAND_START, BRAND_END)
    # Round corners
    mask = rounded_mask((s, s), int(s * radius_ratio))
    out = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    out.paste(bg, (0, 0), mask)

    # Text: "本"
    draw = ImageDraw.Draw(out)
    # Font size ~ 70% of square
    font_size = int(s * 0.68)
    font = ImageFont.truetype(FONT_BOLD, font_size)
    # Measure and center
    bbox = draw.textbbox((0, 0), char, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (s - tw) / 2 - bbox[0]
    ty = (s - th) / 2 - bbox[1] - int(s * 0.02)  # slight upward bias

    # Drop shadow for depth
    shadow = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).text((tx, ty + max(1, s // 64)), char, font=font, fill=(0, 0, 0, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=max(1, s // 128)))
    out = Image.alpha_composite(out, shadow)

    # Main text
    ImageDraw.Draw(out).text((tx, ty), char, font=font, fill=WHITE)
    return out


def gen_pngs():
    sizes = {
        'favicon-16x16.png': 16,
        'favicon-32x32.png': 32,
        'favicon-48x48.png': 48,
        'apple-touch-icon.png': 180,
        'android-chrome-192x192.png': 192,
        'android-chrome-512x512.png': 512,
    }
    for name, s in sizes.items():
        img = make_logo(s)
        img.save(OUT / name, 'PNG', optimize=True)
        print(f'✓ {name}')


def gen_ico():
    # Multi-resolution ICO
    ico_sizes = [16, 24, 32, 48, 64]
    imgs = [make_logo(s) for s in ico_sizes]
    imgs[0].save(
        OUT / 'favicon.ico',
        format='ICO',
        sizes=[(s, s) for s in ico_sizes],
        append_images=imgs[1:]
    )
    print('✓ favicon.ico (multi-res 16/24/32/48/64)')


# ==========================================================
# 3. Open Graph image (1200x630)
# ==========================================================
def gen_og_image():
    W, H = 1200, 630

    # Base radial gradient
    bg = make_radial_gradient((W, H), (76, 71, 195), (35, 28, 95), center=(W * 0.28, H * 0.3))
    out = bg.convert('RGBA')

    draw = ImageDraw.Draw(out)

    # Decorative grid dots (subtle)
    for y in range(0, H, 36):
        for x in range(0, W, 36):
            draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(255, 255, 255, 18))

    # Decorative floating circles (glow)
    for cx, cy, r, alpha in [
        (W - 180, H - 120, 240, 32),
        (W - 40, 120, 180, 26),
        (100, H - 80, 140, 24),
    ]:
        glow = Image.new('RGBA', (r * 4, r * 4), (0, 0, 0, 0))
        ImageDraw.Draw(glow).ellipse([r, r, r * 3, r * 3], fill=(255, 255, 255, alpha))
        glow = glow.filter(ImageFilter.GaussianBlur(radius=r // 3))
        out.alpha_composite(glow, (cx - r * 2, cy - r * 2))

    # Logo square (left side)
    logo_size = 180
    logo = make_logo(logo_size, radius_ratio=0.25)
    # Add soft shadow beneath logo
    shadow = Image.new('RGBA', (logo_size + 60, logo_size + 60), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [30, 30, logo_size + 30, logo_size + 30],
        radius=int(logo_size * 0.25), fill=(0, 0, 0, 120)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=20))
    logo_x, logo_y = 80, 110
    out.alpha_composite(shadow, (logo_x - 30, logo_y - 20))
    out.alpha_composite(logo, (logo_x, logo_y))

    draw = ImageDraw.Draw(out)

    # Eyebrow pill
    pill_text = '🏫  分班更新一氣呵成'
    pill_font = ImageFont.truetype(FONT_BOLD, 22)
    bbox = draw.textbbox((0, 0), pill_text, font=pill_font)
    pw = bbox[2] - bbox[0] + 32
    ph = bbox[3] - bbox[1] + 16
    px, py = 290, 120
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=ph // 2, fill=(255, 255, 255, 30), outline=(255, 255, 255, 90), width=1)
    draw.text((px + 16 - bbox[0], py + 8 - bbox[1]), pill_text, font=pill_font, fill=(230, 230, 255))

    # Main title (2 lines)
    title_font = ImageFont.truetype(FONT_BOLD, 76)
    title_font_big = ImageFont.truetype(FONT_BOLD, 94)
    draw.text((290, 172), '本土語分班', font=title_font_big, fill=WHITE)
    draw.text((290, 280), '配對系統', font=title_font_big, fill=(230, 218, 255))

    # Subtitle
    sub_font = ImageFont.truetype(FONT_REG, 28)
    draw.text((290, 400), '上傳舊名單 + 新編班名冊 → 自動以姓名配對', font=sub_font, fill=(210, 214, 240))
    draw.text((290, 440), '即時更新班級座號 · 100% 本機運算 · 資料不上雲', font=sub_font, fill=(210, 214, 240))

    # Feature chips at bottom
    chips = [
        '⚡ 秒級配對',
        '🎯 錯字容錯',
        '🔒 本機處理',
        '🌙 深色模式',
    ]
    chip_font = ImageFont.truetype(FONT_BOLD, 24)
    cx = 290
    cy = 520
    for chip in chips:
        b = draw.textbbox((0, 0), chip, font=chip_font)
        cw = b[2] - b[0] + 32
        ch = b[3] - b[1] + 18
        draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=ch // 2,
                               fill=(255, 255, 255, 45), outline=(255, 255, 255, 110), width=1)
        draw.text((cx + 16 - b[0], cy + 9 - b[1]), chip, font=chip_font, fill=WHITE)
        cx += cw + 12

    # Bottom-right URL / hint
    url_font = ImageFont.truetype(FONT_REG, 20)
    url_text = 'v2.0 · GitHub Pages · 單檔 HTML'
    ub = draw.textbbox((0, 0), url_text, font=url_font)
    draw.text((W - (ub[2] - ub[0]) - 40, H - 40), url_text, font=url_font, fill=(180, 185, 220))

    # Flatten and save
    out.convert('RGB').save(OUT / 'og-image.png', 'PNG', optimize=True)
    print('✓ og-image.png (1200x630)')


def gen_og_square():
    """800x800 square version for LINE preview (LINE prefers square)."""
    W = H = 800
    bg = make_radial_gradient((W, H), (76, 71, 195), (35, 28, 95), center=(W * 0.3, H * 0.3))
    out = bg.convert('RGBA')

    draw = ImageDraw.Draw(out)
    for y in range(0, H, 28):
        for x in range(0, W, 28):
            draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(255, 255, 255, 18))

    # Large centered logo
    logo_size = 240
    logo = make_logo(logo_size, radius_ratio=0.25)
    shadow = Image.new('RGBA', (logo_size + 80, logo_size + 80), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [40, 40, logo_size + 40, logo_size + 40],
        radius=int(logo_size * 0.25), fill=(0, 0, 0, 140)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=26))
    lx = (W - logo_size) // 2
    ly = 140
    out.alpha_composite(shadow, (lx - 40, ly - 30))
    out.alpha_composite(logo, (lx, ly))

    draw = ImageDraw.Draw(out)

    # Title
    title_font = ImageFont.truetype(FONT_BOLD, 70)
    title = '本土語分班配對系統'
    b = draw.textbbox((0, 0), title, font=title_font)
    tw = b[2] - b[0]
    draw.text(((W - tw) // 2 - b[0], 440), title, font=title_font, fill=WHITE)

    # Subtitle
    sub_font = ImageFont.truetype(FONT_REG, 26)
    subs = [
        '上傳 → 比對 → 匯出',
        '分班更新一氣呵成'
    ]
    y = 545
    for s in subs:
        b = draw.textbbox((0, 0), s, font=sub_font)
        sw = b[2] - b[0]
        draw.text(((W - sw) // 2 - b[0], y), s, font=sub_font, fill=(210, 214, 240))
        y += 38

    # Footer
    ft_font = ImageFont.truetype(FONT_REG, 22)
    ft = 'v2.0 · 100% 本機運算 · 資料不上雲'
    b = draw.textbbox((0, 0), ft, font=ft_font)
    fw = b[2] - b[0]
    draw.text(((W - fw) // 2 - b[0], H - 60), ft, font=ft_font, fill=(170, 178, 215))

    out.convert('RGB').save(OUT / 'og-image-square.png', 'PNG', optimize=True)
    print('✓ og-image-square.png (800x800)')


# ==========================================================
# 4. PWA manifest
# ==========================================================
def gen_manifest():
    import json
    manifest = {
        "name": "本土語分班配對系統",
        "short_name": "本土語配對",
        "description": "小學升級分班後,自動更新本土語選修名單的網頁工具",
        "start_url": "./",
        "scope": "./",
        "display": "standalone",
        "orientation": "any",
        "background_color": "#fafbff",
        "theme_color": "#4f46e5",
        "lang": "zh-Hant",
        "icons": [
            {"src": "android-chrome-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
            {"src": "android-chrome-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}
        ]
    }
    (OUT / 'manifest.webmanifest').write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
    print('✓ manifest.webmanifest')


if __name__ == '__main__':
    print('Generating assets to:', OUT)
    gen_favicon_svg()
    gen_pngs()
    gen_ico()
    gen_og_image()
    gen_og_square()
    gen_manifest()
    print('\nDone. All assets in project root.')
