'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronRight, ArrowLeftRight, Users, BookOpen, Settings, LogOut, Bell } from 'lucide-react';
import type { AppTab } from '@/types/app';
import type { UserData } from '@/types/onboarding';

interface HeaderProps {
  user?: UserData | null;
  onTabChange?: (tab: AppTab) => void;
}

const MENU_ITEMS: { icon: React.ReactNode; label: string; tab: AppTab }[] = [
  { icon: <BookOpen size={18} />,       label: '홈',       tab: 'home'      },
  { icon: <ArrowLeftRight size={18} />, label: '교환하기', tab: 'exchange'  },
  { icon: <Users size={18} />,          label: '커뮤니티', tab: 'community' },
  { icon: <Settings size={18} />,       label: '프로필',   tab: 'profile'   },
];

export function Header({ user, onTabChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const closeDrawer = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200);
  }, []);

  const go = (tab: AppTab) => {
    closeDrawer();
    setTimeout(() => onTabChange?.(tab), 200);
  };

  const initial = user?.name?.[0] ?? null;

  return (
    <>
      <header className="bg-[#1A6B3C] px-4 py-4 flex items-center shrink-0 relative">
        {/* Left — hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col gap-1.25 p-1.5"
          aria-label="메뉴 열기"
        >
          <span className="block w-4.5 h-0.5 bg-white rounded-full" />
          <span className="block w-4.5 h-0.5 bg-white rounded-full" />
          <span className="block w-4.5 h-0.5 bg-white rounded-full" />
        </button>

        {/* Center — logo (absolute so it doesn't squeeze sides) */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <Image src="/logo-v2.png" alt="Bookle" width={46} height={26} priority />
        </div>

        {/* Right — user + bell */}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => onTabChange?.('profile')}>
            {initial ? (
              <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-bold">
                {initial}
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            )}
          </button>

          <button className="relative p-0.5">
            <Bell size={19} className="text-white" />
            {user && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-400 text-white text-[8px] font-bold flex items-center justify-center">
                2
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Drawer overlay */}
      {open && (
        <div className={`fixed inset-0 z-60 flex transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`}>
          {/* Drawer panel */}
          <div className={`w-64 h-full flex flex-col ${closing ? 'drawer-exit' : 'drawer-enter'}`}
            style={{ background: 'rgba(10,40,25,0.72)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
          >
            {/* Top: X button */}
            <div className="flex justify-end px-5 pt-14 pb-2">
              <button onClick={closeDrawer} className="p-1.5 rounded-full hover:bg-white/15 transition-colors text-white/70 hover:text-white">
                <X size={21} />
              </button>
            </div>

            {/* User info */}
            <div className="px-5 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {initial ?? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-white font-bold text-base">사용자</p>
                  <p className="text-white/55 text-xs mt-0.5">{user?.email ?? '로그인이 필요해요'}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-white/15 mb-2" />

            {/* Menu items */}
            <nav className="flex-1 px-3 space-y-0.5">
              {MENU_ITEMS.map(({ icon, label, tab }) => (
                <button
                  key={tab}
                  onClick={() => go(tab)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white font-medium hover:bg-white/12 transition-colors text-base"
                >
                  <span className="text-white/70">{icon}</span>
                  <span>{label}</span>
                  <ChevronRight size={14} className="ml-auto text-white/30" />
                </button>
              ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 pb-10 pt-3 border-t border-white/12 mt-3">
              <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/45 hover:text-red-300 hover:bg-white/10 transition-colors text-base">
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            </div>
          </div>

          {/* Overlay */}
          <div className="flex-1" onClick={closeDrawer} />
        </div>
      )}
    </>
  );
}
