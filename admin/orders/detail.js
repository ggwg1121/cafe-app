(async function () {
  if (!(await requireAdmin())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await adminLogout();
    window.location.href = "../login.html";
  });

  const id = getQueryParam("id");
  const order = await getOrderById(id);
  const root = qs("#detail-root");

  if (!order) {
    root.classList.add("hidden");
    qs("#not-found").classList.remove("hidden");
    return;
  }

  root.innerHTML = `
    <div class="card">
      <div class="order-detail-header">
        <h1>주문 상세</h1>
        <span class="badge badge-success">${escapeHtml(order.status)}</span>
      </div>

      <div class="order-detail-items">
        ${order.items
          .map(
            (item) => `
          <div class="order-detail-item">
            <span>${escapeHtml(item.name)} x ${item.qty}</span>
            <span>${formatPrice(item.price * item.qty)}</span>
          </div>
        `
          )
          .join("")}
      </div>

      <div class="order-detail-total">
        <span>총 결제 금액</span>
        <span>${formatPrice(order.total)}</span>
      </div>

      <div class="order-detail-meta">
        <p>주문번호: ${escapeHtml(order.id)}</p>
        <p>주문일시: ${formatDate(order.createdAt)}</p>
        <p>고객: ${escapeHtml(order.userName)} (${escapeHtml(order.userEmail)})</p>
        <p>결제수단: ${escapeHtml(order.payment.cardNumberMasked)} (${escapeHtml(order.payment.cardHolder)})</p>
      </div>
    </div>

    <a href="./list.html" class="btn btn-secondary btn-block order-detail-back">목록으로</a>
  `;
})();
