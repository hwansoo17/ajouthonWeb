// HomePage.tsx
'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';

import GroupSidebar from './components/GroupSideBar';
import ActivityFeed from './components/ActivityFeed';
import { authApi } from '@/api/api';
import { useRouter } from 'next/navigation';
import useActivityFormDataStore from '@/store/activityFormDataStore';

// --- 타입 정의 (기존 코드 유지) ---
interface ApiActivity {
  postId: number;
  title: string;
  content: string;
  fileUrls: string[];
  participantNames: string[];
  createdAt: string;
}

type Photo = { id: string; url: string };
type Participant = { id: string; name: string };
type Member = {
  memberId: string;
  name: string;
  email: string;
  role: string;
};

export type AppActivity = {
  activityId: string;
  title: string;
  date: string;
  content: string;
  photos: Photo[];
  participants: Participant[];
  createdAt: string;
};

interface GroupInfo {
  groupId: number;
  groupName: string;
}
// --- 타입 정의 끝 ---

// 아이콘 컴포넌트 (기존 코드 유지)
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: 24, height: 24 }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: 24, height: 24 }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2} // 아이콘 두께 조절 가능
    stroke="currentColor"
    style={{ width: 24, height: 24 }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: 24, height: 24 }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

interface InviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string | null;
}

const InviteCodeModal: React.FC<InviteCodeModalProps> = ({
  isOpen,
  onClose,
  code,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !code) {
    return null;
  }

  const handleCopyCode = async () => {
    if (code) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // 2초 후 "복사됨!" 메시지 사라짐
      } catch (err) {
        console.error('코드 복사 실패:', err);
        alert('코드 복사에 실패했습니다.');
      }
    }
  };

  return (
    <div
      style={{
        // 오버레이 스타일
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, // 다른 요소들보다 위에 오도록
      }}>
      <div
        style={{
          // 모달 컨텐츠 스타일
          background: '#2d2d37', // 어두운 배경
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 5px 25px rgba(0,0,0,0.3)',
          color: '#e0e0e0',
          width: 'auto',
          minWidth: '300px',
          maxWidth: '90%',
        }}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: '15px',
            fontSize: '20px',
            color: 'white',
          }}>
          모임 초대 코드
        </h3>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#82aaff', // 코드 색상
            padding: '15px',
            margin: '10px 0 25px 0',
            background: '#1e1e24',
            borderRadius: '8px',
            border: '1px dashed #4a4a52',
            userSelect: 'all', // 쉽게 드래그하여 복사 가능하도록
          }}>
          {code}
        </div>
        <button
          onClick={handleCopyCode}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: copied ? '#059669' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            minWidth: '100px',
            transition: 'background-color 0.2s',
          }}>
          {copied ? '복사됨!' : '복사하기'}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '10px 20px',
            background: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            minWidth: '100px',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#666')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#555')}>
          닫기
        </button>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [currentGroupActivities, setCurrentGroupActivities] = useState<
    AppActivity[]
  >([]);
  const [currentGroupMembers, setCurrentGroupMembers] = useState<Member[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] =
    useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFetchingInviteCode, setIsFetchingInviteCode] =
    useState<boolean>(false);

  // 모달 상태 추가
  const [isInviteCodeModalOpen, setIsInviteCodeModalOpen] =
    useState<boolean>(false);
  const [inviteCodeToDisplay, setInviteCodeToDisplay] = useState<string | null>(
    null,
  );

  const router = useRouter();
  const { setMembersForSelection } = useActivityFormDataStore();

  // ... (getGroups, fetchGroupActivities, fetchGroupMembers, handleSelectGroup, toggleSidebar, selectedGroupDetails, handleAddActivity, handleExtractReport 함수들은 기존 코드 유지) ...
  const getGroups = useCallback(async () => {
    try {
      const response = await authApi.get<GroupInfo[]>('/groups');
      setGroups(response.data);
      if (response.data && response.data.length > 0) {
        if (selectedGroupId === null) {
          setSelectedGroupId(response.data[0].groupId);
        }
      } else {
        setSelectedGroupId(null);
        setCurrentGroupActivities([]);
        setCurrentGroupMembers([]);
      }
    } catch (error) {
      console.error('그룹 정보를 가져오는 데 실패했습니다:', error);
      setGroups([]);
      setSelectedGroupId(null);
      setCurrentGroupActivities([]);
      setCurrentGroupMembers([]);
    }
  }, [selectedGroupId]);

  const fetchGroupActivities = useCallback(async (groupId: number) => {
    if (!groupId) return;
    setIsActivitiesLoading(true);
    setCurrentGroupActivities([]);
    try {
      const response = await authApi.get<ApiActivity[]>(`/groups/${groupId}`);
      const mappedActivities: AppActivity[] = response.data.map((activity) => ({
        activityId: String(activity.postId),
        title: activity.title,
        content: activity.content,
        date: new Date(activity.createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        photos: activity.fileUrls.map((url, photoIndex) => ({
          id: `photo-${activity.postId}-${photoIndex}`,
          url: url,
        })),
        participants: activity.participantNames.map((name, pIndex) => ({
          id: `participant-${activity.postId}-${pIndex}`,
          name: name,
        })),
        createdAt: activity.createdAt,
      }));
      setCurrentGroupActivities(mappedActivities);
    } catch (error) {
      console.error(
        `그룹 ${groupId}의 활동 정보를 가져오는 데 실패했습니다:`,
        error,
      );
      setCurrentGroupActivities([]);
    } finally {
      setIsActivitiesLoading(false);
    }
  }, []);

  const fetchGroupMembers = useCallback(async (groupId: number) => {
    if (!groupId) return;
    try {
      const response = await authApi.get<Member[]>(
        `/groups/${groupId}/members`,
      );
      setCurrentGroupMembers(response.data);
    } catch (error) {
      console.error(
        `그룹 ${groupId}의 멤버 정보를 가져오는 데 실패했습니다:`,
        error,
      );
      setCurrentGroupMembers([]);
    }
  }, []);

  useEffect(() => {
    getGroups();
  }, []); // getGroups는 selectedGroupId에 의존하므로, selectedGroupId가 변경될 때마다 getGroups를 호출하면 무한 루프 발생 가능성 있음. 최초에만 호출하도록 변경.

  useEffect(() => {
    if (selectedGroupId !== null) {
      fetchGroupActivities(selectedGroupId);
      fetchGroupMembers(selectedGroupId);
    } else {
      setCurrentGroupActivities([]);
      setCurrentGroupMembers([]);
    }
  }, [selectedGroupId, fetchGroupActivities, fetchGroupMembers]);

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const selectedGroupDetails = useMemo(() => {
    return groups.find((g) => g.groupId === selectedGroupId);
  }, [selectedGroupId, groups]);

  const handleAddActivity = () => {
    if (selectedGroupId !== null) {
      setMembersForSelection(currentGroupMembers);
      router.push(`/group/${selectedGroupId}/new-activity`);
    } else {
      alert('활동을 추가할 그룹을 먼저 선택해주세요.');
    }
  };

  const handleExtractReport = () => {
    if (selectedGroupId !== null) {
      router.push(`/group/${selectedGroupId}/extract-report`);
    } else {
      alert('보고서를 추출할 그룹을 먼저 선택해주세요.');
    }
  };

  const handleGetInviteCode = async () => {
    if (!selectedGroupId) {
      alert('초대 코드를 발급받을 그룹을 선택해주세요.');
      return;
    }
    setIsFetchingInviteCode(true);
    try {
      // API 응답에서 초대 코드가 'inviteCode' 필드에 있다고 가정 (사용자 코드 기반)
      const response = await authApi.get<{ inviteCode: string }>( // API 응답 타입에 inviteCode 명시
        `/groups/${selectedGroupId}/code`,
      );

      if (response.data && response.data.inviteCode) {
        setInviteCodeToDisplay(response.data.inviteCode); // 모달에 표시할 코드 설정
        setIsInviteCodeModalOpen(true); // 모달 열기
      } else {
        throw new Error('초대 코드를 응답에서 찾을 수 없습니다.');
      }
    } catch (error: any) {
      console.error('초대 코드 발급 실패:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        '초대 코드 발급 중 오류가 발생했습니다.';
      alert(`오류: ${errorMessage}`); // 에러 시에는 기존처럼 alert 사용
    } finally {
      setIsFetchingInviteCode(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        height: 'calc(100vh - 60px)',
        position: 'relative',
        background: '#18181b',
      }}>
      {/* ... (사이드바 토글 버튼, 사이드바 영역 기존 코드 유지) ... */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '80px',
          left: isSidebarOpen ? 'calc(320px + 20px)' : '20px',
          zIndex: 101,
          padding: '12px',
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'left 0.3s ease-in-out, background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div
        style={{
          width: isSidebarOpen ? '320px' : '0px',
          height: '100%',
          backgroundColor: '#23232a',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'width 0.3s ease-in-out',
          flexShrink: 0,
          zIndex: 50,
        }}>
        {isSidebarOpen && (
          <GroupSidebar
            groups={groups}
            onSelectGroup={handleSelectGroup}
            selectedGroupId={selectedGroupId}
          />
        )}
      </div>

      <main
        style={
          /* ... 기존 main 스타일 ... */ {
            flexGrow: 1,
            height: '100%',
            overflowY: 'auto',
            paddingLeft: '60px',
            paddingRight: '60px',
            paddingTop: '40px',
            background: '#18181b',
            color: '#f4f4f5',
          }
        }>
        {selectedGroupDetails && !isActivitiesLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #3f3f46',
            }}>
            <h2 style={{ color: '#f4f4f5', fontSize: '26px', margin: 0 }}>
              {selectedGroupDetails.groupName} 활동 피드
            </h2>
            <button
              onClick={handleGetInviteCode}
              disabled={isFetchingInviteCode}
              style={{
                /* ... 초대 코드 발급 버튼 스타일 기존 유지 ... */
                padding: '8px 16px',
                backgroundColor: isFetchingInviteCode ? '#374151' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isFetchingInviteCode ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                marginLeft: '20px',
              }}
              onMouseOver={(e) => {
                if (!isFetchingInviteCode)
                  e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseOut={(e) => {
                if (!isFetchingInviteCode)
                  e.currentTarget.style.backgroundColor = '#10b981';
              }}>
              {isFetchingInviteCode ? '코드 받는 중...' : '초대 코드 발급'}
            </button>
          </div>
        )}

        {/* ... (나머지 로딩 및 데이터 표시 로직 기존 유지) ... */}
        {isActivitiesLoading && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '50px',
              color: '#a1a1aa',
            }}>
            <p>활동내역을 불러오는 중입니다...</p>
          </div>
        )}
        {!isActivitiesLoading &&
          selectedGroupDetails &&
          currentGroupActivities.length > 0 && (
            <ActivityFeed
              activities={currentGroupActivities}
              groupName={selectedGroupDetails.groupName}
            />
          )}
        {!isActivitiesLoading &&
          selectedGroupDetails &&
          currentGroupActivities.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '50px',
                color: '#a1a1aa',
              }}>
              <p style={{ fontSize: '18px' }}>등록된 활동이 없습니다.</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                첫 활동을 기록해보세요!
              </p>
            </div>
          )}
        {!isActivitiesLoading && !selectedGroupDetails && groups.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '50px',
              color: '#a1a1aa',
            }}>
            <h2 style={{ color: '#e4e4e7' }}>모임을 선택해주세요.</h2>
            <p>
              좌측 {isSidebarOpen ? '' : '메뉴를 열어 '}모임 리스트에서 보고
              싶은 모임을 클릭하세요.
            </p>
          </div>
        )}
        {!isActivitiesLoading && groups.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '50px',
              color: '#a1a1aa',
            }}>
            <h2 style={{ color: '#e4e4e7' }}>참여 중인 모임이 없습니다.</h2>
            <p>새로운 모임에 참여하거나 직접 만들어보세요!</p>
          </div>
        )}

        {/* 플로팅 액션 버튼들 (기존 코드 유지) */}
        {selectedGroupDetails && !isActivitiesLoading && (
          <>
            <button
              onClick={handleExtractReport}
              title="보고서 추출"
              style={{
                position: 'fixed',
                bottom: '110px',
                right: '40px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#059669',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 90,
                transition:
                  'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#047857')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#059669')
              }
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = 'scale(0.95)')
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
              <DownloadIcon />
            </button>
            <button
              onClick={handleAddActivity}
              title="새 활동 추가"
              style={{
                position: 'fixed',
                bottom: '40px',
                right: '40px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 90,
                transition:
                  'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#4f46e5')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#6366f1')
              }
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = 'scale(0.95)')
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
              <PlusIcon />
            </button>
          </>
        )}
      </main>

      {/* 초대 코드 모달 렌더링 */}
      <InviteCodeModal
        isOpen={isInviteCodeModalOpen}
        onClose={() => setIsInviteCodeModalOpen(false)}
        code={inviteCodeToDisplay}
      />
    </div>
  );
};

export default HomePage;
