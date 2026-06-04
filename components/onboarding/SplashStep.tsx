'use client';

import { Button } from '@/components/ui';

interface SplashStepProps {
  onNext: () => void;
}

export function SplashStep({ onNext }: SplashStepProps) {
  return (
    <div className="min-h-screen bg-[#1A6B3C] flex flex-col items-center justify-between p-8">
      {/* Top label */}
      <div className="w-full flex justify-end pt-2">
        <span className="text-[#A8D5B8] text-xs font-medium tracking-widest uppercase">
          C2C 독서 플랫폼
        </span>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center gap-8 animate-fade-in-up">
        {/* Logo mark */}
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-6xl font-black text-white tracking-tighter">B</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#F0C040] flex items-center justify-center">
            <span className="text-sm">📚</span>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-black text-white tracking-tight">
            Bookle
          </h1>
          <p className="text-[#A8D5B8] text-lg font-light tracking-wide">
            책이 연결하는 사람들의 이야기
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {['C2C 책 교환', 'AI 취향 매칭', '독서 커뮤니티', '텍스트힙'].map(
            (f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium"
              >
                {f}
              </span>
            )
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-xs space-y-3 animate-fade-in delay-300">
        <Button
          size="lg"
          onClick={onNext}
          className="bg-white text-[#1A6B3C] hover:bg-[#F0FFF4] font-bold text-base shadow-2xl"
        >
          시작하기
        </Button>
        <p className="text-center text-[#A8D5B8] text-xs">
          이미 계정이 있으신가요?{' '}
          <span className="text-white underline cursor-pointer">로그인</span>
        </p>
      </div>
    </div>
  );
}
