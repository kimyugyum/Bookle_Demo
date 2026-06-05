'use client';

import { useState } from 'react';
import { Button, Input, StepShell, BookleLogo } from '@/components/ui';
import { UserData } from '@/types/onboarding';

interface SignupStepProps {
  onNext: (data: Pick<UserData, 'name' | 'email' | 'password'>) => void;
  onBack: () => void;
}

export function SignupStep({ onNext, onBack }: SignupStepProps) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = '이름을 입력해주세요';
    if (!form.email.includes('@')) e.email = '올바른 이메일을 입력해주세요';
    if (form.password.length < 8) e.password = '비밀번호는 8자 이상이어야 합니다';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext(form);
  };

  return (
    <StepShell step={1} totalSteps={5} onBack={onBack}
      stepLabels={['회원가입', '인증', '취향', '책 등록', '매칭']}
    >
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-col items-center text-center space-y-1">
          <h2 className="text-xl font-bold text-[#111827]">계정 만들기</h2>
          <p className="text-sm text-[#6B7280]">독서 여정을 함께 시작해요</p>
        </div>

        <div className="space-y-4">
          <Input
            label="이름"
            placeholder="홍길동"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />
          <Input
            label="이메일"
            type="email"
            placeholder="hello@bookle.kr"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            label="비밀번호"
            type={showPw ? 'text' : 'password'}
            placeholder="8자 이상 입력"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            hint="영문, 숫자, 특수문자 조합을 권장합니다"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="text-[#9CA3AF] hover:text-[#374151] transition-colors"
              >
                {showPw ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            }
          />
        </div>

        {/* Password strength */}
        {form.password.length > 0 && (
          <div className="space-y-1 animate-fade-in">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      form.password.length >= i * 3
                        ? i <= 2
                          ? '#F59E0B'
                          : '#1A6B3C'
                        : '#E5E7EB',
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-[#9CA3AF]">
              {form.password.length < 6
                ? '더 강한 비밀번호를 사용하세요'
                : form.password.length < 10
                ? '적당한 강도입니다'
                : '강한 비밀번호입니다 👍'}
            </p>
          </div>
        )}

        <Button size="lg" onClick={handleSubmit}>
          다음
        </Button>

        <p className="text-center text-xs text-[#9CA3AF]">
          가입 시{' '}
          <span className="text-[#1A6B3C] underline cursor-pointer">이용약관</span>
          {' '}및{' '}
          <span className="text-[#1A6B3C] underline cursor-pointer">개인정보 처리방침</span>
          에 동의합니다
        </p>
      </div>
    </StepShell>
  );
}
