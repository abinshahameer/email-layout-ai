import tcsLogoUrl from "@/assets/tcs-logo.png";
import tataLogoUrl from "@/assets/tata-logo.svg";

export interface EmailLogos {
  tcs: string;
  tata: string;
}

let cache: EmailLogos | null = null;

/**
 * Rasterize an image (e.g. an SVG) to a PNG data URL via canvas.
 * Outlook can't render SVG, so logos must be raster for the email.
 */
const rasterizeToPng = (url: string, maxHeight = 120): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const natH = img.naturalHeight || maxHeight;
      const natW = img.naturalWidth || maxHeight;
      const scale = Math.min(1, maxHeight / natH);
      const w = Math.max(1, Math.round(natW * scale));
      const h = Math.max(1, Math.round(natH * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no 2d context"));
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/png")); // PNG preserves transparency
    };
    img.onerror = reject;
    img.src = url;
  });

/**
 * Returns the TCS and Tata logos as base64 PNG data URLs for embedding in the
 * exported email. Result is cached. On failure a logo resolves to "" so the
 * caller can fall back to the remote URL.
 */
export const loadEmailLogos = async (): Promise<EmailLogos> => {
  if (cache) return cache;
  // Rasterize both to a downscaled PNG: keeps the embedded email small and is
  // Outlook-safe (raster, not SVG) regardless of the source asset format.
  const [tcs, tata] = await Promise.all([
    rasterizeToPng(tcsLogoUrl).catch(() => ""),
    rasterizeToPng(tataLogoUrl).catch(() => ""),
  ]);
  cache = { tcs, tata };
  return cache;
};
