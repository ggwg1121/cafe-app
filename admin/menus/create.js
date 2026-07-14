(async function () {
  if (!(await requireAdmin())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await adminLogout();
    window.location.href = "../login.html";
  });

  const categorySelect = qs("#category");
  window.CATEGORIES.forEach((category) => {
    const opt = document.createElement("option");
    opt.value = category.id;
    opt.textContent = category.name;
    categorySelect.appendChild(opt);
  });

  qs("#menu-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = qs("#name").value.trim();
    await createMenu({
      name,
      categoryId: categorySelect.value,
      price: Number(qs("#price").value),
      image: qs("#image").value.trim() || placeholderImage(name || "메뉴"),
      description: qs("#description").value.trim(),
      isSoldOut: qs("#isSoldOut").checked,
    });
    showToast("메뉴가 추가되었습니다.");
    window.location.href = "./list.html";
  });
})();
