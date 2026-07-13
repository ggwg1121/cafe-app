(function () {
  if (!requireAdmin()) return;

  qs("#logout-btn").addEventListener("click", () => {
    adminLogout();
    window.location.href = "../login.html";
  });

  const tbody = qs("#inventory-tbody");
  const emptyState = qs("#empty-state");

  function categoryName(categoryId) {
    const category = window.CATEGORIES.find((c) => c.id === categoryId);
    return category ? category.name : "-";
  }

  function render() {
    const menus = getMenus();
    const inventory = getInventory();

    if (menus.length === 0) {
      tbody.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    tbody.innerHTML = menus
      .map((menu) => {
        const stock = inventory.find((inv) => inv.menuId === menu.id)?.stock ?? 0;
        return `
        <tr data-row="${menu.id}">
          <td><img class="thumb" src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" /></td>
          <td>${escapeHtml(menu.name)}</td>
          <td>${categoryName(menu.categoryId)}</td>
          <td>
            <div class="stock-stepper">
              <button data-decrease="${menu.id}">-</button>
              <span data-stock="${menu.id}">${stock}</span>
              <button data-increase="${menu.id}">+</button>
            </div>
          </td>
          <td>
            ${
              stock === 0
                ? '<span class="badge badge-danger">품절</span>'
                : '<span class="badge badge-success">재고 있음</span>'
            }
          </td>
          <td>
            <a class="btn btn-secondary" href="./detail.html?menuId=${menu.id}">상세 조정</a>
          </td>
        </tr>
      `;
      })
      .join("");

    qsa("[data-increase]", tbody).forEach((btn) => {
      btn.addEventListener("click", () => adjustStock(btn.dataset.increase, 1));
    });
    qsa("[data-decrease]", tbody).forEach((btn) => {
      btn.addEventListener("click", () => adjustStock(btn.dataset.decrease, -1));
    });
  }

  function adjustStock(menuId, delta) {
    const inventory = getInventory();
    const row = inventory.find((inv) => inv.menuId === menuId);
    if (row) {
      row.stock = Math.max(0, row.stock + delta);
    } else {
      inventory.push({ menuId, stock: Math.max(0, delta) });
    }
    saveInventory(inventory);
    render();
  }

  render();
})();
