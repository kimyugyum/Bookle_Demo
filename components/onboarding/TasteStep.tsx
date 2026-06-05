'use client';

import { useState } from 'react';
import { Button, StepShell, BookleLogo } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TasteStepProps {
  onNext: (genres: string[]) => void;
  onBack: () => void;
}

const GENRES = [
  { id: 'fiction', label: '소설', emoji: '📖', desc: '현대소설, 고전문학' },
  { id: 'selfhelp', label: '자기계발', emoji: '🚀', desc: '성장, 동기부여' },
  { id: 'science', label: '과학/기술', emoji: '🔬', desc: 'IT, 우주, 생물학' },
  { id: 'history', label: '역사/인문', emoji: '🏛️', desc: '역사, 철학, 사상' },
  { id: 'economy', label: '경제/경영', emoji: '📊', desc: '비즈니스, 투자' },
  { id: 'essay', label: '에세이', emoji: '✍️', desc: '수필, 산문' },
  { id: 'art', label: '예술/문화', emoji: '🎨', desc: '미술, 음악, 영화' },
  { id: 'kids', label: '어린이/청소년', emoji: '🧸', desc: '동화, 그림책' },
  { id: 'comic', label: '만화/그래픽', emoji: '🎭', desc: '웹툰, 코믹스' },
  { id: 'travel', label: '여행/취미', emoji: '🌏', desc: '여행, 요리, 스포츠' },
  { id: 'poetry', label: '시/희곡', emoji: '🌸', desc: '시집, 희곡' },
  { id: 'mystery', label: '추리/스릴러', emoji: '🔍', desc: '미스터리, 범죄' },
];

export function TasteStep({ onNext, onBack }: TasteStepProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((g) => g !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev
    );
  };

  return (
    <StepShell step={3} totalSteps={5} onBack={onBack}
      stepLabels={['회원가입', '인증', '취향', '책 등록', '매칭']}
    >
      <div className="space-y-5 animate-fade-in-up">
        <div className="flex flex-col items-center text-center space-y-1">
          <h2 className="text-xl font-bold text-[#111827]">독서 취향 설정</h2>
          <p className="text-sm text-[#6B7280]">
            관심 장르를 선택하면 AI가 딱 맞는 교환 상대를 찾아드려요
          </p>
        </div>

        {/* Selection counter */}
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-[#6B7280]">최대 5개 선택</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  i <= selected.length
                    ? 'bg-[#1A6B3C] scale-110'
                    : 'bg-[#E5E7EB]'
                )}
              />
            ))}
          </div>
        </div>

        {/* Genre grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {GENRES.map((genre) => {
            const isSelected = selected.includes(genre.id);
            return (
              <button
                key={genre.id}
                onClick={() => toggle(genre.id)}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 text-left',
                  'active:scale-95',
                  isSelected
                    ? 'border-[#1A6B3C] bg-[#E8F5EE] shadow-md shadow-green-900/10'
                    : 'border-[#E5E7EB] bg-white hover:border-[#A8D5B8] hover:bg-[#F0FFF4]'
                )}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#1A6B3C] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <span className="text-2xl">{genre.emoji}</span>
                <span className={cn(
                  'text-xs font-semibold',
                  isSelected ? 'text-[#1A6B3C]' : 'text-[#374151]'
                )}>
                  {genre.label}
                </span>
                <span className="text-[10px] text-[#9CA3AF] text-center leading-tight">
                  {genre.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* AI note */}
        {selected.length >= 2 && (
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#E8F5EE] border border-[#A8D5B8] animate-scale-in">
            <span className="text-lg mt-0.5">🤖</span>
            <div>
              <p className="text-xs font-semibold text-[#1A6B3C]">AI 매칭 준비 완료</p>
              <p className="text-xs text-[#4B9E6A] mt-0.5">
                선택한 {selected.length}개 장르를 기반으로 최적의 교환 상대를 찾을게요!
              </p>
            </div>
          </div>
        )}

        <Button
          size="lg"
          disabled={selected.length === 0}
          onClick={() => onNext(selected)}
        >
          {selected.length === 0
            ? '장르를 선택해 주세요'
            : `${selected.length}개 선택 완료 · 다음`}
        </Button>
      </div>
    </StepShell>
  );
}
