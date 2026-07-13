(function () {
  const user = getCurrentUser();
  if (user) {
    qs("#login-link").classList.add("hidden");
    qsa(".nav-auth-only").forEach((el) => el.classList.remove("hidden"));
    const logoutBtn = qs("#logout-btn");
    logoutBtn.classList.remove("hidden");
    logoutBtn.addEventListener("click", () => {
      logout();
      window.location.reload();
    });
  }

  const cartCountEl = qs("#cart-count");
  const cartCount = user ? getCartCount() : 0;
  if (cartCount > 0) {
    cartCountEl.textContent = cartCount;
    cartCountEl.classList.remove("hidden");
  }

  function averageRating(menuId) {
    const reviews = getReviews().filter((r) => r.menuId === menuId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }

  const popularMenus = [...getMenus()]
    .filter((menu) => !menu.isSoldOut)
    .sort((a, b) => averageRating(b.id) - averageRating(a.id))
    .slice(0, 4);

  qs("#popular-menu-grid").innerHTML = popularMenus
    .map((menu) => {
      const rating = averageRating(menu.id);
      return `
      <a href="./menus/detail.html?id=${menu.id}" class="popular-card">
        <div class="popular-card-image-wrap">
          <img class="popular-card-image" src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" />
          <span class="popular-card-price">${formatPrice(menu.price)}</span>
        </div>
        <div class="popular-card-body">
          <p class="popular-card-name">${escapeHtml(menu.name)}</p>
          ${rating > 0 ? `<p class="popular-card-rating">⭐ ${rating.toFixed(1)}</p>` : ""}
        </div>
      </a>
    `;
    })
    .join("");

  const ICON_PIN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  const ICON_PHONE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  const ICON_CLOCK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

  qs("#store-info").innerHTML = `
    <h3 class="store-card-name">${escapeHtml(window.STORE_INFO.name)}</h3>
    <div class="store-card-row">
      <span class="store-card-icon">${ICON_PIN}</span>
      <span>${escapeHtml(window.STORE_INFO.address)}</span>
    </div>
    <div class="store-card-row">
      <span class="store-card-icon">${ICON_PHONE}</span>
      <span>${escapeHtml(window.STORE_INFO.phone)}</span>
    </div>
    <div class="store-card-row">
      <span class="store-card-icon">${ICON_CLOCK}</span>
      <span>${escapeHtml(window.STORE_INFO.hours)}</span>
    </div>
  `;
})();
