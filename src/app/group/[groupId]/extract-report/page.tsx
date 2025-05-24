// app/group/[groupId]/extract-report/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { authApi } from '@/api/api'; // Your API instance

// Type for the activity data fetched from GET /groups/{groupId}
interface ApiActivity {
  postId: number;
  title: string;
  content: string; // May not be needed for display, but part of fetched data
  fileUrls: string[];
  participantNames: string[];
  createdAt: string; // e.g., "2024-05-24T13:40:00"
}

export default function ExtractReportPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    // ... (기존 fetchActivities 로직 유지) ...
    if (!groupId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.get<ApiActivity[]>(`/groups/${groupId}`);
      setActivities(response.data);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError('활동 목록을 불러오는 데 실패했습니다.');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleCheckboxChange = (postId: number) => {
    // ... (기존 handleCheckboxChange 로직 유지) ...
    setSelectedPostIds((prevSelectedIds) =>
      prevSelectedIds.includes(postId)
        ? prevSelectedIds.filter((id) => id !== postId)
        : [...prevSelectedIds, postId],
    );
  };

  const handleGenerateReport = async () => {
    if (selectedPostIds.length === 0) {
      alert('보고서에 포함할 활동을 하나 이상 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    const requestBody = {
      postIds: selectedPostIds,
    };

    console.log('1단계: 보고서 생성 요청 시작:', requestBody);

    try {
      const generateResponse = await authApi.post(
        '/api/reports/generate',
        requestBody,
      );
      console.log('1단계 성공: 보고서 생성 요청 완료:', generateResponse.data);

      console.log('2단계: 보고서 파일 다운로드 요청 시작: /report/download');
      const downloadResponse = await authApi.get('/report/download', {
        responseType: 'blob',
      });

      // DOCX 파일의 정확한 MIME 타입은 다음과 같습니다:
      // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      // 서버가 이 Content-Type을 보내주면 가장 좋습니다.
      const contentType =
        downloadResponse.headers['content-type'] ||
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      const blob = new Blob([downloadResponse.data], {
        type: contentType,
      });

      // 파일명 결정
      let fileName = 'report.docx'; // 기본 파일명을 .docx로 변경
      const contentDisposition =
        downloadResponse.headers['content-disposition'];
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(
          /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']+)['"]?;?/i,
        );
        if (fileNameMatch && fileNameMatch[1]) {
          // UTF-8 인코딩된 파일명 디코딩 시도 (예: filename*=UTF-8''report%20%E1%84%80%E1%85%B5.docx)
          try {
            fileName = decodeURIComponent(
              fileNameMatch[1].replace(/['"]/g, ''),
            );
          } catch (e) {
            // 디코딩 실패 시 원본 값 사용 또는 단순화된 버전 사용
            fileName = fileNameMatch[1].replace(/['"]/g, ''); // 따옴표 제거
            console.warn(
              'Content-Disposition filename 디코딩 실패, 원본 사용:',
              fileNameMatch[1],
              e,
            );
          }
        } else {
          // filename* 이 아닌 단순 filename="report.docx" 형태 처리
          const simplerFileNameMatch =
            contentDisposition.match(/filename="?([^"]+)"?/i);
          if (simplerFileNameMatch && simplerFileNameMatch[1]) {
            fileName = simplerFileNameMatch[1];
          }
        }
      }
      // 파일명에 .docx 확장자가 없으면 추가 (서버가 확장자 없이 파일명만 줄 경우 대비)
      if (!fileName.toLowerCase().endsWith('.docx')) {
        fileName += '.docx';
      }

      console.log(
        `2단계 성공: 파일 다운로드 준비 완료. 파일명: ${fileName}, 타입: ${contentType}`,
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('보고서가 성공적으로 다운로드되었습니다.');
      setSelectedPostIds([]);
    } catch (err: any) {
      console.error('보고서 생성 또는 다운로드 중 오류 발생:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '보고서 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      alert(`오류: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    // ... (기존 formatDate 로직 유지) ...
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    // ... (기존 로딩 UI 유지) ...
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
        활동 목록을 불러오는 중...
      </div>
    );
  }

  return (
    // ... (나머지 JSX 구조는 이전과 동일하게 유지) ...
    <div
      style={{
        padding: '40px',
        color: 'white',
        maxWidth: '800px',
        margin: 'auto',
        background: '#18181b',
        minHeight: '100vh',
      }}>
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: '20px',
          padding: '8px 15px',
          cursor: 'pointer',
          background: '#333',
          color: 'white',
          border: '1px solid #555',
          borderRadius: '4px',
        }}>
        &larr; 뒤로가기
      </button>
      <h1
        style={{
          marginBottom: '30px',
          borderBottom: '1px solid #3f3f46',
          paddingBottom: '15px',
        }}>
        보고서 추출 (모임 ID: {groupId})
      </h1>

      {error && (
        <p style={{ color: '#f87171', marginBottom: '20px' }}>오류: {error}</p>
      )}

      {activities.length === 0 && !isLoading && !error && (
        <p>이 모임에는 아직 보고할 활동이 없습니다.</p>
      )}

      {activities.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2em', marginBottom: '15px' }}>
            활동 선택:
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {activities.map((activity) => (
              <li
                key={activity.postId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 8px',
                  borderBottom: '1px solid #27272a',
                  background: selectedPostIds.includes(activity.postId)
                    ? '#2a2a30'
                    : 'transparent',
                  borderRadius: '4px',
                  marginBottom: '5px',
                }}>
                <input
                  type="checkbox"
                  id={`activity-${activity.postId}`}
                  checked={selectedPostIds.includes(activity.postId)}
                  onChange={() => handleCheckboxChange(activity.postId)}
                  style={{
                    marginRight: '15px',
                    transform: 'scale(1.2)',
                    cursor: 'pointer',
                  }}
                />
                <label
                  htmlFor={`activity-${activity.postId}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    cursor: 'pointer',
                  }}>
                  <span style={{ fontWeight: 500 }}>{activity.title}</span>
                  <span style={{ color: '#a1a1aa', fontSize: '0.9em' }}>
                    {formatDate(activity.createdAt)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activities.length > 0 && (
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating || selectedPostIds.length === 0}
          style={{
            padding: '12px 25px',
            background:
              isGenerating || selectedPostIds.length === 0 ? '#555' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor:
              isGenerating || selectedPostIds.length === 0
                ? 'not-allowed'
                : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            width: '100%',
            marginTop: '10px',
          }}>
          {isGenerating
            ? '보고서 처리 중...'
            : `선택된 활동 ${selectedPostIds.length}개로 보고서 추출 및 다운로드`}
        </button>
      )}
    </div>
  );
}
