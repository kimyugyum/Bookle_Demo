'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['전체', '서평', '추천', '교환후기', '독서팁', '챌린지'];

const POSTS = [
  {
    id: 1,
    author: '박민준', avatar: '🧑‍💻', time: '1시간 전', category: '서평',
    title: '"채식주의자" 읽고 생각이 많아졌어요',
    body: '한강 작가의 문체가 정말 독특하게 느껴졌는데, 특히 식물이 되고 싶다는 영혜의 심리가 단순한 거부감이 아니라 사회적 압박에 대한 반응처럼 보였어요.',
    likes: 42, comments: 13, liked: false, book: '채식주의자',
  },
  {
    id: 2,
    author: '이수연', avatar: '👩‍🎨', time: '3시간 전', category: '서평',
    title: '코스모스 1회독 완료! 우주가 이렇게 아름다울 줄이야 🌌',
    body: '칼 세이건의 문장 하나하나가 시처럼 느껴졌어요. 과학책인데 이렇게 감동적일 수가 있다는 게 신기해요. "우리는 별의 먼지로 만들어졌다"는 구절이 아직도 머릿속에 맴돌아요.',
    likes: 38, comments: 7, liked: true, book: '코스모스',
  },
  {
    id: 3,
    author: '김태호', avatar: '🧑‍🔬', time: '어제', category: '교환후기',
    title: '책 교환 후기 — 정말 새 책처럼 받았어요! ⭐⭐⭐⭐⭐',
    body: '박민준님과 교환했는데 포장도 꼼꼼하게 해주셨고 책 상태도 딱 설명하신 그대로였어요. 믿고 교환할 수 있는 분이에요!',
    likes: 25, comments: 5, liked: false, book: null,
  },
  {
    id: 4,
    author: '정유진', avatar: '👩‍🎓', time: '2일 전', category: '독서팁',
    title: '독서 슬럼프 극복 방법 공유합니다',
    body: '저도 한동안 책이 손에 안 잡혔는데, 얇은 에세이부터 다시 시작하니까 다시 읽고 싶어지더라고요. 두꺼운 책보다는 100페이지 이하의 가벼운 책으로 시작해보세요!',
    likes: 61, comments: 22, liked: false, book: null,
  },
  {
    id: 5,
    author: '최준서', avatar: '🧑‍🎤', time: '3일 전', category: '서평',
    title: '"아몬드" — 감정에 대해 다시 생각하게 해준 책',
    body: '감정을 모르는 아이의 이야기를 통해 오히려 내가 어떤 감정을 느끼는지 돌아보게 됐어요. 공감능력에 대한 질문을 던지는 작품.',
    likes: 34, comments: 9, liked: false, book: '아몬드',
  },
];

const CATEGORY_COLOR: Record<string, string> = {
  서평: 'bg-blue-50 text-blue-600',
  추천: 'bg-purple-50 text-purple-600',
  교환후기: 'bg-[#E8F5EE] text-[#1A6B3C]',
  독서팁: 'bg-amber-50 text-amber-600',
  챌린지: 'bg-red-50 text-red-500',
};

export function CommunityTab() {
  const [category, setCategory] = useState('전체');
  const [likedIds, setLikedIds] = useState<Set<number>>(
    new Set(POSTS.filter((p) => p.liked).map((p) => p.id))
  );

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = POSTS.filter((p) => category === '전체' || p.category === category);

  return (
    <div>
      {/* Sticky header */}
      <div className="bg-white border-b border-[#F3F4F6] px-4 pt-14 pb-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-[#111827]">커뮤니티</h1>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A6B3C] text-white text-xs font-semibold">
            <Pencil size={12} /> 글쓰기
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                category === c ? 'bg-[#1A6B3C] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 pb-4 space-y-3">
        {filtered.map((post) => {
          const isLiked = likedIds.has(post.id);
          const likeCount = post.likes + (isLiked && !post.liked ? 1 : !isLiked && post.liked ? -1 : 0);
          return (
            <div key={post.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden animate-fade-in-up">
              <div className="p-4 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{post.avatar}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[#111827]">{post.author}</span>
                    <span className="text-xs text-[#9CA3AF] ml-2">{post.time}</span>
                  </div>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', CATEGORY_COLOR[post.category] ?? 'bg-[#F3F4F6] text-[#6B7280]')}>
                    {post.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#111827] leading-snug">{post.title}</h3>
                <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed line-clamp-2">{post.body}</p>
                {post.book && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E8F5EE]">
                    <span className="text-xs">📖</span>
                    <span className="text-xs text-[#1A6B3C] font-medium">{post.book}</span>
                  </div>
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
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                  <MessageCircle size={14} /> {post.comments}
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                  <Share2 size={14} /> 공유
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
