// ActivityFeed.tsx
'use client';
import React from 'react';
import { Activity } from '../data'; // data.ts에서 import
import ActivityCard from './ActivityCard';

interface ActivityFeedProps {
  activities: Activity[];
  groupName: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  groupName,
}) => {
  if (!activities || activities.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: '#a1a1aa',
          marginTop: '50px',
          padding: '20px',
        }}>
        <h2 style={{ color: '#e4e4e7', marginBottom: '12px' }}>{groupName}</h2>
        <p style={{ fontSize: '18px' }}>아직 등록된 활동이 없습니다. 😥</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        padding: '20px 0',
      }}>
      {activities.map((activity) => (
        <ActivityCard key={activity.activityId} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityFeed;
