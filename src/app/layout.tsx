import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glance",
  description: "Your AI cheat sheet before every connection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
        <footer className="fixed bottom-0 left-0 right-0 p-4 text-center">
          <a
            href="https://www.ericxie.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className=""
          >
            <p className="text-gray-400 text-sm">Built with {"<3"} by Eric</p>
          </a>
        </footer>
      </body>
    </html>
  );
}
