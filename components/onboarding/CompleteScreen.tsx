'use client';

import { Button } from '@/components/ui';
import { UserData } from '@/types/onboarding';

interface CompleteScreenProps {
  userData: UserData;
  onGoHome: () => void;
}

export function CompleteScreen({ userData, onGoHome }: CompleteScreenProps) {
  return (
    <div className="min-h-screen bg-[#1A6B3C] flex flex-col items-center justify-center p-8 text-center">
      <div className="space-y-8 animate-scale-in">
        {/* Celebration */}
        <div className="space-y-2">
          <div className="text-7xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-white">
            환영해요, {userData.name}님!
          </h1>
          <p className="text-[#A8D5B8] text-lg">Bookle 가입이 완료됐어요</p>
        </div>

        {/* Summary card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/20 text-left space-y-3 max-w-sm w-full">
          <p className="text-white font-semibold text-sm">가입 완료 정보</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#A8D5B8]">이메일</span>
              <span className="text-white font-medium">{userData.email}</span>
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
        <div className="space-y-2 max-w-xs w-full">
          {[
            '📬 교환 요청이 도착하면 알림을 보내드려요',
            '👥 독서 커뮤니티에 참여해 보세요',
            '📖 독서 챌린지로 책 읽는 습관을 만들어요',
          ].map((tip) => (
            <div key={tip} className="flex items-start gap-2 text-left">
              <span className="text-[#A8D5B8] text-xs leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          onClick={onGoHome}
          className="bg-white text-[#1A6B3C] hover:bg-[#F0FFF4] font-bold max-w-xs w-full"
        >
          Bookle 시작하기 →
        </Button>
      </div>
    </div>
  );
}
