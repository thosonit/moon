/**
 * Converts a Google Drive share URL into a direct-viewable image URL.
 * Accepts formats like:
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/open?id=<ID>
 * Uses the lh3.googleusercontent.com host rather than drive.google.com/uc —
 * the uc endpoint frequently returns 503 when hotlinked from an <img> tag
 * (it expects a top-level navigation), while lh3 serves reliably for embeds.
 * Returns null if no file ID can be extracted or input is empty.
 */
export function toDirectImageUrl(driveUrl) {
  if (!driveUrl || typeof driveUrl !== "string") {
    return null;
  }

  const fileMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w2000`;
  }

  const openMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}=w2000`;
  }

  return null;
}
