// 목업 데이터 (실서버 없이 정적 파일만으로 동작)

const CATEGORIES = [
  { id: "coffee", name: "커피" },
  { id: "tea", name: "티/음료" },
  { id: "dessert", name: "디저트" },
];

// 외부 네트워크 없이도 항상 표시되는 인라인 SVG placeholder 이미지 생성
// (발표 환경에서 이미지 CDN 접속이 막혀도 안전하게 렌더링되도록 함)
function placeholderImage(text, bg = "#e6d2b8", fg = "#6b4626") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="100%" height="100%" fill="${bg}"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="28" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const MENUS_SEED = [
  {
    id: "m01",
    categoryId: "coffee",
    name: "아메리카노",
    price: 4500,
    image: "/images/m01.jpg",
    description: "깊고 진한 에스프레소에 물을 더한 클래식 커피.",
    isSoldOut: false,
  },
  {
    id: "m02",
    categoryId: "coffee",
    name: "카페라떼",
    price: 5000,
    image: "/images/m02.jpg",
    description: "부드러운 스팀 밀크와 에스프레소의 조화.",
    isSoldOut: false,
  },
  {
    id: "m03",
    categoryId: "coffee",
    name: "바닐라라떼",
    price: 5500,
    image: "/images/m03.jpg",
    description: "달콤한 바닐라 시럽이 더해진 라떼.",
    isSoldOut: false,
  },
  {
    id: "m04",
    categoryId: "tea",
    name: "얼그레이 티",
    price: 4800,
    image: "/images/m04.jpg",
    description: "은은한 베르가못 향의 홍차.",
    isSoldOut: false,
  },
  {
    id: "m05",
    categoryId: "tea",
    name: "복숭아 아이스티",
    price: 5200,
    image: "/images/m05.jpg",
    description: "상큼한 복숭아 향의 시원한 아이스티.",
    isSoldOut: false,
  },
  {
    id: "m06",
    categoryId: "dessert",
    name: "티라미수",
    price: 6500,
    image: "/images/m06.jpg",
    description: "마스카포네 치즈와 에스프레소가 어우러진 이탈리아 디저트.",
    isSoldOut: false,
  },
  {
    id: "m07",
    categoryId: "dessert",
    name: "치즈케이크",
    price: 6000,
    image: "/images/m07.jpg",
    description: "진한 크림치즈로 만든 뉴욕 스타일 케이크.",
    isSoldOut: true,
  },
  {
    id: "m08",
    categoryId: "coffee",
    name: "카페모카",
    price: 5500,
    image: "/images/m08.jpg",
    description: "진한 초콜릿과 에스프레소, 부드러운 우유의 조화.",
    isSoldOut: false,
  },
  {
    id: "m09",
    categoryId: "coffee",
    name: "카푸치노",
    price: 5000,
    image: "/images/m09.jpg",
    description: "풍성한 우유 거품이 올라간 진한 에스프레소.",
    isSoldOut: false,
  },
  {
    id: "m10",
    categoryId: "coffee",
    name: "플랫화이트",
    price: 5300,
    image: "/images/m10.jpg",
    description: "적은 거품, 진한 에스프레소 향이 살아있는 커피.",
    isSoldOut: false,
  },
  {
    id: "m11",
    categoryId: "coffee",
    name: "콜드브루",
    price: 5000,
    image: "/images/m11.jpg",
    description: "12시간 저온 추출로 부드럽고 깔끔한 맛.",
    isSoldOut: false,
  },
  {
    id: "m12",
    categoryId: "coffee",
    name: "디카페인 아메리카노",
    price: 4800,
    image: "/images/m12.jpg",
    description: "카페인 부담 없이 즐기는 깔끔한 아메리카노.",
    isSoldOut: false,
  },
  {
    id: "m13",
    categoryId: "coffee",
    name: "헤이즐넛 라떼",
    price: 5500,
    image: "/images/m13.jpg",
    description: "고소한 헤이즐넛 시럽이 더해진 부드러운 라떼.",
    isSoldOut: false,
  },
  {
    id: "m14",
    categoryId: "tea",
    name: "자몽 허니 블랙티",
    price: 5500,
    image: "/images/m14.jpg",
    description: "상큼한 자몽과 달콤한 꿀이 어우러진 홍차.",
    isSoldOut: false,
  },
  {
    id: "m15",
    categoryId: "tea",
    name: "캐모마일 티",
    price: 4800,
    image: "/images/m15.jpg",
    description: "은은한 꽃향으로 마음까지 편안해지는 허브티.",
    isSoldOut: false,
  },
  {
    id: "m16",
    categoryId: "tea",
    name: "유자차",
    price: 5000,
    image: "/images/m16.jpg",
    description: "새콤달콤한 유자청을 듬뿍 넣은 전통차.",
    isSoldOut: false,
  },
  {
    id: "m17",
    categoryId: "tea",
    name: "밀크티",
    price: 5200,
    image: "/images/m17.jpg",
    description: "진한 홍차와 우유가 어우러진 부드러운 밀크티.",
    isSoldOut: false,
  },
  {
    id: "m18",
    categoryId: "dessert",
    name: "크루아상",
    price: 4200,
    image: "/images/m18.jpg",
    description: "겹겹이 바삭한 버터 풍미 가득한 페이스트리.",
    isSoldOut: false,
  },
  {
    id: "m19",
    categoryId: "dessert",
    name: "스콘",
    price: 4000,
    image: "/images/m19.jpg",
    description: "겉은 바삭하고 속은 촉촉한 플레인 스콘.",
    isSoldOut: false,
  },
  {
    id: "m20",
    categoryId: "dessert",
    name: "초코 브라우니",
    price: 5000,
    image: "/images/m20.jpg",
    description: "진한 초콜릿이 가득한 촉촉한 브라우니.",
    isSoldOut: false,
  },
  {
    id: "m21",
    categoryId: "dessert",
    name: "마카롱 세트",
    price: 6800,
    image: "/images/m21.jpg",
    description: "다양한 맛으로 즐기는 5개입 마카롱 세트.",
    isSoldOut: false,
  },
  {
    id: "m22",
    categoryId: "dessert",
    name: "당근 케이크",
    price: 6200,
    image: "/images/m22.jpg",
    description: "크림치즈 프로스팅을 올린 촉촉한 당근 케이크.",
    isSoldOut: false,
  },
];

// 단일 매장 정보 (표시용, 관리자 CRUD 대상 아님)
const STORE_INFO = {
  name: "카페 온담 본점",
  address: "서울시 강남구 테헤란로 123",
  phone: "02-1234-5678",
  hours: "매일 08:00 - 22:00",
};

// 메뉴별 재고 수량 (단일 매장 기준)
const INVENTORY_SEED = [
  { menuId: "m01", stock: 42 },
  { menuId: "m02", stock: 30 },
  { menuId: "m03", stock: 18 },
  { menuId: "m04", stock: 25 },
  { menuId: "m05", stock: 12 },
  { menuId: "m06", stock: 8 },
  { menuId: "m07", stock: 0 },
  { menuId: "m08", stock: 20 },
  { menuId: "m09", stock: 27 },
  { menuId: "m10", stock: 15 },
  { menuId: "m11", stock: 33 },
  { menuId: "m12", stock: 22 },
  { menuId: "m13", stock: 17 },
  { menuId: "m14", stock: 14 },
  { menuId: "m15", stock: 19 },
  { menuId: "m16", stock: 24 },
  { menuId: "m17", stock: 16 },
  { menuId: "m18", stock: 10 },
  { menuId: "m19", stock: 13 },
  { menuId: "m20", stock: 9 },
  { menuId: "m21", stock: 6 },
  { menuId: "m22", stock: 11 },
];

// 로그인 검증용 목업 회원 (실제 서비스에서는 서버 인증으로 대체)
const USERS = [
  { id: "u01", email: "guest@cafe.com", password: "guest1234", name: "김민지" },
];

// 목업 관리자 계정
const ADMINS = [
  { id: "a01", email: "admin@cafe.com", password: "admin1234", name: "박사장" },
];

const REVIEWS_SEED = [
  {
    id: "r01",
    menuId: "m01",
    userId: "u01",
    userName: "김민지",
    rating: 5,
    comment: "산미가 적당하고 깔끔해요!",
    date: "2026-07-01",
  },
  {
    id: "r02",
    menuId: "m02",
    userId: "u01",
    userName: "김민지",
    rating: 4,
    comment: "우유 비율이 딱 좋아요.",
    date: "2026-07-03",
  },
];

// 관리자 CRUD/리뷰 작성이 반영되도록 localStorage에 저장된 값을 우선 사용하고,
// 저장된 값이 없으면 위 목업 데이터를 초기값으로 사용한다.
// (js/utils.js보다 먼저 로드되는 경우가 있어 자체 헬퍼를 둔다)
function _readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// 개발 중 목업 데이터(MENUS_SEED 등)의 구조나 내용이 바뀌면,
// 이전에 브라우저에 캐시된 localStorage 값이 새 seed보다 우선 적용되어 혼란을 준다.
// 버전을 올릴 때마다 캐시를 자동으로 비워 항상 최신 seed로 시작하게 한다.
const DATA_VERSION = "2026-07-13-4";
(function resetCacheOnSeedChange() {
  try {
    if (localStorage.getItem("cafe_data_version") !== DATA_VERSION) {
      localStorage.removeItem("cafe_menus");
      localStorage.removeItem("cafe_reviews");
      localStorage.removeItem("cafe_stores");
      localStorage.removeItem("cafe_inventory");
      localStorage.setItem("cafe_data_version", DATA_VERSION);
    }
  } catch {
    // localStorage 접근 불가 환경은 무시
  }
})();

function getMenus() {
  return _readLS("cafe_menus", MENUS_SEED);
}

function saveMenus(menus) {
  localStorage.setItem("cafe_menus", JSON.stringify(menus));
}

function getReviews() {
  return _readLS("cafe_reviews", REVIEWS_SEED);
}

function saveReviews(reviews) {
  localStorage.setItem("cafe_reviews", JSON.stringify(reviews));
}

function getInventory() {
  return _readLS("cafe_inventory", INVENTORY_SEED);
}

function saveInventory(inventory) {
  localStorage.setItem("cafe_inventory", JSON.stringify(inventory));
}

// 브라우저(스크립트 태그) 환경 전역 노출
window.CATEGORIES = CATEGORIES;
window.STORE_INFO = STORE_INFO;
window.USERS = USERS;
window.ADMINS = ADMINS;
window.getMenus = getMenus;
window.saveMenus = saveMenus;
window.getReviews = getReviews;
window.saveReviews = saveReviews;
window.getInventory = getInventory;
window.saveInventory = saveInventory;
window.placeholderImage = placeholderImage;
