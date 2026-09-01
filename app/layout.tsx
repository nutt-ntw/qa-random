import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QA Random — Interactive Statistics Lab",
  description: "ทดลอง sampling distribution และ Central Limit Theorem ผ่านการสุ่มฉลากแบบไม่คืนค่า",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className="min-h-screen font-[family-name:var(--font-noto)] antialiased">{children}</body>
    </html>
  );
}
