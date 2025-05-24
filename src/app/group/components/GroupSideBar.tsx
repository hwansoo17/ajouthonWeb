// GroupSidebar.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. useRouter 임포트
import { categoryMap, roleMap } from '../data';
import { authApi } from '@/api/api';

interface SidebarGroupInfo {
  groupId: number;
  groupName: string;
  category: string;
  role: string;
}

interface GroupSidebarProps {
  groups: SidebarGroupInfo[];
  onSelectGroup: (groupId: number) => void;
  selectedGroupId: number | null;
  onGroupJoined: () => void;
}

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setError('초대 코드를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await authApi.post('/groups/signin', { inviteCode });
      alert('모임에 성공적으로 가입되었습니다!');
      onSuccess();
      onClose();
      setInviteCode('');
    } catch (err: any) {
      console.error('모임 가입 실패:', err);
      setError(
        err.response?.data?.message || '모임 가입 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // ... (JoinGroupModal JSX - 기존 코드 유지)
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
      }}>
      <div
        style={{
          background: '#2d2d37',
          padding: '30px',
          borderRadius: '12px',
          color: '#e0e0e0',
          width: 'auto',
          minWidth: '300px',
          maxWidth: '90%',
          boxShadow: '0 5px 25px rgba(0,0,0,0.3)',
        }}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: '20px',
            fontSize: '20px',
            color: 'white',
            textAlign: 'center',
          }}>
          초대 코드로 모임 가입
        </h3>
        {error && (
          <p
            style={{
              color: '#f87171',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '10px',
            }}>
            {error}
          </p>
        )}
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => {
            setInviteCode(e.target.value);
            if (error) setError('');
          }}
          placeholder="초대 코드 입력"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '6px',
            border: '1px solid #3f3f46',
            background: '#1f1f24',
            color: '#f4f4f5',
            fontSize: '16px',
          }}
        />
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#555',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
            }}>
            취소
          </button>
          <button
            onClick={handleJoin}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              background: isLoading ? '#1d4ed8' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
            }}>
            {isLoading ? '가입 중...' : '가입하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

const GroupSidebar: React.FC<GroupSidebarProps> = ({
  groups,
  onSelectGroup,
  selectedGroupId,
  onGroupJoined,
}) => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const router = useRouter(); // 2. useRouter 인스턴스 생성

  // 3. 모임 생성 페이지로 이동하는 핸들러 함수
  const handleNavigateToCreateGroup = () => {
    router.push('/group/create'); // 모임 생성 페이지 경로
  };

  return (
    <>
      <div
        style={{
          width: '400px',
          minWidth: '400px',
          height: '100%',
          background: '#23232a',
          boxShadow: '4px 0 24px rgba(0,0,0,0.24)',
          padding: '40px 32px',
          color: '#f4f4f5',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          zIndex: 10,
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
          <h1 style={{ color: '#f4f4f5', fontSize: '28px', margin: 0 }}>
            모임 리스트
          </h1>
          {/* 버튼들을 그룹화하기 위한 div */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              title="새 모임 가입"
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: '#4A5568',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#2D3748')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#4A5568')
              }>
              모임 가입
            </button>
            {/* 모임 생성 버튼 추가 */}
            <button
              onClick={handleNavigateToCreateGroup}
              title="새 모임 생성"
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: '#38A169', // 다른 색상 (예: 녹색 계열)
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#2F855A')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#38A169')
              }>
              모임 생성
            </button>
          </div>
        </div>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            gap: 16,
            display: 'flex',
            flexDirection: 'column',
          }}>
          {groups.map((group) => (
            <li
              key={group.groupId}
              onClick={() => onSelectGroup(group.groupId)}
              style={{
                /* ... 기존 li 스타일 ... */
                border: `2px solid ${
                  group.groupId === selectedGroupId ? '#8b5cf6' : '#3f3f46'
                }`,
                borderRadius: 12,
                padding: '24px 20px',
                background:
                  group.groupId === selectedGroupId ? '#3730a3' : '#27272a',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
              <div style={{ fontWeight: 700, fontSize: 20 }}>
                {group.groupName}
              </div>
              {group.category && categoryMap[group.category] && (
                <div style={{ fontSize: 15, color: '#a1a1aa' }}>
                  카테고리: {categoryMap[group.category] || group.category}
                </div>
              )}
              {group.role && roleMap[group.role] && (
                <div style={{ fontSize: 15, color: '#a1a1aa' }}>
                  내 역할: {roleMap[group.role] || group.role}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={() => {
          onGroupJoined();
        }}
      />
    </>
  );
};

export default GroupSidebar;
