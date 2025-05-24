// 예시: 헤더 컴포넌트의 일부
'use client';

import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation'; // 로그아웃 후 리다이렉션을 위해

export function Header() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    console.log('[Header] 로그아웃 버튼 클릭');
    logout();
    // 로그아웃 후 로그인 페이지 또는 홈페이지로 이동
    router.push('/login');
  };

  return (
    <header
      style={{
        height: '60px',
        width: '100%',
        alignItems: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
        background: '#23232a',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <p>내 앱</p>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
          }}>
          로그아웃
        </button>
      )}
    </header>
  );
}
