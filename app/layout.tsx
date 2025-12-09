import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Hammond's Fight Lab | Lee Hammond MMA Training",
  description: "Premium MMA training courses from UFC veteran Lee Hammond. Master striking, grappling, and fight IQ with world-class instruction.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Hammond's Fight Lab | Lee Hammond MMA Training",
    description: "Premium MMA training courses from UFC veteran Lee Hammond",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
