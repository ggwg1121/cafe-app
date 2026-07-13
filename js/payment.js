// 결제 시뮬레이션 (실제 PG 연동 없이 지연 후 성공 처리)
// 의존: js/auth.js(getCurrentUser), js/cart.js(getCartDetails, getCartTotal, clearCart)
// js/utils.js(generateId, readJSON, writeJSON)

const ORDERS_KEY = "cafe_orders";
const ORDER_STATUSES = ["결제완료", "제조중", "픽업대기", "완료"];

// 전체 주문 (관리자용). 고객 화면에서는 getOrders()로 본인 주문만 필터링해서 사용한다.
function getAllOrders() {
  return readJSON(ORDERS_KEY, []);
}

function saveAllOrders(orders) {
  writeJSON(ORDERS_KEY, orders);
}

function getOrders() {
  const user = getCurrentUser();
  if (!user) return [];
  return getAllOrders().filter((order) => order.userId === user.id);
}

function getOrderById(orderId) {
  return getAllOrders().find((order) => order.id === orderId) || null;
}

function updateOrderStatus(orderId, status) {
  const orders = getAllOrders().map((order) => (order.id === orderId ? { ...order, status } : order));
  saveAllOrders(orders);
}

function maskCardNumber(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return `**** **** **** ${last4}`;
}

// paymentInfo: { cardNumber, cardHolder }
// 성공/실패를 흉내내는 비동기 결제 처리. 카드번호 16자리가 아니면 실패 처리
function processPayment(paymentInfo) {
  return new Promise((resolve, reject) => {
    const items = getCartDetails();
    const total = getCartTotal();

    if (items.length === 0) {
      reject({ ok: false, error: "장바구니가 비어 있습니다." });
      return;
    }

    setTimeout(() => {
      const digits = paymentInfo.cardNumber.replace(/\D/g, "");
      if (digits.length !== 16) {
        reject({ ok: false, error: "카드 번호를 올바르게 입력해주세요." });
        return;
      }

      const user = getCurrentUser();
      const order = {
        id: generateId("order"),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        items: items.map((item) => ({
          menuId: item.menu.id,
          name: item.menu.name,
          price: item.menu.price,
          qty: item.qty,
        })),
        total,
        payment: {
          cardNumberMasked: maskCardNumber(paymentInfo.cardNumber),
          cardHolder: paymentInfo.cardHolder,
        },
        status: "결제완료",
        createdAt: new Date().toISOString(),
      };

      const orders = getAllOrders();
      orders.unshift(order);
      saveAllOrders(orders);
      clearCart();

      resolve({ ok: true, order });
    }, 1200);
  });
}

window.ORDER_STATUSES = ORDER_STATUSES;
window.getAllOrders = getAllOrders;
window.getOrders = getOrders;
window.getOrderById = getOrderById;
window.updateOrderStatus = updateOrderStatus;
window.processPayment = processPayment;
