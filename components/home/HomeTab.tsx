'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, ChevronRight, TrendingUp, Heart, Repeat2, MessageCircle } from 'lucide-react';
import { BookCover } from '@/components/ui/BookCover';
import { GENRE_LABELS } from '@/lib/user-store';
import { useAppStore } from '@/lib/store';
import { BESTSELLERS, POPULAR_EXCHANGE, BANNERS, HOME_COMMUNITY_POSTS } from '@/lib/mock-data';
import type { AppTab } from '@/types/app';

interface HomeTabProps {
  onTabChange: (tab: AppTab) => void;
}

const AVATAR_COLORS = ['#7C3AED', '#DB2777', '#0284C7', '#D97706', '#059669'];

export function HomeTab({ onTabChange }: HomeTabProps) {
  const user = useAppStore((s) => s.user);
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
        <section>
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
            {HOME_COMMUNITY_POSTS.map((post, idx) => (
              <button
                key={post.title}
                onClick={() => onTabChange('community')}
                className="w-full bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm text-left hover:border-[#A8D5B8] transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                  >
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

      {/* ── 푸터 ── */}
      <footer className="mt-2 px-4 pb-6 border-t border-[#F3F4F6] pt-5">
        <div className="flex items-center justify-center mb-3">
          <Image
            src="/logo-v2.png"
            alt="Bookle"
            width={40}
            height={23}
            style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(92%) saturate(410%) hue-rotate(100deg) brightness(97%)' }}
          />
        </div>
        <p className="text-center text-[10px] text-[#9CA3AF] leading-relaxed">
          책이 연결하는 사람들의 이야기
        </p>
        <div className="flex justify-center gap-4 mt-3">
          {['이용약관', '개인정보처리방침', '고객센터'].map((label) => (
            <button key={label} className="text-[10px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
              {label}
            </button>
          ))}
        </div>
        <p className="text-center text-[9px] text-[#D1D5DB] mt-3">© 2026 Bookle. All rights reserved.</p>
      </footer>
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
    <div className="relative rounded-2xl overflow-hidden h-28">
      {/* 배경 이미지 */}
      <Image
        src={banner.image}
        alt={banner.tag}
        fill
        className="object-cover transition-opacity duration-500"
        sizes="448px"
        priority
      />
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/35" />
      {/* Content */}
      <div className="absolute inset-0 px-5 py-4 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/50 text-white/90">
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
