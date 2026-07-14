(async function () {
  if (!(await requireAuth())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await logout();
    window.location.href = "../index.html";
  });

  const user = getCurrentUser();

  qs("#profile-card").innerHTML = `
    <p class="profile-name">${escapeHtml(user.name)}님</p>
    <p class="profile-email">${escapeHtml(user.email)}</p>
  `;

  qs("#points-card").innerHTML = `
    <span class="points-card-label">보유 포인트</span>
    <span class="points-card-value">${getCurrentUserPoints().toLocaleString("ko-KR")}P</span>
  `;

  const orders = await getOrders();
  const reviews = await getReviews();
  const cartCount = await getCartCount();

  qs("#order-count").textContent = `${orders.length}건`;
  qs("#review-count").textContent = `${reviews.filter((r) => r.userId === user.id).length}건`;
  qs("#basket-count").textContent = `${cartCount}개`;
})();
