// 메뉴/리뷰 데이터 (Supabase 백엔드)
// 의존: js/supabaseClient.js(sb)

const CATEGORIES = [
  { id: "coffee", name: "커피" },
  { id: "tea", name: "티/음료" },
  { id: "dessert", name: "디저트" },
];

// data.js는 index.html(루트), menus/(1단계), admin/menus/(2단계) 등
// 서로 다른 깊이의 페이지에서 공통으로 로드된다. 이미지 경로를 "/images/..."처럼
// 루트 절대경로로 고정하면 파일을 직접 열거나(file://) 서브경로에 배포할 때 깨지므로,
// 이 스크립트 자신의 src 속성에서 상대경로 접두사를 계산해 사용한다.
const IMG_BASE = (function () {
  const scriptSrc = document.currentScript && document.currentScript.getAttribute("src");
  return scriptSrc ? scriptSrc.replace(/js\/data\.js$/, "") : "./";
})();

// 외부 네트워크 없이도 항상 표시되는 인라인 SVG placeholder 이미지 생성
// (발표 환경에서 이미지 CDN 접속이 막혀도 안전하게 렌더링되도록 함)
function placeholderImage(text, bg = "#e6d2b8", fg = "#6b4626") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="100%" height="100%" fill="${bg}"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="28" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// menus.image 컬럼에는 시드 이미지의 파일명만 저장돼 있다(예: "m01.jpg").
// 관리자가 직접 입력한 값은 완전한 URL/데이터 URI이므로 그대로 사용한다.
function resolveMenuImage(value) {
  if (!value) return placeholderImage("메뉴");
  if (/^(https?:|data:)/.test(value)) return value;
  return IMG_BASE + "images/" + value;
}

function mapMenuRow(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    price: row.price,
    image: resolveMenuImage(row.image),
    // 원본 값(파일명 또는 URL) 그대로 보존 — 관리자 수정 폼에서 이미지값을 건드리지 않고
    // 재저장할 때 이미 리졸브된 경로가 DB에 덮어써지는 것을 방지하기 위함
    imageRaw: row.image,
    description: row.description,
    isSoldOut: row.is_sold_out,
    stock: row.stock,
  };
}

function mapReviewRow(row, nameMap) {
  return {
    id: row.id,
    menuId: row.menu_id,
    userId: row.user_id,
    userName: nameMap?.get(row.user_id) ?? "알 수 없음",
    rating: row.rating,
    comment: row.comment,
    date: row.created_at.slice(0, 10),
  };
}

async function getMenus() {
  const { data, error } = await sb.from("menus").select("*").order("created_at", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data.map(mapMenuRow);
}

async function createMenu({ categoryId, name, price, image, description, isSoldOut }) {
  const { error } = await sb.from("menus").insert({
    category_id: categoryId,
    name,
    price,
    image,
    description,
    is_sold_out: isSoldOut,
  });
  if (error) throw error;
}

async function updateMenu(id, { categoryId, name, price, image, description, isSoldOut }) {
  const { error } = await sb
    .from("menus")
    .update({ category_id: categoryId, name, price, image, description, is_sold_out: isSoldOut })
    .eq("id", id);
  if (error) throw error;
}

async function updateMenuStock(id, stock) {
  const { error } = await sb.from("menus").update({ stock }).eq("id", id);
  if (error) throw error;
}

async function deleteMenu(id) {
  const { error } = await sb.from("menus").delete().eq("id", id);
  if (error) throw error;
}

async function getReviews() {
  const { data, error } = await sb.from("reviews").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }

  // 작성자 이름은 profiles가 아니라 공개 뷰(public_profiles)에서 가져온다.
  // profiles는 본인 것만 조회 가능한 RLS가 걸려있어, 남이 쓴 리뷰의 작성자 이름을 가져올 수 없기 때문.
  const userIds = [...new Set(data.map((row) => row.user_id))];
  const { data: profiles } = await sb.from("public_profiles").select("id, name").in("id", userIds);
  const nameMap = new Map((profiles || []).map((p) => [p.id, p.name]));

  return data.map((row) => mapReviewRow(row, nameMap));
}

async function createReview({ menuId, userId, rating, comment }) {
  const { error } = await sb.from("reviews").insert({ menu_id: menuId, user_id: userId, rating, comment });
  if (error) throw error;
}

async function updateReview(id, { rating, comment }) {
  const { error } = await sb.from("reviews").update({ rating, comment }).eq("id", id);
  if (error) throw error;
}

async function deleteReview(id) {
  const { error } = await sb.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

// 단일 매장 정보 (표시용, 관리자 CRUD 대상 아님)
const STORE_INFO = {
  name: "카페 온담 본점",
  address: "서울시 강남구 테헤란로 123",
  phone: "02-1234-5678",
  hours: "매일 08:00 - 22:00",
};

// 브라우저(스크립트 태그) 환경 전역 노출
window.CATEGORIES = CATEGORIES;
window.STORE_INFO = STORE_INFO;
window.getMenus = getMenus;
window.createMenu = createMenu;
window.updateMenu = updateMenu;
window.updateMenuStock = updateMenuStock;
window.deleteMenu = deleteMenu;
window.getReviews = getReviews;
window.createReview = createReview;
window.updateReview = updateReview;
window.deleteReview = deleteReview;
window.placeholderImage = placeholderImage;
