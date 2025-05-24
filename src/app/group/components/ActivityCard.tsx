// ActivityCard.tsx
'use client';
import React from 'react';
import { Activity } from '../data'; // data.ts에서 import

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { title, createdAt, content, photos, participants } = activity;

  return (
    <div
      style={{
        background: '#27272a', // 카드 배경
        borderRadius: '16px',
        border: '1px solid #3f3f46',
        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
        padding: '24px',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px', // 내부 요소 간 간격
        width: '100%',
        margin: '0 auto', // 중앙 정렬 (피드가 카드보다 넓을 경우)
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
        <span style={{ fontSize: '14px', color: '#a1a1aa' }}>
          {new Date(createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
      {/* 사진 갤러리 */}
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
            overflow: 'hidden', // 사진 모서리 둥글게
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
                height: photos.length === 1 ? 'auto' : '200px', // 단일 사진은 자동 높이, 여러 개는 고정 높이
                maxHeight: '450px',
                objectFit: 'cover', // 이미지 비율 유지하며 채우기
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
            // 이 div는 제목(h4)과 내용 단락(p)을 위한 컨테이너입니다.
            display: 'flex', // 제목과 내용을 수직으로 배치하기 위해 유지
            width: '100%',
            flexDirection: 'column',
            // whiteSpace: 'pre-wrap', // 이 스타일은 실제 텍스트를 감싸는 요소로 이동
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
          {/* 내용을 별도의 <p> 태그로 감싸고 여기에 스타일 적용 */}
          <p
            style={{
              whiteSpace: 'pre-wrap', // 공백/줄바꿈 유지, 필요시 자동 줄바꿈
              overflowWrap: 'break-word', // 긴 단어가 넘칠 경우 강제로 줄바꿈
              margin: 0, // <p> 태그의 기본 마진 제거 (필요시)
              color: '#f4f4f5', // 내용 텍스트 색상 (부모로부터 상속받지만 명시 가능)
              lineHeight: 1.6, // 가독성을 위한 줄 간격 (선택 사항)
            }}>
            {content}
          </p>
        </div>
      )}

      {/* 참여자 목록 */}
      {participants && participants.length > 0 && (
        <div style={{ paddingTop: '12px', borderTop: '1px solid #3f3f46' }}>
          <h4
            style={{
              fontSize: '15px',
              color: '#a1a1aa',
              marginBottom: '10px',
              fontWeight: 500,
            }}>
            참여자:
          </h4>
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
