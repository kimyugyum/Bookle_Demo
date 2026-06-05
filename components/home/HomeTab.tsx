'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, TrendingUp, Heart, Repeat2, MessageCircle } from 'lucide-react';
import { BookCover } from '@/components/ui/BookCover';
import { GENRE_LABELS, genreLabels } from '@/lib/user-store';
import type { AppTab } from '@/types/app';
import type { UserData } from '@/types/onboarding';

interface HomeTabProps {
  user: UserData | null;
  isFirstVisit: boolean;
  onTabChange: (tab: AppTab) => void;
}

const BESTSELLERS = [
  { title: '채식주의자',       author: '한강',      rank: 1 },
  { title: '아몬드',           author: '손원평',    rank: 2 },
  { title: '82년생 김지영',    author: '조남주',    rank: 3 },
  { title: '어린왕자',         author: '생텍쥐페리', rank: 4 },
  { title: '미드나잇 라이브러리', author: '매트 헤이그', rank: 5 },
  { title: '사피엔스',         author: '유발 하라리', rank: 6 },
];

const POPULAR_EXCHANGE = [
  { title: '코스모스',     author: '칼 세이건',  count: 12 },
  { title: '돈의 심리학', author: '모건 하우절', count: 9  },
  { title: '채식주의자',  author: '한강',        count: 8  },
  { title: '불편한 편의점', author: '김호연',    count: 7  },
  { title: '사피엔스',    author: '유발 하라리', count: 6  },
];

const BANNERS = [
  {
    bg: 'linear-gradient(135deg, #1A6B3C 0%, #2D8A52 100%)',
    tag: '이벤트',
    title: '첫 교환 성공하면\n포인트 2배 적립!',
    sub: '6월 한 달간 진행',
    tagColor: '#A8D5B8',
  },
  {
    bg: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
    tag: '신규 기능',
    title: 'AI 매칭으로\n딱 맞는 책 교환 상대 찾기',
    sub: '취향 기반 자동 추천',
    tagColor: '#93C5FD',
  },
  {
    bg: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)',
    tag: '베스트',
    title: '이번 주 가장 많이\n교환된 책 TOP 10',
    sub: '지금 바로 확인하세요',
    tagColor: '#FED7AA',
  },
];

const COMMUNITY_POSTS = [
  { author: '박민준', title: '"채식주의자" 읽고 생각이 많아졌어요', likes: 42, time: '1시간 전', category: '서평' },
  { author: '정유진', title: '독서 슬럼프 극복 방법 공유합니다',    likes: 61, time: '2일 전',  category: '독서팁' },
  { author: '이수연', title: '이번 달 읽은 책 5권 후기',           likes: 38, time: '3일 전',  category: '서평' },
];

export function HomeTab({ user, isFirstVisit, onTabChange }: HomeTabProps) {
  const userGenreNames = (user?.genres ?? []).map((id) => GENRE_LABELS[id]).filter(Boolean);
  const name = user?.name || '독서인';

  return (
    <div className="pb-2">
      <div className="px-4 pt-4 space-y-6">

        {/* ── 비가입 CTA ── */}
        {!user && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 text-center animate-fade-in-up">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5EE] flex items-center justify-center mx-auto mb-3">
              <BookCover title="Bookle" author="" size="xs" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">Bookle을 시작해보세요</h3>
            <p className="text-xs text-[#6B7280] mt-1 mb-4 leading-relaxed">
              취향 설정만 해도 AI가 딱 맞는<br />교환 상대를 즉시 찾아드려요
            </p>
            <div className="flex gap-2">
              <a href="/onboarding/1" className="flex-1 py-3 rounded-xl bg-[#1A6B3C] text-white text-sm font-bold text-center">
                회원가입 시작
              </a>
              <button onClick={() => onTabChange('exchange')} className="flex-1 py-3 rounded-xl border-2 border-[#E5E7EB] text-[#374151] text-sm font-semibold">
                둘러보기
              </button>
            </div>
          </div>
        )}

        {/* ── 검색바 ── */}
        <button
          onClick={() => onTabChange('exchange')}
          className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-[#E5E7EB] shadow-sm"
        >
          <Search size={15} className="text-[#9CA3AF] shrink-0" />
          <span className="text-[#9CA3AF] text-sm">책 제목, 저자, 장르로 검색...</span>
        </button>

        {/* ── 광고 배너 ── */}
        <BannerCarousel />

        {/* ── 베스트셀러 ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={15} className="text-[#1A6B3C]" />
              <h2 className="text-base font-bold text-[#111827]">베스트셀러</h2>
            </div>
            <button onClick={() => onTabChange('exchange')} className="text-xs text-[#1A6B3C] font-medium flex items-center gap-0.5">
              더보기 <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {BESTSELLERS.map((book) => (
              <div key={book.title} className="shrink-0 w-24">
                <div className="relative mb-2">
                  <BookCover title={book.title} author={book.author} size="md" className="w-full" />
                  <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#1A6B3C] text-white text-[10px] font-black flex items-center justify-center">
                    {book.rank}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#111827] leading-tight line-clamp-1">{book.title}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{book.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 이번 주 인기 교환 도서 ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Repeat2 size={15} className="text-[#1A6B3C]" />
              <h2 className="text-base font-bold text-[#111827]">이번 주 인기 교환 도서</h2>
            </div>
            <button onClick={() => onTabChange('exchange')} className="text-xs text-[#1A6B3C] font-medium flex items-center gap-0.5">
              더보기 <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {POPULAR_EXCHANGE.map((book, idx) => {
              const isMatch = userGenreNames.some((g) => book.title.includes(g) || book.author.includes(g));
              return (
                <button
                  key={book.title}
                  onClick={() => onTabChange('exchange')}
                  className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-[#E5E7EB] shadow-sm hover:border-[#A8D5B8] transition-all text-left"
                >
                  <span className="text-sm font-black text-[#D1D5DB] w-5 shrink-0">{idx + 1}</span>
                  <BookCover title={book.title} author={book.author} size="xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827] line-clamp-1">{book.title}</p>
                    <p className="text-xs text-[#9CA3AF]">{book.author}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-[#1A6B3C] font-semibold">{book.count}명</span>
                    <span className="text-[10px] text-[#9CA3AF]">교환 중</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 커뮤니티 인기글 ── */}
        <section className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <MessageCircle size={15} className="text-[#1A6B3C]" />
              <h2 className="text-base font-bold text-[#111827]">커뮤니티 인기글</h2>
            </div>
            <button onClick={() => onTabChange('community')} className="text-xs text-[#1A6B3C] font-medium flex items-center gap-0.5">
              더보기 <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {COMMUNITY_POSTS.map((post) => (
              <button
                key={post.title}
                onClick={() => onTabChange('community')}
                className="w-full bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm text-left hover:border-[#A8D5B8] transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[10px] font-bold text-[#1A6B3C]">
                    {post.author[0]}
                  </div>
                  <span className="text-xs text-[#6B7280]">{post.author}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#9CA3AF]">{post.category}</span>
                  <span className="text-[10px] text-[#D1D5DB] ml-auto">{post.time}</span>
                </div>
                <p className="text-sm font-medium text-[#111827] leading-snug">{post.title}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Heart size={11} className="text-[#9CA3AF]" />
                  <span className="text-[10px] text-[#9CA3AF]">{post.likes}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % BANNERS.length);
    }, 3000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleDotClick = (idx: number) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  const banner = BANNERS[current];

  return (
    <div className="relative rounded-2xl overflow-hidden h-28" style={{ background: banner.bg, transition: 'background 0.5s ease' }}>
      {/* Content */}
      <div className="absolute inset-0 px-5 py-4 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ color: banner.tagColor, borderColor: banner.tagColor + '60' }}>
            {banner.tag}
          </span>
          <p className="text-white font-bold text-base mt-2 leading-snug whitespace-pre-line">{banner.title}</p>
        </div>
        <p className="text-white/60 text-xs">{banner.sub}</p>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className="rounded-full transition-all duration-300"
            style={{
              width: idx === current ? 16 : 6,
              height: 6,
              background: idx === current ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
