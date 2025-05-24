// 예시: app/main/page.tsx (보호되어야 하는 페이지의 컴포넌트)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore'; // Zustand 스토어
import { InviteCodeInput } from './components/InviteCodeInput';

export default function ProtectedPage() {
  // 컴포넌트 이름을 ProtectedPage 등으로 변경하여 의미를 명확히 합니다.
  const { isAuthenticated, isAutoLoginLoading, group } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 자동 로그인/초기 인증 상태 로딩이 완료되었는지 확인
    if (!isAutoLoginLoading) {
      // 인증되지 않았다면 로그인 페이지로 리다이렉트
      if (!isAuthenticated) {
        console.log(
          '[Client Side] User not authenticated. Redirecting to /login...',
        );
        router.push('/login');
      }
      // 인증 되었다면 아무것도 하지 않고 페이지 내용을 보여줍니다.
    }
  }, [isAuthenticated, isAutoLoginLoading, router]); // 의존성 배열

  // 1. 자동 로그인/초기 인증 로딩 중일 때 보여줄 화면
  if (isAutoLoginLoading) {
    return (
      <div>
        <p>인증 상태를 확인 중입니다...</p>
      </div>
    );
  }

  // 2. 로딩이 끝났지만, 아직 인증되지 않은 상태라면 (리다이렉션 직전)
  //    아무것도 표시하지 않거나 간단한 메시지를 표시할 수 있습니다.
  //    보통 useEffect의 리다이렉션이 빠르게 일어나므로 이 상태는 거의 보이지 않을 수 있습니다.
  if (!isAuthenticated) {
    return (
      <div>
        <p>로그인 페이지로 이동합니다...</p>
      </div>
    );
  }

  // 3. 로딩이 끝나고, 인증된 사용자에게 보여줄 실제 페이지 내용
  // 예시: 모임 데이터가 있는지 확인 (임시로 useAuthStore에서 가져온다고 가정)
  // 실제로는 별도의 모임 store/useGroupStore 등에서 가져와야 할 수 있습니다.

  // 모임 데이터가 없을 때: 초대코드 입력 및 모임 생성 안내
  if (group.length === 0) {
    return <InviteCodeInput />;
  }

  // 모임 데이터가 있을 때: 기존 페이지 내용
  if (group.length > 0) {
    return (
      <div>
        <h1>환영합니다!</h1>
        <InviteCodeInput />
      </div>
    );
  }
}
