/**
 * Generate QR code data URL
 */
export function generateQRCode(text: string): string {
  // Placeholder - intégrer une vraie lib QR code si besoin
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
}