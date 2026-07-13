(function () {
  if (!requireAuth()) return;

  qs("#logout-btn").addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
  });

  const items = getCartDetails();
  if (items.length === 0) {
    window.location.href = "../basket/list.html";
    return;
  }

  qs("#order-summary").innerHTML = `
    ${items
      .map(
        (item) => `
      <div class="order-summary-item">
        <span>${escapeHtml(item.menu.name)} x ${item.qty}</span>
        <span>${formatPrice(item.subtotal)}</span>
      </div>
    `
      )
      .join("")}
    <div class="order-summary-total">
      <span>총 결제 금액</span>
      <span>${formatPrice(getCartTotal())}</span>
    </div>
  `;

  const cardNumberInput = qs("#cardNumber");
  cardNumberInput.addEventListener("input", () => {
    const digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
    cardNumberInput.value = digits.replace(/(.{4})/g, "$1 ").trim();
  });

  const form = qs("#payment-form");
  const errorEl = qs("#payment-error");
  const payBtn = qs("#pay-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");
    payBtn.disabled = true;
    payBtn.textContent = "결제 처리 중...";

    processPayment({
      cardNumber: cardNumberInput.value,
      cardHolder: qs("#cardHolder").value.trim(),
    })
      .then((result) => {
        window.location.href = `./complete.html?orderId=${result.order.id}`;
      })
      .catch((err) => {
        errorEl.textContent = err.error;
        errorEl.classList.remove("hidden");
        payBtn.disabled = false;
        payBtn.textContent = "결제하기";
      });
  });
})();
