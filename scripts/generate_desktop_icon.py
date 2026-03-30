#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SPRITESHEET_PATH = ROOT / "web/public/cc1/spritesheet.bmp"
OUTPUT_PATH = ROOT / "src-tauri/app-icon.png"
CANVAS_SIZE = 1024
TILE_CODE_CHIP = 2
TILE_CODE_FLOOR = 0


def lerp_color(
    start: tuple[int, int, int],
    end: tuple[int, int, int],
    ratio: float,
) -> tuple[int, int, int]:
    return tuple(
        round(start[channel] + (end[channel] - start[channel]) * ratio)
        for channel in range(3)
    )


def load_sheet_sprite(tile_code: int) -> Image.Image:
    sheet = Image.open(SPRITESHEET_PATH).convert("RGBA")
    tile_size = sheet.height // 16
    x = (tile_code // 16) * tile_size
    y = (tile_code % 16) * tile_size
    sprite = sheet.crop((x, y, x + tile_size, y + tile_size))

    pixels = []
    for pixel in sprite.getdata():
        if pixel[:3] == (255, 0, 255):
            pixels.append((0, 0, 0, 0))
        else:
            pixels.append(pixel)
    sprite.putdata(pixels)
    return sprite


def build_background() -> Image.Image:
    image = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    top = (27, 76, 98)
    bottom = (236, 240, 243)
    accent = (35, 95, 122)

    for y in range(CANVAS_SIZE):
        ratio = y / (CANVAS_SIZE - 1)
        base = lerp_color(top, bottom, ratio * 0.86)
        row = Image.new("RGBA", (CANVAS_SIZE, 1), (*base, 255))
        image.paste(row, (0, y))

    overlay = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    for index in range(-CANVAS_SIZE, CANVAS_SIZE * 2, 96):
        overlay_draw.line(
            ((index, 0), (index - CANVAS_SIZE, CANVAS_SIZE)),
            fill=(*accent, 32),
            width=18,
        )

    image = Image.alpha_composite(image, overlay)

    mask = Image.new("L", (CANVAS_SIZE, CANVAS_SIZE), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle((0, 0, CANVAS_SIZE, CANVAS_SIZE), radius=224, fill=255)
    image.putalpha(mask)
    return image


def build_board_panel(floor_sprite: Image.Image) -> tuple[Image.Image, tuple[int, int]]:
    panel_size = 720
    grid_margin = 72
    cell_count = 4
    cell_gap = 14
    cell_size = (panel_size - grid_margin * 2 - cell_gap * (cell_count - 1)) // cell_count

    panel = Image.new("RGBA", (panel_size, panel_size), (0, 0, 0, 0))
    shadow = Image.new("RGBA", (panel_size, panel_size), (0, 0, 0, 0))
    shadow_mask = Image.new("L", (panel_size, panel_size), 0)
    shadow_mask_draw = ImageDraw.Draw(shadow_mask)
    shadow_mask_draw.rounded_rectangle((28, 34, panel_size - 24, panel_size - 18), radius=96, fill=255)
    shadow.putalpha(shadow_mask.filter(ImageFilter.GaussianBlur(34)))
    shadow = Image.new("RGBA", (panel_size, panel_size), (21, 43, 56, 110)).convert("RGBA")
    shadow.putalpha(shadow_mask.filter(ImageFilter.GaussianBlur(34)))

    panel_draw = ImageDraw.Draw(panel)
    panel_draw.rounded_rectangle(
        (34, 26, panel_size - 34, panel_size - 34),
        radius=92,
        fill=(252, 253, 254, 242),
        outline=(82, 109, 123, 48),
        width=4,
    )

    cell_fill = (219, 228, 234, 255)
    cell_outline = (120, 145, 157, 68)
    scaled_floor = floor_sprite.resize((cell_size, cell_size), Image.Resampling.NEAREST)

    highlighted_cell_xy = (2, 1)
    highlighted_box = (0, 0, 0, 0)

    for row in range(cell_count):
        for column in range(cell_count):
            x = grid_margin + column * (cell_size + cell_gap)
            y = grid_margin + row * (cell_size + cell_gap)
            cell_box = (x, y, x + cell_size, y + cell_size)
            panel_draw.rounded_rectangle(
                cell_box,
                radius=36,
                fill=cell_fill,
                outline=cell_outline,
                width=3,
            )
            tinted_floor = Image.new("RGBA", (cell_size, cell_size), (0, 0, 0, 0))
            tinted_floor.paste(scaled_floor, (0, 0), scaled_floor)
            panel.alpha_composite(tinted_floor, (x, y))

            if (column, row) == highlighted_cell_xy:
                highlighted_box = cell_box

    if highlighted_box != (0, 0, 0, 0):
        hx0, hy0, hx1, hy1 = highlighted_box
        panel_draw.rounded_rectangle(
            (hx0 - 8, hy0 - 8, hx1 + 8, hy1 + 8),
            radius=42,
            outline=(35, 95, 122, 255),
            width=10,
        )
        handle_fill = (35, 95, 122, 255)
        handle_size = 18
        for hx, hy in (
            (hx0 - 14, hy0 - 14),
            (hx1 - 4, hy0 - 14),
            (hx0 - 14, hy1 - 4),
            (hx1 - 4, hy1 - 4),
        ):
            panel_draw.rounded_rectangle(
                (hx, hy, hx + handle_size, hy + handle_size),
                radius=6,
                fill=handle_fill,
            )

    panel = Image.alpha_composite(shadow, panel)
    return panel, highlighted_box[:2]


def build_pencil_overlay(size: int = 420) -> Image.Image:
    pencil = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(pencil)

    barrel_box = (94, 150, 338, 232)
    ferrule_box = (76, 150, 116, 232)
    tip_base = 338

    draw.rounded_rectangle(barrel_box, radius=30, fill=(35, 95, 122, 255))
    draw.rounded_rectangle(
        (104, 162, 328, 178),
        radius=8,
        fill=(154, 203, 223, 148),
    )
    draw.rounded_rectangle(ferrule_box, radius=18, fill=(219, 222, 228, 255))
    draw.rectangle((68, 156, 82, 226), fill=(242, 145, 133, 255))
    draw.polygon(((tip_base, 150), (tip_base + 56, 191), (tip_base, 232)), fill=(232, 211, 165, 255))
    draw.polygon(((tip_base + 35, 176), (tip_base + 56, 191), (tip_base + 35, 206)), fill=(71, 63, 55, 255))

    return pencil.rotate(-30, resample=Image.Resampling.BICUBIC, expand=True)


def main() -> None:
    background = build_background()
    floor_sprite = load_sheet_sprite(TILE_CODE_FLOOR)
    chip_sprite = load_sheet_sprite(TILE_CODE_CHIP)

    panel, highlighted_origin = build_board_panel(floor_sprite)
    panel_position = (140, 164)
    background.alpha_composite(panel, panel_position)

    chip_size = 252
    chip = chip_sprite.resize((chip_size, chip_size), Image.Resampling.NEAREST)
    chip_shadow = Image.new("RGBA", chip.size, (17, 33, 42, 110))
    chip_shadow.putalpha(ImageChops.multiply(chip.getchannel("A"), Image.new("L", chip.size, 140)))
    chip_shadow = chip_shadow.filter(ImageFilter.GaussianBlur(14))

    chip_position = (
        panel_position[0] + highlighted_origin[0] - 56,
        panel_position[1] + highlighted_origin[1] - 92,
    )
    background.alpha_composite(chip_shadow, (chip_position[0] + 12, chip_position[1] + 18))
    background.alpha_composite(chip, chip_position)

    pencil = build_pencil_overlay()
    background.alpha_composite(pencil, (566, 520))

    gloss = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    gloss_draw = ImageDraw.Draw(gloss)
    gloss_draw.rounded_rectangle(
        (82, 78, CANVAS_SIZE - 82, 360),
        radius=188,
        fill=(255, 255, 255, 48),
    )
    gloss = gloss.filter(ImageFilter.GaussianBlur(32))
    background = Image.alpha_composite(background, gloss)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    background.save(OUTPUT_PATH)
    print(f"Wrote {OUTPUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
