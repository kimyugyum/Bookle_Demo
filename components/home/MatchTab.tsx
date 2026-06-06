'use client';

import { useState } from 'react';
import { Sparkles, Check, X, ChevronRight, Clock, ArrowLeftRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookCover } from '@/components/ui/BookCover';
import { useAppStore } from '@/lib/store';
import { DEMO_RECEIVED, AI_RECS } from '@/lib/mock-data';
import { ChatModal, type ChatPartner } from './ChatModal';

type SubTab = 'received' | 'sent';

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

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: '응답 대기', color: 'bg-amber-50 text-amber-600' },
  accepted: { label: '수락됨', color: 'bg-[#E8F5EE] text-[#1A6B3C]' },
  rejected: { label: '거절됨', color: 'bg-red-50 text-red-400' },
};

export function MatchTab() {
  const exchanges            = useAppStore((s) => s.exchanges);
  const updateExchangeStatus = useAppStore((s) => s.updateExchangeStatus);

  const [subTab, setSubTab] = useState<SubTab>('received');
  const [demoAccepted, setDemoAccepted] = useState<string[]>([]);
  const [demoRejected, setDemoRejected] = useState<string[]>([]);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);

  const sentRequests = exchanges.filter((e) => e.direction === 'sent');

  const pendingDemo = DEMO_RECEIVED.filter(
    (r) => !demoAccepted.includes(r.id) && !demoRejected.includes(r.id)
  );
  const receivedBadge = pendingDemo.length;

  const handleStatusChange = (id: string, status: 'accepted' | 'rejected') => {
    updateExchangeStatus(id, status);
  };

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
            { id: 'received' as SubTab, label: '받은 요청', badge: receivedBadge },
            { id: 'sent' as SubTab, label: '보낸 요청', badge: sentRequests.filter(r => r.status === 'pending').length },
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

        {/* ── 받은 요청 탭 ── */}
        {subTab === 'received' && (
          <>
            {pendingDemo.map((req, idx) => (
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
                    onClick={() => setDemoRejected((p) => [...p, req.id])}
                    className="flex-1 py-3 flex items-center justify-center gap-1.5 text-sm text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={16} /> 거절
                  </button>
                  <div className="w-px bg-[#F3F4F6]" />
                  <button
                    onClick={() => setDemoAccepted((p) => [...p, req.id])}
                    className="flex-1 py-3 flex items-center justify-center gap-1.5 text-sm text-[#1A6B3C] font-semibold hover:bg-[#E8F5EE] transition-colors"
                  >
                    <Check size={16} /> 수락
                  </button>
                </div>
              </div>
            ))}

            {demoAccepted.length > 0 && (
              <div className="bg-[#E8F5EE] rounded-2xl p-5 text-center animate-scale-in">
                <p className="text-3xl mb-2">🎉</p>
                <p className="text-sm font-bold text-[#1A6B3C]">교환 수락 완료!</p>
                <p className="text-xs text-[#4B9E6A] mt-1">박민준님께 알림이 전송됐어요</p>
                <button
                  onClick={() => setChatPartner({ name: '박민준', theirBook: '채식주의자', myBook: '불편한 편의점' })}
                  className="mt-3 w-full py-2.5 rounded-xl bg-[#1A6B3C] text-white text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={15} /> 채팅하기
                </button>
              </div>
            )}

            {demoRejected.length > 0 && pendingDemo.length === 0 && demoAccepted.length === 0 && (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm font-medium text-[#374151]">새로운 요청이 없어요</p>
              </div>
            )}

            {pendingDemo.length === 0 && demoAccepted.length === 0 && demoRejected.length === 0 && (
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

        {/* ── 보낸 요청 탭 ── */}
        {subTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📤</p>
                <p className="text-sm font-medium text-[#374151]">보낸 요청이 없어요</p>
                <p className="text-xs text-[#9CA3AF] mt-1">교환 탭에서 원하는 책에 요청해보세요</p>
              </div>
            ) : (
              sentRequests.map((req, idx) => {
                const statusInfo = STATUS_LABEL[req.status];
                return (
                  <div key={req.id} className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm animate-fade-in-up">
                    <div className="flex items-center gap-3">
                      <Avatar name={req.ownerName} idx={idx + 1} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#111827]">{req.ownerName}</span>
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1', statusInfo.color)}>
                            {req.status === 'pending' && <Clock size={10} />}
                            {req.status === 'accepted' && <Check size={10} />}
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                          {new Date(req.requestedAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 요청 · {req.matchScore}% 매칭
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB]">
                      <div className="flex-1 flex flex-col items-center gap-1.5">
                        <BookCover title={req.seekerBook} author={req.seekerAuthor} size="sm" />
                        <p className="text-[10px] text-[#9CA3AF]">내 책</p>
                        <p className="text-[10px] font-medium text-[#374151] text-center leading-tight line-clamp-1">{req.seekerBook}</p>
                      </div>
                      <div className="text-xl text-[#9CA3AF]">⇄</div>
                      <div className="flex-1 flex flex-col items-center gap-1.5">
                        <BookCover title={req.ownerBook} author={req.ownerAuthor} size="sm" />
                        <p className="text-[10px] text-[#9CA3AF]">상대 책</p>
                        <p className="text-[10px] font-medium text-[#374151] text-center leading-tight line-clamp-1">{req.ownerBook}</p>
                      </div>
                    </div>
                    {req.message && (
                      <p className="mt-2 text-xs text-[#6B7280] bg-[#F9FAFB] rounded-xl px-3 py-2 leading-relaxed">
                        "{req.message}"
                      </p>
                    )}
                    {req.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'rejected')}
                        className="mt-3 w-full py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#9CA3AF] hover:text-red-400 hover:border-red-200 transition-colors"
                      >
                        요청 취소
                      </button>
                    )}
                    {req.status === 'accepted' && (
                      <div className="mt-3 space-y-2">
                        <div className="p-3 rounded-xl bg-[#E8F5EE] text-center">
                          <p className="text-xs font-bold text-[#1A6B3C]">🎉 교환 수락됐어요! 배송을 준비해주세요</p>
                        </div>
                        <button
                          onClick={() => setChatPartner({ name: req.ownerName, theirBook: req.ownerBook, myBook: req.seekerBook })}
                          className="w-full py-2.5 rounded-xl bg-[#1A6B3C] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare size={14} /> 채팅하기
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

      </div>

      {chatPartner && (
        <ChatModal partner={chatPartner} onClose={() => setChatPartner(null)} />
      )}
    </div>
  );
}
