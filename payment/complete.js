(function () {
  if (!requireAuth()) return;

  qs("#logout-btn").addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
  });

  const orderId = getQueryParam("orderId");
  const order = getOrderById(orderId);
  const root = qs("#complete-root");

  if (!order) {
    root.classList.add("hidden");
    qs("#not-found").classList.remove("hidden");
    return;
  }

  root.innerHTML = `
    <div class="card complete-card">
      <div class="complete-icon">✅</div>
      <h1 class="complete-title">결제가 완료되었습니다</h1>
      <p class="complete-order-id">주문번호 ${escapeHtml(order.id)} · ${escapeHtml(order.payment.cardNumberMasked)}</p>

      <div class="complete-summary">
        ${order.items
          .map(
            (item) => `
          <div class="complete-summary-item">
            <span>${escapeHtml(item.name)} x ${item.qty}</span>
            <span>${formatPrice(item.price * item.qty)}</span>
          </div>
        `
          )
          .join("")}
        <div class="complete-summary-total">
          <span>총 결제 금액</span>
          <span>${formatPrice(order.total)}</span>
        </div>
      </div>

      <div class="complete-actions">
        <a href="../menus/list.html" class="btn btn-secondary">쇼핑 계속하기</a>
        <a href="../orders/list.html" class="btn btn-primary">주문내역 보기</a>
      </div>
    </div>
  `;
})();
