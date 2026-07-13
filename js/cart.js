// 장바구니 상태 관리 (로그인한 회원별로 localStorage에 저장)
// 의존: js/auth.js(getCurrentUser), js/data.js(MENUS), js/utils.js(readJSON, writeJSON)

function getCartKey() {
  const user = getCurrentUser();
  return user ? `cafe_cart_${user.id}` : null;
}

// [{ menuId, qty }]
function getCart() {
  const key = getCartKey();
  if (!key) return [];
  return readJSON(key, []);
}

function saveCart(cart) {
  const key = getCartKey();
  if (!key) return;
  writeJSON(key, cart);
}

function addItem(menuId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.menuId === menuId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ menuId, qty });
  }
  saveCart(cart);
  return cart;
}

function updateQty(menuId, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((item) => item.menuId !== menuId);
  } else {
    const existing = cart.find((item) => item.menuId === menuId);
    if (existing) existing.qty = qty;
  }
  saveCart(cart);
  return cart;
}

function removeItem(menuId) {
  const cart = getCart().filter((item) => item.menuId !== menuId);
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart([]);
}

// 메뉴 정보와 합쳐진 상세 목록 반환
function getCartDetails() {
  return getCart()
    .map((item) => {
      const menu = getMenus().find((m) => m.id === item.menuId);
      if (!menu) return null;
      return { menu, qty: item.qty, subtotal: menu.price * item.qty };
    })
    .filter(Boolean);
}

function getCartTotal() {
  return getCartDetails().reduce((sum, item) => sum + item.subtotal, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

window.getCart = getCart;
window.addItem = addItem;
window.updateQty = updateQty;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.getCartDetails = getCartDetails;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;
