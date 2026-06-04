'use client';

import {
  House,
  ArrowsLeftRight,
  Sparkle,
  UsersThree,
  UserCircle,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { AppTab } from '@/types/app';

interface BottomNavProps {
  active: AppTab;
  onChange: (tab: AppTab) => void;
  matchBadge?: number;
}

const TABS: {
  id: AppTab;
  label: string;
  Icon: React.ComponentType<{ size?: number; weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone' }>;
}[] = [
  { id: 'home',      label: '홈',     Icon: House           },
  { id: 'exchange',  label: '교환',   Icon: ArrowsLeftRight },
  { id: 'match',     label: '매칭',   Icon: Sparkle         },
  { id: 'community', label: '커뮤니티', Icon: UsersThree      },
  { id: 'profile',   label: '프로필',  Icon: UserCircle      },
];

export function BottomNav({ active, onChange, matchBadge = 1 }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#F3F4F6] z-50">
      <div className="flex">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          const badge = id === 'match' ? matchBadge : 0;

          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-3 relative transition-colors',
                isActive ? 'text-[#1A6B3C]' : 'text-[#9CA3AF]'
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#1A6B3C]" />
              )}
              <div className="relative">
                <Icon
                  size={23}
                  weight={isActive ? 'fill' : 'regular'}
                />
                {badge > 0 && (
                  <div className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {badge}
                  </div>
                )}
              </div>
              <span className={cn('text-[10px]', isActive ? 'font-bold' : 'font-medium')}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
