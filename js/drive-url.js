/**
 * Converts a Google Drive share URL into a direct-viewable image URL.
 * Accepts formats like:
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/open?id=<ID>
 * Returns null if no file ID can be extracted or input is empty.
 */
export function toDirectImageUrl(driveUrl) {
  if (!driveUrl || typeof driveUrl !== "string") {
    return null;
  }

  const fileMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?id=${fileMatch[1]}`;
  }

  const openMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?id=${openMatch[1]}`;
  }

  return null;
}
