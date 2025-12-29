import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WinnerLens - AI 기반 쿠팡 셀러 자동화",
    description: "상품 발굴부터 등록까지 End-to-End 자동화",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={inter.className}>
                <Toaster />
                {children}
            </body>
        </html>
    );
}
