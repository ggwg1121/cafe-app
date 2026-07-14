(async function () {
  if (!(await requireAuth())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await logout();
    window.location.href = "../index.html";
  });

  const listEl = qs("#basket-list");
  const summaryEl = qs("#basket-summary");
  const emptyState = qs("#empty-state");
  const cartCountEl = qs("#cart-count");

  async function updateCartBadge() {
    const count = await getCartCount();
    cartCountEl.textContent = count;
    cartCountEl.classList.toggle("hidden", count === 0);
  }

  async function render() {
    const items = await getCartDetails();

    if (items.length === 0) {
      listEl.innerHTML = "";
      summaryEl.classList.add("hidden");
      emptyState.classList.remove("hidden");
      await updateCartBadge();
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

    qs("#basket-total").textContent = formatPrice(await getCartTotal());

    qsa("[data-increase]", listEl).forEach((btn) => {
      btn.addEventListener("click", async () => {
        const item = items.find((i) => i.menu.id === btn.dataset.increase);
        await updateQty(btn.dataset.increase, item.qty + 1);
        render();
      });
    });

    qsa("[data-decrease]", listEl).forEach((btn) => {
      btn.addEventListener("click", async () => {
        const item = items.find((i) => i.menu.id === btn.dataset.decrease);
        await updateQty(btn.dataset.decrease, item.qty - 1);
        render();
      });
    });

    qsa("[data-remove]", listEl).forEach((btn) => {
      btn.addEventListener("click", async () => {
        await removeItem(btn.dataset.remove);
        render();
      });
    });

    await updateCartBadge();
  }

  render();
})();
