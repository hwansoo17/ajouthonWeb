// HomePage.tsx (또는 app/your-route/page.tsx)
'use client';
import React, { useState, useMemo } from 'react';

import { groupsWithActivitiesData } from './data'; // data.ts에서 import
import GroupSidebar from './components/GroupSideBar';
import ActivityFeed from './components/ActivityFeed';

// Toggle Button SVG Icon (예시)
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
  // 첫 번째 그룹을 기본 선택, 없으면 null
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
    groupsWithActivitiesData.length > 0
      ? groupsWithActivitiesData[0].groupId
      : null,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 사이드바 기본적으로 열림

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
    // 모바일 환경에서는 그룹 선택 시 사이드바를 닫도록 할 수 있습니다.
    // if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 선택된 그룹 정보 찾기 (메모이제이션으로 성능 최적화)
  const selectedGroup = useMemo(() => {
    return groupsWithActivitiesData.find((g) => g.groupId === selectedGroupId);
  }, [selectedGroupId]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#18181b' }}>
      {/* 사이드바 토글 버튼 (화면 좌측 상단에 고정) */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '20px',
          left: isSidebarOpen ? `calc(320px + 20px)` : '20px', // 사이드바 너비만큼 이동
          zIndex: 100, // 사이드바보다 위에 표시
          padding: '12px',
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '50%', // 원형 버튼
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'left 0.3s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* 사이드바 */}
      <div
        style={{
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          position: isSidebarOpen ? 'relative' : 'absolute', // 닫혔을 때 레이아웃에서 제외
          width: isSidebarOpen ? 'auto' : '0', // 닫혔을 때 너비 0
        }}>
        {isSidebarOpen && (
          <GroupSidebar
            groups={groupsWithActivitiesData}
            onSelectGroup={handleSelectGroup}
            selectedGroupId={selectedGroupId}
          />
        )}
      </div>

      {/* 메인 컨텐츠 (활동 피드) */}
      <main
        style={{
          flexGrow: 1,
          padding: '20px',
          paddingTop: '80px', // 토글 버튼과의 간격 확보
          overflowY: 'auto', // 내용이 길면 스크롤
          background: '#18181b',
          color: '#f4f4f5',
          transition: 'margin-left 0.3s ease-in-out', // 사이드바 상태에 따른 애니메이션
          // marginLeft: isSidebarOpen ? '0' : `-${/* 사이드바 너비 */}px` // 필요시 조정
        }}>
        {selectedGroup ? (
          <ActivityFeed
            activities={selectedGroup.activities}
            groupName={selectedGroup.groupName}
          />
        ) : (
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
      </main>
    </div>
  );
};

export default HomePage;
