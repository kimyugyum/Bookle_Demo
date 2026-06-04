import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bookle — 책이 연결하는 사람들의 이야기',
  description: 'C2C 실물 책 교환 · 독서 커뮤니티 · AI 취향 매칭 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
