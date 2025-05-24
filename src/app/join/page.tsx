'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '@/api/api'; // Assuming authApi is your configured Axios instance

const InviteCodeInput = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for the join button
  const [error, setError] = useState(''); // Error message state
  const router = useRouter();

  const handleJoinGroup = async () => {
    if (!code.trim()) {
      setError('초대 코드를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const requestBody = {
        inviteCode: code,
      };
      // Send POST request to /groups/signin
      // Assuming a successful response means the user has joined the group.
      // The API might return details of the joined group or just a success status.
      await authApi.post('/groups/signin', requestBody);

      // console.log('모임 가입 성공:', response.data);
      alert('모임에 성공적으로 가입되었습니다!');
      router.push('/'); // Navigate to the main group listing page (e.g., HomePage)
      // If your main group page is '/group', use router.push('/group');
    } catch (err: any) {
      console.error('모임 가입 실패:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(
          '모임 가입 중 오류가 발생했습니다. 코드를 확인하거나 다시 시도해주세요.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#18181b',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#23232a',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.24)',
          padding: '40px 32px',
          minWidth: '340px',
          maxWidth: '90vw',
          textAlign: 'center',
          color: '#f4f4f5',
          gap: '20px', // Increased gap for better spacing
        }}>
        <h1 style={{ color: '#f4f4f5', margin: 0 }}>모임 참여하기</h1>
        <p style={{ color: '#a1a1aa', margin: 0 }}>
          초대코드를 입력하여 모임에 참여하거나 새 모임을 생성하세요.
        </p>

        {/* Error Message Display */}
        {error && (
          <p style={{ color: '#f87171', fontSize: '14px', margin: '0' }}>
            {error}
          </p>
        )}

        {/* Invite Code Input Form */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(''); // Clear error when user types
            }}
            placeholder="초대코드 입력"
            style={{
              flexGrow: 1, // Allow input to take available space
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #3f3f46', // Slightly lighter border
              background: '#1f1f24', // Slightly lighter input background
              color: '#f4f4f5',
              minWidth: 0,
              outline: 'none',
              fontSize: '16px',
            }}
          />
          <button
            onClick={handleJoinGroup} // Attach handler
            disabled={isLoading} // Disable button when loading
            style={{
              padding: '10px 20px', // Increased padding
              borderRadius: '6px',
              border: 'none',
              background: isLoading ? '#1d4ed8' : '#2563eb', // Darker blue when loading
              color: '#fff',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              textWrap: 'nowrap',
              fontSize: '16px',
              transition: 'background-color 0.2s',
            }}>
            {isLoading ? '참여 중...' : '참여하기'}
          </button>
        </div>

        {/* Create Group Button */}
        <button
          onClick={() => {
            router.push('/group/create');
          }}
          style={{
            padding: '12px 0', // Increased padding
            width: '100%',
            borderRadius: '6px',
            border: 'none',
            background: '#059669', // Darker green for contrast
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#047857')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#059669')
          }>
          새 모임 생성하기
        </button>
      </div>
    </div>
  );
};

export default InviteCodeInput;
