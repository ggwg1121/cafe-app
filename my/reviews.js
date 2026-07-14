(async function () {
  if (!(await requireAuth())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await logout();
    window.location.href = "../index.html";
  });

  const user = getCurrentUser();
  const menus = await getMenus();
  const listEl = qs("#review-list");
  const emptyState = qs("#empty-state");

  function menuName(menuId) {
    const menu = menus.find((m) => m.id === menuId);
    return menu ? menu.name : "삭제된 메뉴";
  }

  async function render() {
    const allReviews = await getReviews();
    const reviews = allReviews.filter((r) => r.userId === user.id);

    if (reviews.length === 0) {
      listEl.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    listEl.innerHTML = reviews
      .map(
        (review) => `
        <div class="my-review-item card" data-review-id="${review.id}">
          <div class="my-review-item-header">
            <span class="my-review-menu">${escapeHtml(menuName(review.menuId))}</span>
            <span class="my-review-date">${formatDate(review.date)}</span>
          </div>
          <div class="review-view">
            <div>${"⭐".repeat(review.rating)}</div>
            <p>${escapeHtml(review.comment)}</p>
            <div class="my-review-actions">
              <button class="btn btn-secondary" data-edit="${review.id}">수정</button>
              <button class="btn btn-danger" data-delete="${review.id}">삭제</button>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    qsa("[data-edit]", listEl).forEach((btn) => {
      const review = reviews.find((r) => r.id === btn.dataset.edit);
      btn.addEventListener("click", () => startEdit(review));
    });

    qsa("[data-delete]", listEl).forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("이 리뷰를 삭제할까요?")) return;
        await deleteReview(btn.dataset.delete);
        render();
      });
    });
  }

  function startEdit(review) {
    const item = listEl.querySelector(`[data-review-id="${review.id}"] .review-view`);

    item.innerHTML = `
      <form class="my-review-edit-form" data-edit-form="${review.id}">
        <div class="field">
          <label>평점</label>
          <select name="rating">
            ${[5, 4, 3, 2, 1]
              .map(
                (n) =>
                  `<option value="${n}" ${n === review.rating ? "selected" : ""}>${"⭐".repeat(n)} (${n}점)</option>`
              )
              .join("")}
          </select>
        </div>
        <div class="field">
          <label>리뷰 내용</label>
          <textarea name="comment" rows="3">${escapeHtml(review.comment)}</textarea>
        </div>
        <div class="my-review-actions">
          <button type="button" class="btn btn-secondary" data-cancel>취소</button>
          <button type="submit" class="btn btn-primary">저장</button>
        </div>
      </form>
    `;

    item.querySelector("[data-cancel]").addEventListener("click", render);
    item.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const rating = Number(e.target.rating.value);
      const comment = e.target.comment.value.trim();
      await updateReview(review.id, { rating, comment });
      showToast("리뷰가 수정되었습니다.");
      render();
    });
  }

  render();
})();
