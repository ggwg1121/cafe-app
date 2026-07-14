// 장바구니 상태 관리 (Supabase cart_items 테이블, 로그인한 회원 기준)
// 의존: js/auth.js(getCurrentUser), js/supabaseClient.js(sb), js/data.js(mapMenuRow)

async function getCart() {
  const user = getCurrentUser();
  if (!user) return [];
  const { data, error } = await sb.from("cart_items").select("menu_id, qty").eq("user_id", user.id);
  if (error) {
    console.error(error);
    return [];
  }
  return data.map((row) => ({ menuId: row.menu_id, qty: row.qty }));
}

async function addItem(menuId, qty = 1) {
  const user = getCurrentUser();
  if (!user) return;

  const { data } = await sb
    .from("cart_items")
    .select("qty")
    .eq("user_id", user.id)
    .eq("menu_id", menuId)
    .maybeSingle();

  const newQty = (data?.qty ?? 0) + qty;
  await sb.from("cart_items").upsert({ user_id: user.id, menu_id: menuId, qty: newQty }, { onConflict: "user_id,menu_id" });
}

async function updateQty(menuId, qty) {
  const user = getCurrentUser();
  if (!user) return;

  if (qty <= 0) {
    await sb.from("cart_items").delete().eq("user_id", user.id).eq("menu_id", menuId);
  } else {
    await sb.from("cart_items").upsert({ user_id: user.id, menu_id: menuId, qty }, { onConflict: "user_id,menu_id" });
  }
}

async function removeItem(menuId) {
  const user = getCurrentUser();
  if (!user) return;
  await sb.from("cart_items").delete().eq("user_id", user.id).eq("menu_id", menuId);
}

async function clearCart() {
  const user = getCurrentUser();
  if (!user) return;
  await sb.from("cart_items").delete().eq("user_id", user.id);
}

// 메뉴 정보와 합쳐진 상세 목록 반환
async function getCartDetails() {
  const user = getCurrentUser();
  if (!user) return [];

  const { data, error } = await sb.from("cart_items").select("qty, menus(*)").eq("user_id", user.id);
  if (error || !data) {
    console.error(error);
    return [];
  }

  return data
    .filter((row) => row.menus)
    .map((row) => {
      const menu = mapMenuRow(row.menus);
      return { menu, qty: row.qty, subtotal: menu.price * row.qty };
    });
}

async function getCartTotal() {
  const items = await getCartDetails();
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}

async function getCartCount() {
  const cart = await getCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

window.getCart = getCart;
window.addItem = addItem;
window.updateQty = updateQty;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.getCartDetails = getCartDetails;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;
