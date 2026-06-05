# Bookle — 프론트엔드 구현 명세서
> Next.js 14 (App Router) · TypeScript · Tailwind CSS · Mock Data 전용 (백엔드 없음)
> 이 문서를 Claude Code에 그대로 전달하여 구현 지시에 사용한다.

---

## 0. 기술 스택 & 프로젝트 구조

```
bookle/
├── app/
│   ├── layout.tsx               # 루트 레이아웃 (폰트, 메타데이터)
│   ├── page.tsx                 # / → /onboarding 리다이렉트
│   ├── onboarding/
│   │   └── page.tsx             # 온보딩 플로우 컨트롤러
│   ├── home/
│   │   └── page.tsx             # 메인 홈 피드
│   ├── exchange/
│   │   ├── page.tsx             # 교환 목록/검색
│   │   └── [id]/
│   │       └── page.tsx         # 교환 상세 페이지
│   ├── community/
│   │   └── page.tsx             # 독서 커뮤니티
│   ├── mypage/
│   │   └── page.tsx             # 마이페이지
│   └── matching/
│       └── page.tsx             # AI 매칭 결과
├── components/
│   ├── ui/                      # 공용 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── BookCard.tsx
│   │   └── Modal.tsx
│   ├── onboarding/              # 온보딩 전용
│   │   ├── SplashStep.tsx
│   │   ├── SignupStep.tsx
│   │   ├── VerifyStep.tsx
│   │   ├── TasteStep.tsx
│   │   ├── RegisterBookStep.tsx
│   │   └── MatchingStep.tsx
│   └── layout/
│       └── AppShell.tsx         # 로그인 후 공통 레이아웃 (헤더 + BottomNav)
├── lib/
│   ├── utils.ts                 # cn() 유틸
│   ├── mock-data.ts             # 전체 목 데이터
│   └── store.ts                 # Zustand 전역 상태
├── types/
│   └── index.ts                 # 전체 TypeScript 타입
└── public/
    └── bookle_logo.svg          # 브랜드 로고 (투명 배경)
```

**의존성:**
```bash
npm install zustand lucide-react clsx tailwind-merge
```

---

## 1. TypeScript 타입 정의 (`types/index.ts`)

```typescript
// ── 온보딩 ──────────────────────────────────────────
export type OnboardingStep =
  | 'splash' | 'signup' | 'verify' | 'taste' | 'register-book' | 'matching';

// ── 유저 ──────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;           // 이모지 또는 이미지 URL
  genres: GenreId[];        // 관심 장르 ID 배열
  bio: string;
  reviewCount: number;      // 완료된 교환 횟수
  rating: number;           // 평균 평점 (1~5)
  joinedAt: string;         // ISO 날짜
  isVerified: boolean;      // 본인 인증 여부
}

// ── 책 ──────────────────────────────────────────
export type BookCondition = 'A' | 'B' | 'C';
// A: 최상 (새 책과 동일)
// B: 상 (약간의 사용감, 훼손 없음)
// C: 중 (눈에 띄는 사용감)

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedYear: number;
  isbn: string;
  genre: GenreId;
  condition: BookCondition;
  description: string;      // 한 줄 소개
  coverEmoji: string;       // 커버 대체 이모지 (이미지 없을 때)
  estimatedPrice: number;   // 정가 (원)
  deposit: number;          // 보증금 = estimatedPrice * 0.01 (소수점 올림)
  ownerId: string;          // User.id
  isAvailable: boolean;     // 교환 가능 여부
  createdAt: string;
}

// ── 장르 ──────────────────────────────────────────
export type GenreId =
  | 'fiction' | 'selfhelp' | 'science' | 'history'
  | 'economy' | 'essay' | 'art' | 'kids'
  | 'comic' | 'travel' | 'poetry' | 'mystery';

export interface Genre {
  id: GenreId;
  label: string;
  emoji: string;
  desc: string;
}

// ── 교환 요청 ──────────────────────────────────────
export type ExchangeStatus =
  | 'pending'     // 요청 대기 중
  | 'accepted'    // 수락됨 (배송 전)
  | 'shipping'    // 양방향 배송 중
  | 'completed'   // 교환 완료
  | 'rejected'    // 거절됨
  | 'cancelled'   // 취소됨
  | 'disputed';   // 분쟁 중

export interface ExchangeRequest {
  id: string;
  seekerId: string;         // 요청한 유저 (Book Seeker)
  ownerId: string;          // 책 보유자 (Book Owner)
  seekerBookId: string;     // Seeker가 제공하는 책
  ownerBookId: string;      // Owner가 제공하는 책
  matchScore: number;       // AI 매칭 점수 (0~100)
  status: ExchangeStatus;
  depositAmount: number;    // 보증금 (양쪽 합산)
  depositPaid: boolean;     // 보증금 납부 여부
  seekerShipped: boolean;   // Seeker 배송 완료
  ownerShipped: boolean;    // Owner 배송 완료
  seekerConfirmed: boolean; // Seeker 수령 확인
  ownerConfirmed: boolean;  // Owner 수령 확인
  requestedAt: string;
  updatedAt: string;
  message: string;          // 요청 메시지
}

// ── 커뮤니티 ──────────────────────────────────────
export interface Post {
  id: string;
  authorId: string;
  type: 'review' | 'recommend' | 'challenge' | 'free';
  title: string;
  content: string;
  bookTitle?: string;
  bookAuthor?: string;
  oneLineReview?: string;   // 한줄평 (최대 50자)
  rating?: number;          // 별점 (1~5)
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
}

// ── 챌린지 ──────────────────────────────────────
export interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  targetBooks: number;      // 목표 권수
  durationDays: number;     // 기간 (일)
  participantCount: number;
  isJoined: boolean;
}

// ── AI 매칭 ──────────────────────────────────────
export interface MatchResult {
  user: User;
  offeredBook: Book;        // 상대가 제공하는 책
  requestedBook: Book;      // 상대가 원하는 책 (내 책)
  matchScore: number;
  matchReasons: string[];   // 매칭 이유 ["같은 소설 장르 선호", "비슷한 독서 이력"]
}

// ── 전역 상태 ──────────────────────────────────────
export interface AppState {
  currentUser: User | null;
  isOnboarded: boolean;
  onboardingData: Partial<OnboardingFormData>;
}

export interface OnboardingFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  genres: GenreId[];
  book: Omit<Book, 'id' | 'ownerId' | 'createdAt' | 'isAvailable' | 'deposit'>;
}
```

---

## 2. Mock 데이터 (`lib/mock-data.ts`)

다음 데이터를 export const로 선언한다. 모든 로직은 이 데이터를 기반으로 동작한다.

```typescript
// MOCK_GENRES: Genre[] — 12개 장르
// 각 항목: { id, label, emoji, desc }
// fiction/소설/📖, selfhelp/자기계발/🚀, science/과학기술/🔬,
// history/역사인문/🏛️, economy/경제경영/📊, essay/에세이/✍️,
// art/예술문화/🎨, kids/어린이청소년/🧸, comic/만화그래픽/🎭,
// travel/여행취미/🌏, poetry/시희곡/🌸, mystery/추리스릴러/🔍

// MOCK_USERS: User[] — 최소 10명
// 현재 로그인 유저: id: 'user-me', name: '김지현', genres: ['fiction','essay','selfhelp']

// MOCK_BOOKS: Book[] — 최소 20권
// 각 책에 estimatedPrice 포함, deposit = Math.ceil(estimatedPrice * 0.01)
// 인기 도서 포함: 불편한 편의점, 채식주의자, 코스모스, 아몬드, 82년생 김지영 등

// MOCK_EXCHANGES: ExchangeRequest[] — 다양한 status 포함
// pending 2건, accepted 1건, shipping 1건, completed 3건

// MOCK_POSTS: Post[] — 최소 15개
// type별로 골고루: review 6, recommend 4, challenge 3, free 2

// MOCK_CHALLENGES: Challenge[] — 5개
// 예: "30일 독서 챌린지", "장르 탐험가", "한 줄 리뷰 마스터"

// MOCK_MATCHES: MatchResult[] — 3개 (현재 유저 기준)
// matchScore: 94, 87, 81
// matchReasons 각 2~3개
```

---

## 3. 전역 상태 (`lib/store.ts`)

Zustand 사용. localStorage persist 적용 (온보딩 완료 여부 유지).

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Store {
  // 상태
  currentUser: User | null;
  isOnboarded: boolean;
  onboardingData: Partial<OnboardingFormData>;
  activeExchanges: ExchangeRequest[];

  // 온보딩 액션
  setOnboardingData: (data: Partial<OnboardingFormData>) => void;
  completeOnboarding: (user: User) => void;

  // 교환 액션
  requestExchange: (request: Omit<ExchangeRequest, 'id' | 'requestedAt' | 'updatedAt'>) => void;
  updateExchangeStatus: (id: string, status: ExchangeStatus) => void;
  confirmShipping: (exchangeId: string, role: 'seeker' | 'owner') => void;
  confirmReceipt: (exchangeId: string, role: 'seeker' | 'owner') => void;

  // 유저 액션
  logout: () => void;
}
```

---

## 4. 온보딩 플로우 (`app/onboarding/page.tsx`)

### 전체 구조
- `useState<OnboardingStep>` 로 현재 스텝 관리
- 각 스텝 컴포넌트가 `onNext` / `onBack` prop을 받음
- 완료 시 Zustand `completeOnboarding()` 호출 → `/home` 으로 `router.push()`

### Step 1: Splash (`components/onboarding/SplashStep.tsx`)

**레이아웃:** 전체 화면, 배경색 `#1A6B3C`

**표시 요소:**
- 상단: "C2C 독서 플랫폼" 텍스트 (우측 정렬, 흰색 소문자)
- 중앙: Bookle 로고 (`public/bookle_logo.svg`) — `next/image`로 렌더링, width/height 160
- 로고 아래: "Bookle" 브랜드명 (흰색, font-black)
- 슬로건: "책이 연결하는 사람들의 이야기" (연한 초록)
- 기능 Pill 4개: "C2C 책 교환" / "AI 취향 매칭" / "독서 커뮤니티" / "텍스트힙"
  - 스타일: `bg-white/10 border border-white/20 text-white/80`

**하단:**
- "시작하기" 버튼: `bg-white text-[#1A6B3C]`, 클릭 시 `setStep('signup')`
- "이미 계정이 있으신가요? 로그인" 텍스트 링크

**애니메이션:** `fadeInUp` (0.45s ease)

---

### Step 2: 회원가입 (`components/onboarding/SignupStep.tsx`)

**표시 요소:**
- 상단 진행 표시: `ProgressBar` (현재 1/5, 레이블: 회원가입/인증/취향/책등록/매칭)
- 뒤로가기 버튼

**폼 필드:**
```
이름 (name): text, placeholder "홍길동", 필수
이메일 (email): email, placeholder "hello@bookle.kr", 필수
비밀번호 (password): password, placeholder "8자 이상 입력", 필수
  └─ 우측에 보기/숨기기 토글 버튼
```

**유효성 검사 (클라이언트):**
- 이름: 비어있으면 "이름을 입력해주세요"
- 이메일: `@` 미포함 시 "올바른 이메일을 입력해주세요"
- 비밀번호: 8자 미만 시 "비밀번호는 8자 이상이어야 합니다"
- 에러는 각 Input 하단에 빨간색 텍스트로 표시

**비밀번호 강도 미터:**
- 비밀번호 입력 시작 시 표시 (fadeIn)
- 4칸 진행 바: 3자/6자/9자/12자 이상 기준
- 3자 미만: 회색
- 3~8자: 노란색 (`#F59E0B`)
- 9자 이상: 초록색 (`#1A6B3C`)
- 텍스트: "더 강한 비밀번호를 사용하세요" / "적당한 강도입니다" / "강한 비밀번호입니다 👍"

**하단:**
- "다음" 버튼 (full width)
- 이용약관/개인정보처리방침 동의 문구

**완료 시:** `setOnboardingData({ name, email, password })` → `setStep('verify')`

---

### Step 3: 본인 인증 (`components/onboarding/VerifyStep.tsx`)

**표시 요소:**
- ProgressBar (2/5)
- 휴대폰 번호 입력 + "인증번호 발송" 버튼

**휴대폰 번호 자동 포맷:**
```typescript
// 숫자만 추출 후 000-0000-0000 형식으로 자동 변환
// 최대 11자리 (010XXXXXXXX)
const formatPhone = (v: string) => {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0,3)}-${digits.slice(3)}`;
  return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
};
```

**인증번호 발송 로직:**
1. 버튼 클릭 → 1.2초 로딩 상태 (`sending: true`)
2. 완료 → `codeSent: true`, 타이머 180초 시작
3. 6자리 입력 칸 표시 (각각 독립 `<input>` 태그)
4. 타이머: MM:SS 형식, 30초 미만 시 빨간색

**6자리 코드 입력 UX:**
- 숫자 1자 입력 시 자동으로 다음 칸으로 포커스 이동
- Backspace 시 이전 칸으로 포커스 이동
- 6자리 모두 입력 AND 값이 `'123456'` (Mock 인증번호) 이면 자동 인증 처리
- 인증 완료: 모든 칸 `border-[#1A6B3C] bg-[#E8F5EE]`, "✅ 인증 완료!" 메시지

**신뢰 배지:** 🔒 개인정보 암호화 / ✅ 실명 인증 / 🛡️ 안전 거래 보장

**다음 버튼:** 인증 완료 전까지 disabled

**완료 시:** `setOnboardingData({ phone })` → `setStep('taste')`

---

### Step 4: 독서 취향 설정 (`components/onboarding/TasteStep.tsx`)

**표시 요소:**
- ProgressBar (3/5)
- 안내 문구: "관심 장르를 선택하면 AI가 딱 맞는 교환 상대를 찾아드려요"
- 선택 카운터: "최대 5개 선택" + 현재 선택 수 표시 (● 도트 5개)

**장르 그리드:**
- 3열 그리드, 12개 장르 (`MOCK_GENRES` 사용)
- 각 카드: `[emoji][장르명][설명]` 세로 배치
- 선택 전: `border-[#E5E7EB] bg-white`
- 선택 후: `border-[#1A6B3C] bg-[#E8F5EE]` + 우측 상단 초록 체크 뱃지
- 5개 선택 시 추가 선택 불가 (이미 선택된 것은 해제 가능)

**AI 매칭 준비 메시지:**
- 2개 이상 선택 시 등장 (`scaleIn` 애니메이션)
- 🤖 "AI 매칭 준비 완료 / 선택한 N개 장르를 기반으로 최적의 교환 상대를 찾을게요!"
- 스타일: `bg-[#E8F5EE] border border-[#A8D5B8]`

**다음 버튼:** 0개 선택 시 "장르를 선택해 주세요" (disabled), 1개 이상 "N개 선택 완료 · 다음"

**완료 시:** `setOnboardingData({ genres })` → `setStep('register-book')`

---

### Step 5: 첫 책 등록 (`components/onboarding/RegisterBookStep.tsx`)

**표시 요소:**
- ProgressBar (4/5)
- 인기 도서 빠른 선택 (2열 그리드, 4개)
  - 불편한 편의점/김호연/🏪
  - 채식주의자/한강/🥦
  - 코스모스/칼 세이건/🌌
  - 아몬드/손원평/🌰
  - 클릭 시 title/author 자동 입력
- 구분선 "또는 직접 입력"

**폼 필드:**
```
책 제목 (title): text, 필수
저자 (author): text, 필수
책 상태 (condition): 버튼 3개 (최상A / 상B / 중C)
  - 선택된 버튼: border-[#1A6B3C] bg-[#E8F5EE]
  - 기본값: 'A'
한 줄 소개 (description): textarea 2줄, 선택
```

**책 상태 설명:**
- A(최상): "새 책과 동일한 상태"
- B(상): "약간의 사용감, 훼손 없음"
- C(중): "눈에 띄는 사용감 있음"

**보증금 안내 (자동 계산):**
- 선택된 책의 estimatedPrice 존재 시 표시
- "예상 보증금: estimatedPrice * 0.01원 (교환 완료 후 전액 환급)"

**다음 버튼:** "AI 매칭 시작하기 🤖"

**완료 시:** `setOnboardingData({ book })` → `setStep('matching')`

---

### Step 6: AI 매칭 (`components/onboarding/MatchingStep.tsx`)

**Phase 1: 분석 중 (analyzing)**

전체 화면 `bg-[#1A6B3C]`

- 중앙: 🤖 이모지 + 펄스 애니메이션 (3중 원)
- 제목: "AI 매칭 중 / {name}님의 취향을 분석하고 있어요"
- 진행 바 (흰색, 0→100%)
- 단계 리스트:
  1. 독서 취향 분석 중 (45% 이후 완료)
  2. 보유 도서 인덱싱 (70% 이후 완료)
  3. 매칭 후보군 탐색 (90% 이후 완료)
  4. 최적 매칭 선정 (100% 이후 완료)

**타이밍:**
```typescript
// setTimeout으로 단계별 진행
{ pct: 20, delay: 400 }
{ pct: 45, delay: 900 }
{ pct: 70, delay: 1500 }
{ pct: 90, delay: 2100 }
{ pct: 100, delay: 2600 }
// 3000ms 후 phase → 'found'
```

**Phase 2: 매칭 목록 (found)**

- "매칭 완료! 🎉 / {name}님과 잘 맞는 3명을 찾았어요"
- 내가 등록한 책 표시 카드 (초록 배경)
- `MOCK_MATCHES` 3개 카드 (0.1s 딜레이 순차 fadeIn)

**각 매칭 카드:**
```
[아바타][이름][매칭 점수 배지]
[상대 책 제목] / [저자]
[장르 태그들] [거래 N회]
[> 화살표]
```
- 클릭 시 상세 페이지로 전환

**Phase 3: 매칭 상세 (detail)**

- 상단: 상대 프로필 (초록 헤더, 아바타, 이름, 매칭 점수, 거래 횟수)
- 상대 도서 정보
- 관심 장르 태그
- 교환 도식: `[내 책] ⇄ [상대 책]`
- 보증금 안내 박스 (amber 계열)
- "교환 요청 보내기 📨" 버튼 → 0.6초 로딩 후 완료 화면
- "다른 매칭 보기" → 목록으로 돌아가기

**완료 후:**
- `completeOnboarding(mockUser)` 호출
- `/home` 으로 이동

---

## 5. 홈 피드 (`app/home/page.tsx`)

**레이아웃:** `AppShell` 적용 (상단 헤더 + 하단 네비게이션)

**헤더:**
- 좌측: Bookle 로고 (SVG, 초록)
- 우측: 알림 아이콘 (종 모양, `lucide-react` Bell), 검색 아이콘

**섹션 1: 배너 (히어로)**
```
배경: 초록 그라디언트
텍스트: "안녕하세요, {name}님 👋"
서브: "오늘의 AI 추천 매칭이 도착했어요"
버튼: "매칭 확인하기 →" → /matching
```

**섹션 2: 빠른 액션 (4개 버튼 그리드)**
```
📚 책 등록하기  →  /exchange/register
🤖 AI 매칭     →  /matching
👥 커뮤니티    →  /community
📖 챌린지      →  /community?tab=challenge
```
각 버튼: 아이콘 + 텍스트, `rounded-2xl bg-white border shadow-sm`

**섹션 3: 교환 가능한 책 (수평 스크롤)**
- 섹션 제목: "지금 교환 가능한 책"
- `overflow-x: auto`, `flex gap-3`
- `MOCK_BOOKS.filter(b => b.isAvailable).slice(0, 8)` 표시
- 각 카드: `BookCard` 컴포넌트 (세로형, 130px 너비)

**섹션 4: 최근 커뮤니티 글**
- 섹션 제목: "독서 커뮤니티"
- `MOCK_POSTS.slice(0, 3)` 표시
- 각 카드: 제목/내용 미리보기/좋아요/댓글 수

**섹션 5: 진행 중인 교환**
- 로그인 유저의 `MOCK_EXCHANGES` 중 `status !== 'completed'` 표시
- 없으면 "진행 중인 교환이 없어요. 첫 교환을 시작해보세요!" + 버튼

---

## 6. 교환 목록/검색 (`app/exchange/page.tsx`)

**헤더:**
- "책 교환" 제목
- 검색 아이콘

**검색 바:**
- placeholder: "책 제목, 저자명으로 검색"
- `useState<string>(searchQuery)` 로 실시간 필터링

**필터 칩 (수평 스크롤):**
```
전체 | 소설 | 자기계발 | 과학/기술 | 역사/인문 | 경제/경영 | ...
```
- 선택된 칩: `bg-[#1A6B3C] text-white`
- 미선택: `bg-white border text-gray-600`

**필터/검색 로직:**
```typescript
const filtered = MOCK_BOOKS.filter(book => {
  const matchesSearch = searchQuery === '' ||
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
  return book.isAvailable && matchesSearch && matchesGenre;
});
```

**정렬 옵션:**
- 최신순 (기본) / 보증금 낮은 순 / 상태 좋은 순

**목록:** 2열 그리드, `BookCard` 컴포넌트

**BookCard 컴포넌트 (`components/ui/BookCard.tsx`):**
```
[커버 이모지 영역 - bg 초록 계열]
[제목 (2줄 ellipsis)]
[저자]
[상태 뱃지: A/B/C]
[보증금: N원]
[소유자 이름]
```
- 클릭 시 `/exchange/[id]` 이동

---

## 7. 교환 상세 (`app/exchange/[id]/page.tsx`)

**useParams()** 로 `id` 추출 → `MOCK_BOOKS.find(b => b.id === id)` 로 책 정보 조회
→ 없으면 "책을 찾을 수 없습니다" + 뒤로 가기

**레이아웃:**
```
[커버 영역] — 초록 배경, 큰 이모지, 상태 뱃지
[정보 영역]
  제목 (text-xl font-bold)
  저자 · 출판사 · 출판년도
  장르 태그
  한 줄 소개

[보증금 정보 카드]
  정가: N원
  보증금: N원 (정가의 1%)
  💡 교환 완료 시 전액 환급됩니다

[소유자 정보 카드]
  아바타 / 이름 / 거래 횟수 / 평점

[교환 조건]
  내가 제공할 책 선택 (내 등록 도서 목록 드롭다운)

[교환 요청 버튼]
```

**교환 요청 버튼 로직:**
1. 내 등록 도서 미선택 시: "제공할 책을 선택해주세요" (disabled)
2. 선택 완료 후 클릭: 확인 모달 표시
3. 모달 내용: "교환 요청을 보낼까요? / 상대방이 수락하면 양방향 배송이 시작됩니다"
4. 확인: `requestExchange(...)` 호출 → 성공 토스트 → `/mypage` 이동

---

## 8. AI 매칭 (`app/matching/page.tsx`)

**초기 상태:** 분석 애니메이션 (Step 6 Phase 1과 동일한 UI, 2.5초)

**매칭 결과 목록:**
- `MOCK_MATCHES` 3개 카드
- 각 카드: 매칭 점수 + 이유 태그 표시

**매칭 이유 표시:**
```
예: ["소설 장르 취향 일치", "비슷한 독서 수준", "교환 이력 안전"]
각 이유: 초록 배경 pill
```

**상세 이동:** 카드 클릭 → `/exchange/[ownerBookId]` 이동

---

## 9. 커뮤니티 (`app/community/page.tsx`)

**탭 네비게이션 (4탭):**
```
전체 | 한줄평 | 추천 | 챌린지
```
- `useState<tab>` 로 현재 탭 관리
- URL query param: `?tab=review` 등으로 딥링크 지원

**탭별 필터:**
```typescript
const filtered = tab === 'all' ? MOCK_POSTS :
  MOCK_POSTS.filter(p => p.type === tab);
```

**글 카드:**
```
[타입 뱃지] [작성일]
[제목]
[내용 미리보기 — 2줄 ellipsis]
[책 정보 (있는 경우): "📖 책 제목 · 저자"]
[한줄평 + 별점 (있는 경우)]
[❤️ N  💬 N  #태그들]
```

**챌린지 탭:**
- `MOCK_CHALLENGES` 카드형 표시
- 참여/미참여 상태별 버튼 ("참여 중" / "참여하기")
- 참여 클릭 시 `isJoined` 토글

**글쓰기 FAB (Floating Action Button):**
- 우측 하단 고정
- 클릭 시 `WriteModal` 표시

**WriteModal 내용:**
```
글 유형 선택: 한줄평 | 추천 | 자유
제목 (text input)
내용 (textarea)
[한줄평 선택 시] 별점 선택 (⭐ 1~5) + 책 제목/저자 입력
등록 버튼
```
- 실제 저장 없이 toast "등록되었습니다" 표시 후 모달 닫기

---

## 10. 마이페이지 (`app/mypage/page.tsx`)

**프로필 헤더:**
```
[아바타 이모지 — 큰 원형]
[이름]  [인증 배지 ✅]
[자기소개]
[통계: 교환 N회 | 평점 N.N | 장르 N개]
```

**섹션 1: 내 교환 현황**
탭: 진행 중 | 완료 | 전체

각 교환 카드:
```
[상태 뱃지] — pending/accepted/shipping/completed/rejected
[내 책] ⇄ [상대 책]
[상대방 이름]
[요청일]
[상태별 액션 버튼]
```

**상태별 액션 버튼 로직:**
```
pending   → "요청 취소"
accepted  → "배송 완료 신고"  (클릭 시 confirmShipping 호출)
shipping  → [내 배송 완료 여부에 따라]
            아직 안 했으면: "내 배송 완료 신고"
            했으면: "상대 배송 대기 중..."
completed → "교환 완료 ✅"
rejected  → "거절됨"
```

**섹션 2: 내 등록 도서**
- `MOCK_BOOKS.filter(b => b.ownerId === 'user-me')` 표시
- 각 카드에 "수정" / "삭제" 버튼 (Mock: toast만 표시)
- "+ 새 책 등록" 버튼 → `/exchange/register`

**섹션 3: 관심 장르**
- `MOCK_GENRES.filter(g => currentUser.genres.includes(g.id))` 칩 표시
- "수정" 버튼 → 장르 선택 모달 (TasteStep과 동일 UI)

**섹션 4: 독서 기록 (Book Passport)**
- 완료된 교환 기반으로 자동 생성
- 간단한 카드 형식: "총 N권 교환 완료"
- 장르별 분포 간단 표시

**로그아웃 버튼:**
- 클릭 → `logout()` 호출 → `/onboarding` 이동

---

## 11. 하단 네비게이션 (`components/ui/BottomNav.tsx`)

**항목 (5개):**
```
🏠 홈       → /home
🔄 교환     → /exchange
🤖 매칭     → /matching
👥 커뮤니티 → /community
👤 마이     → /mypage
```

**현재 경로 판별:**
```typescript
const pathname = usePathname();
const isActive = (href: string) => pathname.startsWith(href);
```

**활성 탭 스타일:**
- 아이콘: `text-[#1A6B3C]`
- 텍스트: `text-[#1A6B3C] font-semibold`
- 비활성: `text-[#9CA3AF]`

**고정 위치:** `fixed bottom-0 left-0 right-0`, 흰 배경, 상단 border

---

## 12. AppShell (`components/layout/AppShell.tsx`)

로그인 후 모든 페이지에 적용되는 레이아웃 래퍼.

```typescript
interface AppShellProps {
  children: React.ReactNode;
  title?: string;           // 헤더에 표시할 페이지 제목
  showBack?: boolean;       // 뒤로 가기 버튼 표시 여부
  showHeader?: boolean;     // 헤더 표시 여부 (기본 true)
  rightElement?: React.ReactNode; // 헤더 우측 커스텀 요소
}
```

구조:
```
<div className="min-h-screen bg-[#F9FAFB] pb-20">
  {showHeader && <Header ... />}
  <main>{children}</main>
  <BottomNav />
</div>
```

---

## 13. 공용 UI 컴포넌트

### Button (`components/ui/Button.tsx`)
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}
```
- primary: `bg-[#1A6B3C] text-white`
- secondary: `bg-[#E8F5EE] text-[#1A6B3C]`
- ghost: `text-[#6B7280] hover:bg-gray-100`
- outline: `border-2 border-[#1A6B3C] text-[#1A6B3C]`
- danger: `bg-red-500 text-white`

### Input (`components/ui/Input.tsx`)
- label / error / hint / leftIcon / rightElement props
- focus: `border-[#1A6B3C] ring-2 ring-[#1A6B3C]/15`
- error 상태: `border-red-400`

### Modal (`components/ui/Modal.tsx`)
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```
- 배경 오버레이: `bg-black/50 backdrop-blur-sm`
- 모달 카드: `rounded-3xl bg-white` (하단에서 슬라이드 업)
- ESC 키로 닫기

### Toast (`components/ui/Toast.tsx`)
- 전역 토스트 시스템
- 상단 중앙 고정, 자동 사라짐 (2.5초)
- 타입: `success` (초록) / `error` (빨강) / `info` (파랑)

---

## 14. 라우팅 & 인증 가드

`middleware.ts` 생성:
```typescript
// /home, /exchange, /community, /mypage, /matching 경로 접근 시
// Zustand isOnboarded가 false이면 /onboarding 으로 리다이렉트
// (localStorage 기반이므로 쿠키에 onboarded 플래그 저장하여 미들웨어에서 확인)
```

구체적 구현:
```typescript
// app/home/layout.tsx (및 각 보호 경로)
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function ProtectedLayout({ children }) {
  const { isOnboarded } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (!isOnboarded) router.replace('/onboarding');
  }, [isOnboarded]);
  if (!isOnboarded) return null;
  return children;
}
```

---

## 15. 디자인 토큰

```css
/* 브랜드 컬러 */
--bookle-green:       #1A6B3C;
--bookle-green-light: #2D8A52;
--bookle-green-pale:  #E8F5EE;
--bookle-green-dark:  #0F4726;
--bookle-green-mid:   #4B9E6A;

/* 텍스트 */
--text-primary:   #111827;
--text-secondary: #374151;
--text-muted:     #6B7280;
--text-disabled:  #9CA3AF;

/* 배경 */
--bg-page:    #F9FAFB;
--bg-card:    #FFFFFF;
--bg-subtle:  #F3F4F6;

/* 테두리 */
--border-default: #E5E7EB;
--border-focus:   #1A6B3C;

/* 반지름 */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
```

---

## 16. 애니메이션 정의 (`globals.css`)

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.animate-fade-in-up { animation: fadeInUp 0.45s ease both; }
.animate-fade-in    { animation: fadeIn 0.35s ease both; }
.animate-scale-in   { animation: scaleIn 0.4s ease both; }
.animate-slide-up   { animation: slideUp 0.35s cubic-bezier(0.32,0.72,0,1) both; }

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
```

---

## 17. 구현 우선순위

| 우선순위 | 파일/기능 | 이유 |
|---------|----------|------|
| P0 | types/index.ts | 전체 타입 기반 |
| P0 | lib/mock-data.ts | 모든 페이지에서 필요 |
| P0 | lib/store.ts | 상태 관리 |
| P0 | components/ui/* | 공용 컴포넌트 |
| P1 | 온보딩 6단계 전체 | 데모 핵심 플로우 |
| P1 | app/home/page.tsx | 첫 화면 |
| P1 | components/layout/AppShell.tsx + BottomNav | 모든 페이지 공통 |
| P2 | app/exchange/* | 핵심 기능 |
| P2 | app/matching/page.tsx | AI 매칭 시연 |
| P3 | app/community/page.tsx | 커뮤니티 |
| P3 | app/mypage/page.tsx | 마이페이지 |

---

## 18. 주의사항 & 제약

1. **백엔드 없음** — 모든 데이터는 `lib/mock-data.ts`에서 가져온다. API 호출 없음.
2. **비동기 시뮬레이션** — 버튼 클릭 후 상태 변화는 `setTimeout` (600~1500ms) 으로 로딩 UX 구현.
3. **이미지 없음** — 책 커버, 유저 프로필 모두 이모지로 대체. `next/image`는 로고에만 사용.
4. **모바일 우선** — 최대 너비 `max-w-md` (448px), 중앙 정렬. 데스크톱에서도 모바일 프레임처럼 보여야 함.
5. **로컬스토리지** — Zustand persist로 온보딩 완료 여부 저장. 새로고침 후에도 유지.
6. **폰트** — Google Fonts `Noto Sans KR` (400/500/700/900 weight). `next/font/google` 사용.
7. **아이콘** — `lucide-react` 사용. 커스텀 아이콘 없음.
8. **에러 상태** — 데이터 없을 경우 빈 상태(Empty State) UI 필수 (이모지 + 안내 문구 + CTA 버튼).
