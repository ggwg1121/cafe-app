(async function () {
  await initAuth();
  const user = getCurrentUser();
  if (user) {
    qs("#login-link").classList.add("hidden");
    qsa(".nav-auth-only").forEach((el) => el.classList.remove("hidden"));
    const logoutBtn = qs("#logout-btn");
    logoutBtn.classList.remove("hidden");
    logoutBtn.addEventListener("click", async () => {
      await logout();
      window.location.reload();
    });
  }

  const cartCountEl = qs("#cart-count");
  const cartCount = user ? await getCartCount() : 0;
  if (cartCount > 0) {
    cartCountEl.textContent = cartCount;
    cartCountEl.classList.remove("hidden");
  }

  const id = getQueryParam("id");
  const menus = await getMenus();
  const menu = menus.find((m) => m.id === id);
  const root = qs("#detail-root");

  if (!menu) {
    root.classList.add("hidden");
    qs("#not-found").classList.remove("hidden");
    return;
  }

  const category = window.CATEGORIES.find((c) => c.id === menu.categoryId);

  root.innerHTML = `
    <div class="menu-detail">
      <img class="menu-detail-image" src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" />
      <div class="menu-detail-info">
        <p class="text-muted">${category ? escapeHtml(category.name) : "-"}</p>
        <h1>${escapeHtml(menu.name)}</h1>
        <p class="menu-detail-price">${formatPrice(menu.price)}</p>
        <p>${escapeHtml(menu.description)}</p>

        ${
          menu.isSoldOut
            ? '<p class="badge badge-danger">품절된 메뉴입니다</p>'
            : `
          <div class="menu-detail-qty">
            <label for="qty">수량</label>
            <input type="number" id="qty" value="1" min="1" max="20" />
          </div>
          <button id="add-to-cart-btn" class="btn btn-primary">장바구니 담기</button>
        `
        }
      </div>
    </div>
  `;

  if (!menu.isSoldOut) {
    qs("#add-to-cart-btn").addEventListener("click", async () => {
      if (!getCurrentUser()) {
        const redirect = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `../auth/login.html?redirect=${redirect}`;
        return;
      }
      const qty = Math.max(1, Number(qs("#qty").value) || 1);
      await addItem(menu.id, qty);
      showToast("장바구니에 담았습니다.");
    });
  }

  // 리뷰
  const reviewSection = qs("#review-section");
  reviewSection.classList.remove("hidden");

  const reviewList = qs("#review-list");
  const reviewEmpty = qs("#review-empty");
  const reviewSummary = qs("#review-summary");
  const reviewForm = qs("#review-form");
  const reviewLoginPrompt = qs("#review-login-prompt");
  const reviewAlready = qs("#review-already");

  async function renderReviews() {
    const allReviews = await getReviews();
    const reviews = allReviews.filter((r) => r.menuId === menu.id);

    if (reviews.length === 0) {
      reviewSummary.textContent = "";
      reviewEmpty.classList.remove("hidden");
      reviewList.innerHTML = "";
    } else {
      const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
      reviewSummary.textContent = `⭐ ${avg} (${reviews.length}개)`;
      reviewEmpty.classList.add("hidden");
      reviewList.innerHTML = reviews
        .map(
          (r) => `
          <div class="review-item card">
            <div class="review-item-header">
              <span class="review-item-user">${escapeHtml(r.userName)}</span>
              <span class="review-item-date">${formatDate(r.date)}</span>
            </div>
            <div>${"⭐".repeat(r.rating)}</div>
            <p>${escapeHtml(r.comment)}</p>
          </div>
        `
        )
        .join("");
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      reviewForm.classList.add("hidden");
      reviewAlready.classList.add("hidden");
      reviewLoginPrompt.classList.remove("hidden");
    } else if (reviews.some((r) => r.userId === currentUser.id)) {
      reviewForm.classList.add("hidden");
      reviewLoginPrompt.classList.add("hidden");
      reviewAlready.classList.remove("hidden");
    } else {
      reviewLoginPrompt.classList.add("hidden");
      reviewAlready.classList.add("hidden");
      reviewForm.classList.remove("hidden");
    }
  }

  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    await createReview({
      menuId: menu.id,
      userId: currentUser.id,
      rating: Number(qs("#rating").value),
      comment: qs("#comment").value.trim(),
    });
    showToast("리뷰가 등록되었습니다.");
    await renderReviews();
  });

  await renderReviews();
})();
