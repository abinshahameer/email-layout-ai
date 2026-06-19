import { NewsletterSection } from "@/components/NewsletterEditor";
import { exportToHTML } from "@/lib/htmlExport";

const CRLF = "\r\n";

/** UTF-8 safe base64 encoding of a string (handles ©, ã, →, em-dashes, etc.). */
const utf8ToBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

/** MIME requires base64 bodies wrapped at 76 characters per line. */
const wrapBase64 = (b64: string): string =>
  (b64.replace(/\s/g, "").match(/.{1,76}/g) || []).join(CRLF);

const extFromMime = (mime: string): string =>
  ({
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  }[mime] || "img");

interface InlineImage {
  cid: string;
  mime: string;
  base64: string;
}

/**
 * Builds an RFC-822 `.eml` message from the newsletter.
 *
 * Why .eml instead of pasting into the Outlook compose box:
 *  - The complete HTML document (including the <head> styles and the MSO/VML
 *    hero-background markup) is preserved, because Outlook renders the whole
 *    message rather than running it through the compose paste-sanitizer.
 *  - Embedded base64 images are turned into CID attachments, so they render
 *    in Outlook instead of being stripped as `data:` URIs.
 *  - The `X-Unsent: 1` header makes Outlook desktop open the file as a new,
 *    editable, ready-to-send message instead of a read-only received item.
 */
export const exportToEML = (
  sections: NewsletterSection[],
  subject?: string,
  logos?: { tcs?: string; tata?: string }
): string => {
  // Embedded logos arrive as base64 data URLs and are picked up by the data-URI
  // → CID conversion below, same as content images.
  let html = exportToHTML(sections, logos);

  // Pull every base64 data-URI image out of the HTML and swap it for a cid: reference.
  // The same data URI can appear more than once (e.g. the hero bg in both the <td>
  // style and the VML fallback) — reuse one CID per unique image.
  const images: InlineImage[] = [];
  const seen = new Map<string, string>();
  const dataUriRegex = /data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)/g;

  html = html.replace(dataUriRegex, (match, mime: string, b64: string) => {
    let cid = seen.get(match);
    if (!cid) {
      cid = `img${images.length + 1}@newsletter.local`;
      seen.set(match, cid);
      images.push({ cid, mime, base64: b64 });
    }
    return `cid:${cid}`;
  });

  const headerSection = sections.find((s) => s.type === "header");
  const resolvedSubject =
    subject || (headerSection?.content?.title as string) || "Newsletter";

  const boundary = `----=_Newsletter_${Math.random().toString(36).slice(2)}`;

  const parts: string[] = [];

  // Message headers
  parts.push("X-Unsent: 1");
  parts.push("To: ");
  parts.push(`Subject: ${resolvedSubject}`);
  parts.push("MIME-Version: 1.0");
  parts.push(`Content-Type: multipart/related; boundary="${boundary}"`);
  parts.push("");

  // HTML body part (base64 so all UTF-8 content survives intact)
  parts.push(`--${boundary}`);
  parts.push('Content-Type: text/html; charset="utf-8"');
  parts.push("Content-Transfer-Encoding: base64");
  parts.push("");
  parts.push(wrapBase64(utf8ToBase64(html)));
  parts.push("");

  // Inline image parts
  images.forEach((img, i) => {
    const filename = `image${i + 1}.${extFromMime(img.mime)}`;
    parts.push(`--${boundary}`);
    parts.push(`Content-Type: ${img.mime}; name="${filename}"`);
    parts.push("Content-Transfer-Encoding: base64");
    parts.push(`Content-ID: <${img.cid}>`);
    parts.push(`Content-Disposition: inline; filename="${filename}"`);
    parts.push("");
    parts.push(wrapBase64(img.base64));
    parts.push("");
  });

  parts.push(`--${boundary}--`);
  parts.push("");

  return parts.join(CRLF);
};
