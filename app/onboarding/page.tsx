'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveUser } from '@/lib/user-store';
import { OnboardingStep, UserData, BookData } from '@/types/onboarding';
import { SplashStep } from '@/components/onboarding/SplashStep';
import { SignupStep } from '@/components/onboarding/SignupStep';
import { VerifyStep } from '@/components/onboarding/VerifyStep';
import { TasteStep } from '@/components/onboarding/TasteStep';
import { RegisterBookStep } from '@/components/onboarding/RegisterBookStep';
import { MatchingStep } from '@/components/onboarding/MatchingStep';
import { CompleteScreen } from '@/components/onboarding/CompleteScreen';

const INITIAL_USER: UserData = {
  name: '',
  email: '',
  password: '',
  phone: '',
  genres: [],
  book: null,
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('splash');
  const [userData, setUserData] = useState<UserData>(INITIAL_USER);
  const [completed, setCompleted] = useState(false);

  const update = (data: Partial<UserData>) =>
    setUserData((prev) => ({ ...prev, ...data }));

  if (completed) {
    return (
      <CompleteScreen
        userData={userData}
        onGoHome={() => router.push('/home')}
      />
    );
  }

  switch (step) {
    case 'splash':
      return <SplashStep onNext={() => setStep('signup')} />;

    case 'signup':
      return (
        <SignupStep
          onNext={(data) => { update(data); setStep('verify'); }}
          onBack={() => setStep('splash')}
        />
      );

    case 'verify':
      return (
        <VerifyStep
          onNext={(phone) => { update({ phone }); setStep('taste'); }}
          onBack={() => setStep('signup')}
        />
      );

    case 'taste':
      return (
        <TasteStep
          onNext={(genres) => { update({ genres }); setStep('register-book'); }}
          onBack={() => setStep('verify')}
        />
      );

    case 'register-book':
      return (
        <RegisterBookStep
          onNext={(book: BookData) => { update({ book }); setStep('matching'); }}
          onBack={() => setStep('taste')}
        />
      );

    case 'matching':
      return (
        <MatchingStep
          userData={userData}
          onComplete={() => {
            saveUser(userData);
            setCompleted(true);
          }}
        />
      );

    default:
      return null;
  }
}
