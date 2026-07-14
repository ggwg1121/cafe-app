(async function () {
  if (!(await requireAdmin())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await adminLogout();
    window.location.href = "../login.html";
  });

  const tbody = qs("#review-tbody");
  const emptyState = qs("#empty-state");
  const summaryEl = qs("#review-summary");
  const searchInput = qs("#search-input");
  const ratingSelect = qs("#rating-select");

  const menus = await getMenus();

  function menuName(menuId) {
    const menu = menus.find((m) => m.id === menuId);
    return menu ? menu.name : "삭제된 메뉴";
  }

  async function render() {
    const keyword = searchInput.value.trim().toLowerCase();
    const rating = ratingSelect.value;

    const allReviews = await getReviews();
    if (allReviews.length > 0) {
      const avg = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);
      summaryEl.textContent = `전체 ${allReviews.length}건 · 평균 ⭐ ${avg}`;
    } else {
      summaryEl.textContent = "";
    }

    const reviews = allReviews.filter((review) => {
      const matchesRating = !rating || String(review.rating) === rating;
      const matchesKeyword =
        !keyword ||
        menuName(review.menuId).toLowerCase().includes(keyword) ||
        review.userName.toLowerCase().includes(keyword) ||
        review.comment.toLowerCase().includes(keyword);
      return matchesRating && matchesKeyword;
    });

    if (reviews.length === 0) {
      tbody.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    tbody.innerHTML = reviews
      .map(
        (review) => `
        <tr>
          <td>${escapeHtml(menuName(review.menuId))}</td>
          <td>${escapeHtml(review.userName)}</td>
          <td>${"⭐".repeat(review.rating)}</td>
          <td class="review-comment">${escapeHtml(review.comment)}</td>
          <td>${formatDate(review.date)}</td>
          <td><button class="btn btn-danger" data-delete="${review.id}">삭제</button></td>
        </tr>
      `
      )
      .join("");

    qsa("[data-delete]", tbody).forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("이 리뷰를 삭제할까요?")) return;
        await deleteReview(btn.dataset.delete);
        render();
      });
    });
  }

  searchInput.addEventListener("input", debounce(render, 200));
  ratingSelect.addEventListener("change", render);

  render();
})();
