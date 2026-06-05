'use client';

import { ChevronRight, Bell, Shield, HelpCircle, LogOut, Pencil, Settings, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { genreLabels, completionSteps, completionPct } from '@/lib/user-store';
import { BookCover } from '@/components/ui/BookCover';
import type { UserData } from '@/types/onboarding';
import type { AppTab } from '@/types/app';

interface ProfileTabProps {
  user: UserData | null;
  onTabChange?: (tab: AppTab) => void;
}

interface ProfileTabProps {
  user: UserData | null;
}

const SETTINGS_ITEMS = [
  { Icon: Bell, label: '알림 설정', sub: '새 요청, 메시지 알림' },
  { Icon: Shield, label: '개인정보 보호', sub: '계정 보안 관리' },
  { Icon: HelpCircle, label: '고객센터', sub: 'FAQ, 문의하기' },
];

export function ProfileTab({ user, onTabChange }: ProfileTabProps) {
  const displayGenres = genreLabels(user?.genres ?? []);
  const bookCount = user?.book ? 1 : 0;
  const pct = completionPct(user);
  const steps = completionSteps(user);
  const nextStep = steps.find((s) => !s.done);

  return (
    <div>
      {/* Green header */}
      <div className="px-4 pt-14 pb-12 relative" style={{ background: 'linear-gradient(180deg, #1A6B3C 0%, #ffffff 100%)' }}>
<div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center border-2 border-white/20 text-white text-4xl font-black" style={{ background: '#7C3AED' }}>
              사
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F0C040] flex items-center justify-center shadow-md">
              <Pencil size={11} className="text-white" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-white text-xl font-bold">사용자</h2>
            <p className="text-[#A8D5B8] text-sm mt-0.5">{user?.email ?? '로그인이 필요해요'}</p>
          </div>
          <div className="flex gap-8 mt-1">
            {[
              { label: '교환 완료', value: '0' },
              { label: '등록 도서', value: String(bookCount) },
              { label: '관심 장르', value: String(displayGenres.length) },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#111827] text-2xl font-black">{s.value}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{s.label}</p>
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
                    : <Circle size={14} className="text-[#D1D5DB] shrink-0" />}
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

        {/* ── 내 교환 현황 ── */}
        {user && (
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#111827]">내 교환 현황</h3>
              <button onClick={() => onTabChange?.('match')} className="text-xs text-[#1A6B3C] font-medium flex items-center gap-0.5">
                전체 보기 <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex gap-3">
              {[
                { label: '등록 도서', value: `${bookCount}권`, color: 'bg-[#E8F5EE] text-[#1A6B3C]' },
                { label: '받은 요청', value: '1건',           color: 'bg-red-50 text-red-500'       },
                { label: '완료',     value: '0건',            color: 'bg-[#F3F4F6] text-[#6B7280]'  },
              ].map((item) => (
                <div key={item.label} className="flex-1 rounded-xl bg-[#F9FAFB] p-2.5 text-center">
                  <div className={`text-xs font-bold px-1.5 py-0.5 rounded-md inline-block mb-1 ${item.color}`}>
                    {item.value}
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm text-center">
            <p className="text-sm text-[#6B7280] mb-3">온보딩을 완료하면 프로필이 채워져요</p>
            <a href="/onboarding" className="block w-full py-3 rounded-xl bg-[#1A6B3C] text-white text-sm font-bold">
              시작하기
            </a>
          </div>
        )}

        {/* Genres */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">관심 장르</h3>
            <button className="text-xs text-[#1A6B3C] font-medium">편집</button>
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

        {/* My books */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">내 도서 목록</h3>
            <button className="text-xs text-[#1A6B3C] font-medium">+ 추가</button>
          </div>
          {user?.book ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB]">
              <BookCover title={user.book.title} author={user.book.author} size="xs" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111827]">{user.book.title}</p>
                <p className="text-xs text-[#6B7280]">{user.book.author}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#E8F5EE] text-[#1A6B3C]">
                  상태 {user.book.condition}
                </span>
                <p className="text-[10px] text-amber-500 mt-1 font-medium">교환 대기 중</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-[#9CA3AF]">등록된 도서가 없어요</p>
            </div>
          )}
        </div>

        {/* Exchange history */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
          <h3 className="text-sm font-bold text-[#111827] mb-3">교환 내역</h3>
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <p className="text-sm text-[#6B7280]">아직 완료된 교환이 없어요</p>
            <p className="text-xs text-[#9CA3AF] mt-1">첫 교환을 시작해보세요!</p>
          </div>
        </div>

        {/* Settings */}
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

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E5E7EB] text-sm text-[#9CA3AF] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
          <LogOut size={15} /> 로그아웃
        </button>
      </div>
    </div>
  );
}
