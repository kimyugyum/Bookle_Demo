import type { UserData } from '@/types/onboarding';

const KEY = 'bookle_onboarding_draft';

export function saveDraft(data: Partial<UserData>): void {
  if (typeof window === 'undefined') return;
  const prev = loadDraft();
  localStorage.setItem(KEY, JSON.stringify({ ...prev, ...data }));
}

export function loadDraft(): Partial<UserData> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<UserData>) : {};
  } catch {
    return {};
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

export function draftToUserData(draft: Partial<UserData>): UserData {
  return {
    name: draft.name ?? '',
    email: draft.email ?? '',
    password: draft.password ?? '',
    phone: draft.phone ?? '',
    genres: draft.genres ?? [],
    book: draft.book ?? null,
  };
}
