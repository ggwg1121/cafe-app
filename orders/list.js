(function () {
  if (!requireAuth()) return;

  qs("#logout-btn").addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
  });

  const cartCountEl = qs("#cart-count");
  const cartCount = getCartCount();
  if (cartCount > 0) {
    cartCountEl.textContent = cartCount;
    cartCountEl.classList.remove("hidden");
  }

  const listEl = qs("#order-list");
  const emptyState = qs("#empty-state");

  const orders = getOrders();

  if (orders.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    listEl.innerHTML = orders
      .map((order) => {
        const itemSummary =
          order.items.length === 1
            ? order.items[0].name
            : `${order.items[0].name} 외 ${order.items.length - 1}건`;

        return `
        <a href="./detail.html?id=${order.id}" class="order-card card">
          <div class="order-card-header">
            <span>${formatDate(order.createdAt)}</span>
            <span class="badge badge-success">${escapeHtml(order.status)}</span>
          </div>
          <p class="order-card-items">${escapeHtml(itemSummary)}</p>
          <div class="order-card-footer">
            <span class="text-muted">주문번호 ${escapeHtml(order.id)}</span>
            <span class="order-card-total">${formatPrice(order.total)}</span>
          </div>
        </a>
      `;
      })
      .join("");
  }
})();
