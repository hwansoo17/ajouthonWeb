'use client';
import { api } from '@/api/api';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import React, { useState } from 'react';

const SignUpPage: React.FC = () => {
  const [form, setForm] = useState({
    memberId: '',
    password: '',
    confirmPassword: '',
    name: '',
    studentId: '',
    department: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await api.post('auth/signup', {
        email: form.memberId,
        password: form.password,
        name: form.name,
        studentId: form.studentId,
        department: form.department,
        phoneNumber: form.phone,
      });
      console.log('회원가입 성공:', response.data);
    } catch (err) {
      console.error('회원가입 실패:', err);
    }
    alert('회원가입이 완료되었습니다!');
  };

  return (
    <div
      style={{
        background: '#18181b',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#23232a',
          borderRadius: '16px',
          minWidth: '340px',
          maxWidth: '90vw',
          boxShadow: '0 4px 24px rgba(0,0,0,0.24)',
          padding: '40px 32px',
          color: '#f4f4f5',
        }}>
        <h2 style={{ marginBottom: 24, color: '#f4f4f5', textAlign: 'center' }}>
          회원가입
        </h2>
        <FormInput
          label="이름"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <FormInput
          label="학번"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          required
        />
        <FormInput
          label="학과"
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        />
        <FormInput
          label="전화번호"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="010-1234-5678"
        />
        <FormInput
          label="아이디"
          name="memberId"
          value={form.memberId}
          onChange={handleChange}
          required
        />
        <FormInput
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <FormInput
          label="비밀번호 확인"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        {error && (
          <div
            style={{
              color: '#f87171',
              marginBottom: 16,
              textAlign: 'center',
            }}>
            {error}
          </div>
        )}
        <Button title={'회원가입'} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default SignUpPage;
