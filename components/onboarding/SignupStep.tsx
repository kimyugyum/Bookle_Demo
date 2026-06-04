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
    <StepShell step={2} totalSteps={5} onBack={onBack}
      stepLabels={['회원가입', '인증', '취향', '책 등록', '매칭']}
    >
      <div className="space-y-6 animate-fade-in-up">
        <div className="space-y-1">
          <BookleLogo size="sm" />
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
                className="text-[#9CA3AF] hover:text-[#374151] text-xs transition-colors"
              >
                {showPw ? '숨기기' : '보기'}
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
