import type { UserData } from '@/types/onboarding';

const USER_KEY = 'bookle_user';
const VISITED_KEY = 'bookle_visited';
const REQUESTED_KEY = 'bookle_first_request';

export const GENRE_LABELS: Record<string, string> = {
  fiction: '소설',
  selfhelp: '자기계발',
  science: '과학/기술',
  history: '역사/인문',
  economy: '경제/경영',
  essay: '에세이',
  art: '예술/문화',
  kids: '어린이/청소년',
  comic: '만화/그래픽',
  travel: '여행/취미',
  poetry: '시/희곡',
  mystery: '추리/스릴러',
};

export function saveUser(data: UserData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(data));
}

export function loadUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserData) : null;
  } catch {
    return null;
  }
}

/** Returns true only the very first time it's called in this browser. */
export function consumeFirstVisit(): boolean {
  if (typeof window === 'undefined') return false;
  if (!localStorage.getItem(VISITED_KEY)) {
    localStorage.setItem(VISITED_KEY, '1');
    return true;
  }
  return false;
}

export function markFirstRequest(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REQUESTED_KEY, '1');
}

function hasFirstRequest(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(REQUESTED_KEY);
}

export function completionSteps(user: UserData | null) {
  return [
    { label: '기본 정보 입력', done: !!(user?.name && user?.email) },
    { label: '휴대폰 인증', done: !!(user?.phone) },
    { label: '취향 설정 (장르)', done: (user?.genres?.length ?? 0) > 0 },
    { label: '첫 번째 책 등록', done: !!(user?.book) },
    { label: '첫 교환 요청 보내기', done: hasFirstRequest() },
  ];
}

export function completionPct(user: UserData | null): number {
  const steps = completionSteps(user);
  return Math.round((steps.filter((s) => s.done).length / steps.length) * 100);
}

export function updateGenres(genres: string[]): void {
  const user = loadUser();
  if (!user) return;
  saveUser({ ...user, genres });
}

export function updateBook(book: UserData['book']): void {
  const user = loadUser();
  if (!user) return;
  saveUser({ ...user, book });
}

export function removeBook(): void {
  const user = loadUser();
  if (!user) return;
  saveUser({ ...user, book: null });
}

export function genreLabels(genreIds: string[]): string[] {
  return genreIds.map((id) => GENRE_LABELS[id] ?? id);
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  ['bookle_user', 'bookle_visited', 'bookle_first_request', 'bookle_onboarding_draft', 'bookle_exchanges'].forEach(
    (key) => localStorage.removeItem(key)
  );
  window.location.href = '/onboarding';
}
