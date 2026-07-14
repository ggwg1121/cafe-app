(async function () {
  if (!(await requireAuth())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await logout();
    window.location.href = "../index.html";
  });

  const items = await getCartDetails();
  if (items.length === 0) {
    window.location.href = "../basket/list.html";
    return;
  }

  const total = await getCartTotal();
  const pointsBalance = getCurrentUserPoints();
  const maxUsable = Math.min(pointsBalance, total);

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
      <span>${formatPrice(total)}</span>
    </div>
  `;

  qs("#points-balance").textContent = `${pointsBalance.toLocaleString("ko-KR")}P`;

  const pointsInput = qs("#points-input");
  pointsInput.max = maxUsable;
  const pointsUsedDisplay = qs("#points-used-display");
  const finalTotalDisplay = qs("#final-total");

  function updatePointsSummary() {
    const used = Math.max(0, Math.min(maxUsable, Math.floor(Number(pointsInput.value) || 0)));
    pointsInput.value = used;
    pointsUsedDisplay.textContent = used > 0 ? `-${formatPrice(used)}` : formatPrice(0);
    finalTotalDisplay.textContent = formatPrice(total - used);
    return used;
  }

  pointsInput.addEventListener("input", updatePointsSummary);
  qs("#points-max-btn").addEventListener("click", () => {
    pointsInput.value = maxUsable;
    updatePointsSummary();
  });

  updatePointsSummary();

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

    const pointsToUse = updatePointsSummary();

    processPayment(
      {
        cardNumber: cardNumberInput.value,
        cardHolder: qs("#cardHolder").value.trim(),
      },
      pointsToUse
    )
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
