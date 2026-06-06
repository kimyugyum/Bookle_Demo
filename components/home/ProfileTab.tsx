'use client';

import { useState } from 'react';
import {
  ChevronRight, Bell, Shield, HelpCircle, LogOut, Pencil,
  CheckCircle2, Circle, ArrowRight, X, Truck, PackageCheck, Trash2,
} from 'lucide-react';
import { genreLabels, completionSteps, completionPct, GENRE_LABELS } from '@/lib/user-store';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { BookCover } from '@/components/ui/BookCover';
import type { AppTab } from '@/types/app';
import type { BookData } from '@/types/onboarding';

interface ProfileTabProps {
  onTabChange?: (tab: AppTab) => void;
}

const SETTINGS_ITEMS = [
  { Icon: Bell,       label: '알림 설정',    sub: '새 요청, 메시지 알림' },
  { Icon: Shield,     label: '개인정보 보호', sub: '계정 보안 관리' },
  { Icon: HelpCircle, label: '고객센터',     sub: 'FAQ, 문의하기' },
];

const STATUS_INFO: Record<string, { label: string; color: string }> = {
  pending:   { label: '응답 대기', color: 'bg-amber-50 text-amber-600' },
  accepted:  { label: '수락됨',   color: 'bg-[#E8F5EE] text-[#1A6B3C]' },
  shipping:  { label: '배송 중',  color: 'bg-blue-50 text-blue-600' },
  completed: { label: '교환 완료', color: 'bg-purple-50 text-purple-600' },
  rejected:  { label: '거절됨',   color: 'bg-red-50 text-red-400' },
};

const AVATAR_COLORS = ['#7C3AED', '#DB2777', '#0284C7', '#D97706', '#059669'];
function nameToColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const ALL_GENRE_IDS = Object.keys(GENRE_LABELS);

type ExSubTab = 'ongoing' | 'completed';

// ── 장르 편집 모달 ──────────────────────────────────────────────
function GenreEditModal({
  current,
  onSave,
  onClose,
}: {
  current: string[];
  onSave: (genres: string[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(current);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl flex flex-col overflow-hidden animate-slide-up"
        style={{ maxHeight: '85dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#111827]">관심 장르 편집</h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">최대 5개 선택</p>
            </div>
            <button onClick={onClose} className="p-1 text-[#9CA3AF]"><X size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 min-h-0">
          <div className="grid grid-cols-3 gap-2 pb-2">
            {ALL_GENRE_IDS.map((id) => {
              const isOn = selected.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  className={cn(
                    'py-3 rounded-2xl border text-xs font-semibold transition-all',
                    isOn
                      ? 'border-[#1A6B3C] bg-[#E8F5EE] text-[#1A6B3C]'
                      : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                  )}
                >
                  {GENRE_LABELS[id]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-5 pt-3 pb-8 shrink-0">
          <button
            onClick={() => { onSave(selected); onClose(); }}
            disabled={selected.length === 0}
            className="w-full py-3 rounded-2xl bg-[#1A6B3C] text-white text-sm font-bold disabled:opacity-40"
          >
            {selected.length}개 선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 도서 편집 모달 ──────────────────────────────────────────────
function BookEditModal({
  initial,
  onSave,
  onClose,
}: {
  initial: BookData | null;
  onSave: (book: BookData) => void;
  onClose: () => void;
}) {
  const [title, setTitle]           = useState(initial?.title ?? '');
  const [author, setAuthor]         = useState(initial?.author ?? '');
  const [condition, setCondition]   = useState<'A' | 'B' | 'C'>(initial?.condition ?? 'A');
  const [description, setDescription] = useState(initial?.description ?? '');

  const canSave = title.trim().length > 0 && author.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl px-5 pt-5 pb-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#111827]">도서 정보 수정</h2>
          <button onClick={onClose} className="p-1 text-[#9CA3AF]"><X size={20} /></button>
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="text-xs font-medium text-[#374151] mb-1.5 block">책 제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="책 제목"
              className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-sm focus:border-[#1A6B3C] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#374151] mb-1.5 block">저자</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="저자"
              className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-sm focus:border-[#1A6B3C] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#374151] mb-1.5 block">책 상태</label>
            <div className="flex gap-2">
              {(['A', 'B', 'C'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-semibold border transition-all',
                    condition === c
                      ? 'border-[#1A6B3C] bg-[#E8F5EE] text-[#1A6B3C]'
                      : 'border-[#E5E7EB] text-[#6B7280]'
                  )}
                >
                  {c === 'A' ? '최상 (A)' : c === 'B' ? '상 (B)' : '중 (C)'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#374151] mb-1.5 block">한 줄 소개 (선택)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="책에 대한 간단한 소개"
              rows={2}
              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#1A6B3C] focus:outline-none resize-none"
            />
          </div>
        </div>

        <button
          onClick={() => { onSave({ title, author, condition, description }); onClose(); }}
          disabled={!canSave}
          className="w-full py-3 rounded-2xl bg-[#1A6B3C] text-white text-sm font-bold disabled:opacity-40"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

// ── ProfileTab ──────────────────────────────────────────────
export function ProfileTab({ onTabChange }: ProfileTabProps) {
  const user               = useAppStore((s) => s.user);
  const exchanges          = useAppStore((s) => s.exchanges);
  const logout             = useAppStore((s) => s.logout);
  const updateExchangeStatus = useAppStore((s) => s.updateExchangeStatus);
  const updateGenres       = useAppStore((s) => s.updateGenres);
  const updateBook         = useAppStore((s) => s.updateBook);
  const removeBook         = useAppStore((s) => s.removeBook);

  const displayGenres = genreLabels(user?.genres ?? []);
  const bookCount = user?.book ? 1 : 0;
  const pct   = completionPct(user);
  const steps = completionSteps(user);
  const nextStep = steps.find((s) => !s.done);

  const [exSubTab, setExSubTab]     = useState<ExSubTab>('ongoing');
  const [genreModal, setGenreModal] = useState(false);
  const [bookModal, setBookModal]   = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const ongoingList   = exchanges.filter((e) => ['pending', 'accepted', 'shipping'].includes(e.status));
  const completedList = exchanges.filter((e) => ['completed', 'rejected'].includes(e.status));
  const displayList   = exSubTab === 'ongoing' ? ongoingList : completedList;
  const doneCount     = exchanges.filter((e) => e.status === 'completed').length;

  return (
    <div>
      {/* ── Green header ── */}
      <div className="px-4 pt-14 pb-12 relative" style={{ background: 'linear-gradient(180deg, #1A6B3C 0%, #ffffff 100%)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center border-2 border-white/20 text-white text-4xl font-black"
              style={{ background: user?.name ? nameToColor(user.name) : '#7C3AED' }}
            >
              {user?.name?.[0] ?? '?'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F0C040] flex items-center justify-center shadow-md">
              <Pencil size={11} className="text-white" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-white text-xl font-bold">{user?.name ?? '사용자'}</h2>
            <p className="text-white/70 text-sm mt-0.5">{user?.email ?? '로그인이 필요해요'}</p>
          </div>
          <div className="flex gap-8 mt-1">
            {[
              { label: '교환 완료', value: String(doneCount) },
              { label: '등록 도서', value: String(bookCount) },
              { label: '관심 장르', value: String(displayGenres.length) },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-white text-2xl font-black">{s.value}</p>
                <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-0 pb-4 space-y-4 -mt-6 relative z-10">

        {/* ── 프로필 완성도 ── */}
        {user && pct < 100 && (
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#111827]">프로필 완성도</h3>
              <span className="text-sm font-black text-[#1A6B3C]">{pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E8F5EE] overflow-hidden mb-3">
              <div className="h-full rounded-full bg-[#1A6B3C] transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="space-y-2">
              {steps.map((step) => (
                <div key={step.label} className="flex items-center gap-2">
                  {step.done
                    ? <CheckCircle2 size={14} className="text-[#1A6B3C] shrink-0" />
                    : <Circle      size={14} className="text-[#D1D5DB] shrink-0" />}
                  <span className={cn('text-xs', step.done ? 'text-[#9CA3AF] line-through' : 'text-[#374151] font-medium')}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            {nextStep && (
              <button
                onClick={() => onTabChange?.(nextStep.label.includes('요청') ? 'match' : 'profile')}
                className="mt-3 w-full py-2 rounded-xl bg-[#E8F5EE] text-[#1A6B3C] text-xs font-semibold flex items-center justify-center gap-1"
              >
                다음: {nextStep.label} <ArrowRight size={12} />
              </button>
            )}
          </div>
        )}

        {/* ── 미로그인 ── */}
        {!user && (
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm text-center">
            <p className="text-sm text-[#6B7280] mb-3">온보딩을 완료하면 프로필이 채워져요</p>
            <a href="/onboarding" className="block w-full py-3 rounded-xl bg-[#1A6B3C] text-white text-sm font-bold">
              시작하기
            </a>
          </div>
        )}

        {/* ── 내 교환 현황 ── */}
        {user && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-sm font-bold text-[#111827]">내 교환 현황</h3>
              <button
                onClick={() => onTabChange?.('match')}
                className="text-xs text-[#1A6B3C] font-medium flex items-center gap-0.5"
              >
                매칭 탭 <ChevronRight size={12} />
              </button>
            </div>

            <div className="flex border-b border-[#F3F4F6] mx-4">
              {([
                { id: 'ongoing'   as ExSubTab, label: '진행 중',  count: ongoingList.length },
                { id: 'completed' as ExSubTab, label: '완료/거절', count: completedList.length },
              ]).map(({ id, label, count }) => (
                <button
                  key={id}
                  onClick={() => setExSubTab(id)}
                  className={cn(
                    'flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1 relative',
                    exSubTab === id ? 'text-[#1A6B3C]' : 'text-[#9CA3AF]'
                  )}
                >
                  {label}
                  {count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                  {exSubTab === id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A6B3C] rounded-t" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4">
              {displayList.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-3xl mb-2">{exSubTab === 'ongoing' ? '📤' : '📋'}</p>
                  <p className="text-sm text-[#6B7280]">
                    {exSubTab === 'ongoing' ? '진행 중인 교환이 없어요' : '완료된 교환이 없어요'}
                  </p>
                  {exSubTab === 'ongoing' && (
                    <button
                      onClick={() => onTabChange?.('exchange')}
                      className="mt-3 text-xs text-[#1A6B3C] font-medium underline"
                    >
                      교환 탭에서 요청해보세요
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {displayList.map((req) => {
                    const statusInfo = STATUS_INFO[req.status] ?? STATUS_INFO.pending;
                    const counterpart = req.direction === 'sent' ? req.ownerName : req.seekerName;
                    return (
                      <div key={req.id} className="p-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB]">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                            style={{ background: nameToColor(counterpart) }}
                          >
                            {counterpart[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-[#111827]">{counterpart}</span>
                              <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', statusInfo.color)}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#9CA3AF]">
                              {new Date(req.requestedAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                              {' · '}{req.direction === 'sent' ? '보낸 요청' : '받은 요청'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-white">
                          <div className="flex-1 flex items-center gap-1.5 min-w-0">
                            <BookCover title={req.seekerBook} author={req.seekerAuthor} size="xs" />
                            <p className="text-[10px] text-[#374151] font-medium line-clamp-2 leading-tight">{req.seekerBook}</p>
                          </div>
                          <span className="text-[#9CA3AF] text-sm shrink-0">⇄</span>
                          <div className="flex-1 flex items-center gap-1.5 min-w-0">
                            <BookCover title={req.ownerBook} author={req.ownerAuthor} size="xs" />
                            <p className="text-[10px] text-[#374151] font-medium line-clamp-2 leading-tight">{req.ownerBook}</p>
                          </div>
                        </div>

                        {/* 상태별 액션 버튼 */}
                        {req.status === 'pending' && req.direction === 'sent' && (
                          <button
                            onClick={() => updateExchangeStatus(req.id, 'rejected')}
                            className="mt-2 w-full py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#9CA3AF] hover:text-red-400 hover:border-red-200 transition-colors"
                          >
                            요청 취소
                          </button>
                        )}
                        {req.status === 'accepted' && (
                          <button
                            onClick={() => updateExchangeStatus(req.id, 'shipping')}
                            className="mt-2 w-full py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-600 font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
                          >
                            <Truck size={13} /> 배송 완료 신고
                          </button>
                        )}
                        {req.status === 'shipping' && (
                          <button
                            onClick={() => updateExchangeStatus(req.id, 'completed')}
                            className="mt-2 w-full py-2 rounded-xl bg-[#E8F5EE] border border-[#A8D5B8] text-xs text-[#1A6B3C] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#d4ede0] transition-colors"
                          >
                            <PackageCheck size={13} /> 수령 확인 완료
                          </button>
                        )}
                        {req.status === 'completed' && (
                          <p className="text-[10px] font-bold text-purple-600 text-center mt-2">✅ 교환이 완료됐어요!</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 관심 장르 ── */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">관심 장르</h3>
            {user && (
              <button
                onClick={() => setGenreModal(true)}
                className="text-xs text-[#1A6B3C] font-medium"
              >
                편집
              </button>
            )}
          </div>
          {displayGenres.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {displayGenres.map((g) => (
                <span key={g} className="px-3 py-1.5 rounded-full bg-[#E8F5EE] text-[#1A6B3C] text-xs font-medium">
                  {g}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#9CA3AF]">아직 설정된 장르가 없어요</p>
          )}
        </div>

        {/* ── 내 도서 목록 ── */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">내 도서 목록</h3>
            {user && !user.book && (
              <button
                onClick={() => setBookModal(true)}
                className="text-xs text-[#1A6B3C] font-medium"
              >
                + 추가
              </button>
            )}
          </div>
          {user?.book ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB]">
              <BookCover title={user.book.title} author={user.book.author} size="xs" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111827] line-clamp-1">{user.book.title}</p>
                <p className="text-xs text-[#6B7280]">{user.book.author}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setBookModal(true)}
                  className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E8F5EE] transition-colors"
                >
                  <Pencil size={12} className="text-[#6B7280]" />
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={12} className="text-[#9CA3AF] hover:text-red-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-[#9CA3AF]">등록된 도서가 없어요</p>
            </div>
          )}
        </div>

        {/* ── 독서 기록 (Book Passport) ── */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-bold text-[#111827]">독서 기록</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#1A6B3C] font-medium">Book Passport</span>
          </div>
          {doneCount > 0 ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-xl bg-[#E8F5EE] text-center">
                  <p className="text-2xl font-black text-[#1A6B3C]">{doneCount}</p>
                  <p className="text-[10px] text-[#4B9E6A] mt-0.5">총 교환 완료</p>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-[#F9FAFB] text-center">
                  <p className="text-2xl font-black text-[#374151]">{displayGenres.length}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">관심 장르</p>
                </div>
              </div>
              <div className="space-y-2">
                {exchanges
                  .filter((e) => e.status === 'completed')
                  .map((req) => (
                    <div key={req.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9FAFB]">
                      <span className="text-base">📖</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#374151] line-clamp-1">
                          {req.direction === 'sent' ? req.ownerBook : req.seekerBook}
                        </p>
                        <p className="text-[10px] text-[#9CA3AF]">
                          {new Date(req.requestedAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 교환 완료
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">📚</p>
              <p className="text-sm text-[#6B7280]">아직 완료된 교환이 없어요</p>
              <p className="text-xs text-[#9CA3AF] mt-1">첫 교환을 완료하면 기록이 쌓여요</p>
            </div>
          )}
        </div>

        {/* ── 설정 ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          {SETTINGS_ITEMS.map(({ Icon, label, sub }, idx) => (
            <button
              key={label}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#F9FAFB] transition-colors text-left',
                idx > 0 && 'border-t border-[#F3F4F6]'
              )}
            >
              <div className="w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                <Icon size={15} className="text-[#6B7280]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#111827]">{label}</p>
                <p className="text-xs text-[#9CA3AF]">{sub}</p>
              </div>
              <ChevronRight size={15} className="text-[#D1D5DB]" />
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E5E7EB] text-sm text-[#9CA3AF] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
        >
          <LogOut size={15} /> 로그아웃
        </button>
      </div>

      {/* ── 장르 편집 모달 ── */}
      {genreModal && (
        <GenreEditModal
          current={user?.genres ?? []}
          onSave={updateGenres}
          onClose={() => setGenreModal(false)}
        />
      )}

      {/* ── 도서 편집 모달 ── */}
      {bookModal && (
        <BookEditModal
          initial={user?.book ?? null}
          onSave={updateBook}
          onClose={() => setBookModal(false)}
        />
      )}

      {/* ── 도서 삭제 확인 ── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" onClick={() => setConfirmDelete(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-sm bg-white rounded-3xl p-6 text-center animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-2xl mb-2">🗑️</p>
            <p className="text-base font-bold text-[#111827] mb-1">도서를 삭제할까요?</p>
            <p className="text-xs text-[#9CA3AF] mb-5">삭제하면 교환 요청을 받을 수 없어요</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 rounded-2xl border border-[#E5E7EB] text-sm text-[#6B7280]"
              >
                취소
              </button>
              <button
                onClick={() => { removeBook(); setConfirmDelete(false); }}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
