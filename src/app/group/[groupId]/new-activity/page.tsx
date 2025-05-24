// app/group/[groupId]/new-activity/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import useActivityFormDataStore from '@/store/activityFormDataStore';
import { authApi } from '@/api/api';

// Member 타입 (HomePage와 동일하게 유지 또는 공통 파일에서 import)
type Member = {
  memberId: string;
  name: string;
  email: string;
  role: string;
};

// Presigned URL 응답 객체 타입
interface PresignedUrlResponseItem {
  fileName: string; // 원본 파일명
  uploadUrl: string; // S3 업로드용 presigned URL
}

export default function NewActivityPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const { membersForSelection } = useActivityFormDataStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<
    string[]
  >([]);
  const [selectedLocalFiles, setSelectedLocalFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      // 기존 미리보기 URL 해제
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
      setSelectedLocalFiles(filesArray);
      setFilePreviews(
        filesArray
          .filter((file) => file.type.startsWith('image/'))
          .map((file) => URL.createObjectURL(file)),
      );
    }
  };

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

    // 1) 게시글 + 파일명 리스트 요청
    const requestBody = {
      title,
      content,
      fileNames: selectedLocalFiles.map((f) => f.name),
      participantIds: selectedParticipantIds.map((id) => parseInt(id, 10)),
    };

    try {
      setIsUploading(true);
      const res = await authApi.post<PresignedUrlResponseItem[]>(
        `/groups/${groupId}/posts`,
        requestBody,
      );

      if (res.status === 200) {
        const presignedList = res.data;

        // 2) presigned URL로 파일 업로드
        await Promise.all(
          presignedList.map(async (item) => {
            const file = selectedLocalFiles.find(
              (f) => f.name === item.fileName,
            );
            if (!file) {
              console.warn(`파일 매칭 실패: ${item.fileName}`);
              return;
            }
            console.log(file);
            const uploadRes = await fetch(item.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': file.type },
              body: file,
            });
            if (!uploadRes.ok) {
              throw new Error(
                `${item.fileName} 업로드 실패: ${uploadRes.statusText}`,
              );
            }
          }),
        );

        alert('활동이 성공적으로 등록되었습니다.');
        router.back();
      } else {
        throw new Error(`서버 응답 오류: ${res.status}`);
      }
    } catch (error) {
      console.error('활동 등록/업로드 중 오류:', error);
      alert('활동 등록 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
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
      <h1>새 활동 추가</h1>
      <form onSubmit={handleSubmit}>
        {/* 제목 */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="title"
            style={{ display: 'block', marginBottom: '8px' }}>
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              color: 'black',
              borderRadius: '4px',
            }}
          />
        </div>

        {/* 내용 */}
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
            style={{
              width: '100%',
              padding: '10px',
              color: 'black',
              borderRadius: '4px',
            }}
          />
        </div>

        {/* 파일 업로드 */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="fileUpload"
            style={{ display: 'block', marginBottom: '8px' }}>
            사진/파일 첨부
          </label>
          <input
            id="fileUpload"
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp"
            onChange={handleFileChange}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {filePreviews.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`미리보기 ${idx + 1}`}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #555',
                }}
              />
            ))}
          </div>
          <ul>
            {selectedLocalFiles
              .filter((f) => !f.type.startsWith('image/'))
              .map((f, idx) => (
                <li key={idx} style={{ fontSize: '12px', color: '#ccc' }}>
                  {f.name}
                </li>
              ))}
          </ul>
        </div>

        {/* 참여자 선택 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            참여자 선택
          </label>
          {membersForSelection.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {membersForSelection.map((member: Member) => (
                <button
                  key={member.memberId}
                  type="button"
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
            <p>
              선택할 수 있는 멤버가 없거나, 멤버 목록을 불러오지 못했습니다.
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isUploading}
          style={{
            padding: '12px 20px',
            background: isUploading ? '#555' : '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}>
          {isUploading ? '업로드 중...' : '활동 등록'}
        </button>
      </form>
    </div>
  );
}
