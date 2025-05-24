'use client'; // 클라이언트 컴포넌트로 명시

import useAuthStore from '@/store/authStore'; // 스토어 경로 확인
import { useEffect, useRef } from 'react';

export default function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  // StrictMode 또는 HMR로 인해 여러 번 호출되는 것을 방지하기 위한 플래그
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      console.log('[AuthInitializer] 컴포넌트 마운트, initializeAuth 호출');
      initializeAuth();
      initialized.current = true;
    }
  }, [initializeAuth]); // initializeAuth 함수가 변경될 일은 거의 없지만, 의존성 배열에 포함

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}
