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
  const count = user ? getCartCount() : 0;
  if (count > 0) {
    cartCountEl.textContent = count;
    cartCountEl.classList.remove("hidden");
  }

  const grid = qs("#menu-grid");
  const emptyState = qs("#empty-state");
  const searchInput = qs("#search-input");
  const tabsEl = qs("#category-tabs");
  const paginationEl = qs("#pagination");

  const PAGE_SIZE = 8;
  let activeCategory = "";
  let currentPage = 1;

  function renderTabs() {
    const tabs = [{ id: "", name: "전체" }, ...window.CATEGORIES];
    tabsEl.innerHTML = tabs
      .map(
        (tab) =>
          `<button class="category-tab ${tab.id === activeCategory ? "active" : ""}" data-category="${tab.id}">${escapeHtml(
            tab.name
          )}</button>`
      )
      .join("");

    qsa("[data-category]", tabsEl).forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.category;
        currentPage = 1;
        renderTabs();
        renderGrid();
      });
    });
  }

  function averageRating(menuId) {
    const reviews = getReviews().filter((r) => r.menuId === menuId);
    if (reviews.length === 0) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return { avg: avg.toFixed(1), count: reviews.length };
  }

  function renderGrid() {
    const keyword = searchInput.value.trim().toLowerCase();

    const menus = getMenus().filter((menu) => {
      const matchesKeyword = !keyword || menu.name.toLowerCase().includes(keyword);
      const matchesCategory = !activeCategory || menu.categoryId === activeCategory;
      return matchesKeyword && matchesCategory;
    });

    const totalPages = Math.max(1, Math.ceil(menus.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const pageMenus = menus.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    grid.innerHTML = pageMenus
      .map((menu) => {
        const rating = averageRating(menu.id);
        return `
        <a href="./detail.html?id=${menu.id}" class="menu-card ${menu.isSoldOut ? "sold-out" : ""}">
          <div class="menu-card-image-wrap">
            <img class="menu-card-image" src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" />
            ${menu.isSoldOut ? '<span class="menu-card-soldout">품절</span>' : ""}
            <span class="menu-card-price">${formatPrice(menu.price)}</span>
          </div>
          <div class="menu-card-body">
            <p class="menu-card-name">${escapeHtml(menu.name)}</p>
            ${rating ? `<p class="menu-card-rating">⭐ ${rating.avg} <span>(${rating.count})</span></p>` : ""}
          </div>
        </a>
      `;
      })
      .join("");

    emptyState.classList.toggle("hidden", menus.length > 0);
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      paginationEl.classList.add("hidden");
      paginationEl.innerHTML = "";
      return;
    }

    paginationEl.classList.remove("hidden");

    const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1)
      .map((page) => `<button data-page="${page}" class="${page === currentPage ? "active" : ""}">${page}</button>`)
      .join("");

    paginationEl.innerHTML = `
      <button data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>이전</button>
      ${pageButtons}
      <button data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>다음</button>
    `;

    qsa("[data-page]", paginationEl).forEach((btn) => {
      btn.addEventListener("click", () => {
        currentPage = Number(btn.dataset.page);
        renderGrid();
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  const debouncedRenderGrid = debounce(renderGrid, 200);
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    debouncedRenderGrid();
  });

  renderTabs();
  renderGrid();
})();
