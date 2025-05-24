'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const InviteCodeInput = () => {
  const [code, setCode] = useState('');
  const router = useRouter();
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#18181b', // 다크 배경
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#23232a', // 다크 카드 배경
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.24)',
          padding: '40px 32px',
          minWidth: '340px',
          maxWidth: '90vw',
          textAlign: 'center',
          color: '#f4f4f5', // 밝은 텍스트
          gap: '16px',
        }}>
        <h1 style={{ color: '#f4f4f5' }}>모임이 없습니다</h1>
        <p style={{ color: '#a1a1aa' }}>
          초대코드를 입력하거나 새 모임을 생성하세요.
        </p>
        {/* 초대코드 입력 폼 */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="초대코드 입력"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #27272a',
              background: '#18181b',
              color: '#f4f4f5',
              minWidth: 0,
              outline: 'none',
            }}
          />
          <button
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              textWrap: 'nowrap',
            }}>
            참여하기
          </button>
        </div>
        {/* 모임 생성 버튼 */}
        <button
          onClick={() => {
            router.push('/group/create');
          }}
          style={{
            padding: '8px 0',
            width: '100%',
            borderRadius: '6px',
            border: 'none',
            background: '#10b981',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 16,
          }}>
          모임 생성하기
        </button>
      </div>
    </div>
  );
};

export default InviteCodeInput;
