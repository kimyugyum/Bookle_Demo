'use client';

import { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Pencil, Users, X, Star, Trophy, Users2, ChevronDown, ImagePlus, XCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookCover } from '@/components/ui/BookCover';
import { COMMUNITY_POSTS as POSTS, CHALLENGES } from '@/lib/mock-data';

type Post = typeof POSTS[0];

const CATEGORIES = ['전체', '서평', '추천', '교환후기', '독서팁', '챌린지'];

const POST_COMMENTS: Record<number, { id: number; author: string; text: string; time: string; color: string }[]> = {
  1: [
    { id: 1, author: '이수연', text: '저도 그 부분이 인상깊었어요! 영혜의 저항이 정말 독특하죠.', time: '20분 전', color: '#0284C7' },
    { id: 2, author: '김태호', text: '한강 작가의 문장은 정말 독보적인 것 같아요', time: '40분 전', color: '#059669' },
    { id: 3, author: '최준서', text: '읽은 지 오래됐는데 다시 읽고 싶어지네요 📚', time: '1시간 전', color: '#7C3AED' },
  ],
  2: [
    { id: 1, author: '박민준', text: '과학책인데 이렇게 감동적일 수 있다니 놀라웠어요', time: '1시간 전', color: '#7C3AED' },
    { id: 2, author: '정유진', text: '"별을 보려면 어둠이 필요하다" 이 문장이 너무 좋았어요', time: '2시간 전', color: '#DB2777' },
  ],
  3: [
    { id: 1, author: '이수연', text: '박민준님 항상 꼼꼼하시기로 유명해요!', time: '12시간 전', color: '#0284C7' },
    { id: 2, author: '한지원', text: '저도 교환하고 싶은데 연락해도 될까요?', time: '14시간 전', color: '#D97706' },
  ],
  4: [
    { id: 1, author: '이수연', text: '맞아요! 저도 에세이로 다시 독서 시작했어요 ㅎㅎ', time: '1일 전', color: '#0284C7' },
    { id: 2, author: '김태호', text: '"어린왕자" 추천드려요. 얇고 감동적이에요', time: '1일 전', color: '#059669' },
    { id: 3, author: '박민준', text: '100페이지 이하 기준 완전 공감해요!', time: '2일 전', color: '#7C3AED' },
    { id: 4, author: '최아름', text: '좋은 팁 감사해요. 당장 시도해볼게요!', time: '2일 전', color: '#DB2777' },
  ],
  5: [
    { id: 1, author: '박민준', text: '감정을 통해 나를 돌아보는 경험이었어요. 정말 공감돼요', time: '2일 전', color: '#7C3AED' },
    { id: 2, author: '한지원', text: '이 책 읽고 교환탭에서 바로 찾아봤어요!', time: '3일 전', color: '#D97706' },
  ],
  6: [
    { id: 1, author: '김태호', text: '"원씽" 먼저 읽었는데 정말 좋았어요!', time: '3일 전', color: '#059669' },
    { id: 2, author: '이수연', text: '미라클 모닝은 좀 극단적인 것 같기도... ㅎㅎ', time: '3일 전', color: '#0284C7' },
    { id: 3, author: '정유진', text: '아주 작은 습관의 힘은 진짜 인생책이에요', time: '4일 전', color: '#DB2777' },
  ],
};

const AVATAR_COLORS = ['#7C3AED', '#DB2777', '#0284C7', '#D97706', '#059669'];

const CATEGORY_COLOR: Record<string, string> = {
  서평: 'bg-blue-50 text-blue-600',
  추천: 'bg-purple-50 text-purple-600',
  교환후기: 'bg-[#E8F5EE] text-[#1A6B3C]',
  독서팁: 'bg-amber-50 text-amber-600',
  챌린지: 'bg-red-50 text-red-500',
};

// ── PostDetailModal ──────────────────────────────────────────
function PostDetailModal({ post, likedIds, onToggleLike, onClose }: {
  post: Post;
  likedIds: Set<number>;
  onToggleLike: (id: number) => void;
  onClose: () => void;
}) {
  const [expanded, setExpanded]     = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta]   = useState(0);
  const [comment, setComment]       = useState('');
  const [localComments, setLocalComments] = useState(POST_COMMENTS[post.id] ?? []);
  const dragStartY = useRef(0);
  const baseOffset = useRef(0);

  const isLiked   = likedIds.has(post.id);
  const likeCount = post.likes + (isLiked && !post.liked ? 1 : !isLiked && post.liked ? -1 : 0);
  const colorIdx  = POSTS.findIndex((p) => p.id === post.id);

  const onDragStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    baseOffset.current = expanded ? 0 : window.innerHeight * 0.20;
    setIsDragging(true);
  };

  const onDragMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - dragStartY.current;
    setDragDelta(Math.max(-baseOffset.current, delta));
  };

  const onDragEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    const delta = e.changedTouches[0].clientY - dragStartY.current;
    if (delta < -60) setExpanded(true);
    else if (delta > 80) {
      if (expanded) setExpanded(false);
      else onClose();
    }
    setDragDelta(0);
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    setLocalComments((prev) => [
      { id: Date.now(), author: '나', text: comment.trim(), time: '방금', color: '#1A6B3C' },
      ...prev,
    ]);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute bottom-0 left-0 right-0 max-w-md mx-auto h-[92dvh] bg-white rounded-t-3xl flex flex-col will-change-transform"
        style={{
          transform: `translateY(calc(${expanded ? 0 : 20}dvh + ${dragDelta}px))`,
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div
          className="shrink-0 pt-3 pb-2 flex flex-col items-center touch-none cursor-grab active:cursor-grabbing"
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
          onClick={() => { setExpanded((v) => !v); setDragDelta(0); }}
        >
          <div className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
          <ChevronDown size={14} className={cn('text-[#D1D5DB] mt-1 transition-transform duration-300', expanded && 'rotate-180')} />
        </div>

        {/* 작성자 헤더 */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#F3F4F6] shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: AVATAR_COLORS[colorIdx % AVATAR_COLORS.length] }}
            >
              {post.author[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-[#111827]">{post.author}</p>
              <p className="text-[10px] text-[#9CA3AF]">{post.time}</p>
            </div>
            <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full ml-1', CATEGORY_COLOR[post.category] ?? 'bg-[#F3F4F6] text-[#6B7280]')}>
              {post.category}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-[#9CA3AF]">
            <X size={20} />
          </button>
        </div>

        {/* 스크롤 콘텐츠 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-5 py-4">
            {post.category === '서평' && post.book && (
              <div className="flex items-center gap-3 mb-4 p-3 bg-[#F9FAFB] rounded-2xl">
                <BookCover title={post.book} author="" size="sm" />
                <div>
                  <p className="text-[10px] text-[#9CA3AF]">서평 도서</p>
                  <p className="text-sm font-bold text-[#111827]">{post.book}</p>
                </div>
              </div>
            )}
            <h2 className="text-base font-bold text-[#111827] leading-snug mb-3">{post.title}</h2>
            <p className="text-sm text-[#374151] leading-relaxed">{post.body}</p>
          </div>

          {/* 좋아요 / 공유 */}
          <div className="px-5 flex items-center gap-2 pb-4 border-b border-[#F3F4F6]">
            <button
              onClick={() => onToggleLike(post.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all',
                isLiked ? 'bg-red-50 text-red-500 font-medium' : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-red-50 hover:text-red-400'
              )}
            >
              <Heart size={15} className={isLiked ? 'fill-red-500' : ''} /> {likeCount}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F3F4F6] text-[#6B7280] text-sm hover:bg-[#E8F5EE] hover:text-[#1A6B3C] transition-all">
              <Share2 size={15} /> 공유
            </button>
          </div>

          {/* 댓글 */}
          <div className="px-5 py-4">
            <p className="text-xs font-bold text-[#374151] mb-3">댓글 {localComments.length}</p>
            {localComments.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] text-center py-4">첫 댓글을 남겨보세요</p>
            ) : (
              <div className="space-y-3">
                {localComments.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
                      style={{ background: c.color }}
                    >
                      {c.author[0]}
                    </div>
                    <div className="flex-1 bg-[#F9FAFB] rounded-2xl px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-[#111827]">{c.author}</span>
                        <span className="text-[10px] text-[#9CA3AF]">{c.time}</span>
                      </div>
                      <p className="text-xs text-[#374151] leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="h-4" />
        </div>

        {/* 댓글 입력 */}
        <div className="shrink-0 px-4 py-3 border-t border-[#F3F4F6] bg-white flex gap-2 items-center">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitComment(); }}
            placeholder="댓글을 입력하세요..."
            className="flex-1 h-10 bg-[#F3F4F6] rounded-xl px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
          />
          <button
            onClick={submitComment}
            disabled={!comment.trim()}
            className="w-10 h-10 rounded-xl bg-[#1A6B3C] text-white flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── WriteModal ──────────────────────────────────────────────
type WriteType = '서평' | '추천' | '교환후기' | '독서팁';

function WriteModal({ onClose }: { onClose: () => void }) {
  const [writeType, setWriteType] = useState<WriteType>('서평');
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [rating, setRating]       = useState(0);
  const [bookImages, setBookImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 드래그 상태 (ExchangeTab과 동일 패턴)
  const [expanded, setExpanded]     = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta]   = useState(0);
  const dragStartY = useRef(0);
  const baseOffset = useRef(0);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setBookImages((prev) => [...prev, ...urls].slice(0, 5));
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setBookImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  const onDragStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    baseOffset.current = expanded ? 0 : window.innerHeight * 0.20;
    setIsDragging(true);
  };

  const onDragMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - dragStartY.current;
    setDragDelta(Math.max(-baseOffset.current, delta));
  };

  const onDragEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    const delta = e.changedTouches[0].clientY - dragStartY.current;
    if (delta < -60) {
      setExpanded(true);
    } else if (delta > 80) {
      if (expanded) setExpanded(false);
      else onClose();
    }
    setDragDelta(0);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl px-6 py-14 text-center animate-scale-in">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-base font-bold text-[#111827]">등록되었습니다!</p>
          <p className="text-xs text-[#9CA3AF] mt-1">커뮤니티에 글이 올라갔어요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={onClose}>
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

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-[#F3F4F6] shrink-0">
          <h2 className="text-base font-bold text-[#111827]">글쓰기</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center"
          >
            <X size={18} className="text-[#6B7280]" />
          </button>
        </div>

        {/* 스크롤 가능한 콘텐츠 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 pb-8">
          {/* 글 유형 */}
          <div>
            <p className="text-xs font-medium text-[#374151] mb-2">글 유형</p>
            <div className="grid grid-cols-2 gap-2">
              {(['서평', '추천', '교환후기', '독서팁'] as WriteType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setWriteType(t)}
                  className={cn(
                    'py-2 rounded-xl text-xs font-semibold border transition-all',
                    writeType === t
                      ? 'bg-[#1A6B3C] text-white border-[#1A6B3C]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#A8D5B8]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 서평 전용: 책 제목 + 별점 + 사진 */}
          {writeType === '서평' && (
            <>
              <div>
                <p className="text-xs font-medium text-[#374151] mb-1.5">책 제목</p>
                <input
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="읽은 책 제목을 입력하세요"
                  className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#1A6B3C] focus:ring-2 focus:ring-[#1A6B3C]/15 outline-none"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[#374151] mb-2">별점</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)}>
                      <Star
                        size={26}
                        className={cn(
                          'transition-colors',
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-[#D1D5DB]'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 책 사진 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#374151]">
                    책 사진
                    <span className="text-[#9CA3AF] font-normal ml-1">{bookImages.length}/5</span>
                  </p>
                  {bookImages.length > 0 && (
                    <span className="text-[10px] text-[#9CA3AF]">꾹 눌러서 삭제</span>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {/* 미리보기 썸네일 */}
                  {bookImages.map((url, idx) => (
                    <div key={idx} className="relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`책 사진 ${idx + 1}`}
                        className="w-20 h-24 rounded-xl object-cover border border-[#E5E7EB]"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center"
                      >
                        <XCircle size={16} className="text-[#9CA3AF]" />
                      </button>
                    </div>
                  ))}

                  {/* 추가 버튼 */}
                  {bookImages.length < 5 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 w-20 h-24 rounded-xl border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center gap-1 hover:border-[#1A6B3C] hover:bg-[#F9FAFB] transition-colors"
                    >
                      <ImagePlus size={20} className="text-[#9CA3AF]" />
                      <span className="text-[10px] text-[#9CA3AF]">사진 추가</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>
            </>
          )}

          {/* 제목 */}
          <div>
            <p className="text-xs font-medium text-[#374151] mb-1.5">제목</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#1A6B3C] focus:ring-2 focus:ring-[#1A6B3C]/15 outline-none"
            />
          </div>

          {/* 내용 */}
          <div>
            <p className="text-xs font-medium text-[#374151] mb-1.5">내용</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="자유롭게 내용을 작성해보세요"
              rows={4}
              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#1A6B3C] focus:ring-2 focus:ring-[#1A6B3C]/15 outline-none resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3 rounded-xl bg-[#1A6B3C] text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CommunityTab ──────────────────────────────────────────────
export function CommunityTab() {
  const [category, setCategory] = useState('전체');
  const [writeOpen, setWriteOpen] = useState(false);
  const [detailPost, setDetailPost] = useState<Post | null>(null);
  const [likedIds, setLikedIds] = useState<Set<number>>(
    new Set(POSTS.filter((p) => p.liked).map((p) => p.id))
  );
  const [joinedIds, setJoinedIds] = useState<Set<number>>(
    new Set(CHALLENGES.filter((_, i) => i === 1 || i === 4).map((c) => c.id))
  );

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleJoin = (id: number) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = category === '전체'
    ? POSTS
    : POSTS.filter((p) => p.category === category);

  const isChallengeTab = category === '챌린지';

  return (
    <div>
      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-[#F3F4F6] px-4 pt-4 pb-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#1A6B3C]" />
            <h1 className="text-lg font-bold text-[#111827]">커뮤니티</h1>
          </div>
          <button
            onClick={() => setWriteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A6B3C] text-white text-xs font-semibold"
          >
            <Pencil size={12} /> 글쓰기
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                category === c ? 'bg-[#1A6B3C] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 pb-4 space-y-3">

        {/* ── 챌린지 탭 ── */}
        {isChallengeTab && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={15} className="text-amber-500" />
              <h2 className="text-sm font-bold text-[#111827]">진행 중인 챌린지</h2>
            </div>
            {CHALLENGES.map((ch) => {
              const joined   = joinedIds.has(ch.id);
              const progress = joined ? ch.progress : 0;
              const pct      = Math.round((progress / ch.target) * 100);
              return (
                <div key={ch.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 animate-fade-in-up">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] flex items-center justify-center text-2xl shrink-0">
                      {ch.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-[#111827]">{ch.title}</p>
                        <button
                          onClick={() => toggleJoin(ch.id)}
                          className={cn(
                            'shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                            joined
                              ? 'bg-[#E8F5EE] text-[#1A6B3C]'
                              : 'bg-[#1A6B3C] text-white'
                          )}
                        >
                          {joined ? '참여 중' : '참여하기'}
                        </button>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-0.5 leading-snug">{ch.desc}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF]">
                          <Users2 size={10} />
                          {ch.participants.toLocaleString()}명 참여
                        </div>
                        <span className="text-[10px] text-[#9CA3AF]">{ch.duration}일 챌린지</span>
                      </div>
                    </div>
                  </div>
                  {/* 진행 바 */}
                  {joined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-[#6B7280]">진행도</span>
                        <span className="text-[10px] font-bold text-[#1A6B3C]">
                          {progress}/{ch.target}{ch.unit}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#E8F5EE] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#1A6B3C] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── 일반 게시글 ── */}
        {!isChallengeTab && filtered.map((post, idx) => {
          const isLiked   = likedIds.has(post.id);
          const likeCount = post.likes + (isLiked && !post.liked ? 1 : !isLiked && post.liked ? -1 : 0);
          return (
            <div key={post.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden animate-fade-in-up">
              <div className="p-4 pb-3 cursor-pointer" onClick={() => setDetailPost(post)}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                  >
                    {post.author[0]}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[#111827]">{post.author}</span>
                    <span className="text-xs text-[#9CA3AF] ml-2">{post.time}</span>
                  </div>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', CATEGORY_COLOR[post.category] ?? 'bg-[#F3F4F6] text-[#6B7280]')}>
                    {post.category}
                  </span>
                </div>

                {post.category === '서평' && post.book ? (
                  <div className="flex gap-3 mt-1">
                    <BookCover title={post.book} author="" size="sm" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#111827] leading-snug">{post.title}</h3>
                      <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed line-clamp-3">{post.body}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-[#111827] leading-snug">{post.title}</h3>
                    <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed line-clamp-2">{post.body}</p>
                  </>
                )}
              </div>

              <div className="flex border-t border-[#F9FAFB]">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs transition-colors',
                    isLiked ? 'text-red-500 font-medium' : 'text-[#9CA3AF] hover:text-red-400'
                  )}
                >
                  <Heart size={14} className={isLiked ? 'fill-red-500' : ''} />
                  {likeCount}
                </button>
                <button
                  onClick={() => setDetailPost(post)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  <MessageCircle size={14} /> {post.comments}
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                  <Share2 size={14} /> 공유
                </button>
              </div>
            </div>
          );
        })}

        {/* 게시글 없음 */}
        {!isChallengeTab && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm text-[#6B7280]">아직 게시글이 없어요</p>
            <button
              onClick={() => setWriteOpen(true)}
              className="mt-3 text-xs text-[#1A6B3C] font-medium underline"
            >
              첫 글을 남겨보세요
            </button>
          </div>
        )}

      </div>

      {/* ── FAB ── */}
      {!isChallengeTab && (
        <button
          onClick={() => setWriteOpen(true)}
          className="fixed bottom-24 right-4 w-12 h-12 rounded-full bg-[#1A6B3C] text-white shadow-lg shadow-green-900/30 flex items-center justify-center hover:bg-[#155E34] transition-colors z-20"
        >
          <Pencil size={18} />
        </button>
      )}

      {/* ── WriteModal ── */}
      {writeOpen && <WriteModal onClose={() => setWriteOpen(false)} />}

      {/* ── PostDetailModal ── */}
      {detailPost && (
        <PostDetailModal
          post={detailPost}
          likedIds={likedIds}
          onToggleLike={toggleLike}
          onClose={() => setDetailPost(null)}
        />
      )}
    </div>
  );
}
