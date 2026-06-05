'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, MapPin, ArrowLeftRight, X, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GENRE_LABELS } from '@/lib/user-store';
import { loadUser } from '@/lib/user-store';
import { BookCover } from '@/components/ui/BookCover';
import { addExchange } from '@/lib/exchange-store';
import type { UserData } from '@/types/onboarding';

interface ExchangeTabProps {
  userGenres?: string[];
}

const ALL_GENRES = ['전체', '소설', '자기계발', '과학/기술', '역사/인문', '경제/경영', '에세이', '만화/그래픽'];

const BOOKS = [
  { id: 1, title: '채식주의자', author: '한강', genre: '소설', condition: 'A' as const, owner: '박민준', ownerRating: 4.8, reviewCount: 12, distance: '2.1km', wantGenres: ['소설', '에세이'], matchScore: 94 },
  { id: 2, title: '코스모스', author: '칼 세이건', genre: '과학/기술', condition: 'B' as const, owner: '이수연', ownerRating: 4.6, reviewCount: 8, distance: '0.8km', wantGenres: ['역사/인문'], matchScore: 87 },
  { id: 3, title: '사피엔스', author: '유발 하라리', genre: '역사/인문', condition: 'A' as const, owner: '김태호', ownerRating: 4.9, reviewCount: 24, distance: '3.5km', wantGenres: ['소설', '과학/기술'], matchScore: 91 },
  { id: 4, title: '아몬드', author: '손원평', genre: '소설', condition: 'B' as const, owner: '정유진', ownerRating: 4.7, reviewCount: 6, distance: '1.2km', wantGenres: ['자기계발'], matchScore: 85 },
  { id: 5, title: '미드나잇 라이브러리', author: '매트 헤이그', genre: '소설', condition: 'A' as const, owner: '최준서', ownerRating: 4.5, reviewCount: 15, distance: '4.0km', wantGenres: ['에세이', '소설'], matchScore: 79 },
  { id: 6, title: '돈의 심리학', author: '모건 하우절', genre: '경제/경영', condition: 'B' as const, owner: '한지원', ownerRating: 4.8, reviewCount: 20, distance: '2.8km', wantGenres: ['자기계발'], matchScore: 76 },
  { id: 7, title: '클루지', author: '게리 마커스', genre: '과학/기술', condition: 'C' as const, owner: '오준혁', ownerRating: 4.6, reviewCount: 11, distance: '5.2km', wantGenres: ['역사/인문'], matchScore: 72 },
  { id: 8, title: '나의 라임 오렌지 나무', author: '조제 마우로 데 바스콘셀로스', genre: '소설', condition: 'A' as const, owner: '최아름', ownerRating: 4.7, reviewCount: 18, distance: '1.7km', wantGenres: ['에세이', '소설'], matchScore: 88 },
];

const CONDITION_STYLE = { A: 'text-[#1A6B3C] bg-[#E8F5EE]', B: 'text-amber-600 bg-amber-50', C: 'text-orange-600 bg-orange-50' };
const CONDITION_LABEL = { A: '최상', B: '상', C: '중' };

type ModalBook = typeof BOOKS[0];

export function ExchangeTab({ userGenres = [] }: ExchangeTabProps) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('전체');
  const [modalBook, setModalBook] = useState<ModalBook | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    setUser(loadUser());
  }, []);

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

  const openModal = (book: ModalBook) => {
    setModalBook(book);
    setMessage('');
    setDone(false);
  };

  const closeModal = () => {
    setModalBook(null);
    setDone(false);
  };

  const handleSubmit = () => {
    if (!modalBook) return;
    setSubmitting(true);
    setTimeout(() => {
      addExchange({
        direction: 'sent',
        seekerName: user?.name || '사용자',
        seekerBook: user?.book?.title || '(등록 도서 없음)',
        seekerAuthor: user?.book?.author || '',
        seekerCondition: user?.book?.condition || 'A',
        ownerName: modalBook.owner,
        ownerBook: modalBook.title,
        ownerAuthor: modalBook.author,
        ownerRating: modalBook.ownerRating,
        ownerReviewCount: modalBook.reviewCount,
        matchScore: modalBook.matchScore,
        message,
        status: 'pending',
      });
      setSubmitting(false);
      setDone(true);
    }, 800);
  };

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
              onClick={() => openModal(book)}
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

      {/* 교환 요청 모달 */}
      {modalBook && (
        <div className="fixed inset-0 z-60 flex items-end" onClick={closeModal}>
          <div
            className="w-full max-w-md mx-auto bg-white rounded-t-3xl p-5 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 핸들 */}
            <div className="w-10 h-1 rounded-full bg-[#E5E7EB] mx-auto mb-4" />

            {done ? (
              /* 완료 화면 */
              <div className="py-6 text-center">
                <CheckCircle2 size={48} className="text-[#1A6B3C] mx-auto mb-3" />
                <p className="text-base font-bold text-[#111827]">교환 요청 완료!</p>
                <p className="text-xs text-[#9CA3AF] mt-1 mb-6">{modalBook.owner}님께 요청이 전달됐어요</p>
                <button
                  onClick={closeModal}
                  className="w-full py-3 rounded-2xl bg-[#1A6B3C] text-white text-sm font-bold"
                >
                  확인
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-[#111827]">교환 요청하기</h2>
                  <button onClick={closeModal} className="p-1 text-[#9CA3AF]">
                    <X size={20} />
                  </button>
                </div>

                {/* 교환 도식 */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F9FAFB] mb-4">
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <BookCover title={user?.book?.title || '?'} author={user?.book?.author || ''} size="sm" />
                    <p className="text-[10px] text-[#9CA3AF]">내 책</p>
                    {user?.book ? (
                      <p className="text-xs font-semibold text-[#111827] text-center leading-tight">{user.book.title}</p>
                    ) : (
                      <p className="text-[10px] text-red-400 text-center">등록된 책 없음</p>
                    )}
                  </div>
                  <div className="text-xl text-[#9CA3AF]">⇄</div>
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <BookCover title={modalBook.title} author={modalBook.author} size="sm" />
                    <p className="text-[10px] text-[#9CA3AF]">상대 책</p>
                    <p className="text-xs font-semibold text-[#111827] text-center leading-tight">{modalBook.title}</p>
                  </div>
                </div>

                {/* 상대방 정보 */}
                <div className="flex items-center gap-2 mb-4 px-1">
                  <div className="w-7 h-7 rounded-full bg-[#E8F5EE] flex items-center justify-center text-xs font-bold text-[#1A6B3C]">
                    {modalBook.owner[0]}
                  </div>
                  <span className="text-sm font-medium text-[#111827]">{modalBook.owner}</span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-[#9CA3AF]">{modalBook.ownerRating}</span>
                  </div>
                  <span className="text-xs text-[#9CA3AF] ml-auto">매칭 {modalBook.matchScore}%</span>
                </div>

                {/* 메시지 */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-[#374151] mb-1.5 block">요청 메시지 (선택)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="안녕하세요! 교환 희망합니다 😊"
                    rows={3}
                    className="w-full bg-[#F9FAFB] rounded-xl px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]/20 resize-none border border-[#E5E7EB]"
                  />
                </div>

                {!user?.book && (
                  <p className="text-xs text-red-400 text-center mb-3">
                    교환하려면 먼저 내 책을 등록해야 해요
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-2xl border border-[#E5E7EB] text-sm text-[#6B7280] font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!user?.book || submitting}
                    className={cn(
                      'flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all',
                      user?.book && !submitting
                        ? 'bg-[#1A6B3C] text-white'
                        : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    )}
                  >
                    {submitting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    ) : (
                      <><Send size={14} /> 요청 보내기</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
