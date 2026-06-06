const KEY = 'bookle_exchanges';

export type ExchangeStatus = 'pending' | 'accepted' | 'shipping' | 'completed' | 'rejected';

export interface ExchangeRequest {
  id: string;
  direction: 'sent' | 'received';
  // 요청자 (나)
  seekerName: string;
  seekerBook: string;
  seekerAuthor: string;
  seekerCondition: 'A' | 'B' | 'C';
  // 상대방
  ownerName: string;
  ownerBook: string;
  ownerAuthor: string;
  ownerRating: number;
  ownerReviewCount: number;
  matchScore: number;
  message: string;
  status: ExchangeStatus;
  requestedAt: string;
}

export function loadExchanges(): ExchangeRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ExchangeRequest[]) : [];
  } catch {
    return [];
  }
}

export function addExchange(
  req: Omit<ExchangeRequest, 'id' | 'requestedAt'>
): ExchangeRequest {
  const list = loadExchanges();
  const newReq: ExchangeRequest = {
    ...req,
    id: Date.now().toString(),
    requestedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([...list, newReq]));
  return newReq;
}

export function updateStatus(id: string, status: ExchangeStatus): void {
  const list = loadExchanges();
  const updated = list.map((e) => (e.id === id ? { ...e, status } : e));
  localStorage.setItem(KEY, JSON.stringify(updated));
}
