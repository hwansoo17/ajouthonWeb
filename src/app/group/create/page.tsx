'use client';
import React, { useState } from 'react';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';

const categories = [
  { label: '운동', value: 'exercise' },
  { label: '스터디', value: 'study' },
  { label: '동아리', value: 'club' },
];

export default function MeetCreatePage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0].value);

  const handleCreate = () => {
    // TODO: 모임 생성 로직 추가
    alert(`모임 이름: ${name}\n카테고리: ${category}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#18181b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#23232a',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.24)',
          padding: '40px 32px',
          minWidth: '340px',
          maxWidth: '90vw',
          color: '#f4f4f5',
          gap: '20px',
        }}>
        <h1 style={{ color: '#f4f4f5', marginBottom: 0 }}>모임 생성</h1>
        <FormInput
          label="모임 이름"
          value={name}
          name="meetName"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div style={{ margin: '0 0 8px 0' }}>
          <label style={{ display: 'block', marginBottom: 8 }}>카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #27272a',
              background: '#18181b',
              color: '#f4f4f5',
              outline: 'none',
            }}>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <Button title="모임 생성하기" onClick={handleCreate} />
      </div>
    </div>
  );
}
