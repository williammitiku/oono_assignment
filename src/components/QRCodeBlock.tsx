"use client";

interface QRCodeBlockProps {
  url: string;
  size?: number;
}

/** Renders a QR code image for the given URL (e.g. for "View on mobile"). */
export function QRCodeBlock({ url, size = 120 }: QRCodeBlockProps) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
  return (
    <div className="flex flex-col items-end">
      <img
        src={src}
        alt="Scan to view on mobile"
        width={size}
        height={size}
        className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-200 rounded bg-white"
      />
      <p className="text-xs mt-1 text-gray-500">View on mobile</p>
    </div>
  );
}
