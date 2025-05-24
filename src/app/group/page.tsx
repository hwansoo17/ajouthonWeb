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
  const router = useRouter();
  const { setMembersForSelection } = useActivityFormDataStore();

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
        /* ... 매핑 로직 ... */ activityId: String(activity.postId),
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
  }, []);

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
      setMembersForSelection(currentGroupMembers); // 현재 멤버 목록을 스토어에 저장
      router.push(`/group/${selectedGroupId}/new-activity`);
    } else {
      alert('활동을 추가할 그룹을 먼저 선택해주세요.');
    }
  };

  return (
    // 1. 최상위 div에 display:flex와 height: 100vh 적용
    <div
      style={{
        display: 'flex',
        height: 'calc(100% - 60px)',
        background: '#18181b',
      }}>
      {/* 사이드바 토글 버튼 */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '80px', // 위치는 필요에 따라 조정
          // 사이드바 너비(320px)를 고려하여 left 값 조정
          left: isSidebarOpen ? 'calc(320px + 20px)' : '20px',
          zIndex: 101, // 사이드바보다 위에 오도록 zIndex 조정
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

      {/* 2. 사이드바 영역 */}
      <div
        style={{
          display: 'flex',
          width: isSidebarOpen ? '320px' : '0px', // 상태에 따라 너비 변경
          height: '100%', // 전체 화면 높이
          backgroundColor: '#23232a',
          overflowY: 'auto', // 내용이 길면 스크롤
          overflowX: 'hidden', // 너비가 0일 때 내용 숨김
          transition: 'width 0.3s ease-in-out',
          flexShrink: 0, // 너비 고정, 줄어들지 않음
          zIndex: 50, // 필요시 zIndex 설정
        }}>
        {/* 사이드바가 열려 있을 때만 GroupSidebar 내용 렌더링 (애니메이션을 위해 항상 렌더링하고 내부에서 숨길 수도 있음) */}
        {isSidebarOpen && (
          <GroupSidebar
            groups={groups}
            onSelectGroup={handleSelectGroup}
            selectedGroupId={selectedGroupId}
          />
        )}
      </div>

      {/* 3. 메인 콘텐츠 영역 */}
      <main
        style={{
          flexGrow: 1, // 남은 공간 모두 차지
          height: '100%', // 전체 화면 높이 (또는 부모 높이 100% 사용)
          overflowY: 'auto', // 내용이 길면 스크롤
          padding: '20px',
          paddingTop: '80px', // 상단 고정 요소(토글 버튼 등) 고려한 패딩
          background: '#18181b',
          color: '#f4f4f5',
          // marginLeft 제거 (flex-grow가 너비 관리)
          // transition: 'margin-left 0.3s ease-in-out', // 더 이상 필요 없음
        }}>
        {/* 선택된 그룹 정보 및 활동 추가 버튼 섹션 */}
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
              "{selectedGroupDetails.groupName}" 활동 피드
            </h2>
            <button
              onClick={handleAddActivity}
              style={{
                padding: '10px 18px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#4f46e5')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#6366f1')
              }>
              활동 추가하기
            </button>
          </div>
        )}

        {/* ... (나머지 로딩 및 데이터 표시 로직 유지) ... */}
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
      </main>
    </div>
  );
};

export default HomePage;
