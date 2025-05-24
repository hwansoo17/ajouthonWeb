// app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore'; // 스토어 경로 확인
import { api } from '@/api/api'; // API 유틸리티

export default function LoginPage() {
  const router = useRouter();
  // login 액션은 이제 토큰만 받습니다.
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('[LoginPage] 이미 로그인됨. 메인 페이지(/)로 이동.');
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // event 타입 명시
    event.preventDefault(); // 폼 기본 제출(새로고침) 방지
    setError('');

    try {
      const response = await api.post('auth/signin', {
        email,
        password,
      });
      console.log('로그인 성공:', response.data);

      const token = response.data.accessToken;
      const refreshToken = response.data.refreshToken; // refreshToken은 API 응답에 있다면 받아둡니다.

      if (token) {
        // accessToken은 스토어의 login 액션을 통해 localStorage에도 저장됩니다.
        // refreshToken은 필요에 따라 별도로 localStorage에 저장할 수 있습니다.
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
          console.log('[LoginPage] refreshToken 저장됨.');
        }

        login(token); // 수정된 login 액션 호출 (accessToken만 전달)
        console.log('[LoginPage] login 액션 호출 후, / 로 라우팅 시도');
        router.push('/');
      } else {
        console.error('로그인 실패: API 응답에 accessToken이 없습니다.');
        setError('로그인에 실패했습니다. (토큰 누락)');
      }
    } catch (err: any) {
      console.error('로그인 API 호출 실패:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (isLoading || (!isLoading && isAuthenticated)) {
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
        <p>페이지를 준비 중입니다...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#18181b',
        padding: '20px',
      }}>
      <div
        style={{
          background: '#23232a',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.24)',
          color: '#f4f4f5',
          width: '100%',
          maxWidth: '400px',
        }}>
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '24px',
            fontSize: '28px',
          }}>
          로그인
        </h1>
        <form onSubmit={handleSubmit}>
          {' '}
          {/* form의 onSubmit 이벤트 핸들러로 handleSubmit 연결 */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
              }}>
              이메일
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #3f3f46',
                background: '#27272a',
                color: '#f4f4f5',
              }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
              }}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #3f3f46',
                background: '#27272a',
                color: '#f4f4f5',
              }}
            />
          </div>
          {error && (
            <p
              style={{
                color: '#f87171',
                textAlign: 'center',
                marginBottom: '16px',
                fontSize: '14px',
              }}>
              {error}
            </p>
          )}
          <button
            type="submit" // 버튼 타입을 submit으로 명시
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}>
            로그인
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          계정이 없으신가요?{' '}
          <a
            href="/signup" // Next.js에서는 Link 컴포넌트 사용 권장
            style={{ color: '#34d399', textDecoration: 'underline' }}>
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
