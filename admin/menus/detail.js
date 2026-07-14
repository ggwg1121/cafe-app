(async function () {
  if (!(await requireAdmin())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await adminLogout();
    window.location.href = "../login.html";
  });

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
        <span class="badge ${menu.isSoldOut ? "badge-danger" : "badge-success"}">
          ${menu.isSoldOut ? "품절" : "판매중"}
        </span>
        <h1>${escapeHtml(menu.name)}</h1>
        <p class="text-muted">${category ? escapeHtml(category.name) : "-"}</p>
        <p class="menu-detail-price">${formatPrice(menu.price)}</p>
        <p>${escapeHtml(menu.description)}</p>

        <div class="menu-detail-actions">
          <a href="./edit.html?id=${menu.id}" class="btn btn-primary">수정하기</a>
          <button id="delete-btn" class="btn btn-danger">삭제하기</button>
          <a href="./list.html" class="btn btn-secondary">목록으로</a>
        </div>
      </div>
    </div>
  `;

  qs("#delete-btn").addEventListener("click", async () => {
    if (!confirm("이 메뉴를 삭제할까요?")) return;
    await deleteMenu(id);
    window.location.href = "./list.html";
  });
})();
