'use client';

import { Button, BookleLogo } from '@/components/ui';
import { UserData } from '@/types/onboarding';

interface CompleteScreenProps {
  userData: UserData;
  onGoHome: () => void;
}

const TIPS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    text: '교환 요청이 도착하면 알림을 보내드려요.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    text: '독서 커뮤니티에 참여해 보세요.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    text: '독서 챌린지로 책 읽는 습관을 만들어요.',
  },
];

export function CompleteScreen({ userData, onGoHome }: CompleteScreenProps) {
  return (
    <div className="min-h-screen bg-[#1A6B3C] flex flex-col items-center justify-center p-8 text-center">
      <div className="space-y-8 animate-scale-in w-full max-w-sm">

        {/* Logo + celebration */}
        <div className="flex flex-col items-center space-y-4">
          {/* Checkmark circle */}
          <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-white">
              환영해요, {userData.name || '회원'}님!
            </h1>
            <p className="text-[#A8D5B8]">Bookle 가입이 완료됐어요</p>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-5 border border-white/20 text-left space-y-3">
          <p className="text-white font-semibold text-sm">가입 완료 정보</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#A8D5B8]">이메일</span>
              <span className="text-white font-medium">{userData.email || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A8D5B8]">관심 장르</span>
              <span className="text-white font-medium">{userData.genres.length}개 선택</span>
            </div>
            {userData.book && (
              <div className="flex justify-between text-sm">
                <span className="text-[#A8D5B8]">등록 도서</span>
                <span className="text-white font-medium">{userData.book.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Next steps */}
        <div className="space-y-3 text-left">
          {TIPS.map((tip) => (
            <div key={tip.text} className="flex items-start gap-3 text-[#A8D5B8]">
              {tip.icon}
              <span className="text-xs leading-relaxed">{tip.text}</span>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          onClick={onGoHome}
          className="bg-white text-[#1A6B3C] hover:bg-[#F0FFF4] font-bold w-full"
        >
          Bookle 시작하기
        </Button>
      </div>
    </div>
  );
}
