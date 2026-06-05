'use client';

import { useState, useEffect } from 'react';
import type { AppTab } from '@/types/app';
import type { UserData } from '@/types/onboarding';
import { loadUser, consumeFirstVisit } from '@/lib/user-store';
import { BottomNav } from '@/components/home/BottomNav';
import { Header } from '@/components/home/Header';
import { HomeTab } from '@/components/home/HomeTab';
import { ExchangeTab } from '@/components/home/ExchangeTab';
import { MatchTab } from '@/components/home/MatchTab';
import { CommunityTab } from '@/components/home/CommunityTab';
import { ProfileTab } from '@/components/home/ProfileTab';

export default function HomePage() {
  const [tab, setTab] = useState<AppTab>('home');
  const [user, setUser] = useState<UserData | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    setUser(loadUser());
    setIsFirstVisit(consumeFirstVisit());
  }, []);

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        <Header user={user} onTabChange={setTab} />
        <div className="flex-1 overflow-y-auto pb-20">
          {tab === 'home' && (
            <HomeTab user={user} isFirstVisit={isFirstVisit} onTabChange={setTab} />
          )}
          {tab === 'exchange' && <ExchangeTab userGenres={user?.genres ?? []} />}
          {tab === 'match' && <MatchTab />}
          {tab === 'community' && <CommunityTab />}
          {tab === 'profile' && <ProfileTab user={user} onTabChange={setTab} />}
        </div>
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </div>
  );
}
