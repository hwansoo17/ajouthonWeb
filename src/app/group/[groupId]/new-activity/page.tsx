// app/group/[groupId]/new-activity/page.tsx (예시)
'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useActivityFormDataStore from '@/store/activityFormDataStore'; // 스토어 임포트
import { authApi } from '@/api/api'; // API 인스턴스

// Member 타입 (HomePage와 동일하게 유지 또는 공통 파일에서 import)
type Member = {
  memberId: string;
  name: string;
  email: string;
  role: string;
};

export default function NewActivityPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string; // URL에서 groupId 가져오기

  // 스토어에서 멤버 목록과 데이터 클리어 함수 가져오기
  const { membersForSelection } = useActivityFormDataStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<
    string[]
  >([]);
  // 파일 관련 상태 및 핸들러는 복잡하므로 여기서는 개념만 설명 (실제 구현 필요)
  const [fileNames, setFileNames] = useState<string[]>([]); // 예: 업로드 후 파일명/경로 목록

  const handleParticipantToggle = (memberId: string) => {
    setSelectedParticipantIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const requestBody = {
      title,
      content,
      fileNames, // 실제 파일 업로드 로직 후 설정된 파일명/경로 배열
      participantIds: selectedParticipantIds.map((id) => parseInt(id, 10)), // 문자열 ID를 숫자로 변환
    };

    console.log('Submitting new activity:', requestBody);

    try {
      await authApi.post(`/groups/${groupId}/posts`, requestBody);
      alert('활동이 성공적으로 등록되었습니다.');
      // 성공 후 이전 페이지(활동 피드)로 이동하거나, 해당 그룹 상세 페이지로 이동
      router.back(); // 간단하게 뒤로가기
      // 또는 router.push(`/`); // HomePage (활동 피드)로 이동
    } catch (error) {
      console.error('활동 등록 실패:', error);
      alert('활동 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        color: 'white',
        maxWidth: '700px',
        margin: 'auto',
      }}>
      <h1>새 활동 추가 (모임 ID: {groupId})</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="title"
            style={{ display: 'block', marginBottom: '8px' }}>
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', color: 'black' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="content"
            style={{ display: 'block', marginBottom: '8px' }}>
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            style={{ width: '100%', padding: '10px', color: 'black' }}
          />
        </div>

        {/* 파일 업로드 관련 UI (실제 구현 필요) */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            파일 첨부
          </label>
          {/* <input type="file" multiple onChange={handleFileChange} /> */}
          <p style={{ fontSize: '12px', color: '#aaa' }}>
            {' '}
            (실제 파일 업로드 UI 구현 필요)
          </p>
          {/* 선택된 파일명 표시: {fileNames.join(', ')} */}
        </div>

        {/* 참여자 선택 (태그 형식 UI) */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            참여자 선택
          </label>
          {membersForSelection.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {membersForSelection.map((member) => (
                <button
                  type="button"
                  key={member.memberId}
                  onClick={() => handleParticipantToggle(member.memberId)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #555',
                    borderRadius: '16px',
                    background: selectedParticipantIds.includes(member.memberId)
                      ? '#4f46e5'
                      : '#333',
                    color: 'white',
                    cursor: 'pointer',
                  }}>
                  {member.name}
                </button>
              ))}
            </div>
          ) : (
            <p>선택할 수 있는 멤버가 없거나 불러오는 중입니다.</p>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: '12px 20px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}>
          활동 등록
        </button>
      </form>
    </div>
  );
}
