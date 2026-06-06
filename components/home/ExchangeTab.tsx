'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Star, MapPin, ArrowLeftRight, X, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GENRE_LABELS } from '@/lib/user-store';
import { useAppStore } from '@/lib/store';
import { BookCover } from '@/components/ui/BookCover';
import { ALL_GENRES, EXCHANGE_BOOKS } from '@/lib/mock-data';

const AVATAR_COLORS = ['#7C3AED', '#DB2777', '#0284C7', '#D97706', '#059669'];
function nameToColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const CONDITION_STYLE = { A: 'text-[#1A6B3C] bg-[#E8F5EE]', B: 'text-amber-600 bg-amber-50', C: 'text-orange-600 bg-orange-50' };
const CONDITION_LABEL = { A: '최상', B: '상', C: '중' };
const CONDITION_DESC = { A: '새 책과 동일한 상태', B: '약간의 사용감, 훼손 없음', C: '눈에 띄는 사용감 있음' };
const CONDITION_BARS = { A: 3, B: 2, C: 1 };
const CONDITION_BAR_COLOR = { A: 'bg-[#1A6B3C]', B: 'bg-amber-400', C: 'bg-orange-400' };

type ModalBook = typeof EXCHANGE_BOOKS[0];
type SortBy = 'match' | 'distance' | 'newest';

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'match',    label: '매칭도순' },
  { value: 'distance', label: '거리순'   },
  { value: 'newest',   label: '최신순'   },
];

export function ExchangeTab() {
  const user         = useAppStore((s) => s.user);
  const addExchange  = useAppStore((s) => s.addExchange);

  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('전체');
  const [sortBy, setSortBy] = useState<SortBy>('match');
  const [sortOpen, setSortOpen] = useState(false);
  const [modalBook, setModalBook] = useState<ModalBook | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const dragStartY = useRef(0);
  const baseOffset = useRef(0);

  const userGenreNames = (user?.genres ?? []).map((id) => GENRE_LABELS[id]).filter(Boolean);
  const hasTaste = userGenreNames.length > 0;
  const genreChips = hasTaste ? ['전체', '✨ 내 취향', ...ALL_GENRES.slice(1)] : ALL_GENRES;

  const filtered = EXCHANGE_BOOKS.filter((b) => {
    if (query && !b.title.includes(query) && !b.author.includes(query)) return false;
    if (genre === '전체') return true;
    if (genre === '✨ 내 취향') return userGenreNames.includes(b.genre);
    return b.genre === genre;
  });

  const sorted = (() => {
    const arr = [...filtered];
    if (sortBy === 'match') {
      return arr.sort((a, b) => {
        const am = userGenreNames.includes(a.genre) ? 1 : 0;
        const bm = userGenreNames.includes(b.genre) ? 1 : 0;
        if (bm !== am) return bm - am;
        return b.matchScore - a.matchScore;
      });
    }
    if (sortBy === 'distance') {
      return arr.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }
    return arr.sort((a, b) => b.id - a.id);
  })();

  const openModal = (book: ModalBook) => {
    setModalBook(book);
    setMessage('');
    setDone(false);
    setExpanded(false);
    setDragDelta(0);
  };

  const closeModal = () => {
    setModalBook(null);
    setDone(false);
    setExpanded(false);
    setDragDelta(0);
  };

  const onDragStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    baseOffset.current = expanded ? 0 : window.innerHeight * 0.20;
    setIsDragging(true);
  };

  const onDragMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - dragStartY.current;
    // Allow dragging up (negative delta), clamp so it can't go above fully expanded
    const clamped = Math.max(-baseOffset.current, delta);
    setDragDelta(clamped);
  };

  const onDragEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    const delta = e.changedTouches[0].clientY - dragStartY.current;
    if (delta < -60) {
      setExpanded(true);
    } else if (delta > 80) {
      if (expanded) setExpanded(false);
      else closeModal();
    }
    setDragDelta(0);
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
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center relative transition-colors',
                sortOpen ? 'bg-[#E8F5EE]' : 'bg-[#F3F4F6]'
              )}
            >
              <SlidersHorizontal size={16} className={sortOpen ? 'text-[#1A6B3C]' : 'text-[#6B7280]'} />
              {sortBy !== 'match' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#1A6B3C]" />
              )}
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-12 z-30 bg-white rounded-2xl shadow-lg border border-[#E5E7EB] overflow-hidden w-32">
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => { setSortBy(value); setSortOpen(false); }}
                      className={cn(
                        'w-full px-4 py-3 text-sm text-left transition-colors',
                        sortBy === value
                          ? 'bg-[#E8F5EE] text-[#1A6B3C] font-bold'
                          : 'text-[#374151] hover:bg-[#F9FAFB]'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
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
        {hasTaste && genre === '전체' && sortBy === 'match' && (
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
        <div className="fixed inset-0 z-60 overflow-hidden" onClick={closeModal}>
          {/* 딤 */}
          <div className="absolute inset-0 bg-black/40" />

          {/* 시트 */}
          <div
            className="absolute bottom-0 left-0 right-0 max-w-md mx-auto h-[92dvh] bg-white rounded-t-3xl flex flex-col will-change-transform"
            style={{
              transform: `translateY(calc(${expanded ? 0 : 20}dvh + ${dragDelta}px))`,
              transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 핸들 — 드래그 영역 */}
            <div
              className="shrink-0 pt-3 pb-2 flex flex-col items-center touch-none cursor-grab active:cursor-grabbing"
              onTouchStart={onDragStart}
              onTouchMove={onDragMove}
              onTouchEnd={onDragEnd}
              onClick={() => { setExpanded((v) => !v); setDragDelta(0); }}
            >
              <div className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
              <ChevronDown
                size={14}
                className={cn(
                  'text-[#D1D5DB] mt-1 transition-transform duration-300',
                  expanded && 'rotate-180'
                )}
              />
            </div>

            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto px-5 pb-8 min-h-0">

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
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-[#111827]">교환 요청하기</h2>
                  <button onClick={closeModal} className="p-1 text-[#9CA3AF]">
                    <X size={20} />
                  </button>
                </div>

                {/* 목업 공지 */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 mb-4">
                  <span className="text-amber-500 text-xs shrink-0">⚠️</span>
                  <p className="text-[10px] text-amber-700 leading-snug">
                    아래 데이터 및 사진은 <span className="font-semibold">데모용 목업</span>입니다. 실제 서비스에서는 판매자가 직접 등록한 정보가 표시됩니다.
                  </p>
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

                {/* 등록 사진 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-medium text-[#374151]">
                      등록 사진 <span className="text-[#9CA3AF] font-normal">{modalBook.photos.length}장</span>
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 font-medium">예시</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {modalBook.photos.map((photo, idx) => (
                      <div key={idx} className="shrink-0 flex flex-col items-center gap-1">
                        <div className="w-24 h-32 rounded-xl overflow-hidden bg-[#F3F4F6]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt={photo.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] text-[#9CA3AF]">{photo.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 책 상태 */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] mb-4">
                  <div>
                    <p className="text-xs font-medium text-[#374151]">책 상태</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{CONDITION_DESC[modalBook.condition]}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {([1, 2, 3] as const).map((i) => (
                        <div
                          key={i}
                          className={cn(
                            'w-5 h-2 rounded-full',
                            i <= CONDITION_BARS[modalBook.condition]
                              ? CONDITION_BAR_COLOR[modalBook.condition]
                              : 'bg-[#E5E7EB]'
                          )}
                        />
                      ))}
                    </div>
                    <span className={cn('text-xs font-bold px-2 py-0.5 rounded-lg', CONDITION_STYLE[modalBook.condition])}>
                      {CONDITION_LABEL[modalBook.condition]}
                    </span>
                  </div>
                </div>

                {/* 상대방 정보 */}
                <div className="flex items-center gap-2 mb-4 px-1">
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: nameToColor(modalBook.owner) }}
                  >
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
        </div>
      )}
    </div>
  );
}
