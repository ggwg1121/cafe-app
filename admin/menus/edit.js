(function () {
  if (!requireAdmin()) return;

  qs("#logout-btn").addEventListener("click", () => {
    adminLogout();
    window.location.href = "../login.html";
  });

  const id = getQueryParam("id");
  const menu = getMenus().find((m) => m.id === id);
  const form = qs("#menu-form");

  if (!menu) {
    qs("#not-found").classList.remove("hidden");
    return;
  }

  const categorySelect = qs("#category");
  window.CATEGORIES.forEach((category) => {
    const opt = document.createElement("option");
    opt.value = category.id;
    opt.textContent = category.name;
    categorySelect.appendChild(opt);
  });

  qs("#name").value = menu.name;
  categorySelect.value = menu.categoryId;
  qs("#price").value = menu.price;
  qs("#image").value = menu.image;
  qs("#description").value = menu.description;
  qs("#isSoldOut").checked = menu.isSoldOut;
  form.classList.remove("hidden");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const updated = {
      ...menu,
      name: qs("#name").value.trim(),
      categoryId: categorySelect.value,
      price: Number(qs("#price").value),
      image: qs("#image").value.trim() || menu.image,
      description: qs("#description").value.trim(),
      isSoldOut: qs("#isSoldOut").checked,
    };

    saveMenus(getMenus().map((m) => (m.id === id ? updated : m)));
    showToast("메뉴가 수정되었습니다.");
    window.location.href = `./detail.html?id=${id}`;
  });
})();
