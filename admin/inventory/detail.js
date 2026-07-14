(async function () {
  if (!(await requireAdmin())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await adminLogout();
    window.location.href = "../login.html";
  });

  const menuId = getQueryParam("menuId");
  const menus = await getMenus();
  const menu = menus.find((m) => m.id === menuId);
  const root = qs("#detail-root");

  if (!menu) {
    root.classList.add("hidden");
    qs("#not-found").classList.remove("hidden");
    return;
  }

  const category = window.CATEGORIES.find((c) => c.id === menu.categoryId);

  root.innerHTML = `
    <div class="card inventory-detail">
      <img class="inventory-detail-image" src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" />
      <h1>${escapeHtml(menu.name)}</h1>
      <p class="inventory-detail-category">${category ? escapeHtml(category.name) : "-"}</p>

      <div class="inventory-detail-input">
        <label for="stock-input">재고 수량</label>
        <input type="number" id="stock-input" min="0" value="${menu.stock}" />
      </div>

      <div class="inventory-detail-actions">
        <a href="./list.html" class="btn btn-secondary">목록으로</a>
        <button id="save-btn" class="btn btn-primary">저장하기</button>
      </div>
    </div>
  `;

  qs("#save-btn").addEventListener("click", async () => {
    const newStock = Math.max(0, Number(qs("#stock-input").value) || 0);
    await updateMenuStock(menuId, newStock);
    showToast("재고가 저장되었습니다.");
    window.location.href = "./list.html";
  });
})();
