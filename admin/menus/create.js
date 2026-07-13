(function () {
  if (!requireAdmin()) return;

  qs("#logout-btn").addEventListener("click", () => {
    adminLogout();
    window.location.href = "../login.html";
  });

  const categorySelect = qs("#category");
  window.CATEGORIES.forEach((category) => {
    const opt = document.createElement("option");
    opt.value = category.id;
    opt.textContent = category.name;
    categorySelect.appendChild(opt);
  });

  qs("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const menu = {
      id: generateId("m"),
      name: qs("#name").value.trim(),
      categoryId: categorySelect.value,
      price: Number(qs("#price").value),
      image: qs("#image").value.trim() || placeholderImage(qs("#name").value.trim() || "메뉴"),
      description: qs("#description").value.trim(),
      isSoldOut: qs("#isSoldOut").checked,
    };

    saveMenus([...getMenus(), menu]);
    saveInventory([...getInventory(), { menuId: menu.id, stock: 0 }]);
    showToast("메뉴가 추가되었습니다.");
    window.location.href = "./list.html";
  });
})();
