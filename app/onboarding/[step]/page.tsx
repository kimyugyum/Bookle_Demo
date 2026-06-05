'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SplashStep } from '@/components/onboarding/SplashStep';
import { SignupStep } from '@/components/onboarding/SignupStep';
import { VerifyStep } from '@/components/onboarding/VerifyStep';
import { TasteStep } from '@/components/onboarding/TasteStep';
import { RegisterBookStep } from '@/components/onboarding/RegisterBookStep';
import { MatchingStep } from '@/components/onboarding/MatchingStep';
import { CompleteScreen } from '@/components/onboarding/CompleteScreen';
import { saveDraft, loadDraft, clearDraft, draftToUserData } from '@/lib/draft-store';
import { saveUser } from '@/lib/user-store';
import type { BookData } from '@/types/onboarding';

export default function OnboardingStepPage() {
  const params = useParams();
  const router = useRouter();
  const step = Number(params.step);
  const [completed, setCompleted] = useState(false);
  const [draft, setDraft] = useState(() => loadDraft());

  useEffect(() => {
    setDraft(loadDraft());
  }, [step]);

  const go = (n: number) => router.push(`/onboarding/${n}`);

  if (completed) {
    return (
      <CompleteScreen
        userData={draftToUserData(draft)}
        onGoHome={() => {
          clearDraft();
          router.push('/home');
        }}
      />
    );
  }

  switch (step) {
    case 1:
      return <SplashStep onNext={() => go(2)} />;

    case 2:
      return (
        <SignupStep
          onNext={(data) => { saveDraft(data); go(3); }}
          onBack={() => go(1)}
        />
      );

    case 3:
      return (
        <VerifyStep
          onNext={(phone) => { saveDraft({ phone }); go(4); }}
          onBack={() => go(2)}
        />
      );

    case 4:
      return (
        <TasteStep
          onNext={(genres) => { saveDraft({ genres }); go(5); }}
          onBack={() => go(3)}
        />
      );

    case 5:
      return (
        <RegisterBookStep
          onNext={(book: BookData) => { saveDraft({ book }); go(6); }}
          onBack={() => go(4)}
        />
      );

    case 6:
      return (
        <MatchingStep
          userData={draftToUserData(draft)}
          onComplete={() => {
            saveUser(draftToUserData(draft));
            setCompleted(true);
          }}
        />
      );

    default:
      router.replace('/onboarding/1');
      return null;
  }
}
