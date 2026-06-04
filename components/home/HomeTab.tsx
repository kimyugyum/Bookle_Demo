'use client';

import { useState } from 'react';
import { Bell, Search, ChevronRight, TrendingUp, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { completionSteps, completionPct, genreLabels, GENRE_LABELS } from '@/lib/user-store';
import { BookCover } from '@/components/ui/BookCover';
import type { AppTab } from '@/types/app';
import type { UserData } from '@/types/onboarding';

interface HomeTabProps {
  user: UserData | null;
  isFirstVisit: boolean;
  onTabChange: (tab: AppTab) => void;
}

const ALL_BOOKS = [
  { title: '채식주의자', author: '한강', genre: '소설', available: 3 },
  { title: '아몬드', author: '손원평', genre: '소설', available: 2 },
  { title: '미드나잇 라이브러리', author: '매트 헤이그', genre: '소설', available: 2 },
  { title: '코스모스', author: '칼 세이건', genre: '과학/기술', available: 1 },
  { title: '사피엔스', author: '유발 하라리', genre: '역사/인문', available: 4 },
  { title: '돈의 심리학', author: '모건 하우절', genre: '경제/경영', available: 1 },
  { title: '82년생 김지영', author: '조남주', genre: '소설', available: 2 },
  { title: '어린왕자', author: '생텍쥐페리', genre: '소설', available: 5 },
];

const COMMUNITY_PREVIEWS = [
  { author: '박민준', avatar: '🧑‍💻', title: '"채식주의자" 읽고 생각이 많아졌어요', likes: 42, time: '1시간 전', category: '서평' },
  { author: '정유진', avatar: '👩‍🎓', title: '독서 슬럼프 극복 방법 공유합니다', likes: 61, time: '2일 전', category: '독서팁' },
];

const WELCOME_AVATARS = [
  { avatar: '🧑‍💻', name: '박민준' },
  { avatar: '👩‍🎨', name: '이수연' },
  { avatar: '🧑‍🔬', name: '김태호' },
];

export function HomeTab({ user, isFirstVisit, onTabChange }: HomeTabProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const userGenreNames = (user?.genres ?? []).map((id) => GENRE_LABELS[id]).filter(Boolean);
  const userGenreDisplay = genreLabels(user?.genres ?? []);
  const pct = completionPct(user);
  const steps = completionSteps(user);
  const nextStep = steps.find((s) => !s.done);

  const matchingBooks = ALL_BOOKS.filter((b) => userGenreNames.includes(b.genre));
  const otherBooks = ALL_BOOKS.filter((b) => !userGenreNames.includes(b.genre));
  const displayBooks =
    user && matchingBooks.length > 0
      ? [...matchingBooks, ...otherBooks].slice(0, 5)
      : ALL_BOOKS.slice(0, 5);

  const matchingUserCount = Math.min(3 + userGenreDisplay.length, 8);
  const name = user?.name || '독서인';
  const showWelcomeBanner = isFirstVisit && !bannerDismissed && !!user;
  const sectionTitle =
    userGenreDisplay.length > 0
      ? `${userGenreDisplay.slice(0, 2).join(' · ')} 취향 추천`
      : '이번 주 인기 교환 도서';

  return (
    <div>
      {/* Green header */}
      <div className="bg-[#1A6B3C] px-5 pt-14 pb-8">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[#A8D5B8] text-sm">안녕하세요 👋</p>
            <h1 className="text-white text-xl font-bold mt-0.5">{name}님</h1>
          </div>
          <button className="relative mt-1">
            <Bell size={22} className="text-white" />
            {user && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-400 text-white text-[9px] flex items-center justify-center font-bold">
                2
              </div>
            )}
          </button>
        </div>
        <button
          onClick={() => onTabChange('exchange')}
          className="w-full flex items-center gap-3 bg-white/15 backdrop-blur rounded-2xl px-4 py-3 border border-white/20 text-left"
        >
          <Search size={15} className="text-[#A8D5B8] shrink-0" />
          <span className="text-[#A8D5B8] text-sm">책 제목, 저자, 장르로 검색...</span>
        </button>
      </div>

      <div className="px-4 -mt-4 pb-4 space-y-4">

        {/* ── 첫 방문 환영 배너 ── */}
        {showWelcomeBanner && (
          <div className="bg-white rounded-2xl border border-[#A8D5B8] shadow-lg overflow-hidden animate-scale-in">
            <div className="bg-[#1A6B3C] px-4 py-3 flex items-center justify-between">
              <span className="text-white text-sm font-bold">🎉 Bookle에 오신 걸 환영해요!</span>
              <button
                onClick={() => setBannerDismissed(true)}
                className="text-white/60 hover:text-white text-xl leading-none w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-[#374151]">
                {userGenreDisplay.length > 0 ? (
                  <>
                    <span className="font-semibold text-[#1A6B3C]">
                      {userGenreDisplay.slice(0, 2).join(' · ')}
                    </span>{' '}
                    취향의 {matchingUserCount}명이 지금 교환을 기다리고 있어요
                  </>
                ) : (
                  '취향에 맞는 교환 상대를 찾아볼게요'
                )}
              </p>
              {userGenreDisplay.length > 0 && (
                <div className="flex gap-2">
                  {WELCOME_AVATARS.map((u, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#F9FAFB]">
                      <span className="text-2xl">{u.avatar}</span>
                      <span className="text-xs font-medium text-[#111827]">{u.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#E8F5EE] text-[#1A6B3C]">
                        {userGenreDisplay[i % userGenreDisplay.length]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => { setBannerDismissed(true); onTabChange('match'); }}
                className="w-full py-2.5 rounded-xl bg-[#1A6B3C] text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                매칭 후보 보러 가기 <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── 비가입 CTA ── */}
        {!user && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-5 text-center animate-fade-in-up">
            <p className="text-4xl mb-3">📚</p>
            <h3 className="text-base font-bold text-[#111827]">Bookle을 시작해보세요</h3>
            <p className="text-xs text-[#6B7280] mt-1 mb-4 leading-relaxed">
              취향 설정만 해도 AI가 딱 맞는<br />교환 상대를 즉시 찾아드려요
            </p>
            <div className="flex gap-2">
              <a href="/onboarding" className="flex-1 py-3 rounded-xl bg-[#1A6B3C] text-white text-sm font-bold text-center">
                회원가입 시작
              </a>
              <button onClick={() => onTabChange('exchange')} className="flex-1 py-3 rounded-xl border-2 border-[#E5E7EB] text-[#374151] text-sm font-semibold">
                둘러보기
              </button>
            </div>
          </div>
        )}

        {/* ── 프로필 완성도 ── */}
        {user && pct < 100 && (
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#111827]">프로필 완성도</h3>
              <span className="text-sm font-black text-[#1A6B3C]">{pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E8F5EE] overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-[#1A6B3C] transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="space-y-2">
              {steps.map((step) => (
                <div key={step.label} className="flex items-center gap-2">
                  {step.done
                    ? <CheckCircle2 size={14} className="text-[#1A6B3C] shrink-0" />
                    : <Circle size={14} className="text-[#D1D5DB] shrink-0" />}
                  <span className={cn(
                    'text-xs',
                    step.done ? 'text-[#9CA3AF] line-through' : 'text-[#374151] font-medium'
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            {nextStep && (
              <button
                onClick={() => onTabChange(nextStep.label.includes('요청') ? 'match' : 'profile')}
                className="mt-3 w-full py-2 rounded-xl bg-[#E8F5EE] text-[#1A6B3C] text-xs font-semibold flex items-center justify-center gap-1"
              >
                다음: {nextStep.label} <ArrowRight size={12} />
              </button>
            )}
          </div>
        )}

        {/* ── 교환 현황 ── */}
        {user?.book && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E7EB] animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#111827]">내 교환 현황</h3>
              <button onClick={() => onTabChange('match')} className="text-xs text-[#1A6B3C] font-medium flex items-center gap-0.5">
                전체 보기 <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex gap-3">
              {[
                { label: '등록 도서', value: '1권', color: 'bg-[#E8F5EE] text-[#1A6B3C]' },
                { label: '받은 요청', value: '1건', color: 'bg-red-50 text-red-500' },
                { label: '완료', value: '0건', color: 'bg-[#F3F4F6] text-[#6B7280]' },
              ].map((item) => (
                <div key={item.label} className="flex-1 rounded-xl bg-[#F9FAFB] p-2.5 text-center">
                  <div className={`text-xs font-bold px-1.5 py-0.5 rounded-md inline-block mb-1 ${item.color}`}>
                    {item.value}
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 교환 요청 알림 ── */}
        {user && (
          <button
            onClick={() => onTabChange('match')}
            className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-[#E5E7EB] text-left hover:shadow-md transition-all animate-fade-in-up"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-xl shrink-0">
              📬
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#111827]">새 교환 요청 1건</p>
              <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                박민준님이 &ldquo;{user.book?.title ?? '내 책'}&rdquo;을 원해요
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <ChevronRight size={16} className="text-[#D1D5DB]" />
            </div>
          </button>
        )}

        {/* ── 취향 기반 / 인기 도서 ── */}
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={15} className="text-[#1A6B3C]" />
              <h3 className="text-sm font-bold text-[#111827]">{sectionTitle}</h3>
            </div>
            <button onClick={() => onTabChange('exchange')} className="text-xs text-[#1A6B3C] font-medium flex items-center gap-0.5">
              더보기 <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {displayBooks.map((book) => {
              const isMatch = userGenreNames.includes(book.genre);
              return (
                <div key={book.title} className="shrink-0 w-28">
                  <BookCover title={book.title} author={book.author} size="md" className="w-full mb-2" />
                  {isMatch ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E8F5EE] text-[#1A6B3C]">
                      취향 일치
                    </span>
                  ) : (
                    <span className="text-[9px] text-[#9CA3AF]">{book.available}명 교환 중</span>
                  )}
                  <p className="text-xs font-semibold text-[#111827] mt-1 leading-tight line-clamp-1">
                    {book.title}
                  </p>
                  <p className="text-[10px] text-[#9CA3AF]">{book.author}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 커뮤니티 인기글 ── */}
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">커뮤니티 인기글</h3>
            <button onClick={() => onTabChange('community')} className="text-xs text-[#1A6B3C] font-medium flex items-center gap-0.5">
              더보기 <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {COMMUNITY_PREVIEWS.map((post) => (
              <button
                key={post.title}
                onClick={() => onTabChange('community')}
                className="w-full bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm text-left hover:border-[#A8D5B8] transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{post.avatar}</span>
                  <span className="text-xs text-[#6B7280]">{post.author}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#9CA3AF]">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-[#D1D5DB] ml-auto">{post.time}</span>
                </div>
                <p className="text-sm font-medium text-[#111827] leading-snug">{post.title}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-1.5">❤️ {post.likes}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
