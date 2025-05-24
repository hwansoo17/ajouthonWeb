// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // 예시 폰트
import './globals.css'; // 전역 CSS 파일

import AuthInitializer from '@/components/AuthInitializer'; // 경로 확인

import { Header } from '@/components/Header';
import AuthGuard from '@/components/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '내 앱 타이틀',
  description: '내 앱 설명',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={inter.className}
        style={{ background: '#18181b', color: '#f4f4f5', height: '100vh' }}>
        {/* 모든 페이지 컨텐츠를 AuthGuard로 감싸서 보호 */}
        <AuthInitializer /> {/* 앱 시작 시 인증 상태 초기화 */}
        <AuthGuard>
          <Header /> {/* 헤더 컴포넌트 추가 */}{' '}
          {/* 모든 페이지 컨텐츠를 AuthGuard로 감싸서 보호 */}
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
