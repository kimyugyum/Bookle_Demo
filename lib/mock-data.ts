// ── HomeTab ──────────────────────────────────────────────────────────────────

export const BESTSELLERS = [
  { title: '채식주의자',           author: '한강',                              rank: 1 },
  { title: '아몬드',               author: '손원평',                            rank: 2 },
  { title: '나의 라임 오렌지 나무', author: '조제 마우로 데 바스콘셀로스',        rank: 3 },
  { title: '어린왕자',             author: '생텍쥐페리',                        rank: 4 },
  { title: '미드나잇 라이브러리',   author: '매트 헤이그',                       rank: 5 },
  { title: '사피엔스',             author: '유발 하라리',                       rank: 6 },
];

export const POPULAR_EXCHANGE = [
  { title: '코스모스',      author: '칼 세이건',   count: 12 },
  { title: '돈의 심리학',  author: '모건 하우절',  count: 9  },
  { title: '채식주의자',   author: '한강',         count: 8  },
  { title: '불편한 편의점', author: '김호연',       count: 7  },
  { title: '사피엔스',     author: '유발 하라리',  count: 6  },
];

export const BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
    tag: '이벤트',
    title: '첫 교환 성공하면\n포인트 2배 적립!',
    sub: '6월 한 달간 진행',
  },
  {
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
    tag: '신규 기능',
    title: 'AI 매칭으로\n딱 맞는 책 교환 상대 찾기',
    sub: '취향 기반 자동 추천',
  },
  {
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80',
    tag: '베스트',
    title: '이번 주 가장 많이\n교환된 책 TOP 10',
    sub: '지금 바로 확인하세요',
  },
];

export const HOME_COMMUNITY_POSTS = [
  { author: '박민준', title: '"채식주의자" 읽고 생각이 많아졌어요', likes: 42, time: '1시간 전', category: '서평' },
  { author: '정유진', title: '독서 슬럼프 극복 방법 공유합니다',    likes: 61, time: '2일 전',  category: '독서팁' },
  { author: '이수연', title: '이번 달 읽은 책 5권 후기',           likes: 38, time: '3일 전',  category: '서평' },
];

// ── ExchangeTab ───────────────────────────────────────────────────────────────

export const ALL_GENRES = ['전체', '소설', '자기계발', '과학/기술', '역사/인문', '경제/경영', '에세이', '만화/그래픽'];

export const EXCHANGE_BOOKS = [
  { id: 1, title: '채식주의자', author: '한강', genre: '소설', condition: 'A' as const, owner: '박민준', ownerRating: 4.8, reviewCount: 12, distance: '2.1km', wantGenres: ['소설', '에세이'], matchScore: 94,
    photos: [{ url: 'https://picsum.photos/seed/bk1a/300/400', label: '표지' }, { url: 'https://picsum.photos/seed/bk1b/300/400', label: '내지' }] },
  { id: 2, title: '코스모스', author: '칼 세이건', genre: '과학/기술', condition: 'B' as const, owner: '이수연', ownerRating: 4.6, reviewCount: 8, distance: '0.8km', wantGenres: ['역사/인문'], matchScore: 87,
    photos: [{ url: 'https://picsum.photos/seed/bk2a/300/400', label: '표지' }, { url: 'https://picsum.photos/seed/bk2b/300/400', label: '측면' }, { url: 'https://picsum.photos/seed/bk2c/300/400', label: '내지' }] },
  { id: 3, title: '사피엔스', author: '유발 하라리', genre: '역사/인문', condition: 'A' as const, owner: '김태호', ownerRating: 4.9, reviewCount: 24, distance: '3.5km', wantGenres: ['소설', '과학/기술'], matchScore: 91,
    photos: [{ url: 'https://picsum.photos/seed/bk3a/300/400', label: '표지' }, { url: 'https://picsum.photos/seed/bk3b/300/400', label: '내지' }] },
  { id: 4, title: '아몬드', author: '손원평', genre: '소설', condition: 'B' as const, owner: '정유진', ownerRating: 4.7, reviewCount: 6, distance: '1.2km', wantGenres: ['자기계발'], matchScore: 85,
    photos: [{ url: 'https://picsum.photos/seed/bk4a/300/400', label: '표지' }, { url: 'https://picsum.photos/seed/bk4b/300/400', label: '내지' }, { url: 'https://picsum.photos/seed/bk4c/300/400', label: '하단' }] },
  { id: 5, title: '미드나잇 라이브러리', author: '매트 헤이그', genre: '소설', condition: 'A' as const, owner: '최준서', ownerRating: 4.5, reviewCount: 15, distance: '4.0km', wantGenres: ['에세이', '소설'], matchScore: 79,
    photos: [{ url: 'https://picsum.photos/seed/bk5a/300/400', label: '표지' }, { url: 'https://picsum.photos/seed/bk5b/300/400', label: '내지' }] },
  { id: 6, title: '돈의 심리학', author: '모건 하우절', genre: '경제/경영', condition: 'B' as const, owner: '한지원', ownerRating: 4.8, reviewCount: 20, distance: '2.8km', wantGenres: ['자기계발'], matchScore: 76,
    photos: [{ url: 'https://picsum.photos/seed/bk6a/300/400', label: '표지' }, { url: 'https://picsum.photos/seed/bk6b/300/400', label: '측면' }] },
  { id: 7, title: '클루지', author: '게리 마커스', genre: '과학/기술', condition: 'C' as const, owner: '오준혁', ownerRating: 4.6, reviewCount: 11, distance: '5.2km', wantGenres: ['역사/인문'], matchScore: 72,
    photos: [{ url: 'https://picsum.photos/seed/bk7a/300/400', label: '표지' }, { url: 'https://picsum.photos/seed/bk7b/300/400', label: '내지' }, { url: 'https://picsum.photos/seed/bk7c/300/400', label: '하단' }, { url: 'https://picsum.photos/seed/bk7d/300/400', label: '측면' }] },
  { id: 8, title: '나의 라임 오렌지 나무', author: '조제 마우로 데 바스콘셀로스', genre: '소설', condition: 'A' as const, owner: '최아름', ownerRating: 4.7, reviewCount: 18, distance: '1.7km', wantGenres: ['에세이', '소설'], matchScore: 88,
    photos: [{ url: 'https://picsum.photos/seed/bk8a/300/400', label: '표지' }, { url: 'https://picsum.photos/seed/bk8b/300/400', label: '내지' }] },
];

// ── MatchTab ──────────────────────────────────────────────────────────────────

export const DEMO_RECEIVED = [
  {
    id: 'demo-1',
    name: '박민준',
    theirBook: '채식주의자',
    theirAuthor: '한강',
    wantsMyBook: '불편한 편의점',
    matchScore: 94,
    time: '2시간 전',
    reviewCount: 12,
    condition: 'A',
  },
];

export const AI_RECS = [
  { id: 1, name: '김태호',  book: '사피엔스',          author: '유발 하라리', matchScore: 91, reviewCount: 24, genres: ['역사/인문', '과학/기술'], reason: '역사/인문 장르 취향이 일치해요' },
  { id: 2, name: '정유진',  book: '아몬드',             author: '손원평',      matchScore: 85, reviewCount: 6,  genres: ['소설', '자기계발'],       reason: '소설 선호도가 비슷해요' },
  { id: 3, name: '최준서',  book: '미드나잇 라이브러리', author: '매트 헤이그', matchScore: 79, reviewCount: 15, genres: ['소설', '에세이'],         reason: '에세이 장르 취향이 비슷해요' },
];

// ── CommunityTab ──────────────────────────────────────────────────────────────

export const COMMUNITY_POSTS = [
  {
    id: 1,
    author: '박민준', time: '1시간 전', category: '서평',
    title: '"채식주의자" 읽고 생각이 많아졌어요',
    body: '한강 작가의 문체가 정말 독특하게 느껴졌는데, 특히 식물이 되고 싶다는 영혜의 심리가 단순한 거부감이 아니라 사회적 압박에 대한 반응처럼 보였어요.',
    likes: 42, comments: 13, liked: false, book: '채식주의자',
  },
  {
    id: 2,
    author: '이수연', time: '3시간 전', category: '서평',
    title: '코스모스 1회독 완료! 우주가 이렇게 아름다울 줄이야 🌌',
    body: '칼 세이건의 문장 하나하나가 시처럼 느껴졌어요. 과학책인데 이렇게 감동적일 수가 있다는 게 신기해요.',
    likes: 38, comments: 7, liked: true, book: '코스모스',
  },
  {
    id: 3,
    author: '김태호', time: '어제', category: '교환후기',
    title: '책 교환 후기 — 정말 새 책처럼 받았어요! ⭐⭐⭐⭐⭐',
    body: '박민준님과 교환했는데 포장도 꼼꼼하게 해주셨고 책 상태도 딱 설명하신 그대로였어요. 믿고 교환할 수 있는 분이에요!',
    likes: 25, comments: 5, liked: false, book: null,
  },
  {
    id: 4,
    author: '정유진', time: '2일 전', category: '독서팁',
    title: '독서 슬럼프 극복 방법 공유합니다',
    body: '저도 한동안 책이 손에 안 잡혔는데, 얇은 에세이부터 다시 시작하니까 다시 읽고 싶어지더라고요. 두꺼운 책보다는 100페이지 이하의 가벼운 책으로 시작해보세요!',
    likes: 61, comments: 22, liked: false, book: null,
  },
  {
    id: 5,
    author: '최준서', time: '3일 전', category: '서평',
    title: '"아몬드" — 감정에 대해 다시 생각하게 해준 책',
    body: '감정을 모르는 아이의 이야기를 통해 오히려 내가 어떤 감정을 느끼는지 돌아보게 됐어요.',
    likes: 34, comments: 9, liked: false, book: '아몬드',
  },
  {
    id: 6,
    author: '한지원', time: '4일 전', category: '추천',
    title: '자기계발 입문자에게 추천하는 책 3권',
    body: '처음 자기계발 책을 읽는 분들께 "원씽", "아주 작은 습관의 힘", "미라클 모닝" 이 세 권을 추천해요. 읽는 순서대로 효과가 배가돼요.',
    likes: 57, comments: 18, liked: false, book: null,
  },
];

export const CHALLENGES = [
  {
    id: 1,
    emoji: '📚',
    title: '30일 독서 챌린지',
    desc: '한 달 안에 5권을 읽고 서평을 남겨보세요',
    target: 5, unit: '권',
    participants: 342, duration: 30,
    progress: 0,
  },
  {
    id: 2,
    emoji: '🗺️',
    title: '장르 탐험가',
    desc: '평소 읽지 않던 5가지 장르에 도전해보세요',
    target: 5, unit: '장르',
    participants: 218, duration: 60,
    progress: 2,
  },
  {
    id: 3,
    emoji: '✍️',
    title: '한 줄 리뷰 마스터',
    desc: '10개의 한줄평을 작성해 리뷰어로 거듭나세요',
    target: 10, unit: '개',
    participants: 189, duration: 30,
    progress: 0,
  },
  {
    id: 4,
    emoji: '🔄',
    title: '교환왕',
    desc: '3번의 성공적인 교환을 완료해보세요',
    target: 3, unit: '회',
    participants: 156, duration: 45,
    progress: 0,
  },
  {
    id: 5,
    emoji: '⭐',
    title: '베스트셀러 클럽',
    desc: '이번 분기 베스트셀러 3권을 읽어보세요',
    target: 3, unit: '권',
    participants: 423, duration: 90,
    progress: 1,
  },
];
