// GroupSidebar.tsx
'use client';
import React from 'react';
import { GroupWithActivities, categoryMap, roleMap } from '../data'; // data.ts에서 import

interface GroupSidebarProps {
  groups: GroupWithActivities[];
  onSelectGroup: (groupId: number) => void;
  selectedGroupId: number | null; // 현재 선택된 그룹 ID
}

const GroupSidebar: React.FC<GroupSidebarProps> = ({
  groups,
  onSelectGroup,
  selectedGroupId,
}) => {
  return (
    <div
      style={{
        width: '320px', // 사이드바 너비 고정
        minWidth: '320px',
        height: '100%', // 전체 화면 높이
        background: '#23232a',
        boxShadow: '4px 0 24px rgba(0,0,0,0.24)', // 오른쪽에 그림자
        padding: '40px 32px',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto', // 그룹 목록이 길 경우 스크롤
        position: 'sticky', // 스크롤 시 상단에 고정 (필요시)
        top: 0,
        zIndex: 10, // 다른 요소 위에 오도록
      }}>
      <h1 style={{ color: '#f4f4f5', marginBottom: 24, fontSize: '28px' }}>
        모임 리스트
      </h1>
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
              border: `2px solid ${
                group.groupId === selectedGroupId ? '#8b5cf6' : '#3f3f46'
              }`, // 선택된 항목 강조
              borderRadius: 12,
              padding: '24px 20px',
              background:
                group.groupId === selectedGroupId ? '#3730a3' : '#27272a', // 선택 시 배경 변경
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
            <div style={{ fontSize: 15, color: '#a1a1aa' }}>
              카테고리: {categoryMap[group.category] || group.category}
            </div>
            <div style={{ fontSize: 15, color: '#a1a1aa' }}>
              내 역할: {roleMap[group.role] || group.role}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupSidebar;
