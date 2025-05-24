// components/AuthGuard.tsx
'use client'; // 클라이언트 컴포넌트로 명시

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore'; // 스토어 경로 확인

// 인증 없이 접근 가능한 "공개" 경로 목록
const PUBLIC_PATHS = ['/login', '/signup']; // 예: '/auth/kakao/callback' 등 OAuth 콜백 경로도 추가 가능

interface AuthGuardProps {
  children: React.ReactNode; // 보호할 페이지 컨텐츠
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading); // 스토어의 로딩 상태 사용
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로를 가져옴

  useEffect(() => {
    console.log(
      `[AuthGuard] 현재 경로: ${pathname}, 인증 로딩중: ${isLoading}, 인증됨: ${isAuthenticated}`,
    );

    if (isLoading) {
      console.log('[AuthGuard] 인증 상태 확인 중... 대기');
      return; // 인증 상태 확인이 완료될 때까지 아무것도 하지 않음
    }

    const pathIsPublic = PUBLIC_PATHS.some((publicPath) =>
      pathname.startsWith(publicPath),
    );

    if (!isAuthenticated && !pathIsPublic) {
      // 인증되지 않았고, 현재 경로가 공개 경로가 아니라면 로그인 페이지로 리다이렉트
      console.log(
        `[AuthGuard] 인증 안됨 & 비공개 경로 (${pathname}). /login으로 이동합니다.`,
      );
      router.push('/login');
    }
    // (선택 사항) 이미 로그인한 사용자가 /login, /signup 페이지에 접근하려고 하면 메인 페이지로 리다이렉트
    // else if (isAuthenticated && pathIsPublic) {
    //   console.log(`[AuthGuard] 인증됨 & 공개 경로 (${pathname}). 메인 페이지(/)로 이동합니다.`);
    //   router.push('/'); // 또는 '/main' 등 대시보드 페이지
    // }
  }, [isAuthenticated]); // 의존성 배열에 상태값 및 라우터 객체 포함

  // 인증 상태 로딩 중일 때 보여줄 UI (선택 사항)
  if (isLoading) {
    console.log('[AuthGuard] 로딩 중 UI 표시');
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#18181b',
          color: '#f4f4f5',
        }}>
        <p>사용자 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 인증되지 않았고, 비공개 경로이며, 리다이렉션이 아직 실행되기 전 (매우 짧은 순간)
  if (
    !isAuthenticated &&
    !PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath))
  ) {
    console.log('[AuthGuard] 리다이렉트 대기 UI 표시 (인증X, 비공개 경로)');
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#18181b',
          color: '#f4f4f5',
        }}>
        <p>로그인 페이지로 이동합니다...</p>
      </div>
    ); // 또는 null을 반환하여 아무것도 표시하지 않음
  }

  // 모든 조건 통과 시 (인증되었거나, 공개 경로이거나, 로딩 완료 후 조건 만족) 자식 컴포넌트(페이지) 렌더링
  console.log('[AuthGuard] 접근 허용. 페이지 컨텐츠 렌더링.');
  return <>{children}</>;
}
