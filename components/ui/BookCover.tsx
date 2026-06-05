'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BookCoverProps {
  title: string;
  author: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

// 실제 이미지가 있는 책 목록
const BOOK_IMAGES: Record<string, string> = {
  '채식주의자':        '/books/채식주의자.jpg',
  '코스모스':          '/books/코스모스.jpg',
  '사피엔스':          '/books/사피엔스.jpg',
  '아몬드':            '/books/아몬드.jpg',
  '미드나잇 라이브러리': '/books/미드나잇-라이브러리.jpg',
  '돈의 심리학':       '/books/돈의-심리학.jpg',
  '클루지':            '/books/클루지.jpg',
  '나의 라임 오렌지 나무': '/books/나의-라임-오렌지나무.jpg',
  '불편한 편의점':     '/books/불편한-편의점.jpg',
  '어린왕자':          '/books/어린왕자.jpg',
};

const PALETTES: { from: string; to: string; spine: string }[] = [
  { from: '#7c3aed', to: '#4338ca', spine: '#5b21b6' },
  { from: '#db2777', to: '#be185d', spine: '#9d174d' },
  { from: '#d97706', to: '#b45309', spine: '#92400e' },
  { from: '#059669', to: '#047857', spine: '#065f46' },
  { from: '#0284c7', to: '#1d4ed8', spine: '#1e40af' },
  { from: '#c026d3', to: '#7c3aed', spine: '#a21caf' },
  { from: '#0f766e', to: '#0369a1', spine: '#0e7490' },
  { from: '#b91c1c', to: '#be123c', spine: '#9f1239' },
  { from: '#4d7c0f', to: '#15803d', spine: '#166534' },
  { from: '#92400e', to: '#b45309', spine: '#78350f' },
];

function hashTitle(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

const SIZES = {
  xs: { w: 40,  h: 58,  titleSize: 6,  authorSize: 0,  spineW: 5,  radius: 6  },
  sm: { w: 56,  h: 80,  titleSize: 7,  authorSize: 6,  spineW: 6,  radius: 8  },
  md: { w: 80,  h: 114, titleSize: 9,  authorSize: 7,  spineW: 8,  radius: 10 },
  lg: { w: 112, h: 160, titleSize: 11, authorSize: 9,  spineW: 10, radius: 12 },
};

export function BookCover({ title, author, size = 'md', className }: BookCoverProps) {
  const imageSrc = BOOK_IMAGES[title];
  const s = SIZES[size];

  if (imageSrc) {
    return (
      <div
        className={cn('relative shrink-0 overflow-hidden shadow-md', className)}
        style={{ width: s.w, height: s.h, borderRadius: s.radius }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes={`${s.w}px`}
        />
      </div>
    );
  }

  const palette = PALETTES[hashTitle(title) % PALETTES.length];

  return (
    <div
      className={cn('relative shrink-0 overflow-hidden shadow-md', className)}
      style={{
        width: s.w,
        height: s.h,
        borderRadius: s.radius,
        background: `linear-gradient(155deg, ${palette.from}, ${palette.to})`,
      }}
    >
      <div className="absolute left-0 top-0 bottom-0" style={{ width: s.spineW, background: palette.spine }} />
      <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
      {size !== 'xs' && (
        <div className="absolute inset-0 flex flex-col justify-end p-2" style={{ paddingLeft: s.spineW + 6 }}>
          <p
            className="font-bold text-white leading-tight"
            style={{ fontSize: s.titleSize, WebkitLineClamp: 3, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}
          >
            {title}
          </p>
          {s.authorSize > 0 && (
            <p className="text-white/60 truncate mt-0.5" style={{ fontSize: s.authorSize }}>{author}</p>
          )}
        </div>
      )}
    </div>
  );
}
