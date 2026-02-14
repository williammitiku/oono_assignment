import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "oono Brand Collections",
  description: "View brand story collections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
