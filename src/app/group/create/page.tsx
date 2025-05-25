'use client';
import React, { useState } from 'react';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';
import { authApi } from '@/api/api';
import { useRouter } from 'next/navigation';

const categories = [
  { label: '2025 운동크루', value: 'SPORTS' },
  { label: '스터디', value: 'STUDY' },
  { label: '소학회', value: 'CLUB' },
  { label: '기타', value: 'ETC' },
];

export default function MeetCreatePage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0].value);
  const router = useRouter();
  const handleCreate = async () => {
    try {
      const response = await authApi.post('/groups', {
        name,
        category,
      });
      console.log('모임 생성 성공:', response.data);
      alert(`모임 이름: ${name}\n카테고리: ${category}`);
      router.push('/group'); // 모임 생성 후 메인 페이지로 이동
    } catch (error) {
      console.error('모임 생성 실패:', error);
      alert('모임 생성에 실패했습니다. 다시 시도해주세요.');
    }
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
