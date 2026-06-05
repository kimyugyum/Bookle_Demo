'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Star, MapPin, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GENRE_LABELS } from '@/lib/user-store';
import { BookCover } from '@/components/ui/BookCover';

interface ExchangeTabProps {
  userGenres?: string[];
}

const ALL_GENRES = ['전체', '소설', '자기계발', '과학/기술', '역사/인문', '경제/경영', '에세이', '만화/그래픽'];

const BOOKS = [
  { id: 1, title: '채식주의자', author: '한강', genre: '소설', condition: 'A' as const, owner: '박민준', ownerRating: 4.8, reviewCount: 12, distance: '2.1km', wantGenres: ['소설', '에세이'] },
  { id: 2, title: '코스모스', author: '칼 세이건', genre: '과학/기술', condition: 'B' as const, owner: '이수연', ownerRating: 4.6, reviewCount: 8, distance: '0.8km', wantGenres: ['역사/인문'] },
  { id: 3, title: '사피엔스', author: '유발 하라리', genre: '역사/인문', condition: 'A' as const, owner: '김태호', ownerRating: 4.9, reviewCount: 24, distance: '3.5km', wantGenres: ['소설', '과학/기술'] },
  { id: 4, title: '아몬드', author: '손원평', genre: '소설', condition: 'B' as const, owner: '정유진', ownerRating: 4.7, reviewCount: 6, distance: '1.2km', wantGenres: ['자기계발'] },
  { id: 5, title: '미드나잇 라이브러리', author: '매트 헤이그', genre: '소설', condition: 'A' as const, owner: '최준서', ownerRating: 4.5, reviewCount: 15, distance: '4.0km', wantGenres: ['에세이', '소설'] },
  { id: 6, title: '돈의 심리학', author: '모건 하우절', genre: '경제/경영', condition: 'B' as const, owner: '한지원', ownerRating: 4.8, reviewCount: 20, distance: '2.8km', wantGenres: ['자기계발'] },
  { id: 7, title: '클루지', author: '게리 마커스', genre: '과학/기술', condition: 'C' as const, owner: '오준혁', ownerRating: 4.6, reviewCount: 11, distance: '5.2km', wantGenres: ['역사/인문'] },
  { id: 8, title: '82년생 김지영', author: '조남주', genre: '소설', condition: 'A' as const, owner: '최아름', ownerRating: 4.7, reviewCount: 18, distance: '1.7km', wantGenres: ['에세이', '소설'] },
];

const CONDITION_STYLE = { A: 'text-[#1A6B3C] bg-[#E8F5EE]', B: 'text-amber-600 bg-amber-50', C: 'text-orange-600 bg-orange-50' };
const CONDITION_LABEL = { A: '최상', B: '상', C: '중' };

export function ExchangeTab({ userGenres = [] }: ExchangeTabProps) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('전체');

  const userGenreNames = userGenres.map((id) => GENRE_LABELS[id]).filter(Boolean);
  const hasTaste = userGenreNames.length > 0;
  const genreChips = hasTaste ? ['전체', '✨ 내 취향', ...ALL_GENRES.slice(1)] : ALL_GENRES;

  const filtered = BOOKS.filter((b) => {
    if (query && !b.title.includes(query) && !b.author.includes(query)) return false;
    if (genre === '전체') return true;
    if (genre === '✨ 내 취향') return userGenreNames.includes(b.genre);
    return b.genre === genre;
  });

  const sorted = hasTaste
    ? [...filtered].sort((a, b) => +!userGenreNames.includes(a.genre) - +!userGenreNames.includes(b.genre))
    : filtered;

  return (
    <div>
      {/* Sticky header */}
      <div className="bg-white border-b border-[#F3F4F6] px-4 pt-4 pb-3 sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-1">
          <ArrowLeftRight size={18} className="text-[#1A6B3C]" />
          <h1 className="text-lg font-bold text-[#111827]">책 교환</h1>
        </div>
        <p className="text-xs text-[#9CA3AF] mb-3">읽은 책을 나누고, 원하는 책을 얻어보세요</p>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-3 h-10">
            <Search size={15} className="text-[#9CA3AF] shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목, 저자 검색..."
              className="flex-1 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
            />
          </div>
          <button className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
            <SlidersHorizontal size={16} className="text-[#6B7280]" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 mt-3 scrollbar-hide">
          {genreChips.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                genre === g ? 'bg-[#1A6B3C] text-white' : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 pb-4 space-y-3">
        {hasTaste && genre === '전체' && (
          <p className="text-xs text-[#9CA3AF] px-1">
            ✨ <span className="font-medium text-[#1A6B3C]">{userGenreNames.slice(0, 2).join(' · ')}</span> 취향 책이 상단에 표시돼요
          </p>
        )}
        <p className="text-xs text-[#9CA3AF] px-1">교환 가능한 책 {sorted.length}권</p>

        {sorted.map((book) => {
          const isMatch = userGenreNames.includes(book.genre);
          return (
            <button
              key={book.id}
              className={cn(
                'w-full bg-white rounded-2xl p-4 border shadow-sm text-left hover:shadow-md transition-all',
                isMatch ? 'border-[#A8D5B8] ring-1 ring-[#A8D5B8]/30' : 'border-[#E5E7EB] hover:border-[#1A6B3C]'
              )}
            >
              <div className="flex gap-3">
                <BookCover title={book.title} author={book.author} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#111827] leading-tight">{book.title}</h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">{book.author}</p>
                    </div>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0', CONDITION_STYLE[book.condition])}>
                      {CONDITION_LABEL[book.condition]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-[#374151]">{book.owner}</span>
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-[#9CA3AF]">{book.ownerRating} ({book.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-0.5 ml-auto">
                      <MapPin size={10} className="text-[#9CA3AF]" />
                      <span className="text-[10px] text-[#9CA3AF]">{book.distance}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    <span className="text-[10px] text-[#9CA3AF]">원하는 장르:</span>
                    {book.wantGenres.map((g) => (
                      <span key={g} className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full',
                        userGenreNames.includes(g)
                          ? 'bg-[#E8F5EE] text-[#1A6B3C] font-medium'
                          : 'bg-[#F3F4F6] text-[#9CA3AF]'
                      )}>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#F9FAFB] flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">내 책과 교환 가능</span>
                <span className={cn('text-xs font-semibold', isMatch ? 'text-[#1A6B3C]' : 'text-[#6B7280]')}>
                  {isMatch ? '✨ 취향 일치 · 교환하기 →' : '교환 요청하기 →'}
                </span>
              </div>
            </button>
          );
        })}

        {sorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm font-medium text-[#374151]">검색 결과가 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}
