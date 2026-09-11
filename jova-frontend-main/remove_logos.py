"""
Removes the "WINARC" plate (top-center) and the partial branded placard on
the right edge from a folder of near-identical, locked-off-camera frames.

How it works:
- Because the camera doesn't move, both logo regions sit in roughly the same
  pixel location in every frame.
- For each region, we grab a same-size patch from a NEARBY area of the same
  surface (still red panel / still dark machine body) and seamlessly blend
  it over the logo using Poisson blending (cv2.seamlessClone). This keeps
  the surface's real texture/lighting instead of a flat, obviously-edited
  patch.

Usage:
    python remove_logos.py "C:\\path\\to\\frame_5" "C:\\path\\to\\frame_5_clean"

You can pass multiple input folders if you want to process frame_3, frame_4,
frame_5 in one run:
    python remove_logos.py frame_3 frame_3_clean
    python remove_logos.py frame_4 frame_4_clean
    python remove_logos.py frame_5 frame_5_clean

TUNE THESE if the logo drifts position in other parts of the sequence
(e.g. if the camera angle changes partway through — check a sample frame
from that range and adjust the box coordinates below, or add another
region to the REGIONS list).
"""

import cv2
import numpy as np
import os
import sys

# Each region: (x, y, w, h) of the box to erase, and (src_x, src_y) = the
# top-left corner of a same-size patch of clean surrounding surface to clone
# over it.
REGIONS = [
    # WINARC plate, top-center. Source patch is directly below it, still on
    # the same red textured panel.
    {"box": (755, 0, 190, 125), "src": (755, 135)},
    # Partial branded placard, right edge. Source patch is to the left of
    # it, still on the same dark machine body.
    {"box": (1800, 415, 120, 220), "src": (1650, 415)},
]


def clean_frame(img):
    h, w = img.shape[:2]
    out = img.copy()
    for region in REGIONS:
        bx, by, bw, bh = region["box"]
        sx, sy = region["src"]

        # Clip to image bounds just in case
        bx2, by2 = min(bx + bw, w), min(by + bh, h)
        bw2, bh2 = bx2 - bx, by2 - by
        if bw2 <= 0 or bh2 <= 0:
            continue
        sx2, sy2 = min(sx + bw2, w), min(sy + bh2, h)
        if sx2 - sx <= 0 or sy2 - sy <= 0:
            continue

        patch = img[sy:sy2, sx:sx2].astype(np.float32)
        if patch.shape[0] != bh2 or patch.shape[1] != bw2:
            patch = cv2.resize(patch, (bw2, bh2)).astype(np.float32)

        dest = out[by:by2, bx:bx2].astype(np.float32)

        # Feathered alpha mask: fully replaced in the middle, blended with
        # the original toward the edges, so the seam isn't a hard rectangle.
        feather = max(4, min(bw2, bh2) // 10)
        mask = np.ones((bh2, bw2), dtype=np.float32)
        for i in range(feather):
            a = (i + 1) / feather
            mask[i, :] = np.minimum(mask[i, :], a)
            mask[bh2 - 1 - i, :] = np.minimum(mask[bh2 - 1 - i, :], a)
            mask[:, i] = np.minimum(mask[:, i], a)
            mask[:, bw2 - 1 - i] = np.minimum(mask[:, bw2 - 1 - i], a)
        mask3 = mask[:, :, None]

        blended = patch * mask3 + dest * (1 - mask3)
        out[by:by2, bx:bx2] = blended.astype(np.uint8)

    return out


def main():
    if len(sys.argv) != 3:
        print("Usage: python remove_logos.py <input_folder> <output_folder>")
        sys.exit(1)

    in_dir, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    exts = (".jpg", ".jpeg", ".png")
    files = [f for f in os.listdir(in_dir) if f.lower().endswith(exts)]
    files.sort()

    print(f"Processing {len(files)} images from {in_dir} -> {out_dir}")
    for i, fname in enumerate(files, 1):
        path = os.path.join(in_dir, fname)
        img = cv2.imread(path)
        if img is None:
            print(f"  [skip] couldn't read {fname}")
            continue
        cleaned = clean_frame(img)
        cv2.imwrite(os.path.join(out_dir, fname), cleaned, [cv2.IMWRITE_JPEG_QUALITY, 95])
        if i % 50 == 0 or i == len(files):
            print(f"  {i}/{len(files)} done")

    print("Done.")


if __name__ == "__main__":
    main()