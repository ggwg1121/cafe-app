// 주문 조회/생성/상태 변경, 포인트 내역 조회 (Supabase orders/order_items/points_ledger 테이블)
// 의존: js/auth.js(getCurrentUser), js/supabaseClient.js(sb), js/cart.js(getCartDetails, getCartTotal, clearCart)
//
// 주문 생성(포인트 적립/사용 포함)은 checkout() SECURITY DEFINER RPC가 처리한다.

const ORDER_SELECT = "*, profiles(name, email), order_items(*)";

function mapOrderRow(row) {
  // user_id가 없으면(profiles가 없으면) 주문 이후 회원 탈퇴로 연결이 끊어진 주문이다.
  const isWithdrawn = row.user_id === null;
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.profiles?.name ?? (isWithdrawn ? "탈퇴한 고객" : "알 수 없음"),
    userEmail: row.profiles?.email ?? "",
    items: (row.order_items || []).map((item) => ({
      menuId: item.menu_id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    })),
    total: row.total,
    payment: {
      cardNumberMasked: row.payment_card_masked,
      cardHolder: row.payment_card_holder,
    },
    status: row.status,
    pointsUsed: row.points_used,
    pointsEarned: row.points_earned,
    createdAt: row.created_at,
  };
}

// 전체 주문 (관리자용). 고객 화면에서는 getOrders()로 본인 주문만 조회한다.
async function getAllOrders() {
  const { data, error } = await sb.from("orders").select(ORDER_SELECT).order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data.map(mapOrderRow);
}

async function getOrders() {
  const user = getCurrentUser();
  if (!user) return [];
  const { data, error } = await sb
    .from("orders")
    .select(ORDER_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data.map(mapOrderRow);
}

// 로그인한 사용자가 해당 메뉴를 주문한 적이 있는지 (리뷰 작성 가능 여부 판단용, 화면 안내 목적)
// 실제 작성 가능 여부는 reviews 테이블의 INSERT RLS 정책이 서버에서 강제한다.
async function hasPurchasedMenu(menuId) {
  const user = getCurrentUser();
  if (!user) return false;
  const orders = await getOrders();
  return orders.some((order) => order.items.some((item) => item.menuId === menuId));
}

async function getOrderById(orderId) {
  const { data, error } = await sb.from("orders").select(ORDER_SELECT).eq("id", orderId).maybeSingle();
  if (error || !data) return null;
  return mapOrderRow(data);
}

function maskCardNumber(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return `**** **** **** ${last4}`;
}

function mapPointsLedgerRow(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    type: row.type,
    amount: row.amount,
    reason: row.reason,
    createdAt: row.created_at,
  };
}

// 로그인한 사용자 본인의 포인트 적립/사용 내역 (최신순)
async function getPointsHistory() {
  const user = getCurrentUser();
  if (!user) return [];
  const { data, error } = await sb
    .from("points_ledger")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data.map(mapPointsLedgerRow);
}

// paymentInfo: { cardNumber, cardHolder }
// 실제 주문 생성/포인트 적립·사용은 서버(checkout RPC)가 장바구니를 직접 읽어 처리한다.
// 클라이언트는 카드번호 형식만 미리 검증해 즉각적인 피드백을 준다.
async function processPayment(paymentInfo, pointsToUse = 0) {
  const items = await getCartDetails();

  if (items.length === 0) {
    throw { ok: false, error: "장바구니가 비어 있습니다." };
  }

  const digits = paymentInfo.cardNumber.replace(/\D/g, "");
  if (digits.length !== 16) {
    throw { ok: false, error: "카드 번호를 올바르게 입력해주세요." };
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));

  const { data, error } = await sb.rpc("checkout", {
    p_points_to_use: pointsToUse,
    p_payment_card_masked: maskCardNumber(paymentInfo.cardNumber),
    p_payment_card_holder: paymentInfo.cardHolder,
  });

  if (error) {
    throw { ok: false, error: error.message || "주문 처리 중 오류가 발생했습니다." };
  }

  return {
    ok: true,
    order: {
      id: data.order_id,
      total: data.total,
      pointsUsed: data.points_used,
      pointsEarned: data.points_earned,
    },
  };
}

window.getAllOrders = getAllOrders;
window.getOrders = getOrders;
window.getOrderById = getOrderById;
window.processPayment = processPayment;
window.getPointsHistory = getPointsHistory;
window.hasPurchasedMenu = hasPurchasedMenu;
