'use client';

import { ChevronRight, Bell, Shield, HelpCircle, LogOut, Pencil, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { genreLabels } from '@/lib/user-store';
import type { UserData } from '@/types/onboarding';

interface ProfileTabProps {
  user: UserData | null;
}

const SETTINGS_ITEMS = [
  { Icon: Bell, label: '알림 설정', sub: '새 요청, 메시지 알림' },
  { Icon: Shield, label: '개인정보 보호', sub: '계정 보안 관리' },
  { Icon: HelpCircle, label: '고객센터', sub: 'FAQ, 문의하기' },
];

export function ProfileTab({ user }: ProfileTabProps) {
  const displayGenres = genreLabels(user?.genres ?? []);
  const bookCount = user?.book ? 1 : 0;

  return (
    <div>
      {/* Green header */}
      <div className="bg-[#1A6B3C] px-4 pt-14 pb-8 relative">
        <button className="absolute top-14 right-4 p-2 rounded-xl bg-white/10">
          <Settings size={18} className="text-white" />
        </button>

        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-4xl border-2 border-white/30">
              🧑‍💼
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F0C040] flex items-center justify-center shadow-md">
              <Pencil size={11} className="text-white" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-white text-xl font-bold">{user?.name ?? '독서인'}</h2>
            <p className="text-[#A8D5B8] text-sm mt-0.5">{user?.email ?? '로그인이 필요해요'}</p>
          </div>
          <div className="flex gap-8 mt-1">
            {[
              { label: '교환 완료', value: '0' },
              { label: '등록 도서', value: String(bookCount) },
              { label: '관심 장르', value: String(displayGenres.length) },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-white text-2xl font-black">{s.value}</p>
                <p className="text-[#A8D5B8] text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-4">
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
              <div className="w-10 h-10 rounded-xl bg-[#E8F5EE] flex items-center justify-center text-xl">
                📚
              </div>
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
            <p className="text-3xl mb-2">📦</p>
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
