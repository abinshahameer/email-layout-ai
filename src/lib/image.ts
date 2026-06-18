/**
 * Per-image size cap for the encoded (base64) output.
 *
 * Images that already encode under this limit are returned untouched — only
 * files that exceed it get capped. ~200 KB keeps the exported HTML and the
 * IndexedDB record reasonable without visibly degrading normal photos.
 */
export const MAX_IMAGE_BYTES = 200 * 1024;

/** Approximate byte size of the payload in a base64 data URL. */
const dataUrlBytes = (dataUrl: string): number => {
  const comma = dataUrl.indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
};

/**
 * Encode a canvas to a JPEG data URL, capping the result at `maxBytes`.
 *
 * If the image fits at `startQuality`, it's returned as-is. Otherwise the cap
 * is applied in two stages: first lower the JPEG quality, then (if still too
 * large) progressively shrink the dimensions — always re-drawing from the
 * full-resolution source canvas to avoid cumulative blur.
 */
export const capCanvasToLimit = (
  canvas: HTMLCanvasElement,
  startQuality: number,
  maxBytes: number = MAX_IMAGE_BYTES
): string => {
  let quality = startQuality;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);

  // Only oversized images get capped.
  if (dataUrlBytes(dataUrl) <= maxBytes) return dataUrl;

  // 1) Reduce quality first.
  while (dataUrlBytes(dataUrl) > maxBytes && quality > 0.4) {
    quality = Math.max(0.4, quality - 0.1);
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  if (dataUrlBytes(dataUrl) <= maxBytes) return dataUrl;

  // 2) Still too big → shrink dimensions, re-drawing from the source canvas.
  const work = document.createElement("canvas");
  const ctx = work.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  let w = canvas.width;
  let h = canvas.height;
  for (let attempt = 0; attempt < 8 && dataUrlBytes(dataUrl) > maxBytes; attempt++) {
    w = Math.max(1, Math.round(w * 0.85));
    h = Math.max(1, Math.round(h * 0.85));
    work.width = w;
    work.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(canvas, 0, 0, w, h);
    dataUrl = work.toDataURL("image/jpeg", quality);
  }

  return dataUrl;
};
