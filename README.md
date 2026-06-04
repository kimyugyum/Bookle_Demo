# Bookle

> C2C 도서 교환 플랫폼 — 책이 연결하는 사람들의 이야기

---

## 소개

Bookle은 개인 간(C2C) 책 교환을 중심으로 한 독서 커뮤니티 플랫폼입니다.  
사용자가 보유한 책을 등록하면, AI가 독서 취향을 분석해 최적의 교환 상대를 매칭해 드립니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **온보딩** | 회원가입 → 휴대폰 인증 → 취향(장르) 설정 → 책 등록 → AI 매칭 |
| **C2C 교환** | 보유 책 등록, 장르/키워드 검색, 교환 요청 송수신 |
| **AI 매칭** | 장르 취향 기반 매칭 점수 산출 및 교환 상대 추천 |
| **커뮤니티** | 서평·독서팁·교환후기 피드, 좋아요·댓글 인터랙션 |
| **콜드스타트 해결** | 온보딩 데이터 즉시 활용 + 프로필 완성도 가이드 |

---

## 기술 스택

- **Framework** Next.js 16 (App Router) + React 19
- **Language** TypeScript
- **Styling** Tailwind CSS v4
- **Icons** Phosphor Icons · Lucide React
- **Storage** localStorage (DB 없이 온보딩 데이터 유지)

---

## 화면 구성

```
/               → /home 리다이렉트
/onboarding     → 6단계 온보딩 플로우
/home           → 메인 앱 (홈 · 교환 · 매칭 · 커뮤니티 · 프로필)
```

### 온보딩 플로우
```
스플래시 → 회원가입 → 휴대폰 인증 → 취향 설정 → 책 등록 → AI 매칭 → 완료
```

### 메인 앱 탭
- **홈** — 취향 기반 추천 도서, 프로필 완성도, 교환 현황
- **교환** — 도서 목록 검색·필터, 취향 일치 강조
- **매칭** — 받은 요청 수락/거절, 보낸 요청, AI 추천
- **커뮤니티** — 서평·독서팁 피드
- **프로필** — 내 도서, 교환 내역, 설정

---

## 로컬 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속

---

## 프로젝트 구조

```
app/
  home/           # 메인 앱 (탭 셸)
  onboarding/     # 온보딩 플로우
components/
  home/           # 각 탭 컴포넌트 + BottomNav
  onboarding/     # 온보딩 단계 컴포넌트
  ui/             # BookCover, Button, Input 등 공통 UI
lib/
  user-store.ts   # localStorage 유저 데이터 관리
types/
  onboarding.ts   # 온보딩 타입 정의
  app.ts          # 앱 탭 타입
```
