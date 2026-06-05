'use client';

import { useState, useEffect } from 'react';
import { Button, BookleLogo, BookCover } from '@/components/ui';
import { cn } from '@/lib/utils';
import { UserData, MatchedUser } from '@/types/onboarding';

interface MatchingStepProps {
  userData: UserData;
  onComplete: () => void;
}

const MOCK_MATCHES: MatchedUser[] = [
  { name: '박민준', avatar: '박', book: '채식주의자',      author: '한강',    matchScore: 94, genres: ['소설', '에세이', '역사/인문'], reviewCount: 12 },
  { name: '이수연', avatar: '이', book: '불편한 편의점 2', author: '김호연',  matchScore: 87, genres: ['소설', '자기계발'],             reviewCount: 8  },
  { name: '김태호', avatar: '김', book: '코스모스',        author: '칼 세이건', matchScore: 81, genres: ['과학/기술', '역사/인문'],      reviewCount: 24 },
];

const AVATAR_COLORS = ['#7C3AED', '#DB2777', '#0284C7'];

type Phase = 'analyzing' | 'found' | 'detail';

// ── SVG icons ──────────────────────────────────────────────
const IconSparkle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const IconBook = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const IconArrows = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
  </svg>
);

export function MatchingStep({ userData, onComplete }: MatchingStepProps) {
  const [phase, setPhase] = useState<Phase>('analyzing');
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<MatchedUser | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (phase !== 'analyzing') return;
    const steps = [
      { pct: 20, delay: 400 },
      { pct: 45, delay: 900 },
      { pct: 70, delay: 1500 },
      { pct: 90, delay: 2100 },
      { pct: 100, delay: 2600 },
    ];
    const timers = steps.map(({ pct, delay }) => setTimeout(() => setProgress(pct), delay));
    const done = setTimeout(() => setPhase('found'), 3000);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [phase]);

  const handleRequest = async () => {
    setRequested(true);
    await new Promise((r) => setTimeout(r, 600));
    onComplete();
  };

  // ── ANALYZING ──────────────────────────────
  if (phase === 'analyzing') {
    const steps = [
      { label: '독서 취향 분석 중',  done: progress >= 45  },
      { label: '보유 도서 인덱싱',   done: progress >= 70  },
      { label: '매칭 후보군 탐색',   done: progress >= 90  },
      { label: '최적 매칭 선정',     done: progress >= 100 },
    ];
    return (
      <div className="min-h-screen bg-[#1A6B3C] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-white/20 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <IconSparkle />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">AI 매칭 중</h2>
            <p className="text-[#A8D5B8]">{userData.name || '회원'}님의 취향을 분석하고 있어요</p>
          </div>

          <div className="space-y-2 px-4">
            <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-white transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[#A8D5B8] text-sm font-mono">{progress}%</p>
          </div>

          <div className="space-y-2 px-4 text-left">
            {steps.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className={cn('w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300', s.done ? 'bg-white' : 'bg-white/20')}>
                  {s.done && (
                    <svg className="w-3 h-3 text-[#1A6B3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={cn('text-sm transition-all', s.done ? 'text-white font-medium' : 'text-white/50')}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── MATCH LIST ──────────────────────────────
  if (phase === 'found' && !selected) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4">
        <div className="w-full max-w-md mx-auto space-y-5 animate-fade-in-up">
          <div className="pt-4 flex flex-col items-center text-center space-y-1">
            <BookleLogo size="sm" className="mb-3" />
            <h2 className="text-xl font-bold text-[#111827]">매칭 완료!</h2>
            <p className="text-sm text-[#6B7280]">{userData.name || '회원'}님과 잘 맞는 3명을 찾았어요</p>
          </div>

          {userData.book && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#E8F5EE] border border-[#A8D5B8]">
              <BookCover title={userData.book.title} author={userData.book.author} size="xs" />
              <div>
                <p className="text-xs text-[#4B9E6A] font-medium">내가 등록한 책</p>
                <p className="text-sm font-bold text-[#1A6B3C]">{userData.book.title}</p>
                <p className="text-xs text-[#4B9E6A]">{userData.book.author}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {MOCK_MATCHES.map((match, idx) => (
              <button
                key={match.name}
                onClick={() => { setSelected(match); setSelectedIdx(idx); }}
                className="w-full text-left p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#1A6B3C] hover:shadow-md transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ backgroundColor: AVATAR_COLORS[idx] }}>
                    {match.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827]">{match.name}</span>
                      <div className="flex items-center gap-1 bg-[#E8F5EE] px-2 py-0.5 rounded-full">
                        <span className="text-xs font-bold text-[#1A6B3C]">{match.matchScore}%</span>
                        <span className="text-xs text-[#4B9E6A]">매칭</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[#374151]">
                      <IconBook className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      <span className="text-sm font-medium">{match.book}</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{match.author}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {match.genres.map((g) => (
                        <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">{g}</span>
                      ))}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">거래 {match.reviewCount}회</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[#D1D5DB] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <Button variant="ghost" size="lg" onClick={onComplete}>나중에 매칭하기</Button>
        </div>
      </div>
    );
  }

  // ── MATCH DETAIL ──────────────────────────────
  if (selected) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4">
        <div className="w-full max-w-md mx-auto space-y-5 animate-scale-in">
          <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151] pt-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            매칭 목록으로
          </button>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden">
            <div className="bg-[#1A6B3C] p-6 text-center space-y-3">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mx-auto" style={{ backgroundColor: AVATAR_COLORS[selectedIdx] }}>
                {selected.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="px-3 py-1 bg-white/20 rounded-full">
                    <span className="text-sm font-bold text-white">{selected.matchScore}% 매칭</span>
                  </div>
                  <span className="text-[#A8D5B8] text-sm">거래 {selected.reviewCount}회</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F9FAFB]">
                <BookCover title={selected.book} author={selected.author} size="xs" />
                <div>
                  <p className="text-xs text-[#9CA3AF] mb-0.5">교환 희망 도서</p>
                  <p className="font-bold text-[#111827]">{selected.book}</p>
                  <p className="text-sm text-[#6B7280]">{selected.author}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#9CA3AF] mb-2">관심 장르</p>
                <div className="flex gap-2 flex-wrap">
                  {selected.genres.map((g) => (
                    <span key={g} className="px-3 py-1 rounded-full bg-[#E8F5EE] text-[#1A6B3C] text-xs font-medium">{g}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-[#E5E7EB]">
                <div className="flex-1 text-center">
                  <p className="text-xs text-[#9CA3AF]">내 책</p>
                  <p className="text-sm font-bold text-[#111827] mt-0.5">{userData.book?.title ?? '—'}</p>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <IconArrows />
                  <span className="text-[10px] text-[#9CA3AF]">교환</span>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-[#9CA3AF]">상대 책</p>
                  <p className="text-sm font-bold text-[#111827] mt-0.5">{selected.book}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <IconWallet />
                <div>
                  <p className="text-xs font-semibold text-amber-700">보증금 안내</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    교환 완료 시 책값의 1%가 보증금으로 예치되며, 정상 거래 완료 후 전액 환급됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button size="lg" loading={requested} onClick={handleRequest}>교환 요청 보내기</Button>
          <Button variant="ghost" size="lg" onClick={() => setSelected(null)}>다른 매칭 보기</Button>
        </div>
      </div>
    );
  }

  return null;
}
