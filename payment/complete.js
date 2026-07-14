(async function () {
  if (!(await requireAuth())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await logout();
    window.location.href = "../index.html";
  });

  const orderId = getQueryParam("orderId");
  const order = await getOrderById(orderId);
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
        ${
          order.pointsUsed > 0
            ? `<div class="complete-summary-item"><span>포인트 사용</span><span>-${formatPrice(order.pointsUsed)}</span></div>`
            : ""
        }
        <div class="complete-summary-total">
          <span>최종 결제 금액</span>
          <span>${formatPrice(order.total - order.pointsUsed)}</span>
        </div>
        ${
          order.pointsEarned > 0
            ? `<p class="complete-points-earned">이번 주문으로 ${order.pointsEarned.toLocaleString("ko-KR")}P가 적립되었습니다.</p>`
            : ""
        }
      </div>

      <div class="complete-actions">
        <a href="../menus/list.html" class="btn btn-secondary">쇼핑 계속하기</a>
        <a href="../orders/list.html" class="btn btn-primary">주문내역 보기</a>
      </div>
    </div>
  `;
})();
