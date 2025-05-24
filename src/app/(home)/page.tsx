'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore'; // Zustand 스토어
import { authApi } from '@/api/api';

export default function ProtectedPage() {
  // 컴포넌트 이름을 ProtectedPage 등으로 변경하여 의미를 명확히 합니다.
  const { isAuthenticated, groups, setGroups } = useAuthStore();
  const router = useRouter();

  const getGroups = async () => {
    try {
      const response = await authApi.get('/groups');
      setGroups(response.data);
      if (response.data.length === 0) {
        router.push(`/join`);
      }
      if (response.data.length > 0) {
        // 그룹이 있으면 첫 번째 그룹으로 이동
        router.push(`/group`);
      }
    } catch (error) {
      console.error('그룹 정보를 가져오는 데 실패했습니다:', error);
    }
  };
  useEffect(() => {
    // 자동 로그인/초기 인증 상태 로딩이 완료되었는지 확인
    if (!isAuthenticated) {
      console.log(
        '[Client Side] User not authenticated. Redirecting to /login...',
      );
      router.push('/login');
    }
    getGroups(); // 그룹 정보를 가져옵니다.
    // 인증 되었다면 아무것도 하지 않고 페이지 내용을 보여줍니다.
  }, [isAuthenticated, router]); // 의존성 배열

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
  return null; // 인증된 상태라면 페이지 내용을 렌더링하지 않습니다.
}
