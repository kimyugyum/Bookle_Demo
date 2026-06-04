'use client';

import { useState } from 'react';
import { Button, Input, StepShell, BookleLogo } from '@/components/ui';
import { cn } from '@/lib/utils';
import { BookData } from '@/types/onboarding';

interface RegisterBookStepProps {
  onNext: (book: BookData) => void;
  onBack: () => void;
}

const CONDITIONS: { value: BookData['condition']; label: string; desc: string; color: string }[] = [
  { value: 'A', label: '최상', desc: '새 책과 동일한 상태', color: 'green' },
  { value: 'B', label: '상', desc: '약간의 사용감, 훼손 없음', color: 'amber' },
  { value: 'C', label: '중', desc: '눈에 띄는 사용감 있음', color: 'orange' },
];

const POPULAR_BOOKS = [
  { title: '불편한 편의점', author: '김호연', emoji: '🏪' },
  { title: '채식주의자', author: '한강', emoji: '🥦' },
  { title: '코스모스', author: '칼 세이건', emoji: '🌌' },
  { title: '아몬드', author: '손원평', emoji: '🌰' },
];

export function RegisterBookStep({ onNext, onBack }: RegisterBookStepProps) {
  const [form, setForm] = useState<BookData>({
    title: '',
    author: '',
    condition: 'A',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookData, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = '책 제목을 입력해주세요';
    if (!form.author.trim()) e.author = '저자명을 입력해주세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <StepShell step={5} totalSteps={5} onBack={onBack}
      stepLabels={['회원가입', '인증', '취향', '책 등록', '매칭']}
    >
      <div className="space-y-5 animate-fade-in-up">
        <div className="space-y-1">
          <BookleLogo size="sm" />
          <h2 className="text-xl font-bold text-[#111827]">첫 번째 책 등록</h2>
          <p className="text-sm text-[#6B7280]">교환하고 싶은 책을 등록하면 AI 매칭이 시작돼요</p>
        </div>

        {/* Quick select */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#6B7280]">인기 도서에서 빠르게 선택</p>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_BOOKS.map((b) => (
              <button
                key={b.title}
                onClick={() => setForm({ ...form, title: b.title, author: b.author })}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left',
                  form.title === b.title
                    ? 'border-[#1A6B3C] bg-[#E8F5EE]'
                    : 'border-[#E5E7EB] hover:border-[#A8D5B8]'
                )}
              >
                <span className="text-xl">{b.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-[#111827] leading-tight">{b.title}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{b.author}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-[#9CA3AF]">또는 직접 입력</span>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          <Input
            label="책 제목"
            placeholder="교환할 책의 제목"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={errors.title}
          />
          <Input
            label="저자"
            placeholder="저자명"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            error={errors.author}
          />

          {/* Condition */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#374151]">책 상태</label>
            <div className="flex gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setForm({ ...form, condition: c.value })}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl border-2 text-center transition-all',
                    form.condition === c.value
                      ? 'border-[#1A6B3C] bg-[#E8F5EE]'
                      : 'border-[#E5E7EB] hover:border-[#A8D5B8]'
                  )}
                >
                  <p className={cn(
                    'text-sm font-bold',
                    form.condition === c.value ? 'text-[#1A6B3C]' : 'text-[#374151]'
                  )}>
                    {c.label}
                  </p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5 px-1">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#374151]">
              한 줄 소개 <span className="text-[#9CA3AF] font-normal">(선택)</span>
            </label>
            <textarea
              rows={2}
              placeholder="이 책에 대한 짧은 소개나 소감을 남겨보세요"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-[#E5E7EB] p-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] resize-none focus:border-[#1A6B3C] focus:ring-2 focus:ring-[#1A6B3C]/15 transition-all"
            />
          </div>
        </div>

        <Button
          size="lg"
          onClick={() => { if (validate()) onNext(form); }}
        >
          AI 매칭 시작하기 🤖
        </Button>
      </div>
    </StepShell>
  );
}
