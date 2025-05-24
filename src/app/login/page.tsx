'use client';

import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { setLogin } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력하세요.');
      return;
    }
    setError('');
    setLogin(true, 'dummyAccessToken', 'dummyUserId');
    router.push('/');
  };

  const handleGoToSignup = () => {
    router.push('/signup');
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#18181b',
      }}>
      <div
        style={{
          background: '#23232a',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.24)',
          padding: '40px 32px',
          minWidth: '340px',
          maxWidth: '90vw',
          color: '#f4f4f5',
        }}>
        <h2 style={{ marginBottom: 24, color: '#f4f4f5', textAlign: 'center' }}>
          로그인
        </h2>
        <FormInput
          label="아이디"
          name="memberId"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormInput
          label="비밀번호"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div
            style={{
              color: '#f87171',
              marginBottom: 16,
              textAlign: 'center',
            }}>
            {error}
          </div>
        )}
        <Button title="로그인" onClick={handleSubmit} />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <span style={{ color: '#a1a1aa' }}>계정이 없으신가요? </span>
          <button
            type="button"
            onClick={handleGoToSignup}
            style={{
              background: 'none',
              border: 'none',
              color: '#10b981',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              fontWeight: 600,
            }}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
