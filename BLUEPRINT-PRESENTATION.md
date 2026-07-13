# ☕ 카페 앱 - 프로젝트 청사진

## 🆕 추가 기능

| 기능                  | 설명                                                     |
| --------------------- | -------------------------------------------------------- |
| 로그인/회원가입       | 회원/비회원 구분, 로그인해야 장바구니·주문·리뷰 작성 가능 |
| 결제 시뮬레이션       | 장바구니 → 결제 정보 입력 → 결제 완료 (실제 결제 X, UX만) |
| 리뷰/평점             | 메뉴 상세에서 리뷰 목록 확인 + 평점, 마이페이지에서 내 리뷰 관리 |
| 재고 관리             | 관리자가 단일 매장 기준으로 메뉴별 재고를 관리            |

## 📁 폴더 구조 (완전 코로케이션)

```
cafe-app/
│
├── index.html                        # 메인 (고객)
├── index.css
├── index.js
│
├── 👤 고객 - 인증
│   └── auth/
│       ├── login.html                # 로그인
│       ├── login.css
│       ├── login.js
│       ├── signup.html               # 회원가입
│       ├── signup.css
│       └── signup.js
│
├── 👤 고객 - 메뉴
│   └── menus/
│       ├── list.html                 # 메뉴 목록
│       ├── list.css
│       ├── list.js
│       ├── detail.html               # 메뉴 상세 (리뷰 목록 + 작성 포함)
│       ├── detail.css
│       └── detail.js
│
├── 👤 고객 - 장바구니
│   └── basket/
│       ├── list.html                 # 장바구니
│       ├── list.css
│       └── list.js
│
├── 👤 고객 - 결제
│   └── payment/
│       ├── checkout.html             # 결제 정보 입력
│       ├── checkout.css
│       ├── checkout.js
│       ├── complete.html             # 결제 완료
│       ├── complete.css
│       └── complete.js
│
├── 👤 고객 - 주문 내역
│   └── orders/
│       ├── list.html                 # 주문 내역 목록
│       ├── list.css
│       ├── list.js
│       ├── detail.html               # 주문 상세
│       ├── detail.css
│       └── detail.js
│
├── 👤 고객 - 마이페이지
│   └── my/
│       ├── index.html                # 마이페이지 메인 (내 정보, 요약)
│       ├── index.css
│       ├── index.js
│       ├── reviews.html              # 내가 쓴 리뷰 관리
│       ├── reviews.css
│       └── reviews.js
│
├── 🔴 관리자/사장
│   └── admin/
│       ├── login.html                # 관리자 로그인
│       ├── login.css
│       ├── login.js
│       ├── index.html                # 대시보드 (재고 현황 요약)
│       ├── index.css
│       ├── index.js
│       │
│       ├── menus/
│       │   ├── list.html             # 메뉴 목록
│       │   ├── list.css
│       │   ├── list.js
│       │   ├── detail.html           # 메뉴 상세
│       │   ├── detail.css
│       │   ├── detail.js
│       │   ├── create.html           # 메뉴 추가
│       │   ├── create.css
│       │   ├── create.js
│       │   ├── edit.html             # 메뉴 수정
│       │   ├── edit.css
│       │   └── edit.js
│       │
│       ├── orders/
│       │   ├── list.html             # 주문 목록
│       │   ├── list.css
│       │   ├── list.js
│       │   ├── detail.html           # 주문 상세
│       │   ├── detail.css
│       │   └── detail.js
│       │
│       ├── inventory/                # 재고 관리 (단일 매장)
│       │   ├── list.html             # 메뉴별 재고 목록
│       │   ├── list.css
│       │   ├── list.js
│       │   ├── detail.html           # 품목별 재고 상세/조정
│       │   ├── detail.css
│       │   └── detail.js
│       │
│       └── reviews/                  # 리뷰 관리
│           ├── list.html             # 전체 리뷰 목록 (신고/삭제)
│           ├── list.css
│           └── list.js
│
├── 📦 공유 자원
│   ├── css/
│   │   ├── variables.css             # CSS 변수 (전역)
│   │   └── base.css                  # 리셋 + 공통 베이스 스타일
│   └── js/
│       ├── data.js                   # 메뉴/카테고리/재고/매장정보 목업 데이터
│       ├── utils.js                  # 공통 유틸리티 (포맷, DOM 헬퍼 등)
│       ├── auth.js                   # 로그인 상태 관리 (localStorage 세션)
│       ├── cart.js                   # 장바구니 상태 관리 (localStorage)
│       └── payment.js                # 결제 시뮬레이션 로직
```

## 👥 역할별 기능

| 역할            | 경로                                                                 | 주요 기능                                                                 |
| --------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **비회원**      | `/`, `/menus/`, `/auth/`                                              | 메인, 메뉴 조회, 로그인/회원가입                                          |
| **회원(고객)**  | `/`, `/menus/`, `/basket/`, `/payment/`, `/orders/`, `/my/`           | 메뉴 조회+리뷰, 장바구니, 결제, 주문 내역, 마이페이지, 내 리뷰 관리       |
| **관리자/사장** | `/admin/`, `/admin/menus/`, `/admin/orders/`, `/admin/inventory/`, `/admin/reviews/` | 대시보드, 메뉴 CRUD, 주문 관리, 재고 관리, 리뷰 관리 |

## 🔐 인증/권한 흐름

- 비회원: 메인·메뉴 조회만 가능. 장바구니 담기, 리뷰 작성, 주문 시도 시 로그인 페이지로 리다이렉트
- 회원: `js/auth.js`가 `localStorage`에 로그인 세션(더미 토큰) 저장, 각 페이지 진입 시 세션 체크
- 관리자: 별도 `admin/login.html`로 로그인, 일반 회원 세션과 분리된 관리자 세션 사용

## 🎨 디자인

- **테마**: 라이트 + 따뜻한 브라운/크림 톤
- **분위기**: 미니멀 + 모던
- **카드 스타일**: Glass morphism
- **레이아웃**: 반응형 (모바일/데스크톱)
- 로딩/빈 상태/에러 상태 등 디테일 상태 UI도 신경써서 구성

## 📐 코로케이션 원칙

- **HTML과 동일한 디렉토리에 css, js 파일을 평탄하게 배치** (별도 하위 폴더 없음)
- **파일명은 HTML 파일명과 동일하게 매칭** (`index.html` → `index.css`, `index.js`)
- 전역 공통 자원만 `/css/`, `/js/` 폴더에 분리
- 역할별(비회원/회원/관리자) 독립 폴더로 관심사를 분리

---

## ✅ 구현 TODO

### 1단계: 공유 자원

- [x] `css/variables.css` — 전역 CSS 변수
- [x] `css/base.css` — 리셋, 공통 베이스 스타일
- [x] `js/data.js` — 메뉴/카테고리/매장 목업 데이터
- [x] `js/utils.js` — 공통 유틸리티 (포맷 등)
- [x] `js/auth.js` — 로그인 세션 관리 (회원/관리자 공용 유틸)
- [x] `js/cart.js` — 장바구니 상태 관리
- [x] `js/payment.js` — 결제 시뮬레이션 로직

### 2단계: 고객 - 인증

- [x] `auth/login.html` / `.css` / `.js`
- [x] `auth/signup.html` / `.css` / `.js`

### 3단계: 관리자 - 메뉴 관리 시스템

- [x] `admin/menus/list.html` / `.css` / `.js`
- [x] `admin/menus/detail.html` / `.css` / `.js`
- [x] `admin/menus/create.html` / `.css` / `.js`
- [x] `admin/menus/edit.html` / `.css` / `.js`

### 4단계: 고객 - 메뉴 조회 + 리뷰 시스템

- [x] `menus/list.html` / `.css` / `.js`
- [x] `menus/detail.html` / `.css` / `.js` — 메뉴 정보 + 리뷰 목록/작성 폼

### 5단계: 고객 - 장바구니 & 결제 시스템

- [x] `basket/list.html` / `.css` / `.js`
- [x] `payment/checkout.html` / `.css` / `.js`
- [x] `payment/complete.html` / `.css` / `.js`

### 6단계: 고객 - 주문 관리 시스템

- [x] `orders/list.html` / `.css` / `.js`
- [x] `orders/detail.html` / `.css` / `.js`

### 7단계: 고객 - 메인 & 마이페이지

- [x] `index.html` / `.css` / `.js`
- [x] `my/index.html` / `.css` / `.js`
- [x] `my/reviews.html` / `.css` / `.js`

### 8단계: 관리자 - 대시보드 & 주문 관리

- [x] `admin/login.html` / `.css` / `.js`
- [x] `admin/index.html` / `.css` / `.js`
- [x] `admin/orders/list.html` / `.css` / `.js`
- [x] `admin/orders/detail.html` / `.css` / `.js`

### 9단계: 관리자 - 재고 관리 (단일 매장)

- [x] `admin/inventory/list.html` / `.css` / `.js`
- [x] `admin/inventory/detail.html` / `.css` / `.js`

### 10단계: 관리자 - 리뷰 관리

- [x] `admin/reviews/list.html` / `.css` / `.js`
