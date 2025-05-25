// ActivityCard.tsx
'use client';
import React, { useState } from 'react'; // useState 임포트
// Activity 타입은 HomePage.tsx에서 정의한 AppActivity와 일치해야 합니다.
// 여기서는 HomePage에서 AppActivity를 export 하고, data.ts 대신 그것을 사용한다고 가정하거나,
// Activity 타입이 AppActivity와 동일한 구조를 가진다고 가정합니다.
// 만약 '../data'에 있는 Activity 타입이 다르다면, props 타입을 AppActivity로 맞춰주세요.
import { AppActivity as Activity } from '../HomePage'; // HomePage에서 AppActivity 타입을 가져온다고 가정

interface ActivityCardProps {
  activity: Activity; // HomePage로부터 전달받는 AppActivity 타입
}

const CONTENT_MAX_LENGTH = 1000; // 최대 글자 수 정의

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  // `activity` 객체에서 `createdAt`은 날짜 표시에 사용, `content`는 내용 표시에 사용
  const { title, createdAt, content, photos, participants } = activity;
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const isContentTruncatable = content && content.length > CONTENT_MAX_LENGTH;

  const displayedContent =
    isContentTruncatable && !isContentExpanded
      ? `${content.substring(0, CONTENT_MAX_LENGTH)}...`
      : content;

  const toggleContentExpansion = () => {
    setIsContentExpanded(!isContentExpanded);
  };

  return (
    <div
      style={{
        background: '#27272a',
        borderRadius: '16px',
        border: '1px solid #3f3f46',
        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
        padding: '24px',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%', // 부모 컴포넌트(ActivityFeed)에 의해 너비가 제어됨
        margin: '0 auto',
      }}>
      {/* 카드 헤더: 제목과 날짜 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '12px',
          borderBottom: '1px solid #3f3f46',
        }}>
        <h3
          style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 700,
            color: '#e4e4e7',
          }}>
          {title}
        </h3>
        {/* createdAt은 AppActivity에 원본 날짜 문자열로 존재해야 합니다. */}
        {/* HomePage에서 매핑 시 date (포맷된 문자열) 와 createdAt (원본)을 모두 AppActivity에 포함시켰습니다. */}
        {/* 여기서는 createdAt을 사용해 포맷팅하는 것으로 유지. 만약 AppActivity의 'date'를 사용하려면 activity.date로 변경 */}
        <span style={{ fontSize: '14px', color: '#a1a1aa' }}>
          {new Date(createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* 사진 갤러리 (기존 코드 유지) */}
      {photos && photos.length > 0 && (
        <div
          className="photo-gallery"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${
              photos.length === 1 ? '100%' : '200px'
            }, 1fr))`,
            gap: '10px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
          {photos.map((photo, index) => (
            <img
              key={photo.id || `photo-${index}`}
              src={
                photo.url || 'https://via.placeholder.com/300x200?text=No+Image'
              }
              alt={`${title} 사진 ${index + 1}`}
              style={{
                width: '100%',
                height: photos.length === 1 ? 'auto' : '200px',
                maxHeight: '450px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          ))}
        </div>
      )}

      {/* 내용 */}
      {content && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
          }}>
          <h4
            style={{
              fontSize: '18px',
              color: '#a1a1aa',
              marginBottom: '8px',
              fontWeight: 500,
            }}>
            활동 내용:
          </h4>
          <p
            style={{
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              margin: 0,
              color: '#f4f4f5',
              lineHeight: 1.6,
            }}>
            {displayedContent}
          </p>
          {/* 더보기/간략히 보기 버튼 */}
          {isContentTruncatable && (
            <button
              onClick={toggleContentExpansion}
              style={{
                background: 'none',
                border: 'none',
                color: '#a78bfa', // Tailwind violet-400 (예시 색상)
                cursor: 'pointer',
                padding: '0', // 버튼 자체 패딩 제거
                marginTop: '10px', // 내용과의 간격
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '600',
                alignSelf: 'flex-start', // 왼쪽 정렬된 버튼
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.textDecoration = 'underline')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.textDecoration = 'none')
              }>
              {isContentExpanded ? '간략히 보기' : '더보기'}
            </button>
          )}
        </div>
      )}

      {/* 참여자 목록 (기존 코드 유지) */}
      {participants && participants.length > 0 && (
        <div style={{ paddingTop: '12px', borderTop: '1px solid #3f3f46' }}>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
            {participants.map((participant) => (
              <li
                key={participant.id}
                style={{
                  background: '#3f3f46',
                  color: '#e4e4e7',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}>
                {participant.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
