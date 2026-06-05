'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SplashStepProps {
  onNext: () => void;
}

export function SplashStep({ onNext }: SplashStepProps) {
  const [logoReady, setLogoReady] = useState(false);

  return (
    <div className="min-h-screen bg-[#1A6B3C] flex flex-col items-center">

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">

        {/* Logo */}
        <div className={logoReady ? 'animate-logo-loop' : 'animate-logo-entrance'}>
          <Image
            src="/logo-v2.png"
            alt="Bookle"
            width={160}
            height={90}
            priority
            onLoad={() => setTimeout(() => setLogoReady(true), 600)}
          />
        </div>

        {/* Tagline */}
        <div className="text-center space-y-1.5 animate-fade-in-up">
          <p className="text-white text-lg font-semibold">
            책이 연결하는 사람들의 이야기
          </p>
          <p className="text-[#A8D5B8] text-sm font-normal">
            취향 맞는 사람과 책을 교환해보세요
          </p>
        </div>
      </div>

      {/* Bottom CTA — pinned */}
      <div className="w-full px-6 pb-12 space-y-3 animate-fade-in delay-300">
        <button
          onClick={onNext}
          className="w-full h-14 rounded-2xl bg-white font-bold text-base text-[#1A6B3C] active:scale-[0.98] transition-transform"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          시작하기
        </button>
        <p className="text-center text-sm text-[#A8D5B8]">
          이미 계정이 있으신가요?{' '}
          <span className="text-white font-semibold cursor-pointer">로그인</span>
        </p>
      </div>
    </div>
  );
}
