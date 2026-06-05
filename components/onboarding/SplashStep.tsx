'use client';

import Image from 'next/image';
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
      <div className="flex flex-col items-center gap-6 animate-fade-in-up">
        {/* Logo image */}
        <Image
          src="/logo.png"
          alt="Bookle"
          width={280}
          height={158}
          priority
          className="drop-shadow-2xl"
        />

        <p className="text-[#A8D5B8] text-lg font-light tracking-wide">
          책이 연결하는 사람들의 이야기
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {['C2C 책 교환', 'AI 취향 매칭', '독서 커뮤니티', '텍스트힙'].map((f) => (
            <span
              key={f}
              className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium"
            >
              {f}
            </span>
          ))}
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
