'use client';

import { useState } from 'react';
import { Sparkles, Check, X, ChevronRight, Clock, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookCover } from '@/components/ui/BookCover';

type SubTab = 'received' | 'sent';

const RECEIVED = [
  {
    id: 1,
    name: '박민준',
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
    theirBook: '코스모스',
    theirAuthor: '칼 세이건',
    myBook: '불편한 편의점',
    matchScore: 87,
    time: '1일 전',
  },
];

const AI_RECS = [
  { id: 1, name: '김태호', book: '사피엔스', author: '유발 하라리', matchScore: 91, reviewCount: 24, genres: ['역사/인문', '과학/기술'], reason: '역사/인문 장르 취향이 일치해요' },
  { id: 2, name: '정유진', book: '아몬드', author: '손원평', matchScore: 85, reviewCount: 6, genres: ['소설', '자기계발'], reason: '소설 선호도가 비슷해요' },
  { id: 3, name: '최준서', book: '미드나잇 라이브러리', author: '매트 헤이그', matchScore: 79, reviewCount: 15, genres: ['소설', '에세이'], reason: '에세이 장르 취향이 비슷해요' },
];

const AVATAR_COLORS = ['#7C3AED', '#DB2777', '#0284C7', '#D97706', '#059669'];
function Avatar({ name, idx }: { name: string; idx: number }) {
  return (
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
      style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
    >
      {name[0]}
    </div>
  );
}

export function MatchTab() {
  const [subTab, setSubTab] = useState<SubTab>('received');
  const [accepted, setAccepted] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);

  const pendingReceived = RECEIVED.filter((r) => !accepted.includes(r.id) && !rejected.includes(r.id));

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-[#F3F4F6] px-4 pt-4 sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-1">
          <ArrowLeftRight size={18} className="text-[#1A6B3C]" />
          <h1 className="text-lg font-bold text-[#111827]">매칭</h1>
        </div>
        <p className="text-xs text-[#9CA3AF] mb-3">AI가 취향을 분석해 최적의 교환 상대를 찾아드려요</p>
        <div className="flex">
          {([
            { id: 'received' as SubTab, label: '받은 요청', badge: pendingReceived.length },
            { id: 'sent' as SubTab, label: '보낸 요청', badge: 0 },
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
            {pendingReceived.map((req, idx) => (
              <div key={req.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm animate-fade-in-up">
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={req.name} idx={idx} />
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
              <div className="text-center py-8">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm font-medium text-[#374151]">새로운 요청이 없어요</p>
              </div>
            )}

            {/* AI 추천 */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={15} className="text-[#1A6B3C]" />
                <h2 className="text-base font-bold text-[#111827]">AI 추천 매칭</h2>
              </div>
              {AI_RECS.map((rec, idx) => (
                <button
                  key={rec.id}
                  className="w-full bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm text-left hover:border-[#1A6B3C] hover:shadow-md transition-all animate-fade-in-up mb-3"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={rec.name} idx={rec.id} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">{rec.name}</span>
                        <div className="px-2 py-0.5 bg-[#E8F5EE] rounded-full">
                          <span className="text-xs font-bold text-[#1A6B3C]">{rec.matchScore}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-[#374151] mt-0.5 font-medium">{rec.book}</p>
                      <p className="text-xs text-[#9CA3AF]">{rec.author} · 거래 {rec.reviewCount}회</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-[#F3F4F6]">
                    <Sparkles size={11} className="text-[#1A6B3C] shrink-0" />
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
            </div>
          </>
        )}

        {/* Sent */}
        {subTab === 'sent' && (
          <>
            {SENT.map((req, idx) => (
              <div key={req.id} className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <Avatar name={req.name} idx={idx + 1} />
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

      </div>
    </div>
  );
}
