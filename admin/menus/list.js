(async function () {
  if (!(await requireAdmin())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await adminLogout();
    window.location.href = "../login.html";
  });

  const tbody = qs("#menu-tbody");
  const emptyState = qs("#empty-state");
  const searchInput = qs("#search-input");
  const categorySelect = qs("#category-select");

  window.CATEGORIES.forEach((category) => {
    const opt = document.createElement("option");
    opt.value = category.id;
    opt.textContent = category.name;
    categorySelect.appendChild(opt);
  });

  function categoryName(categoryId) {
    const category = window.CATEGORIES.find((c) => c.id === categoryId);
    return category ? category.name : "-";
  }

  let allMenus = await getMenus();

  function render() {
    const keyword = searchInput.value.trim().toLowerCase();
    const categoryId = categorySelect.value;

    const menus = allMenus.filter((menu) => {
      const matchesKeyword = !keyword || menu.name.toLowerCase().includes(keyword);
      const matchesCategory = !categoryId || menu.categoryId === categoryId;
      return matchesKeyword && matchesCategory;
    });

    tbody.innerHTML = menus
      .map(
        (menu) => `
        <tr>
          <td><img class="thumb" src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" /></td>
          <td class="menu-name"><a href="./detail.html?id=${menu.id}">${escapeHtml(menu.name)}</a></td>
          <td>${categoryName(menu.categoryId)}</td>
          <td>${formatPrice(menu.price)}</td>
          <td>
            ${
              menu.isSoldOut
                ? '<span class="badge badge-danger">품절</span>'
                : '<span class="badge badge-success">판매중</span>'
            }
          </td>
          <td>
            <div class="row-actions">
              <a class="btn btn-secondary" href="./edit.html?id=${menu.id}">수정</a>
              <button class="btn btn-danger" data-delete="${menu.id}">삭제</button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");

    emptyState.classList.toggle("hidden", menus.length > 0);

    qsa("[data-delete]", tbody).forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("이 메뉴를 삭제할까요?")) return;
        const id = btn.dataset.delete;
        await deleteMenu(id);
        allMenus = allMenus.filter((menu) => menu.id !== id);
        render();
      });
    });
  }

  searchInput.addEventListener("input", debounce(render, 200));
  categorySelect.addEventListener("change", render);

  render();
})();
