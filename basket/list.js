(function () {
  if (!requireAuth()) return;

  qs("#logout-btn").addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
  });

  const listEl = qs("#basket-list");
  const summaryEl = qs("#basket-summary");
  const emptyState = qs("#empty-state");
  const cartCountEl = qs("#cart-count");

  function updateCartBadge() {
    const count = getCartCount();
    cartCountEl.textContent = count;
    cartCountEl.classList.toggle("hidden", count === 0);
  }

  function render() {
    const items = getCartDetails();

    if (items.length === 0) {
      listEl.innerHTML = "";
      summaryEl.classList.add("hidden");
      emptyState.classList.remove("hidden");
      updateCartBadge();
      return;
    }

    emptyState.classList.add("hidden");
    summaryEl.classList.remove("hidden");

    listEl.innerHTML = items
      .map(
        (item) => `
        <div class="basket-item card">
          <img class="basket-item-image" src="${escapeHtml(item.menu.image)}" alt="${escapeHtml(item.menu.name)}" />
          <div class="basket-item-info">
            <p class="basket-item-name">${escapeHtml(item.menu.name)}</p>
            <p class="basket-item-price">${formatPrice(item.menu.price)}</p>
            <button class="basket-item-remove" data-remove="${item.menu.id}">삭제</button>
          </div>
          <div class="basket-item-qty">
            <button data-decrease="${item.menu.id}">-</button>
            <span>${item.qty}</span>
            <button data-increase="${item.menu.id}">+</button>
          </div>
          <div class="basket-item-subtotal">${formatPrice(item.subtotal)}</div>
        </div>
      `
      )
      .join("");

    qs("#basket-total").textContent = formatPrice(getCartTotal());

    qsa("[data-increase]", listEl).forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = items.find((i) => i.menu.id === btn.dataset.increase);
        updateQty(btn.dataset.increase, item.qty + 1);
        render();
      });
    });

    qsa("[data-decrease]", listEl).forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = items.find((i) => i.menu.id === btn.dataset.decrease);
        updateQty(btn.dataset.decrease, item.qty - 1);
        render();
      });
    });

    qsa("[data-remove]", listEl).forEach((btn) => {
      btn.addEventListener("click", () => {
        removeItem(btn.dataset.remove);
        render();
      });
    });

    updateCartBadge();
  }

  render();
})();
