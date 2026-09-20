import zlib
import struct
import math

def create_png(width, height, draw_fn, filename):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_fn(x, y, width, height)
            raw_data.extend([r, g, b, a])
            
    # PNG signature
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = struct.pack('>I', zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff)
    png.extend(struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + ihdr_crc)
    
    # IDAT chunk
    compressed = zlib.compress(bytes(raw_data), 9)
    idat_crc = struct.pack('>I', zlib.crc32(b'IDAT' + compressed) & 0xffffffff)
    png.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + idat_crc)
    
    # IEND chunk
    iend_crc = struct.pack('>I', zlib.crc32(b'IEND') & 0xffffffff)
    png.extend(struct.pack('>I', 0) + b'IEND' + iend_crc)
    
    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Generated {filename} ({width}x{height})")

def islamic_icon_pixel(x, y, w, h, maskable=False):
    # Normalized coords from -1 to 1
    nx = (x - w / 2) / (w / 2)
    ny = (y - h / 2) / (h / 2)
    dist_center = math.sqrt(nx*nx + ny*ny)
    
    # Background color: Deep Islamic Green gradient
    bg_r = int(6 + (1 - ny) * 8)
    bg_g = int(78 + (1 - ny) * 20)
    bg_b = int(59 + (1 - ny) * 10)
    bg_a = 255
    
    if not maskable:
        # Rounded corner clipping
        corner_r = 0.28
        dx = max(abs(nx) - (1 - corner_r), 0)
        dy = max(abs(ny) - (1 - corner_r), 0)
        if math.sqrt(dx*dx + dy*dy) > corner_r:
            return (0, 0, 0, 0)
            
    scale = 0.75 if maskable else 0.88
    sx = nx / scale
    sy = ny / scale
    
    # Dome silhouette (lower half)
    # y from 0.1 to 0.7
    in_dome = False
    if 0.1 <= sy <= 0.65:
        # Arch / dome curve:
        dome_w = 0.45 * math.cos(max(-math.pi/2, min(math.pi/2, (sy - 0.2) * 2.8)))
        if abs(sx) <= dome_w:
            in_dome = True
            
    # Crescent Moon (Upper half: sy around -0.3, sx around -0.05)
    in_crescent = False
    cmx, cmy = sx + 0.05, sy + 0.25
    r1 = math.sqrt(cmx*cmx + cmy*cmy)
    # Inner cut
    imx, imy = sx + 0.18, sy + 0.20
    r2 = math.sqrt(imx*imx + imy*imy)
    if r1 < 0.38 and r2 > 0.30:
        in_crescent = True
        
    # Star (near crescent tips)
    in_star = False
    stx, sty = sx - 0.22, sy + 0.25
    star_dist = math.sqrt(stx*stx + sty*sty)
    if star_dist < 0.12:
        # 4-point star ray check
        ang = math.atan2(sty, stx)
        ray = abs(math.cos(ang * 4))
        if star_dist < 0.04 + 0.08 * ray:
            in_star = True

    # Gold color gradient
    gold_r, gold_g, gold_b = 245, 185, 45
    if in_star or in_crescent:
        return (gold_r, gold_g, gold_b, 255)
    elif in_dome:
        # Rich emerald tone inside dome with subtle gold outline
        if abs(sx) > dome_w - 0.04 or sy > 0.62 or sy < 0.12:
            return (212, 160, 30, 255)
        return (10, 80, 55, 255)
        
    # Ring glow
    if 0.82 <= math.sqrt(sx*sx + sy*sy) <= 0.85:
        return (212, 175, 55, 180)
        
    return (bg_r, bg_g, bg_b, bg_a)

create_png(192, 192, lambda x,y,w,h: islamic_icon_pixel(x,y,w,h,False), "public/pwa-192x192.png")
create_png(512, 512, lambda x,y,w,h: islamic_icon_pixel(x,y,w,h,False), "public/pwa-512x512.png")
create_png(180, 180, lambda x,y,w,h: islamic_icon_pixel(x,y,w,h,False), "public/apple-touch-icon.png")
create_png(512, 512, lambda x,y,w,h: islamic_icon_pixel(x,y,w,h,True), "public/pwa-maskable-512x512.png")
create_png(64, 64, lambda x,y,w,h: islamic_icon_pixel(x,y,w,h,False), "public/favicon.ico")
