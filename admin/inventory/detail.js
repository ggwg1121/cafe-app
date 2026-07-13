(function () {
  if (!requireAdmin()) return;

  qs("#logout-btn").addEventListener("click", () => {
    adminLogout();
    window.location.href = "../login.html";
  });

  const menuId = getQueryParam("menuId");
  const menu = getMenus().find((m) => m.id === menuId);
  const inventoryRow = getInventory().find((inv) => inv.menuId === menuId);
  const root = qs("#detail-root");

  if (!menu) {
    root.classList.add("hidden");
    qs("#not-found").classList.remove("hidden");
    return;
  }

  const category = window.CATEGORIES.find((c) => c.id === menu.categoryId);
  const currentStock = inventoryRow ? inventoryRow.stock : 0;

  root.innerHTML = `
    <div class="card inventory-detail">
      <img class="inventory-detail-image" src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" />
      <h1>${escapeHtml(menu.name)}</h1>
      <p class="inventory-detail-category">${category ? escapeHtml(category.name) : "-"}</p>

      <div class="inventory-detail-input">
        <label for="stock-input">재고 수량</label>
        <input type="number" id="stock-input" min="0" value="${currentStock}" />
      </div>

      <div class="inventory-detail-actions">
        <a href="./list.html" class="btn btn-secondary">목록으로</a>
        <button id="save-btn" class="btn btn-primary">저장하기</button>
      </div>
    </div>
  `;

  qs("#save-btn").addEventListener("click", () => {
    const newStock = Math.max(0, Number(qs("#stock-input").value) || 0);
    const inventory = getInventory();
    const existing = inventory.find((inv) => inv.menuId === menuId);
    if (existing) {
      existing.stock = newStock;
    } else {
      inventory.push({ menuId, stock: newStock });
    }
    saveInventory(inventory);
    showToast("재고가 저장되었습니다.");
    window.location.href = "./list.html";
  });
})();
