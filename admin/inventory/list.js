(async function () {
  if (!(await requireAdmin())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await adminLogout();
    window.location.href = "../login.html";
  });

  const tbody = qs("#inventory-tbody");
  const emptyState = qs("#empty-state");

  function categoryName(categoryId) {
    const category = window.CATEGORIES.find((c) => c.id === categoryId);
    return category ? category.name : "-";
  }

  let menus = await getMenus();

  function render() {
    if (menus.length === 0) {
      tbody.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    tbody.innerHTML = menus
      .map((menu) => {
        return `
        <tr data-row="${menu.id}">
          <td><img class="thumb" src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" /></td>
          <td>${escapeHtml(menu.name)}</td>
          <td>${categoryName(menu.categoryId)}</td>
          <td>
            <div class="stock-stepper">
              <button data-decrease="${menu.id}">-</button>
              <span data-stock="${menu.id}">${menu.stock}</span>
              <button data-increase="${menu.id}">+</button>
            </div>
          </td>
          <td>
            ${
              menu.stock === 0
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

  async function adjustStock(menuId, delta) {
    const menu = menus.find((m) => m.id === menuId);
    if (!menu) return;
    const newStock = Math.max(0, menu.stock + delta);
    await updateMenuStock(menuId, newStock);
    menu.stock = newStock;
    render();
  }

  render();
})();
