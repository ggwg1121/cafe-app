(async function () {
  if (!(await requireAdmin())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await adminLogout();
    window.location.href = "../login.html";
  });

  const id = getQueryParam("id");
  const menus = await getMenus();
  const menu = menus.find((m) => m.id === id);
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
  qs("#image").value = menu.imageRaw;
  qs("#description").value = menu.description;
  qs("#isSoldOut").checked = menu.isSoldOut;
  form.classList.remove("hidden");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await updateMenu(id, {
      name: qs("#name").value.trim(),
      categoryId: categorySelect.value,
      price: Number(qs("#price").value),
      image: qs("#image").value.trim() || menu.imageRaw,
      description: qs("#description").value.trim(),
      isSoldOut: qs("#isSoldOut").checked,
    });
    showToast("메뉴가 수정되었습니다.");
    window.location.href = `./detail.html?id=${id}`;
  });
})();
