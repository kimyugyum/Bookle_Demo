'use client';

import { useState } from 'react';
import { Sparkles, Check, X, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookCover } from '@/components/ui/BookCover';

type SubTab = 'received' | 'sent' | 'ai';

const RECEIVED = [
  {
    id: 1,
    name: '박민준',
    avatar: '🧑‍💻',
    theirBook: '채식주의자',
    theirAuthor: '한강',
    wantsMyBook: '불편한 편의점',
    matchScore: 94,
    time: '2시간 전',
    reviewCount: 12,
    condition: 'A',
  },
];

const SENT = [
  {
    id: 1,
    name: '이수연',
    avatar: '👩‍🎨',
    theirBook: '코스모스',
    theirAuthor: '칼 세이건',
    myBook: '불편한 편의점',
    matchScore: 87,
    time: '1일 전',
  },
];

const AI_RECS = [
  { id: 1, name: '김태호', avatar: '🧑‍🔬', book: '사피엔스', author: '유발 하라리', matchScore: 91, reviewCount: 24, genres: ['역사/인문', '과학/기술'], reason: '역사/인문 장르 취향이 일치해요' },
  { id: 2, name: '정유진', avatar: '👩‍🎓', book: '아몬드', author: '손원평', matchScore: 85, reviewCount: 6, genres: ['소설', '자기계발'], reason: '소설 선호도가 비슷해요' },
  { id: 3, name: '최준서', avatar: '🧑‍🎤', book: '미드나잇 라이브러리', author: '매트 헤이그', matchScore: 79, reviewCount: 15, genres: ['소설', '에세이'], reason: '에세이 장르 취향이 비슷해요' },
];

export function MatchTab() {
  const [subTab, setSubTab] = useState<SubTab>('received');
  const [accepted, setAccepted] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);

  const pendingReceived = RECEIVED.filter((r) => !accepted.includes(r.id) && !rejected.includes(r.id));

  return (
    <div>
      {/* Green header */}
      <div className="bg-[#1A6B3C] px-4 pt-14 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-[#A8D5B8]" />
          <h1 className="text-white text-lg font-bold">매칭</h1>
        </div>
        <p className="text-[#A8D5B8] text-sm">AI가 최적의 교환 상대를 찾아드려요</p>
      </div>

      {/* Sub tabs */}
      <div className="bg-white border-b border-[#F3F4F6] sticky top-0 z-10">
        <div className="flex">
          {([
            { id: 'received' as SubTab, label: '받은 요청', badge: pendingReceived.length },
            { id: 'sent' as SubTab, label: '보낸 요청', badge: 0 },
            { id: 'ai' as SubTab, label: 'AI 추천', badge: 0 },
          ]).map(({ id, label, badge }) => (
            <button
              key={id}
              onClick={() => setSubTab(id)}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-1.5',
                subTab === id ? 'text-[#1A6B3C]' : 'text-[#9CA3AF]'
              )}
            >
              {label}
              {badge > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
              {subTab === id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A6B3C] rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-3">
        {/* Received */}
        {subTab === 'received' && (
          <>
            {pendingReceived.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm animate-fade-in-up">
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5EE] flex items-center justify-center text-2xl">
                      {req.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111827]">{req.name}</span>
                        <div className="px-2 py-0.5 bg-[#E8F5EE] rounded-full">
                          <span className="text-xs font-bold text-[#1A6B3C]">{req.matchScore}% 매칭</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">거래 {req.reviewCount}회 · {req.time}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB]">
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <BookCover title={req.theirBook} author={req.theirAuthor} size="sm" />
                      <p className="text-[10px] text-[#9CA3AF]">상대 책</p>
                    </div>
                    <div className="text-xl text-[#9CA3AF]">⇄</div>
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <BookCover title={req.wantsMyBook} author="" size="sm" />
                      <p className="text-[10px] text-[#9CA3AF]">내 책</p>
                    </div>
                  </div>
                </div>
                <div className="flex border-t border-[#F3F4F6]">
                  <button
                    onClick={() => setRejected((p) => [...p, req.id])}
                    className="flex-1 py-3 flex items-center justify-center gap-1.5 text-sm text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={16} /> 거절
                  </button>
                  <div className="w-px bg-[#F3F4F6]" />
                  <button
                    onClick={() => setAccepted((p) => [...p, req.id])}
                    className="flex-1 py-3 flex items-center justify-center gap-1.5 text-sm text-[#1A6B3C] font-semibold hover:bg-[#E8F5EE] transition-colors"
                  >
                    <Check size={16} /> 수락
                  </button>
                </div>
              </div>
            ))}
            {accepted.length > 0 && (
              <div className="bg-[#E8F5EE] rounded-2xl p-5 text-center animate-scale-in">
                <p className="text-3xl mb-2">🎉</p>
                <p className="text-sm font-bold text-[#1A6B3C]">교환 수락 완료!</p>
                <p className="text-xs text-[#4B9E6A] mt-1">박민준님께 알림이 전송됐어요</p>
              </div>
            )}
            {pendingReceived.length === 0 && accepted.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm font-medium text-[#374151]">새로운 요청이 없어요</p>
                <p className="text-xs text-[#9CA3AF] mt-1">AI 추천 탭에서 먼저 요청을 보내보세요</p>
              </div>
            )}
          </>
        )}

        {/* Sent */}
        {subTab === 'sent' && (
          <>
            {SENT.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F5EE] flex items-center justify-center text-2xl">
                    {req.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111827]">{req.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium flex items-center gap-1">
                        <Clock size={10} /> 응답 대기
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{req.time} 요청 · {req.matchScore}% 매칭</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB]">
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <BookCover title={req.myBook} author="" size="sm" />
                    <p className="text-[10px] text-[#9CA3AF]">내 책</p>
                  </div>
                  <div className="text-xl text-[#9CA3AF]">⇄</div>
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <BookCover title={req.theirBook} author={req.theirAuthor} size="sm" />
                    <p className="text-[10px] text-[#9CA3AF]">상대 책</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* AI recommendations */}
        {subTab === 'ai' && (
          <>
            <div className="flex items-center gap-2 px-1 mb-1">
              <span className="text-base">🤖</span>
              <p className="text-xs text-[#6B7280]">취향 분석 기반 추천 · 매일 업데이트</p>
            </div>
            {AI_RECS.map((rec, idx) => (
              <button
                key={rec.id}
                className="w-full bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm text-left hover:border-[#1A6B3C] hover:shadow-md transition-all animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F5EE] flex items-center justify-center text-2xl">
                    {rec.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827]">{rec.name}</span>
                      <div className="px-2 py-0.5 bg-[#E8F5EE] rounded-full">
                        <span className="text-xs font-bold text-[#1A6B3C]">{rec.matchScore}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#374151] mt-0.5">📖 <span className="font-medium">{rec.book}</span></p>
                    <p className="text-xs text-[#9CA3AF]">{rec.author} · 거래 {rec.reviewCount}회</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-[#F3F4F6]">
                  <span className="text-xs">🤖</span>
                  <p className="text-xs text-[#6B7280]">{rec.reason}</p>
                </div>
                <div className="flex items-center gap-1 mt-3 flex-wrap">
                  {rec.genres.map((g) => (
                    <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">{g}</span>
                  ))}
                  <ChevronRight size={15} className="text-[#D1D5DB] ml-auto" />
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
